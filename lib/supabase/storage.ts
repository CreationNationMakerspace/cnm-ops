export const STORAGE_CONFIG = {
  BUCKETS: {
    ASSET_PHOTOS: 'asset-photos',
    INVENTORY_PHOTOS: 'inventory-photos',
  },
  PATHS: {
    ASSETS: 'assets',
    INVENTORY: 'inventory',
  },
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

export type AllowedFileType = typeof STORAGE_CONFIG.ALLOWED_FILE_TYPES[number];

export function getAssetPhotoPath(assetId: string, fileName: string): string {
  return `${STORAGE_CONFIG.PATHS.ASSETS}/${assetId}/${fileName}`;
}

export function getInventoryPhotoPath(itemId: string, fileName: string): string {
  return `${STORAGE_CONFIG.PATHS.INVENTORY}/${itemId}/${fileName}`;
}

export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!STORAGE_CONFIG.ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${STORAGE_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`,
    };
  }

  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large. Maximum size: ${STORAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  return { isValid: true };
} 