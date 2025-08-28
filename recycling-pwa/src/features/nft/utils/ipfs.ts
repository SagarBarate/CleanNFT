/**
 * Convert IPFS URI to HTTP gateway URL
 * @param uri - IPFS URI (e.g., ipfs://QmHash...)
 * @returns HTTP gateway URL or original URI if not IPFS
 */
export function ipfsToHttp(uri: string): string {
  if (!uri?.startsWith('ipfs://')) {
    return uri;
  }
  
  const gateway = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  return `${gateway}${uri.replace('ipfs://', '')}`;
}

/**
 * Extract IPFS hash from URI
 * @param uri - IPFS URI
 * @returns IPFS hash or null if not IPFS URI
 */
export function extractIpfsHash(uri: string): string | null {
  if (!uri?.startsWith('ipfs://')) {
    return null;
  }
  
  return uri.replace('ipfs://', '');
}
