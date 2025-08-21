import React, { useState, useEffect } from 'react';
import { NFTService, NFTInfo, ContractInfo } from '../services/nftService';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';
import './NFTClaiming.css';

interface AvailableNFT {
  tokenId: string;
  tokenURI: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

const NFTClaiming: React.FC = () => {
  const [nftService, setNftService] = useState<NFTService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [availableNFTs, setAvailableNFTs] = useState<AvailableNFT[]>([]);
  const [contractInfo, setContractInfo] = useState<ContractInfo | null>(null);
  const [userClaimStatus, setUserClaimStatus] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [claimingTokenId, setClaimingTokenId] = useState<number | null>(null);

  useEffect(() => {
    initializeService();
  }, []);

  const initializeService = async () => {
    try {
      const service = new NFTService();
      await service.initialize();
      setNftService(service);
      
      // Check if connected to Mumbai
      const isMumbai = await service.isMumbaiNetwork();
      if (!isMumbai) {
        setError('Please connect to Mumbai testnet to use this feature');
        return;
      }

      const address = await service.getSignerAddress();
      setUserAddress(address);
      setIsConnected(true);

      // Load initial data
      await loadContractInfo();
      await loadAvailableNFTs();
      await checkUserClaimStatus();
    } catch (error) {
      setError(`Failed to initialize: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const loadContractInfo = async () => {
    if (!nftService) return;
    
    try {
      const info = await nftService.getContractInfo();
      setContractInfo(info);
    } catch (error) {
      console.error('Failed to load contract info:', error);
    }
  };

  const loadAvailableNFTs = async () => {
    if (!nftService) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/nfts/available`);
      const data = await response.json();
      
      if (data.success) {
        // Fetch metadata for each NFT
        const nftsWithMetadata = await Promise.all(
          data.availableNFTs.map(async (nft: any) => {
            try {
              const metadataResponse = await fetch(nft.tokenURI);
              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                return { ...nft, metadata };
              }
            } catch (error) {
              console.error(`Failed to fetch metadata for token ${nft.tokenId}:`, error);
            }
            return nft;
          })
        );
        
        setAvailableNFTs(nftsWithMetadata);
      }
    } catch (error) {
      setError(`Failed to load available NFTs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const checkUserClaimStatus = async () => {
    if (!nftService || !userAddress) return;
    
    try {
      const hasClaimed = await nftService.hasUserClaimed(userAddress);
      setUserClaimStatus(hasClaimed);
    } catch (error) {
      console.error('Failed to check user claim status:', error);
    }
  };

  const handleClaimNFT = async (tokenId: number) => {
    if (!nftService) return;
    
    try {
      setClaimingTokenId(tokenId);
      setError('');
      setSuccess('');

      // Check if user has already claimed
      if (userClaimStatus) {
        setError('You have already claimed an NFT');
        return;
      }

      // Estimate gas
      const gasEstimate = await nftService.estimateGasForClaim(tokenId);
      console.log('Gas estimate:', gasEstimate.toString());

      // Claim the NFT
      const tx = await nftService.claimNFT(tokenId);
      setSuccess(`Transaction submitted! Hash: ${tx.hash}`);

      // Wait for confirmation
      const receipt = await nftService.waitForTransaction(tx);
      setSuccess(`NFT claimed successfully! Transaction confirmed in block ${receipt.blockNumber}`);

      // Update user claim status
      setUserClaimStatus(true);
      
      // Reload data
      await loadContractInfo();
      await loadAvailableNFTs();

    } catch (error) {
      setError(`Failed to claim NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setClaimingTokenId(null);
    }
  };

  const switchToMumbai = async () => {
    if (!nftService) return;
    
    try {
      await nftService.switchToMumbai();
      setSuccess('Switched to Mumbai testnet successfully!');
      // Reload the page to reinitialize
      window.location.reload();
    } catch (error) {
      setError(`Failed to switch network: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getNetworkName = (chainId: string | number) => {
    const chainIdNum = typeof chainId === 'string' ? parseInt(chainId, 16) : chainId;
    switch (chainIdNum) {
      case 80001:
        return 'Mumbai Testnet';
      case 137:
        return 'Polygon Mainnet';
      case 1:
        return 'Ethereum Mainnet';
      default:
        return `Chain ID: ${chainIdNum}`;
    }
  };

  if (!isConnected) {
    return (
      <div className="nft-claiming-container">
        <div className="connection-prompt">
          <h2>Connect to Claim NFTs</h2>
          <p>Please connect your MetaMask wallet to the Mumbai testnet to claim your recycling reward NFT.</p>
          <button 
            className="connect-button"
            onClick={switchToMumbai}
          >
            Switch to Mumbai Testnet
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="nft-claiming-container">
      <div className="header">
        <h1>🎉 Claim Your Recycling Reward NFT</h1>
        <p>Connect your wallet and claim your exclusive recycling achievement NFT!</p>
      </div>

      {/* Contract Statistics */}
      {contractInfo && (
        <div className="contract-stats">
          <h3>Collection Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Minted</span>
              <span className="stat-value">{contractInfo.totalMinted}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Available for Claim</span>
              <span className="stat-value">{contractInfo.remaining}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Already Claimed</span>
              <span className="stat-value">{contractInfo.claimed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Max Claimable</span>
              <span className="stat-value">{contractInfo.maxClaimable}</span>
            </div>
          </div>
        </div>
      )}

      {/* User Status */}
      <div className="user-status">
        <h3>Your Status</h3>
        <div className="status-info">
          <p><strong>Wallet Address:</strong> {userAddress}</p>
          <p><strong>Claim Status:</strong> 
            {userClaimStatus === null ? ' Checking...' : 
             userClaimStatus ? ' ❌ Already claimed an NFT' : ' ✅ Eligible to claim'}
          </p>
        </div>
      </div>

      {/* Available NFTs */}
      <div className="available-nfts">
        <h3>Available NFTs for Claim</h3>
        {loading ? (
          <div className="loading">Loading available NFTs...</div>
        ) : availableNFTs.length === 0 ? (
          <div className="no-nfts">
            <p>No NFTs are currently available for claiming.</p>
            <p>Check back later for new recycling rewards!</p>
          </div>
        ) : (
          <div className="nfts-grid">
            {availableNFTs.map((nft) => (
              <div key={nft.tokenId} className="nft-card">
                <div className="nft-image">
                  {nft.metadata?.image ? (
                    <img 
                      src={nft.metadata.image} 
                      alt={nft.metadata.name || `NFT ${nft.tokenId}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="fallback-image hidden">🖼️</div>
                </div>
                
                <div className="nft-info">
                  <h4>{nft.metadata?.name || `NFT #${nft.tokenId}`}</h4>
                  <p>{nft.metadata?.description || 'No description available'}</p>
                  
                  {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
                    <div className="nft-attributes">
                      {nft.metadata.attributes.map((attr, index) => (
                        <span key={index} className="attribute">
                          {attr.trait_type}: {attr.value}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="nft-actions">
                    <button
                      className={`claim-button ${userClaimStatus || claimingTokenId === parseInt(nft.tokenId) ? 'disabled' : ''}`}
                      onClick={() => handleClaimNFT(parseInt(nft.tokenId))}
                      disabled={userClaimStatus || claimingTokenId === parseInt(nft.tokenId)}
                    >
                      {claimingTokenId === parseInt(nft.tokenId) ? 'Claiming...' : 
                       userClaimStatus ? 'Already Claimed' : 'Claim NFT'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Messages */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Help Section */}
      <div className="help-section">
        <h3>How to Claim Your NFT</h3>
        <ol>
          <li>Make sure you're connected to the Mumbai testnet</li>
          <li>Ensure you have some MATIC for gas fees</li>
          <li>Click "Claim NFT" on any available NFT</li>
          <li>Confirm the transaction in MetaMask</li>
          <li>Wait for confirmation (usually takes a few seconds)</li>
        </ol>
        
        <div className="help-links">
          <a 
            href="https://faucet.polygon.technology/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            Get Mumbai MATIC from Faucet
          </a>
          <a 
            href="https://mumbai.polygonscan.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            View on Mumbai Polygonscan
          </a>
        </div>
      </div>
    </div>
  );
};

export default NFTClaiming;
