# Assets Directory

This directory is intended for NFT images that will be processed by the CleanNFT Metadata Preparation CLI.

## Supported Formats
- PNG (.png)
- JPEG (.jpg, .jpeg)
- WebP (.webp)

## Example Filenames
For best results with the {count} placeholder feature, use filenames like:
- `badge_5kg.png`
- `recycling_10kg.jpg`
- `achievement_25kg.webp`

## Usage
1. Place your NFT images in this directory
2. Run the CLI: `node contracts/scripts/prepareMetadata.js --images "./assets" --nameBase "CleanNFT Badge" --description "Awarded for recycling {count}kg of waste"`
3. Check the `./out` directory for generated metadata and manifests

## Testing
- Use `--dryRun` flag to test without uploading to Pinata
- Use `--analyze` flag to analyze your repository structure

