#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { PinataSDK } = require('@pinata/sdk');
const dotenv = require('dotenv');
const yargs = require('yargs');
const fg = require('fast-glob');
// Simple concurrency limiter since p-limit is ESM
const createConcurrencyLimiter = (limit) => {
  const queue = [];
  let running = 0;
  
  const run = async (fn) => {
    if (running >= limit) {
      await new Promise(resolve => queue.push(resolve));
    }
    running++;
    try {
      return await fn();
    } finally {
      running--;
      if (queue.length > 0) {
        queue.shift()();
      }
    }
  };
  
  return run;
};

// Load environment variables
dotenv.config();

// CLI argument parsing
const argv = yargs
  .option('analyze', {
    alias: 'z',
    type: 'boolean',
    default: false,
    description: 'Run analysis mode only (no writes)'
  })
  .option('images', {
    alias: 'i',
    type: 'string',
    description: 'Folder path with images (png/jpg/jpeg/webp)'
  })
  .option('nameBase', {
    alias: 'n',
    type: 'string',
    description: 'Base NFT name; actual name = ${nameBase} #<index>'
  })
  .option('description', {
    alias: 'd',
    type: 'string',
    description: 'NFT description with {count} placeholder support'
  })
  .option('attributes', {
    alias: 'a',
    type: 'string',
    description: 'Path to JSON array of attributes'
  })
  .option('externalUrl', {
    alias: 'e',
    type: 'string',
    description: 'External URL for the NFT'
  })
  .option('startIndex', {
    alias: 's',
    type: 'number',
    default: 1,
    description: 'Starting index for names'
  })
  .option('concurrency', {
    alias: 'c',
    type: 'number',
    default: 2,
    description: 'Parallel uploads'
  })
  .option('out', {
    alias: 'o',
    type: 'string',
    default: './out',
    description: 'Output directory'
  })
  .option('dryRun', {
    alias: 'r',
    type: 'boolean',
    default: false,
    description: 'Generate local metadata but skip Pinata uploads'
  })
  .help()
  .argv;

// Validate required arguments only if not in analyze mode
if (!argv.analyze) {
  if (!argv.images) {
    console.error('Error: --images is required when not using --analyze');
    process.exit(1);
  }
  if (!argv.nameBase) {
    console.error('Error: --nameBase is required when not using --analyze');
    process.exit(1);
  }
  if (!argv.description) {
    console.error('Error: --description is required when not using --analyze');
    process.exit(1);
  }
}

class NFTMetadataPreparer {
  constructor(options = {}) {
    this.options = options;
    this.pinata = null;
    this.limit = createConcurrencyLimiter(options.concurrency || 2);
    this.stats = {
      imagesFound: 0,
      imagesUploaded: 0,
      metadataGenerated: 0,
      uploadsSkipped: 0,
      failures: 0
    };
    this.manifest = [];
  }

  async initialize() {
    if (this.options.analyze || this.options.dryRun) {
      return; // No Pinata initialization needed for analysis or dry run
    }

    // Initialize Pinata with JWT or legacy API keys
    const pinataJwt = process.env.PINATA_JWT;
    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_KEY;

    if (pinataJwt) {
      this.pinata = new PinataSDK({ pinataJWTKey: pinataJwt });
      console.log('✅ Using Pinata JWT authentication');
    } else if (pinataApiKey && pinataSecretKey) {
      this.pinata = new PinataSDK({ pinataApiKey, pinataSecretKey });
      console.log('✅ Using Pinata API key authentication');
    } else {
      throw new Error('Pinata credentials not found. Set PINATA_JWT or PINATA_API_KEY/PINATA_SECRET_KEY in .env');
    }

    // Test connection
    try {
      const test = await this.pinata.testAuthentication();
      console.log('✅ Pinata connection successful');
    } catch (error) {
      throw new Error(`Pinata connection failed: ${error.message}`);
    }
  }

  async analyzeRepository() {
    console.log('🔍 CleanNFT Repository Analysis\n');
    
    // Print repository structure
    console.log('📁 Repository Structure (Top 3 levels):');
    const rootItems = fs.readdirSync('.');
    rootItems.forEach(item => {
      const stat = fs.statSync(item);
      if (stat.isDirectory()) {
        const subItems = fs.readdirSync(item).slice(0, 3);
        console.log(`  ├── ${item}/`);
        subItems.forEach(subItem => {
          const subStat = fs.statSync(path.join(item, subItem));
          const icon = subStat.isDirectory() ? '📁' : '📄';
          console.log(`  │   ${icon} ${subItem}`);
        });
        if (fs.readdirSync(item).length > 3) {
          console.log(`  │   ... and ${fs.readdirSync(item).length - 3} more`);
        }
      } else {
        console.log(`  ├── ${item}`);
      }
    });

    // Detect image directories
    console.log('\n🖼️  Candidate Image Directories:');
    const imageDirs = ['assets', 'public', 'images', 'img', 'static', 'media', 'nft', 'rewards'];
    const imageDirStats = [];

    imageDirs.forEach(dirName => {
      const dirPath = path.join('.', dirName);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        const imageFiles = fg.sync([`${dirPath}/**/*.{png,jpg,jpeg,webp}`], { onlyFiles: true });
        if (imageFiles.length > 0) {
          imageDirStats.push({ dir: dirName, count: imageFiles.length, path: dirPath });
        }
      }
    });

    // Sort by image count
    imageDirStats.sort((a, b) => b.count - a.count);
    imageDirStats.forEach(({ dir, count, path }) => {
      console.log(`  📁 ${dir}/ (${count} images) - ${path}`);
    });

    if (imageDirStats.length === 0) {
      console.log('  ❌ No image directories found');
    }

    // Check environment configuration
    console.log('\n🔧 Environment Configuration:');
    const envExists = fs.existsSync('.env');
    console.log(`  .env file: ${envExists ? '✅ Exists' : '❌ Not found'}`);
    
    if (envExists) {
      const envContent = fs.readFileSync('.env', 'utf8');
      const hasPinataJwt = envContent.includes('PINATA_JWT');
      const hasPinataApi = envContent.includes('PINATA_API_KEY');
      const hasPinataSecret = envContent.includes('PINATA_SECRET_KEY');
      
      console.log(`  PINATA_JWT: ${hasPinataJwt ? '✅ Set' : '❌ Not set'}`);
      console.log(`  PINATA_API_KEY: ${hasPinataApi ? '✅ Set' : '❌ Not set'}`);
      console.log(`  PINATA_SECRET_KEY: ${hasPinataSecret ? '✅ Set' : '❌ Not set'}`);
    }

    // Check package.json
    console.log('\n📦 Package Configuration:');
    const packageExists = fs.existsSync('package.json');
    console.log(`  package.json: ${packageExists ? '✅ Exists' : '❌ Not found'}`);
    
    if (packageExists) {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const hasScripts = packageJson.scripts && Object.keys(packageJson.scripts).length > 0;
      console.log(`  scripts section: ${hasScripts ? '✅ Present' : '❌ Empty'}`);
      
      if (hasScripts) {
        const existingScripts = Object.keys(packageJson.scripts);
        console.log(`  existing scripts: ${existingScripts.join(', ')}`);
      }
    }

    // Check for existing metadata/manifest files (excluding node_modules)
    console.log('\n📋 Existing Metadata/Manifest Files:');
    const metadataFiles = fg.sync(['**/*metadata*', '**/*manifest*'], { 
      onlyFiles: true,
      ignore: ['**/node_modules/**']
    });
    if (metadataFiles.length > 0) {
      metadataFiles.forEach(file => {
        console.log(`  📄 ${file}`);
      });
    } else {
      console.log('  ❌ No existing metadata/manifest files found');
    }

    // CLI placement decision
    console.log('\n🎯 CLI Implementation Plan:');
    console.log(`  CLI file location: contracts/scripts/prepareMetadata.js`);
    console.log(`  Output directory: ./out (will be created)`);
    console.log(`  .env.example: Will be added to root (if not exists)`);
    console.log(`  NPM scripts: Will be added to root package.json (if no conflicts)`);

    console.log('\n✅ Analysis complete. No files were modified.');
  }

  async discoverImages() {
    const imagePatterns = ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp'];
    const images = fg.sync(imagePatterns, { 
      cwd: this.options.images,
      onlyFiles: true,
      absolute: false
    });

    if (images.length === 0) {
      throw new Error(`No images found in ${this.options.images}. Supported formats: png, jpg, jpeg, webp`);
    }

    this.stats.imagesFound = images.length;
    console.log(`📁 Found ${images.length} images in ${this.options.images}`);
    return images;
  }

  extractCountFromFilename(filename) {
    // Look for patterns like "badge_5kg.png", "recycling_10kg.jpg", etc.
    const match = filename.match(/(\d+kg)/i);
    return match ? match[1] : null;
  }

  async uploadImageToPinata(imagePath) {
    const fullPath = path.join(this.options.images, imagePath);
    const imageBuffer = fs.readFileSync(fullPath);
    const fileName = path.basename(imagePath);

    try {
      const result = await this.pinata.pinFileToIPFS(imageBuffer, {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            type: 'nft-image',
            project: 'CleanNFT'
          }
        }
      });

      return {
        cid: result.IpfsHash,
        uri: `ipfs://${result.IpfsHash}`,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      throw new Error(`Failed to upload image ${fileName}: ${error.message}`);
    }
  }

  async uploadMetadataToPinata(metadata) {
    try {
      const result = await this.pinata.pinJSONToIPFS(metadata, {
        pinataMetadata: {
          name: metadata.name,
          keyvalues: {
            type: 'nft-metadata',
            project: 'CleanNFT'
          }
        }
      });

      return {
        cid: result.IpfsHash,
        uri: `ipfs://${result.IpfsHash}`,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`
      };
    } catch (error) {
      throw new Error(`Failed to upload metadata for ${metadata.name}: ${error.message}`);
    }
  }

  generateMetadata(imagePath, index, imageCid, imageUri) {
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const count = this.extractCountFromFilename(imagePath);
    
    let description = this.options.description;
    if (count && description.includes('{count}')) {
      description = description.replace('{count}', count);
    }

    const metadata = {
      name: `${this.options.nameBase} #${index}`,
      description: description,
      image: imageUri,
      external_url: this.options.externalUrl || undefined,
      attributes: [],
      created_by: "CleanNFT",
      date: new Date().toISOString()
    };

    // Add custom attributes if provided
    if (this.options.attributes) {
      try {
        const attributesPath = path.resolve(this.options.attributes);
        if (fs.existsSync(attributesPath)) {
          const customAttributes = JSON.parse(fs.readFileSync(attributesPath, 'utf8'));
          if (Array.isArray(customAttributes)) {
            metadata.attributes = customAttributes;
          }
        }
      } catch (error) {
        console.warn(`⚠️  Warning: Could not load attributes from ${this.options.attributes}: ${error.message}`);
      }
    }

    // Remove undefined fields
    Object.keys(metadata).forEach(key => {
      if (metadata[key] === undefined) {
        delete metadata[key];
      }
    });

    return metadata;
  }

  async ensureOutputDirectory() {
    if (!fs.existsSync(this.options.out)) {
      fs.mkdirSync(this.options.out, { recursive: true });
      console.log(`📁 Created output directory: ${this.options.out}`);
    }

    const metadataDir = path.join(this.options.out, 'metadata');
    if (!fs.existsSync(metadataDir)) {
      fs.mkdirSync(metadataDir, { recursive: true });
    }
  }

  async saveLocalMetadata(metadata, imagePath) {
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const metadataPath = path.join(this.options.out, 'metadata', `${fileName}.json`);
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    return metadataPath;
  }

  async generateManifests() {
    // JSON manifest
    const manifestPath = path.join(this.options.out, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(this.manifest, null, 2));

    // CSV manifest
    const csvPath = path.join(this.options.out, 'manifest.csv');
    const csvHeaders = ['index', 'file', 'imageCid', 'imageUri', 'name', 'metadataLocalPath', 'metadataCid', 'tokenUri'];
    const csvContent = [
      csvHeaders.join(','),
      ...this.manifest.map(item => [
        item.index,
        item.file,
        item.imageCid,
        item.imageUri,
        `"${item.name}"`,
        item.metadataLocalPath,
        item.metadataCid,
        item.tokenUri
      ].join(','))
    ].join('\n');
    
    fs.writeFileSync(csvPath, csvContent);

    console.log(`📋 Generated manifests:`);
    console.log(`  JSON: ${manifestPath}`);
    console.log(`  CSV: ${csvPath}`);
  }

  async processImage(imagePath, index) {
    try {
      console.log(`🔄 Processing ${imagePath} (${index}/${this.stats.imagesFound})...`);

      // Upload image to Pinata
      let imageResult;
      if (!this.options.dryRun) {
        imageResult = await this.uploadImageToPinata(imagePath);
        this.stats.imagesUploaded++;
        console.log(`  ✅ Image uploaded: ${imageResult.cid}`);
      } else {
        // Mock result for dry run
        imageResult = {
          cid: 'DRY_RUN_MOCK_CID',
          uri: 'ipfs://DRY_RUN_MOCK_CID',
          url: 'https://gateway.pinata.cloud/ipfs/DRY_RUN_MOCK_CID'
        };
        this.stats.uploadsSkipped++;
        console.log(`  ⏭️  Image upload skipped (dry run)`);
      }

      // Generate metadata
      const metadata = this.generateMetadata(imagePath, index, imageResult.cid, imageResult.uri);
      this.stats.metadataGenerated++;

      // Save local metadata
      const metadataLocalPath = await this.saveLocalMetadata(metadata, imagePath);

      // Upload metadata to Pinata
      let metadataResult;
      if (!this.options.dryRun) {
        metadataResult = await this.uploadMetadataToPinata(metadata);
        console.log(`  ✅ Metadata uploaded: ${metadataResult.cid}`);
      } else {
        // Mock result for dry run
        metadataResult = {
          cid: 'DRY_RUN_MOCK_CID',
          uri: 'ipfs://DRY_RUN_MOCK_CID',
          url: 'https://gateway.pinata.cloud/ipfs/DRY_RUN_MOCK_CID'
        };
        this.stats.uploadsSkipped++;
        console.log(`  ⏭️  Metadata upload skipped (dry run)`);
      }

      // Add to manifest
      this.manifest.push({
        index,
        file: imagePath,
        imageCid: imageResult.cid,
        imageUri: imageResult.uri,
        name: metadata.name,
        metadataLocalPath,
        metadataCid: metadataResult.cid,
        tokenUri: metadataResult.uri
      });

      console.log(`  ✅ Completed: ${metadata.name}`);

    } catch (error) {
      this.stats.failures++;
      console.error(`  ❌ Failed to process ${imagePath}: ${error.message}`);
    }
  }

  async run() {
    try {
      if (this.options.analyze) {
        await this.analyzeRepository();
        return;
      }

      console.log('🚀 CleanNFT Metadata Preparation Started\n');
      
      // Initialize
      await this.initialize();
      await this.ensureOutputDirectory();

      // Discover images
      const images = await this.discoverImages();

      // Process images with concurrency limit
      const tasks = images.map((imagePath, index) => 
        this.limit(() => this.processImage(imagePath, this.options.startIndex + index))
      );

      await Promise.all(tasks);

      // Generate manifests
      await this.generateManifests();

      // Print summary
      console.log('\n📊 Processing Summary:');
      console.log(`  Images found: ${this.stats.imagesFound}`);
      console.log(`  Images uploaded: ${this.stats.imagesUploaded}`);
      console.log(`  Metadata generated: ${this.stats.metadataGenerated}`);
      console.log(`  Uploads skipped (dry run): ${this.stats.uploadsSkipped}`);
      console.log(`  Failures: ${this.stats.failures}`);

      if (this.stats.failures > 0) {
        console.log('\n⚠️  Some images failed to process. Check the logs above.');
        process.exit(1);
      } else {
        console.log('\n✅ All images processed successfully!');
      }

    } catch (error) {
      console.error(`\n❌ Fatal error: ${error.message}`);
      process.exit(1);
    }
  }
}

// Main execution
async function main() {
  const preparer = new NFTMetadataPreparer(argv);
  await preparer.run();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = NFTMetadataPreparer;
