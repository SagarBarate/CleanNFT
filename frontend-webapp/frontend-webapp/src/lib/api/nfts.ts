/**
 * NFT API client - Read-only operations
 * Fetches NFT data from Customer/Admin API
 */

import { env } from "@/lib/utils/env";

export interface NFT {
  id: string;
  tokenId: string;
  collection: string;
  owner: string;
  status: "minted" | "claimed" | "transferred";
  metadata: {
    name: string;
    description: string;
    image?: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  chain: string;
  txHash?: string;
  mintedAt: string;
  recyclingStationId?: string;
  collectionId?: string;
}

export interface NFTFilters {
  status?: "minted" | "claimed" | "transferred";
  collection?: string;
  dateFrom?: string;
  dateTo?: string;
  recyclingStationId?: string;
  page?: number;
  limit?: number;
}

export interface NFTResponse {
  nfts: NFT[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchNFTs(
  filters?: NFTFilters
): Promise<NFTResponse> {
  const base = env.customerBaseUrl || env.adminBaseUrl;
  
  if (!base) {
    // Fallback to mock data for development
    console.warn("No API base URL configured. Using mock data.");
    return getMockNFTs(filters);
  }

  try {
    const url = new URL(`${base}/api/nfts`);
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch NFTs: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    // Return mock data on error
    return getMockNFTs(filters);
  }
}

export async function fetchNFTById(id: string): Promise<NFT | null> {
  const base = env.customerBaseUrl || env.adminBaseUrl;
  
  if (!base) {
    return getMockNFTById(id);
  }

  try {
    const res = await fetch(`${base}/api/nfts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching NFT:", error);
    return getMockNFTById(id);
  }
}

// Mock data for development/fallback
// Includes all badges and NFTs from Users Portal
function getAllMockNFTs(): NFT[] {
  return [
    // Achievement Badges (from BadgeScreen)
    {
      id: "badge-1",
      tokenId: "1",
      collection: "Achievement Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Recycling Rookie",
        description: "Recycle your first 10 bottles and earn 500 points",
        image: "🌱",
        attributes: [
          { trait_type: "Category", value: "Beginner" },
          { trait_type: "Points Required", value: "500" },
          { trait_type: "Rarity", value: "Common" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-2",
      tokenId: "2",
      collection: "Achievement Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Green Guardian",
        description: "Recycle 50 bottles and earn 1000 points",
        image: "🌿",
        attributes: [
          { trait_type: "Category", value: "Intermediate" },
          { trait_type: "Points Required", value: "1000" },
          { trait_type: "Rarity", value: "Common" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-3",
      tokenId: "3",
      collection: "Achievement Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Eco Warrior",
        description: "Recycle 100 bottles and earn 2000 points",
        image: "🌳",
        attributes: [
          { trait_type: "Category", value: "Advanced" },
          { trait_type: "Points Required", value: "2000" },
          { trait_type: "Rarity", value: "Rare" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-4",
      tokenId: "4",
      collection: "Achievement Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Sustainability Champion",
        description: "Recycle 200 bottles and earn 5000 points",
        image: "🏆",
        attributes: [
          { trait_type: "Category", value: "Expert" },
          { trait_type: "Points Required", value: "5000" },
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-5",
      tokenId: "5",
      collection: "Achievement Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Planet Protector",
        description: "Recycle 500 bottles and earn 10000 points",
        image: "🌍",
        attributes: [
          { trait_type: "Category", value: "Master" },
          { trait_type: "Points Required", value: "10000" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-6",
      tokenId: "6",
      collection: "Streak Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Weekly Recycler",
        description: "Recycle bottles for 7 consecutive days",
        image: "📅",
        attributes: [
          { trait_type: "Category", value: "Streak" },
          { trait_type: "Points Required", value: "1000" },
          { trait_type: "Rarity", value: "Rare" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-7",
      tokenId: "7",
      collection: "Social Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Community Leader",
        description: "Help 10 other users recycle their first bottle",
        image: "👥",
        attributes: [
          { trait_type: "Category", value: "Social" },
          { trait_type: "Points Required", value: "3000" },
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "badge-8",
      tokenId: "8",
      collection: "Innovation Badges",
      owner: "0x0000...0000",
      status: "minted",
      metadata: {
        name: "Innovation Pioneer",
        description: "Suggest and implement a new recycling feature",
        image: "💡",
        attributes: [
          { trait_type: "Category", value: "Innovation" },
          { trait_type: "Points Required", value: "8000" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Type", value: "Badge" },
        ],
      },
      chain: "Polygon",
      mintedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    // NFT Tokens (from NFTClaimScreen)
    {
      id: "nft-1",
      tokenId: "1001",
      collection: "Achievement NFTs",
      owner: "0x1234...5678",
      status: "claimed",
      metadata: {
        name: "Recycling Pioneer",
        description: "First NFT for recycling 100 bottles and earning 2000 points",
        image: "🌱",
        attributes: [
          { trait_type: "Category", value: "Achievement" },
          { trait_type: "Points Required", value: "2000" },
          { trait_type: "Rarity", value: "Common" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Ethereum",
      txHash: "0xabc123...",
      mintedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-2",
      tokenId: "1002",
      collection: "Achievement NFTs",
      owner: "0x2345...6789",
      status: "minted",
      metadata: {
        name: "Green Innovator",
        description: "NFT for recycling 500 bottles and earning 5000 points",
        image: "🌿",
        attributes: [
          { trait_type: "Category", value: "Achievement" },
          { trait_type: "Points Required", value: "5000" },
          { trait_type: "Rarity", value: "Rare" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Ethereum",
      txHash: "0xdef456...",
      mintedAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-3",
      tokenId: "1003",
      collection: "Achievement NFTs",
      owner: "0x3456...7890",
      status: "minted",
      metadata: {
        name: "Sustainability Leader",
        description: "NFT for recycling 1000 bottles and earning 10000 points",
        image: "🌳",
        attributes: [
          { trait_type: "Category", value: "Achievement" },
          { trait_type: "Points Required", value: "10000" },
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Ethereum",
      txHash: "0xghi789...",
      mintedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-4",
      tokenId: "1004",
      collection: "Achievement NFTs",
      owner: "0x4567...8901",
      status: "minted",
      metadata: {
        name: "Planet Guardian",
        description: "NFT for recycling 2000 bottles and earning 20000 points",
        image: "🌍",
        attributes: [
          { trait_type: "Category", value: "Achievement" },
          { trait_type: "Points Required", value: "20000" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Ethereum",
      txHash: "0xjkl012...",
      mintedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-5",
      tokenId: "1005",
      collection: "Streak NFTs",
      owner: "0x5678...9012",
      status: "minted",
      metadata: {
        name: "Weekly Champion",
        description: "NFT for maintaining a 7-day recycling streak",
        image: "📅",
        attributes: [
          { trait_type: "Category", value: "Streak" },
          { trait_type: "Points Required", value: "3000" },
          { trait_type: "Rarity", value: "Rare" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Polygon",
      txHash: "0xmno345...",
      mintedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-6",
      tokenId: "1006",
      collection: "Social NFTs",
      owner: "0x6789...0123",
      status: "minted",
      metadata: {
        name: "Community Hero",
        description: "NFT for helping 20 users start recycling",
        image: "👥",
        attributes: [
          { trait_type: "Category", value: "Social" },
          { trait_type: "Points Required", value: "8000" },
          { trait_type: "Rarity", value: "Epic" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Ethereum",
      txHash: "0xpqr678...",
      mintedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-7",
      tokenId: "1007",
      collection: "Innovation NFTs",
      owner: "0x7890...1234",
      status: "minted",
      metadata: {
        name: "Innovation Master",
        description: "NFT for contributing to app development",
        image: "💡",
        attributes: [
          { trait_type: "Category", value: "Innovation" },
          { trait_type: "Points Required", value: "15000" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Ethereum",
      txHash: "0xstu901...",
      mintedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "nft-8",
      tokenId: "1008",
      collection: "Environmental NFTs",
      owner: "0x8901...2345",
      status: "minted",
      metadata: {
        name: "Carbon Neutral",
        description: "NFT for offsetting 1 ton of CO2 through recycling",
        image: "🌱",
        attributes: [
          { trait_type: "Category", value: "Environmental" },
          { trait_type: "Points Required", value: "25000" },
          { trait_type: "Rarity", value: "Legendary" },
          { trait_type: "Type", value: "NFT" },
        ],
      },
      chain: "Polygon",
      txHash: "0xvwx234...",
      mintedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function getMockNFTs(filters?: NFTFilters): NFTResponse {
  const mockNFTs = getAllMockNFTs();
  let filtered = [...mockNFTs];

  if (filters?.status) {
    filtered = filtered.filter((nft) => nft.status === filters.status);
  }

  if (filters?.collection) {
    filtered = filtered.filter((nft) => nft.collection === filters.collection);
  }

  // Pagination
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNFTs = filtered.slice(startIndex, endIndex);

  return {
    nfts: paginatedNFTs,
    total: filtered.length,
    page: page,
    limit: limit,
    totalPages: Math.ceil(filtered.length / limit),
  };
}

function getMockNFTById(id: string): NFT | null {
  // Get all NFTs without pagination
  const allNFTs = getAllMockNFTs();
  return allNFTs.find((nft) => nft.id === id) || null;
}

