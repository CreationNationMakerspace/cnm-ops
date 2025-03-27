import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import { AssetWithPhotos } from '@/types/database';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Image from 'next/image';
import Link from 'next/link';
import { PhotoUploadForm } from '@/components/assets/PhotoUploadForm';
import { handlePhotoUpload } from './actions';

async function getAsset(id: string) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !session) {
    redirect('/login');
  }

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

  return asset as unknown as AssetWithPhotos;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AssetPhotosPage({ params }: Props) {
  const resolvedParams = await params;
  const asset = await getAsset(resolvedParams.id);

  if (!asset) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Photos</h1>
          <p className="mt-2 text-lg text-gray-700">
            Add and manage photos for {asset.name}
          </p>
        </div>
        <Link href={`/assets/${asset.id}`}>
          <Button variant="outline">Back to Asset</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Current Photos</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {asset.photos?.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={photo.photo_url}
                    alt={photo.caption || asset.name}
                    fill
                    className="object-cover"
                  />
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
                      <p className="text-xs text-white">{photo.caption}</p>
                    </div>
                  )}
                  {photo.is_primary && (
                    <div className="absolute top-2 right-2 rounded-full bg-blue-500 px-2 py-1">
                      <span className="text-xs text-white">Primary</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Add New Photos</h2>
          </CardHeader>
          <CardContent>
            <PhotoUploadForm assetId={asset.id} onSubmit={handlePhotoUpload} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 