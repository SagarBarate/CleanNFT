// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RecyclingBadge is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    constructor() 
        ERC721("RecyclingBadge", "RCB") 
        Ownable(msg.sender) 
    {
        _tokenIdCounter = 0;
    }

    function mintBadge(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function getTotalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Optional: Function to get next token ID
    function getNextTokenId() public view returns (uint256) {
        return _tokenIdCounter;
    }

    // Optional: Function to mint to yourself (for testing)
    function mintToSelf(string memory tokenURI) public onlyOwner {
        mintBadge(msg.sender, tokenURI);
    }
}