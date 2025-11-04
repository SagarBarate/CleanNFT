"use client";

import * as React from "react";
import { NFT } from "@/lib/api/nfts";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye } from "lucide-react";

interface NftTableProps {
  nfts: NFT[];
  onRowClick?: (nft: NFT) => void;
}

export function NftTable({ nfts, onRowClick }: NftTableProps) {
  const statusColors = {
    minted: "bg-green-100 text-green-800",
    claimed: "bg-blue-100 text-blue-800",
    transferred: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Owner
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Minted Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {nfts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  No NFTs found
                </td>
              </tr>
            ) : (
              nfts.map((nft) => (
                <tr
                  key={nft.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onRowClick?.(nft)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{nft.tokenId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {nft.metadata.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {nft.collection}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        statusColors[nft.status]
                      )}
                    >
                      {nft.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(nft.mintedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRowClick?.(nft);
                        }}
                        className="text-[#00A86B] hover:text-[#00A86B] hover:bg-[#00A86B]/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {nft.txHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(
                              `https://polygonscan.com/tx/${nft.txHash}`,
                              "_blank"
                            );
                          }}
                          className="text-[#00A86B] hover:text-[#00A86B] hover:bg-[#00A86B]/10"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

