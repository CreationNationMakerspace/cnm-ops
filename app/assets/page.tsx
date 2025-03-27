import { createClient } from '@/lib/supabase/server';
import { AssetList } from '@/components/assets/AssetList';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Suspense } from 'react';

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-64 rounded-lg bg-gray-200" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

async function AssetsList() {
  const supabase = await createClient();

  const { data: assets, error } = await supabase
    .from('assets')
    .select(`
      *,
      photos:asset_photos(*)
    `)
    .order('name');

  if (error) {
    console.error('Error fetching assets:', error);
    return <div>Error loading assets</div>;
  }

  // @ts-expect-error - Supabase's type system doesn't correctly infer the response type for joined queries
  return <AssetList assets={assets || []} />;
}

export default function AssetsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assets</h1>
        <Link href="/assets/new">
          <Button>Add Asset</Button>
        </Link>
      </div>

      <Suspense fallback={<LoadingState />}>
        <AssetsList />
      </Suspense>
    </div>
  );
} 