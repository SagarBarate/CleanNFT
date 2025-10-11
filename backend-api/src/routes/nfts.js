const express = require('express');
const router = express.Router();
const nftController = require('../controllers/nftController');
const multer = require('multer');

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Middleware to handle multer errors
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 10MB.'
      });
    }
  } else if (error.message === 'Only image files are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Only image files are allowed'
    });
  }
  next(error);
};

// Apply multer error handling middleware
router.use(handleMulterError);

// Admin routes (minting)
router.post('/mint', upload.single('imageFile'), async (req, res) => {
  try {
    // Convert the uploaded file to a buffer
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image file is required'
      });
    }

    const { name, description, attributes } = req.body;
    
    // Parse attributes if they exist
    let parsedAttributes = [];
    if (attributes) {
      try {
        parsedAttributes = JSON.parse(attributes);
      } catch (e) {
        parsedAttributes = [];
      }
    }

    // Call the controller with the file buffer
    const result = await nftController.mintNFT({
      body: {
        name,
        description,
        imageFile: req.file.buffer,
        attributes: parsedAttributes
      }
    }, res);

  } catch (error) {
    console.error('Error in mint route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/batch-mint', upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one image file is required'
      });
    }

    const { nfts } = req.body; // Array of { name, description, attributes }
    
    if (!nfts) {
      return res.status(400).json({
        success: false,
        error: 'NFTs data is required'
      });
    }

    let parsedNFTs;
    try {
      parsedNFTs = JSON.parse(nfts);
    } catch (e) {
      return res.status(400).json({
        success: false,
        error: 'Invalid NFTs data format'
      });
    }

    if (parsedNFTs.length !== req.files.length) {
      return res.status(400).json({
        success: false,
        error: 'Number of NFTs must match number of uploaded files'
      });
    }

    // Combine NFT data with file buffers
    const nftsWithFiles = parsedNFTs.map((nft, index) => ({
      ...nft,
      imageFile: req.files[index].buffer
    }));

    // Call the controller
    const result = await nftController.batchMintNFTs({
      body: { nfts: nftsWithFiles }
    }, res);

  } catch (error) {
    console.error('Error in batch mint route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Public routes (viewing and claiming)
router.get('/available', async (req, res) => {
  try {
    await nftController.getAvailableNFTs(req, res);
  } catch (error) {
    console.error('Error in available NFTs route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    await nftController.getContractStats(req, res);
  } catch (error) {
    console.error('Error in contract stats route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/metadata/:tokenId', async (req, res) => {
  try {
    await nftController.getNFTMetadata(req, res);
  } catch (error) {
    console.error('Error in NFT metadata route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/claim-status/:userAddress', async (req, res) => {
  try {
    await nftController.checkUserClaimStatus(req, res);
  } catch (error) {
    console.error('Error in claim status route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/claim', async (req, res) => {
  try {
    await nftController.claimNFT(req, res);
  } catch (error) {
    console.error('Error in claim NFT route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Admin routes (management)
router.put('/update-uri', async (req, res) => {
  try {
    await nftController.updateTokenURI(req, res);
  } catch (error) {
    console.error('Error in update token URI route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test blockchain service route
router.get('/test-blockchain', async (req, res) => {
  try {
    await nftController.testBlockchainService(req, res);
  } catch (error) {
    console.error('Error in blockchain test route:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'NFT service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;



