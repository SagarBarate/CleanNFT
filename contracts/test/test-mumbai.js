const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RecyclingBadge Contract on Mumbai", function () {
  let RecyclingBadge;
  let recyclingBadge;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy contract
    RecyclingBadge = await ethers.getContractFactory("RecyclingBadge");
    recyclingBadge = await RecyclingBadge.deploy();
    await recyclingBadge.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await recyclingBadge.owner()).to.equal(owner.address);
    });

    it("Should start with token ID counter at 0", async function () {
      expect(await recyclingBadge.getNextTokenId()).to.equal(0);
    });

    it("Should start with total supply at 0", async function () {
      expect(await recyclingBadge.getTotalSupply()).to.equal(0);
    });
  });

  describe("Minting", function () {
    const tokenURI = "ipfs://QmTestTokenURI123";

    it("Should allow owner to mint badge", async function () {
      await expect(recyclingBadge.mintBadge(addr1.address, tokenURI))
        .to.emit(recyclingBadge, "Transfer")
        .withArgs(ethers.ZeroAddress, addr1.address, 0);

      expect(await recyclingBadge.ownerOf(0)).to.equal(addr1.address);
      expect(await recyclingBadge.tokenURI(0)).to.equal(tokenURI);
      expect(await recyclingBadge.getTotalSupply()).to.equal(1);
      expect(await recyclingBadge.getNextTokenId()).to.equal(1);
    });

    it("Should increment token ID counter", async function () {
      await recyclingBadge.mintBadge(addr1.address, tokenURI);
      await recyclingBadge.mintBadge(addr2.address, tokenURI);

      expect(await recyclingBadge.getTotalSupply()).to.equal(2);
      expect(await recyclingBadge.getNextTokenId()).to.equal(2);
    });

    it("Should not allow non-owner to mint", async function () {
      await expect(
        recyclingBadge.connect(addr1).mintBadge(addr1.address, tokenURI)
      ).to.be.revertedWithCustomError(recyclingBadge, "OwnableUnauthorizedAccount");
    });

    it("Should not allow minting to zero address", async function () {
      await expect(
        recyclingBadge.mintBadge(ethers.ZeroAddress, tokenURI)
      ).to.be.revertedWith("ERC721: mint to the zero address");
    });
  });

  describe("Token URI", function () {
    it("Should return correct token URI", async function () {
      const tokenURI = "ipfs://QmTestTokenURI456";
      await recyclingBadge.mintBadge(addr1.address, tokenURI);
      
      expect(await recyclingBadge.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should revert for non-existent token", async function () {
      await expect(recyclingBadge.tokenURI(999)).to.be.revertedWith("ERC721: invalid token ID");
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to mint to self", async function () {
      const tokenURI = "ipfs://QmTestTokenURI789";
      await recyclingBadge.mintToSelf(tokenURI);
      
      expect(await recyclingBadge.ownerOf(0)).to.equal(owner.address);
      expect(await recyclingBadge.tokenURI(0)).to.equal(tokenURI);
    });

    it("Should not allow non-owner to mint to self", async function () {
      const tokenURI = "ipfs://QmTestTokenURI999";
      await expect(
        recyclingBadge.connect(addr1).mintToSelf(tokenURI)
      ).to.be.revertedWithCustomError(recyclingBadge, "OwnableUnauthorizedAccount");
    });
  });

  describe("Gas Estimation", function () {
    it("Should estimate gas for minting", async function () {
      const tokenURI = "ipfs://QmTestTokenURIGas";
      const gasEstimate = await recyclingBadge.mintBadge.estimateGas(addr1.address, tokenURI);
      
      expect(gasEstimate).to.be.gt(0);
      console.log(`Estimated gas for minting: ${gasEstimate.toString()}`);
    });
  });

  describe("Batch Operations", function () {
    it("Should handle multiple mints correctly", async function () {
      const tokenURIs = [
        "ipfs://QmToken1",
        "ipfs://QmToken2",
        "ipfs://QmToken3"
      ];

      for (let i = 0; i < tokenURIs.length; i++) {
        await recyclingBadge.mintBadge(addr1.address, tokenURIs[i]);
        expect(await recyclingBadge.ownerOf(i)).to.equal(addr1.address);
        expect(await recyclingBadge.tokenURI(i)).to.equal(tokenURIs[i]);
      }

      expect(await recyclingBadge.getTotalSupply()).to.equal(3);
      expect(await recyclingBadge.getNextTokenId()).to.equal(3);
    });
  });
});
