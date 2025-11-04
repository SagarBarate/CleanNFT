"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NftCard } from "@/components/nft/NftCard";
import { NftTable } from "@/components/nft/NftTable";
import { NftFiltersComponent } from "@/components/nft/NftFilters";
import { NftDetailDrawer } from "@/components/nft/NftDetailDrawer";
import { fetchNFTs, type NFT, type NFTFilters } from "@/lib/api/nfts";
import { cn } from "@/lib/utils/cn";

type ViewMode = "grid" | "table";

export default function NFTsPage() {
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [filters, setFilters] = React.useState<NFTFilters>({
    page: 1,
    limit: 20,
  });
  const [selectedNft, setSelectedNft] = React.useState<NFT | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["nfts", filters],
    queryFn: () => fetchNFTs(filters),
    staleTime: 30000, // 30 seconds
  });

  const collections = React.useMemo(() => {
    if (!data?.nfts) return [];
    const uniqueCollections = new Set(
      data.nfts.map((nft) => nft.collection).filter(Boolean)
    );
    return Array.from(uniqueCollections);
  }, [data?.nfts]);

  const handleNftClick = (nft: NFT) => {
    setSelectedNft(nft);
    setIsDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NFT <span className="text-[#00A86B]">Gallery</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Explore all minted NFTs from our recycling community. Each NFT represents a real environmental impact.
          </p>
        </div>

        {/* Filters */}
        <NftFiltersComponent
          filters={filters}
          onFiltersChange={setFilters}
          collections={collections}
        />

        {/* View Toggle & Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              <List className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
          {data && (
            <p className="text-sm text-gray-600">
              Showing {data.nfts.length} of {data.total} NFTs
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#00A86B]" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800 font-medium">Failed to load NFTs</p>
            <p className="text-red-600 text-sm mt-2">
              {error instanceof Error ? error.message : "Unknown error occurred"}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!isLoading && !error && data && viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.nfts.map((nft) => (
              <NftCard key={nft.id} nft={nft} onClick={handleNftClick} />
            ))}
          </div>
        )}

        {/* Table View */}
        {!isLoading && !error && data && viewMode === "table" && (
          <NftTable nfts={data.nfts} onRowClick={handleNftClick} />
        )}

        {/* Empty State */}
        {!isLoading && !error && data && data.nfts.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <div className="text-6xl mb-4">♻️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No NFTs Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or check back later for new NFTs.
            </p>
            <Button
              onClick={() =>
                setFilters({
                  page: 1,
                  limit: 20,
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !error && data && data.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({ ...filters, page: (filters.page || 1) - 1 })
              }
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 px-4">
              Page {filters.page || 1} of {data.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setFilters({ ...filters, page: (filters.page || 1) + 1 })
              }
              disabled={(filters.page || 1) >= data.totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Detail Drawer */}
        <NftDetailDrawer
          nft={selectedNft}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </div>
    </div>
  );
}

