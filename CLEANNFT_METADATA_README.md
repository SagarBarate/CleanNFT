# 🚀 CleanNFT Metadata Preparation CLI

A Node.js CLI tool for preparing NFT metadata by uploading images to Pinata IPFS, generating ERC-721 compatible metadata, and creating comprehensive manifests.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @pinata/sdk dotenv yargs fast-glob p-limit
```

### 2. Configure Environment

Create a `.env` file in the root directory with your Pinata credentials:

```bash
# Method 1: JWT Token (Recommended)
PINATA_JWT=your_pinata_jwt_token_here

# Method 2: Legacy API Keys (Alternative)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_KEY=your_pinata_secret_key_here
```

### 3. Analyze Your Repository

```bash
node contracts/scripts/prepareMetadata.js --analyze
```

This will scan your repository and provide a detailed report without modifying any files.

### 4. Run a Dry Run

```bash
node contracts/scripts/prepareMetadata.js \
  --images "./assets" \
  --nameBase "CleanNFT Badge" \
  --description "Awarded for recycling {count}kg of waste" \
  --dryRun
```

### 5. Full Upload

```bash
node contracts/scripts/prepareMetadata.js \
  --images "./assets" \
  --nameBase "CleanNFT Badge" \
  --description "Awarded for recycling {count}kg of waste" \
  --externalUrl "https://cleannft.example" \
  --concurrency 3
```

## 📋 Command Line Options

| Option | Alias | Required | Description |
|--------|-------|----------|-------------|
| `--images` | `-i` | ✅ | Folder path with images (png/jpg/jpeg/webp) |
| `--nameBase` | `-n` | ✅ | Base NFT name; actual name = `${nameBase} #<index>` |
| `--description` | `-d` | ✅ | NFT description with `{count}` placeholder support |
| `--attributes` | `-a` | ❌ | Path to JSON array of attributes |
| `--externalUrl` | `-e` | ❌ | External URL for the NFT |
| `--startIndex` | `-s` | ❌ | Starting index for names (default: 1) |
| `--concurrency` | `-c` | ❌ | Parallel uploads (default: 2) |
| `--out` | `-o` | ❌ | Output directory (default: `./out`) |
| `--dryRun` | `-r` | ❌ | Generate local metadata but skip Pinata uploads |
| `--analyze` | `-z` | ❌ | Run analysis mode only (no writes) |

## 🔧 {count} Placeholder Logic

The `{count}` placeholder in descriptions is automatically replaced with values extracted from filenames:

- **Filename pattern**: `badge_5kg.png` → `{count}` becomes `5kg`
- **Filename pattern**: `recycling_10kg.jpg` → `{count}` becomes `10kg`
- **No pattern found**: `{count}` remains as-is or is stripped

### Examples

```bash
# Input: badge_5kg.png
--description "Awarded for recycling {count}kg of waste"
# Result: "Awarded for recycling 5kgkg of waste"

# Input: recycling_badge.png (no count)
--description "Awarded for recycling {count}kg of waste"
# Result: "Awarded for recycling {count}kg of waste"
```

## 🎨 Custom Attributes

Create a JSON file with custom attributes:

```json
[
  {
    "trait_type": "Rarity",
    "value": "Common"
  },
  {
    "trait_type": "Category",
    "value": "Recycling"
  },
  {
    "trait_type": "Achievement",
    "value": "First Time"
  }
]
```

Then use it:

```bash
--attributes "./attributes.json"
```

## 📁 Output Structure

```
./out/
├── metadata/
│   ├── badge_5kg.json
│   ├── badge_10kg.json
│   └── ...
├── manifest.json
└── manifest.csv
```

### Manifest Format

**JSON Manifest** (`manifest.json`):
```json
[
  {
    "index": 1,
    "file": "badge_5kg.png",
    "imageCid": "Qm...",
    "imageUri": "ipfs://Qm...",
    "name": "CleanNFT Badge #1",
    "metadataLocalPath": "./out/metadata/badge_5kg.json",
    "metadataCid": "Qm...",
    "tokenUri": "ipfs://Qm..."
  }
]
```

**CSV Manifest** (`manifest.csv`):
```csv
index,file,imageCid,imageUri,name,metadataLocalPath,metadataCid,tokenUri
1,badge_5kg.png,Qm...,ipfs://Qm...,"CleanNFT Badge #1",./out/metadata/badge_5kg.json,Qm...,ipfs://Qm...
```

## 🚨 Troubleshooting

### Pinata Authentication Errors

**Error**: `Pinata connection failed: Invalid API key`
- **Solution**: Verify your API credentials in `.env`
- **Check**: Ensure you're using the correct key format (JWT vs API key)

**Error**: `Pinata connection failed: Rate limit exceeded`
- **Solution**: Reduce concurrency with `--concurrency 1`
- **Check**: Monitor your Pinata dashboard for usage limits

### Image Processing Errors

**Error**: `No images found in ./assets`
- **Solution**: Verify the images directory path
- **Check**: Ensure images are in supported formats (png, jpg, jpeg, webp)

**Error**: `Failed to upload image: Network error`
- **Solution**: Check your internet connection
- **Check**: Verify Pinata service status

### File Permission Errors

**Error**: `EACCES: permission denied`
- **Solution**: Check write permissions for the output directory
- **Check**: Ensure you have access to create `./out` folder

## 🔍 Analysis Mode

Run with `--analyze` to get a comprehensive repository report:

```bash
node contracts/scripts/prepareMetadata.js --analyze
```

**What it analyzes:**
- Repository structure (top 3 levels)
- Candidate image directories
- Environment configuration
- Package.json scripts
- Existing metadata/manifest files
- Implementation recommendations

## 📊 Performance Tips

- **Concurrency**: Start with `--concurrency 2`, increase gradually
- **Batch Size**: Process images in batches of 50-100 for large collections
- **Dry Run**: Always test with `--dryRun` first
- **Monitoring**: Watch Pinata dashboard for upload progress

## 🔗 Related Documentation

- [Pinata API Documentation](https://docs.pinata.cloud/)
- [ERC-721 Metadata Standards](https://eips.ethereum.org/EIPS/eip-721)
- [IPFS URI Scheme](https://docs.ipfs.io/concepts/ipfs-uri/)

## 🆘 Support

For issues or questions:
1. Check the troubleshooting section above
2. Run `--analyze` to verify your setup
3. Check Pinata dashboard for upload status
4. Verify environment variables are set correctly

---

**Happy NFT Metadata Preparation! 🎉**

