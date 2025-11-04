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
function getMockNFTs(filters?: NFTFilters): NFTResponse {
  const mockNFTs: NFT[] = [
    {
      id: "1",
      tokenId: "1001",
      collection: "Recycling Heroes",
      owner: "0x1234...5678",
      status: "minted",
      metadata: {
        name: "Plastic Bottle #1001",
        description: "NFT minted for recycling 500g of plastic bottles",
        image: "/placeholder-nft.svg",
        attributes: [
          { trait_type: "Material", value: "Plastic" },
          { trait_type: "Weight", value: "500g" },
          { trait_type: "Rarity", value: "Common" },
        ],
      },
      chain: "Polygon",
      txHash: "0xabc123...",
      mintedAt: new Date().toISOString(),
      recyclingStationId: "STATION-001",
    },
    {
      id: "2",
      tokenId: "1002",
      collection: "Eco Warriors",
      owner: "0x2345...6789",
      status: "claimed",
      metadata: {
        name: "Cardboard Box #1002",
        description: "NFT minted for recycling 1kg of cardboard",
        image: "/placeholder-nft.svg",
        attributes: [
          { trait_type: "Material", value: "Cardboard" },
          { trait_type: "Weight", value: "1kg" },
          { trait_type: "Rarity", value: "Rare" },
        ],
      },
      chain: "Polygon",
      txHash: "0xdef456...",
      mintedAt: new Date(Date.now() - 86400000).toISOString(),
      recyclingStationId: "STATION-002",
    },
  ];

  let filtered = mockNFTs;

  if (filters?.status) {
    filtered = filtered.filter((nft) => nft.status === filters.status);
  }

  if (filters?.collection) {
    filtered = filtered.filter((nft) => nft.collection === filters.collection);
  }

  return {
    nfts: filtered,
    total: filtered.length,
    page: filters?.page || 1,
    limit: filters?.limit || 20,
    totalPages: Math.ceil(filtered.length / (filters?.limit || 20)),
  };
}

function getMockNFTById(id: string): NFT | null {
  const mock = getMockNFTs();
  return mock.nfts.find((nft) => nft.id === id) || null;
}

