import { AssetWithPhotos } from '@/types/database';
import { AssetCard } from './AssetCard';

interface AssetListProps {
  assets: AssetWithPhotos[];
  onEdit?: (asset: AssetWithPhotos) => void;
  onDelete?: (asset: AssetWithPhotos) => void;
}

export function AssetList({ assets, onEdit, onDelete }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-gray-200">
        <p className="text-gray-500">No assets found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
} 