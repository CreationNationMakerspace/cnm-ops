import { AssetList } from '@/components/assets/AssetList';
import { Button } from '@/components/ui/Button';
import { AssetWithPhotos } from '@/types/database';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
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
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data: assets, error } = await supabase
    .from('assets')
    .select(`
      *,
      photos:asset_photos(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching assets:', error);
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading assets</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>There was an error loading the assets. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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