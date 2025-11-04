"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NFT } from "@/lib/api/nfts";
import { ExternalLink, Calendar, User, Hash, Link2, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface NftDetailDrawerProps {
  nft: NFT | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NftDetailDrawer({
  nft,
  open,
  onOpenChange,
}: NftDetailDrawerProps) {
  if (!nft) return null;

  const statusColors = {
    minted: "bg-green-100 text-green-800",
    claimed: "bg-blue-100 text-blue-800",
    transferred: "bg-purple-100 text-purple-800",
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-[#0B0F0E]">
            {nft.metadata.name}
          </SheetTitle>
          <SheetDescription className="text-gray-600">
            {nft.metadata.description}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* NFT Image */}
          <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
            {nft.metadata.image ? (
              <Image
                src={nft.metadata.image}
                alt={nft.metadata.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00A86B] to-[#A3FFB0]">
                <span className="text-6xl font-bold text-white">♻️</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <span
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium",
                statusColors[nft.status]
              )}
            >
              {nft.status.toUpperCase()}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Hash className="h-4 w-4" />
                <span>Token ID</span>
              </div>
              <p className="font-mono text-lg font-semibold text-gray-900">
                #{nft.tokenId}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Package className="h-4 w-4" />
                <span>Collection</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {nft.collection}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <User className="h-4 w-4" />
                <span>Owner</span>
              </div>
              <p className="font-mono text-lg font-semibold text-gray-900 break-all">
                {nft.owner}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Minted Date</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(nft.mintedAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link2 className="h-4 w-4" />
                <span>Chain</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{nft.chain}</p>
            </div>

            {nft.recyclingStationId && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Package className="h-4 w-4" />
                  <span>Recycling Station</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {nft.recyclingStationId}
                </p>
              </div>
            )}
          </div>

          {/* Transaction Hash */}
          {nft.txHash && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Link2 className="h-4 w-4" />
                <span>Transaction Hash</span>
              </div>
              <div className="flex items-center space-x-2">
                <p className="font-mono text-sm text-gray-900 break-all">
                  {nft.txHash}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    window.open(
                      `https://polygonscan.com/tx/${nft.txHash}`,
                      "_blank"
                    )
                  }
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on PolygonScan
                </Button>
              </div>
            </div>
          )}

          {/* Attributes */}
          {nft.metadata.attributes && nft.metadata.attributes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Attributes</h3>
              <div className="grid grid-cols-2 gap-3">
                {nft.metadata.attributes.map((attr, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                  >
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                      {attr.trait_type}
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {attr.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

