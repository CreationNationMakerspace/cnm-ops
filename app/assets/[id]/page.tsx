// app/assets/[id]/page.tsx

import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { AssetWithPhotos } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';

// ✅ Tells Next.js this is a dynamic route (skip static generation)
export const dynamic = 'force-dynamic';

async function getAsset(id: string): Promise<AssetWithPhotos | null> {
  const supabase = await createClient();

  // @ts-expect-error - Supabase types are not properly aligned with our database schema
  const { data: asset, error } = await supabase
    .from('assets')
    .select(`
      *,
      photos:asset_photos(*)
    `)
    .eq('id', id as string | number)
    .single();

  if (error || !asset) {
    console.error('Error fetching asset:', error);
    return null;
  }

  // @ts-expect-error - Supabase response type needs to be cast to our AssetWithPhotos type
  return asset;
}

type Props = {
  params: { id: string };
};

export default async function AssetPage({ params }: Props) {
  const asset = await getAsset(params.id);
  if (!asset) notFound();

  const primaryPhoto = asset.photos?.find((p) => p.is_primary) || asset.photos?.[0];
  const otherPhotos = asset.photos?.filter((p) => p.id !== primaryPhoto?.id) || [];

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
          <p className="mt-2 text-lg text-gray-700">{asset.description}</p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/assets/${asset.id}/edit`}>
            <Button variant="outline">Edit Asset</Button>
          </Link>
          <Link href="/assets">
            <Button>Back to Assets</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Asset Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Category</p>
                <p className="text-sm text-gray-700">{asset.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Status</p>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  asset.status === 'available' ? 'bg-green-100 text-green-800' :
                  asset.status === 'in_use' ? 'bg-blue-100 text-blue-800' :
                  asset.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                  asset.status === 'retired' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {asset.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Shop</p>
                <p className="text-sm text-gray-700">{asset.shop.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Location</p>
                <p className="text-sm text-gray-700">{asset.location || 'Not specified'}</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Serial Number</p>
              <p className="text-sm text-gray-700">{asset.serial_number || 'Not specified'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Model Number</p>
              <p className="text-sm text-gray-700">{asset.model_number || 'Not specified'}</p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Manufacturer</p>
              <p className="text-sm text-gray-700">{asset.manufacturer || 'Not specified'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Purchase Date</p>
                <p className="text-sm text-gray-700">{asset.purchase_date || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Purchase Price</p>
                <p className="text-sm text-gray-700">{asset.purchase_price ? `$${asset.purchase_price.toFixed(2)}` : 'Not specified'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Last Maintenance</p>
                <p className="text-sm text-gray-700">{asset.last_maintenance_date || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Next Maintenance</p>
                <p className="text-sm text-gray-700">{asset.next_maintenance_date || 'Not specified'}</p>
              </div>
            </div>

            {asset.maintenance_notes && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Maintenance Notes</p>
                <p className="text-sm text-gray-700">{asset.maintenance_notes}</p>
              </div>
            )}

            {asset.notes && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">Additional Notes</p>
                <p className="text-sm text-gray-700">{asset.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Photos</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {primaryPhoto && (
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={primaryPhoto.photo_url}
                    alt={primaryPhoto.caption || asset.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {primaryPhoto.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                      <p className="text-xs text-white">{primaryPhoto.caption}</p>
                    </div>
                  )}
                </div>
              )}

              {otherPhotos.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {otherPhotos.map((photo) => (
                    <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={photo.photo_url}
                        alt={photo.caption || asset.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                          <p className="text-xs text-white">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Link href={`/assets/${asset.id}/photos`}>
                  <Button variant="outline" className="w-full">
                    Manage Photos
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 