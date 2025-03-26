import { AssetWithPhotos } from '@/types/database';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';

interface AssetCardProps {
  asset: AssetWithPhotos;
  onEdit?: (asset: AssetWithPhotos) => void;
  onDelete?: (asset: AssetWithPhotos) => void;
}

export function AssetCard({ asset, onEdit, onDelete }: AssetCardProps) {
  const primaryPhoto = asset.photos?.find(photo => photo.is_primary);
  const statusColors = {
    available: 'bg-green-100 text-green-800',
    in_use: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
    retired: 'bg-gray-100 text-gray-800',
    broken: 'bg-red-100 text-red-800',
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{asset.name}</h3>
          <p className="text-sm text-gray-700">{asset.category}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            statusColors[asset.status]
          }`}
        >
          {asset.status}
        </span>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.photo_url}
              alt={primaryPhoto.caption || asset.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500">
              No image
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-sm text-gray-800">
            <span className="font-medium text-gray-900">Location:</span> {asset.location || 'Not specified'}
          </p>
          <p className="text-sm text-gray-800">
            <span className="font-medium text-gray-900">Shop:</span> {asset.shop}
          </p>
          {asset.serial_number && (
            <p className="text-sm text-gray-800">
              <span className="font-medium text-gray-900">Serial:</span> {asset.serial_number}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Link href={`/assets/${asset.id}`}>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </Link>
        {onEdit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(asset)}
          >
            Edit
          </Button>
        )}
        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(asset)}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
} 