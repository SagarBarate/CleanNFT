// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Counters removed - using simple uint256 instead
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract RecyclingNFT is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;
    
    // Mapping from token ID to metadata URI
    mapping(uint256 => string) private _tokenURIs;
    
    // Mapping to track if a user has already claimed an NFT
    mapping(address => bool) private _hasClaimed;
    
    // Maximum number of NFTs that can be claimed
    uint256 public maxClaimableNFTs;
    
    // Number of NFTs currently claimed
    uint256 public claimedNFTs;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event NFTMinted(uint256 indexed tokenId, address indexed to, string tokenURI);
    event NFTClaimed(uint256 indexed tokenId, address indexed from, address indexed to);
    event MetadataUpdated(uint256 indexed tokenId, string newTokenURI);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxClaimableNFTs
    ) ERC721(name, symbol) Ownable(msg.sender) {
        maxClaimableNFTs = _maxClaimableNFTs;
        _baseTokenURI = "";
    }
    
    /**
     * @dev Check if a token exists
     * @param tokenId ID of the token to check
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
    
    /**
     * @dev Mint NFTs to admin wallet (only owner can call)
     * @param to Address to mint to (should be admin wallet)
     * @param tokenURIString Metadata URI for the NFT
     */
    function mintNFT(address to, string memory tokenURIString) 
        public 
        onlyOwner 
        returns (uint256) 
    {
        require(to != address(0), "Invalid address");
        require(bytes(tokenURIString).length > 0, "Token URI cannot be empty");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _mint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURIString);
        
        emit NFTMinted(newTokenId, to, tokenURIString);
        
        return newTokenId;
    }
    
    /**
     * @dev Batch mint multiple NFTs to admin wallet
     * @param to Address to mint to
     * @param tokenURIs Array of metadata URIs
     */
    function batchMintNFTs(address to, string[] memory tokenURIs) 
        public 
        onlyOwner 
        returns (uint256[] memory) 
    {
        require(to != address(0), "Invalid address");
        require(tokenURIs.length > 0, "Token URIs array cannot be empty");
        
        uint256[] memory newTokenIds = new uint256[](tokenURIs.length);
        
        for (uint256 i = 0; i < tokenURIs.length; i++) {
            newTokenIds[i] = mintNFT(to, tokenURIs[i]);
        }
        
        return newTokenIds;
    }
    
    /**
     * @dev Claim an NFT from admin wallet (first come, first served)
     * @param tokenId ID of the NFT to claim
     */
    function claimNFT(uint256 tokenId) 
        public 
        nonReentrant 
        returns (bool) 
    {
        require(_exists(tokenId), "NFT does not exist");
        require(ownerOf(tokenId) == owner(), "NFT not owned by admin");
        require(!_hasClaimed[msg.sender], "User has already claimed an NFT");
        require(claimedNFTs < maxClaimableNFTs, "Maximum claimable NFTs reached");
        
        // Transfer NFT from admin to user
        _transfer(owner(), msg.sender, tokenId);
        
        // Mark user as claimed
        _hasClaimed[msg.sender] = true;
        claimedNFTs++;
        
        emit NFTClaimed(tokenId, owner(), msg.sender);
        
        return true;
    }
    
    /**
     * @dev Check if a user has already claimed an NFT
     * @param user Address of the user to check
     */
    function hasUserClaimed(address user) public view returns (bool) {
        return _hasClaimed[user];
    }
    
    /**
     * @dev Get remaining claimable NFTs
     */
    function getRemainingClaimableNFTs() public view returns (uint256) {
        return maxClaimableNFTs - claimedNFTs;
    }
    
    /**
     * @dev Get total minted NFTs
     */
    function getTotalMintedNFTs() public view returns (uint256) {
        return _tokenIds;
    }
    
    /**
     * @dev Set base URI for all tokens
     * @param baseURI New base URI
     */
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }
    
    /**
     * @dev Update metadata URI for a specific token
     * @param tokenId ID of the token
     * @param newTokenURI New metadata URI
     */
    function updateTokenURI(uint256 tokenId, string memory newTokenURI) 
        public 
        onlyOwner 
    {
        require(_exists(tokenId), "NFT does not exist");
        require(bytes(newTokenURI).length > 0, "Token URI cannot be empty");
        
        _setTokenURI(tokenId, newTokenURI);
        emit MetadataUpdated(tokenId, newTokenURI);
    }
    
    /**
     * @dev Set maximum claimable NFTs
     * @param _maxClaimable New maximum
     */
    function setMaxClaimableNFTs(uint256 _maxClaimable) public onlyOwner {
        require(_maxClaimable >= claimedNFTs, "Cannot set below already claimed");
        maxClaimableNFTs = _maxClaimable;
    }
    
    /**
     * @dev Get token URI for a specific token
     * @param tokenId ID of the token
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override 
        returns (string memory) 
    {
        require(_exists(tokenId), "NFT does not exist");
        
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseTokenURI;
        
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        
        return string(abi.encodePacked(base, Strings.toString(tokenId)));
    }
    
    /**
     * @dev Internal function to set token URI
     * @param tokenId ID of the token
     * @param _tokenURI Metadata URI
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "NFT does not exist");
        _tokenURIs[tokenId] = _tokenURI;
    }
    
    /**
     * @dev Override _beforeTokenTransfer to add custom logic if needed
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual {
        // Custom logic can be added here if needed
    }
    
    /**
     * @dev Emergency function to withdraw stuck tokens (only owner)
     * @param tokenId ID of the token to withdraw
     */
    function emergencyWithdraw(uint256 tokenId) public onlyOwner {
        require(_exists(tokenId), "NFT does not exist");
        address currentOwner = ownerOf(tokenId);
        if (currentOwner != owner()) {
            _transfer(currentOwner, owner(), tokenId);
        }
    }
}
