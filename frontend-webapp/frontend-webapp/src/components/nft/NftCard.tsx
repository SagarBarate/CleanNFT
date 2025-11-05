"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Calendar, User } from "lucide-react";
import { NFT } from "@/lib/api/nfts";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";

interface NftCardProps {
  nft: NFT;
  onClick?: (nft: NFT) => void;
}

export function NftCard({ nft, onClick }: NftCardProps) {
  const statusColors = {
    minted: "bg-green-100 text-green-800",
    claimed: "bg-blue-100 text-blue-800",
    transferred: "bg-purple-100 text-purple-800",
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl",
        "transition-all duration-300 cursor-pointer",
        "border border-gray-100 hover:border-[#00A86B]/30"
      )}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => onClick?.(nft)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* NFT Image */}
      <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
        {nft.metadata.image ? (
          // Check if image is an emoji or a valid URL
          nft.metadata.image.startsWith('http://') || 
          nft.metadata.image.startsWith('https://') || 
          nft.metadata.image.startsWith('/') ? (
            <Image
              src={nft.metadata.image}
              alt={nft.metadata.name}
              fill
              className="object-cover"
            />
          ) : (
            // Render emoji as text
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00A86B] to-[#A3FFB0]">
              <span className="text-6xl">{nft.metadata.image}</span>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#00A86B] to-[#A3FFB0]">
            <span className="text-4xl font-bold text-white">♻️</span>
          </div>
        )}
      </div>

      {/* NFT Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 mb-1">
            {nft.metadata.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {nft.metadata.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium",
              statusColors[nft.status]
            )}
          >
            {nft.status}
          </span>
          <span className="text-xs text-gray-500">{nft.collection}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">
              {new Date(nft.mintedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span className="text-xs truncate max-w-[100px]">{nft.owner}</span>
          </div>
        </div>

        {nft.txHash && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://polygonscan.com/tx/${nft.txHash}`,
                "_blank"
              );
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Transaction
          </Button>
        )}
      </div>
    </motion.div>
  );
}

