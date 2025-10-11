/**
 * Convert IPFS URI to HTTP gateway URL
 */
export const ipfsToHttp = (uri: string): string => {
  if (!uri) return '';
  
  // Get configured IPFS gateway
  const gateway = process.env.REACT_APP_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
  
  // Handle different IPFS URI formats
  if (uri.startsWith('ipfs://')) {
    // ipfs://QmHash format
    const hash = uri.replace('ipfs://', '');
    return `${gateway}${hash}`;
  } else if (uri.startsWith('/ipfs/')) {
    // /ipfs/QmHash format
    const hash = uri.replace('/ipfs/', '');
    return `${gateway}${hash}`;
  } else if (uri.includes('ipfs/')) {
    // Already contains ipfs/ path
    const parts = uri.split('ipfs/');
    if (parts.length > 1) {
      return `${gateway}${parts[1]}`;
    }
  } else if (uri.startsWith('Qm') && uri.length === 46) {
    // Direct hash
    return `${gateway}${uri}`;
  }
  
  // If it's already an HTTP URL, return as is
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    return uri;
  }
  
  // Default: assume it's a hash and prepend gateway
  return `${gateway}${uri}`;
};

/**
 * Extract IPFS hash from URI
 */
export const extractIpfsHash = (uri: string): string | null => {
  if (!uri) return null;
  
  if (uri.startsWith('ipfs://')) {
    return uri.replace('ipfs://', '');
  } else if (uri.startsWith('/ipfs/')) {
    return uri.replace('/ipfs/', '');
  } else if (uri.includes('ipfs/')) {
    const parts = uri.split('ipfs/');
    return parts.length > 1 ? parts[1] : null;
  } else if (uri.startsWith('Qm') && uri.length === 46) {
    return uri;
  }
  
  return null;
};

/**
 * Check if URI is IPFS
 */
export const isIpfsUri = (uri: string): boolean => {
  return uri.startsWith('ipfs://') || 
         uri.startsWith('/ipfs/') || 
         uri.includes('ipfs/') ||
         (uri.startsWith('Qm') && uri.length === 46);
};

/**
 * Get multiple gateway URLs for redundancy
 */
export const getIpfsGateways = (): string[] => {
  return [
    process.env.REACT_APP_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/',
    'https://ipfs.io/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
    'https://gateway.ipfs.io/ipfs/'
  ];
};

/**
 * Convert IPFS URI to multiple gateway URLs
 */
export const ipfsToMultipleGateways = (uri: string): string[] => {
  const hash = extractIpfsHash(uri);
  if (!hash) return [uri];
  
  return getIpfsGateways().map(gateway => `${gateway}${hash}`);
};

/**
 * Get fallback IPFS URL if primary fails
 */
export const getFallbackIpfsUrl = async (uri: string): Promise<string> => {
  const urls = ipfsToMultipleGateways(uri);
  
  for (const url of urls) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        return url;
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
      continue;
    }
  }
  
  // Return primary URL as fallback
  return urls[0];
};
