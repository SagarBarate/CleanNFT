import React, { useState, useEffect } from 'react';
import PinataService, { NFTMetadata } from '../services/pinataService';
import { NFTService } from '../services/nftService';
import './AdminNFTMinting.css';

interface MintingForm {
  name: string;
  description: string;
  imageFile: File | null;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

const AdminNFTMinting: React.FC = () => {
  const [pinataService, setPinataService] = useState<PinataService | null>(null);
  const [nftService, setNftService] = useState<NFTService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [mintingForm, setMintingForm] = useState<MintingForm>({
    name: '',
    description: '',
    imageFile: null,
    attributes: []
  });
  
  const [batchMinting, setBatchMinting] = useState<Array<MintingForm>>([]);
  const [isBatchMode, setIsBatchMode] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [mintingResults, setMintingResults] = useState<Array<{
    name: string;
    success: boolean;
    tokenId?: string;
    transactionHash?: string;
    ipfsUrl?: string;
    error?: string;
  }>>([]);

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      // Initialize Pinata service
      const pinata = new PinataService();
      if (!pinata.isConfigured()) {
        setError('Pinata API keys not configured. Please check your environment variables.');
        return;
      }
      setPinataService(pinata);

      // Initialize NFT service
      const nft = new NFTService();
      await nft.initialize();
      setNftService(nft);

      // Check if connected to Mumbai
      const isMumbai = await nft.isMumbaiNetwork();
      if (!isMumbai) {
        setError('Please connect to Mumbai testnet to use this feature');
        return;
      }

      const address = await nft.getSignerAddress();
      setUserAddress(address);
      setIsConnected(true);

      // Check if user is admin (contract owner)
      await checkAdminStatus(nft);

    } catch (error) {
      setError(`Failed to initialize: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const checkAdminStatus = async (service: NFTService) => {
    try {
      const contractInfo = await service.getContractInfo();
      // In a real app, you'd check if the current user is the contract owner
      // For now, we'll assume the connected user is admin
      setIsAdmin(true);
    } catch (error) {
      console.error('Failed to check admin status:', error);
      setIsAdmin(false);
    }
  };

  const handleInputChange = (field: keyof MintingForm, value: any) => {
    setMintingForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('imageFile', file);
    }
  };

  const addAttribute = () => {
    setMintingForm(prev => ({
      ...prev,
      attributes: [...prev.attributes, { trait_type: '', value: '' }]
    }));
  };

  const updateAttribute = (index: number, field: 'trait_type' | 'value', value: string) => {
    setMintingForm(prev => ({
      ...prev,
      attributes: prev.attributes.map((attr, i) => 
        i === index ? { ...attr, [field]: value } : attr
      )
    }));
  };

  const removeAttribute = (index: number) => {
    setMintingForm(prev => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!mintingForm.name.trim()) {
      setError('NFT name is required');
      return false;
    }
    if (!mintingForm.description.trim()) {
      setError('NFT description is required');
      return false;
    }
    if (!mintingForm.imageFile) {
      setError('NFT image is required');
      return false;
    }
    return true;
  };

  const handleMintNFT = async () => {
    if (!pinataService || !nftService || !validateForm()) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Create NFT metadata with Pinata
      const metadataResult = await pinataService.createNFTMetadata(
        mintingForm.name,
        mintingForm.description,
        mintingForm.imageFile!,
        mintingForm.attributes.filter(attr => attr.trait_type && attr.value)
      );

      // Mint NFT using the backend API
      const formData = new FormData();
      formData.append('name', mintingForm.name);
      formData.append('description', mintingForm.description);
      formData.append('imageFile', mintingForm.imageFile!);
      formData.append('attributes', JSON.stringify(mintingForm.attributes.filter(attr => attr.trait_type && attr.value)));

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/nfts/mint`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`NFT minted successfully! Token ID: ${result.tokenId}, Transaction: ${result.transactionHash}`);
        
        // Reset form
        setMintingForm({
          name: '',
          description: '',
          imageFile: null,
          attributes: []
        });
        
        // Add to results
        setMintingResults(prev => [...prev, {
          name: mintingForm.name,
          success: true,
          tokenId: result.tokenId,
          transactionHash: result.transactionHash,
          ipfsUrl: result.ipfsUrl
        }]);
      } else {
        throw new Error(result.error || 'Failed to mint NFT');
      }

    } catch (error) {
      setError(`Failed to mint NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Add to results
      setMintingResults(prev => [...prev, {
        name: mintingForm.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const addBatchNFT = () => {
    setBatchMinting(prev => [...prev, {
      name: '',
      description: '',
      imageFile: null,
      attributes: []
    }]);
  };

  const updateBatchNFT = (index: number, field: keyof MintingForm, value: any) => {
    setBatchMinting(prev => prev.map((nft, i) => 
      i === index ? { ...nft, [field]: value } : nft
    ));
  };

  const removeBatchNFT = (index: number) => {
    setBatchMinting(prev => prev.filter((_, i) => i !== index));
  };

  const handleBatchMint = async () => {
    if (!pinataService || !nftService || batchMinting.length === 0) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const results = [];
      const formData = new FormData();
      const nftsData = [];

      // Prepare batch data
      for (let i = 0; i < batchMinting.length; i++) {
        const nft = batchMinting[i];
        if (!nft.name || !nft.description || !nft.imageFile) {
          results.push({
            name: nft.name || `NFT ${i + 1}`,
            success: false,
            error: 'Missing required fields'
          });
          continue;
        }

        formData.append('images', nft.imageFile);
        nftsData.push({
          name: nft.name,
          description: nft.description,
          attributes: nft.attributes.filter(attr => attr.trait_type && attr.value)
        });
      }

      formData.append('nfts', JSON.stringify(nftsData));

      // Call batch mint API
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/nfts/batch-mint`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(`Batch mint successful! ${result.totalMinted} NFTs minted. Transaction: ${result.transactionHash}`);
        
        // Reset batch form
        setBatchMinting([]);
        
        // Add results
        setMintingResults(prev => [...prev, ...result.results]);
      } else {
        throw new Error(result.error || 'Failed to batch mint NFTs');
      }

    } catch (error) {
      setError(`Failed to batch mint NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="admin-minting-container">
        <div className="connection-prompt">
          <h2>Connect to Mint NFTs</h2>
          <p>Please connect your MetaMask wallet to the Mumbai testnet to mint NFTs.</p>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="admin-minting-container">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to mint NFTs. Only contract owners can mint new NFTs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-minting-container">
      <div className="header">
        <h1>🔨 Admin NFT Minting</h1>
        <p>Mint new recycling reward NFTs to your wallet</p>
        <div className="admin-info">
          <p><strong>Admin Wallet:</strong> {userAddress}</p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`toggle-btn ${!isBatchMode ? 'active' : ''}`}
          onClick={() => setIsBatchMode(false)}
        >
          Single Mint
        </button>
        <button
          className={`toggle-btn ${isBatchMode ? 'active' : ''}`}
          onClick={() => setIsBatchMode(true)}
        >
          Batch Mint
        </button>
      </div>

      {!isBatchMode ? (
        /* Single NFT Minting Form */
        <div className="minting-form">
          <h3>Mint Single NFT</h3>
          
          <div className="form-group">
            <label htmlFor="name">NFT Name *</label>
            <input
              type="text"
              id="name"
              value={mintingForm.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter NFT name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={mintingForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter NFT description"
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">NFT Image *</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            <small>Supported formats: PNG, JPG, GIF, WebP. Max size: 10MB</small>
          </div>

          <div className="form-group">
            <label>Attributes (Optional)</label>
            <div className="attributes-container">
              {mintingForm.attributes.map((attr, index) => (
                <div key={index} className="attribute-row">
                  <input
                    type="text"
                    placeholder="Trait type"
                    value={attr.trait_type}
                    onChange={(e) => updateAttribute(index, 'trait_type', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={attr.value}
                    onChange={(e) => updateAttribute(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    className="remove-attr-btn"
                    onClick={() => removeAttribute(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="add-attr-btn"
                onClick={addAttribute}
              >
                + Add Attribute
              </button>
            </div>
          </div>

          <button
            className="mint-button"
            onClick={handleMintNFT}
            disabled={loading}
          >
            {loading ? 'Minting...' : 'Mint NFT'}
          </button>
        </div>
      ) : (
        /* Batch NFT Minting Form */
        <div className="batch-minting-form">
          <h3>Batch Mint NFTs</h3>
          
          {batchMinting.map((nft, index) => (
            <div key={index} className="batch-nft-item">
              <div className="batch-nft-header">
                <h4>NFT {index + 1}</h4>
                <button
                  className="remove-batch-btn"
                  onClick={() => removeBatchNFT(index)}
                >
                  Remove
                </button>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={nft.name}
                    onChange={(e) => updateBatchNFT(index, 'name', e.target.value)}
                    placeholder="Enter NFT name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={nft.description}
                    onChange={(e) => updateBatchNFT(index, 'description', e.target.value)}
                    placeholder="Enter NFT description"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateBatchNFT(index, 'imageFile', e.target.files?.[0] || null)}
                />
              </div>
            </div>
          ))}
          
          <div className="batch-actions">
            <button
              type="button"
              className="add-batch-btn"
              onClick={addBatchNFT}
            >
              + Add NFT to Batch
            </button>
            
            {batchMinting.length > 0 && (
              <button
                className="batch-mint-button"
                onClick={handleBatchMint}
                disabled={loading}
              >
                {loading ? 'Minting...' : `Mint ${batchMinting.length} NFTs`}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Minting Results */}
      {mintingResults.length > 0 && (
        <div className="minting-results">
          <h3>Minting Results</h3>
          <div className="results-list">
            {mintingResults.map((result, index) => (
              <div key={index} className={`result-item ${result.success ? 'success' : 'error'}`}>
                <div className="result-header">
                  <span className="result-name">{result.name}</span>
                  <span className="result-status">
                    {result.success ? '✅ Success' : '❌ Failed'}
                  </span>
                </div>
                
                {result.success ? (
                  <div className="result-details">
                    <p><strong>Token ID:</strong> {result.tokenId}</p>
                    <p><strong>Transaction:</strong> {result.transactionHash}</p>
                    <p><strong>IPFS URL:</strong> {result.ipfsUrl}</p>
                  </div>
                ) : (
                  <div className="result-details">
                    <p><strong>Error:</strong> {result.error}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="help-section">
        <h3>How to Mint NFTs</h3>
        <ol>
          <li>Fill in the NFT details (name, description, image)</li>
          <li>Optionally add attributes (traits and values)</li>
          <li>Click "Mint NFT" to create the NFT</li>
          <li>The image and metadata will be uploaded to IPFS via Pinata</li>
          <li>The NFT will be minted to your admin wallet</li>
          <li>Users can then claim these NFTs on a first-come-first-served basis</li>
        </ol>
        
        <div className="help-links">
          <a 
            href="https://mumbai.polygonscan.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            View on Mumbai Polygonscan
          </a>
          <a 
            href="https://pinata.cloud/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            Pinata IPFS Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminNFTMinting;
