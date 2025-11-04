"use client";

import * as React from "react";
import { Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NFTFilters } from "@/lib/api/nfts";
import { cn } from "@/lib/utils/cn";

interface NftFiltersProps {
  filters: NFTFilters;
  onFiltersChange: (filters: NFTFilters) => void;
  collections: string[];
}

export function NftFiltersComponent({
  filters,
  onFiltersChange,
  collections,
}: NftFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (key: keyof NFTFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 20,
    });
  };

  const hasActiveFilters = Boolean(
    filters.status || filters.collection || filters.recyclingStationId
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-4">
          <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by token ID, name, or description..."
            className="pl-10"
            disabled
            title="Search functionality coming soon"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-4"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 bg-[#00A86B] text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {Object.values(filters).filter(Boolean).length - 2}
            </span>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) =>
                handleFilterChange("status", e.target.value || undefined)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
            >
              <option value="">All Status</option>
              <option value="minted">Minted</option>
              <option value="claimed">Claimed</option>
              <option value="transferred">Transferred</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection
            </label>
            <select
              value={filters.collection || ""}
              onChange={(e) =>
                handleFilterChange("collection", e.target.value || undefined)
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00A86B]"
            >
              <option value="">All Collections</option>
              {collections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recycling Station ID
            </label>
            <Input
              placeholder="Station ID"
              value={filters.recyclingStationId || ""}
              onChange={(e) =>
                handleFilterChange("recyclingStationId", e.target.value || undefined)
              }
            />
          </div>

          <div className="md:col-span-3 flex justify-end space-x-2">
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

