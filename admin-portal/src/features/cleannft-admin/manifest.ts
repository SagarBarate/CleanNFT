// Types for manifest.json structure
export interface ManifestEntry {
  index: number;
  name: string;
  description?: string;
  imageUri: string;
  tokenUri: string;
  attributes?: Record<string, any>;
}

export interface ParsedManifest {
  entries: ManifestEntry[];
  totalCount: number;
  validEntries: number;
}

/**
 * Parse manifest.json content
 */
export const parseManifest = (content: string): ParsedManifest => {
  try {
    const data = JSON.parse(content);
    
    // Handle different possible structures
    let entries: ManifestEntry[] = [];
    
    if (Array.isArray(data)) {
      // Direct array of entries
      entries = data.map((item, index) => ({
        index: item.index ?? index,
        name: item.name || `NFT ${index + 1}`,
        description: item.description,
        imageUri: item.imageUri || item.image || '',
        tokenUri: item.tokenUri || item.uri || '',
        attributes: item.attributes || {}
      }));
    } else if (data.entries && Array.isArray(data.entries)) {
      // Object with entries array
      entries = data.entries.map((item: any, index: number) => ({
        index: item.index ?? index,
        name: item.name || `NFT ${index + 1}`,
        description: item.description,
        imageUri: item.imageUri || item.image || '',
        tokenUri: item.tokenUri || item.uri || '',
        attributes: item.attributes || {}
      }));
    } else if (data.nfts && Array.isArray(data.nfts)) {
      // Object with nfts array
      entries = data.nfts.map((item: any, index: number) => ({
        index: item.index ?? index,
        name: item.name || `NFT ${index + 1}`,
        description: item.description,
        imageUri: item.imageUri || item.image || '',
        tokenUri: item.tokenUri || item.uri || '',
        attributes: item.attributes || {}
      }));
    } else {
      throw new Error('Invalid manifest structure');
    }
    
    // Validate entries
    const validEntries = entries.filter(entry => 
      entry.tokenUri && entry.tokenUri.trim() !== ''
    );
    
    return {
      entries,
      totalCount: entries.length,
      validEntries: validEntries.length
    };
  } catch (error) {
    throw new Error(`Failed to parse manifest: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Load manifest from file
 */
export const loadManifestFromFile = (file: File): Promise<ParsedManifest> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = parseManifest(content);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Load manifest from URL
 */
export const loadManifestFromUrl = async (url: string): Promise<ParsedManifest> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    return parseManifest(content);
  } catch (error) {
    throw new Error(`Failed to load manifest from URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validate manifest entry
 */
export const validateManifestEntry = (entry: ManifestEntry): boolean => {
  return !!(
    entry.tokenUri &&
    entry.tokenUri.trim() !== '' &&
    entry.name &&
    entry.name.trim() !== ''
  );
};

/**
 * Filter manifest entries by search term
 */
export const filterManifestEntries = (
  entries: ManifestEntry[],
  searchTerm: string
): ManifestEntry[] => {
  if (!searchTerm.trim()) {
    return entries;
  }
  
  const term = searchTerm.toLowerCase();
  return entries.filter(entry =>
    entry.name.toLowerCase().includes(term) ||
    entry.description?.toLowerCase().includes(term) ||
    entry.tokenUri.toLowerCase().includes(term)
  );
};

/**
 * Convert manifest entries to mint items
 */
export const manifestEntriesToMintItems = (entries: ManifestEntry[]) => {
  return entries.map(entry => ({
    tokenUri: entry.tokenUri,
    name: entry.name,
    image: entry.imageUri
  }));
};

/**
 * Get manifest statistics
 */
export const getManifestStats = (entries: ManifestEntry[]) => {
  const total = entries.length;
  const valid = entries.filter(validateManifestEntry).length;
  const withImages = entries.filter(e => e.imageUri && e.imageUri.trim() !== '').length;
  const withDescriptions = entries.filter(e => e.description && e.description.trim() !== '').length;
  
  return {
    total,
    valid,
    withImages,
    withDescriptions,
    validPercentage: total > 0 ? Math.round((valid / total) * 100) : 0
  };
};
