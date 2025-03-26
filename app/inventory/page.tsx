import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { InventoryItemWithPhotos, InventoryStatus } from '@/types/database';

function getStatusColor(status: InventoryStatus) {
  switch (status) {
    case 'in_stock':
      return 'bg-green-100 text-green-800';
    case 'low_stock':
      return 'bg-yellow-100 text-yellow-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    case 'discontinued':
      return 'bg-gray-100 text-gray-800';
  }
}

async function getInventoryItems() {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from('inventory_items')
    .select(`
      *,
      photos:inventory_item_photos(*)
    `)
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching inventory:', error);
    return [];
  }

  return items as InventoryItemWithPhotos[];
}

function ItemCard({ item }: { item: InventoryItemWithPhotos }) {
  const primaryPhoto = item.photos?.find(photo => photo.is_primary) || item.photos?.[0];

  return (
    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          {primaryPhoto ? (
            <Image
              src={primaryPhoto.photo_url}
              alt={primaryPhoto.caption || item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div>
          <h3 className="font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-600">
            {item.quantity} {item.unit}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
          {item.status.replace('_', ' ')}
        </span>
        <Link href={`/inventory/${item.id}`}>
          <Button variant="outline" size="sm">
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function InventoryPage() {
  const items = await getInventoryItems();
  const consumables = items.filter(item => item.category === 'consumable');
  const repairParts = items.filter(item => item.category === 'repair_part');

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
          <p className="mt-2 text-lg text-gray-700">
            Track consumables and repair parts across the makerspace
          </p>
        </div>
        <Link href="/inventory/new">
          <Button>Add Item</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Consumables</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {consumables.length === 0 ? (
                <p className="text-gray-500">No consumables found</p>
              ) : (
                <div className="space-y-4">
                  {consumables.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Repair Parts</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {repairParts.length === 0 ? (
                <p className="text-gray-500">No repair parts found</p>
              ) : (
                <div className="space-y-4">
                  {repairParts.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Low Stock Alerts</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.filter(item => item.quantity <= item.min_quantity).length === 0 ? (
                <p className="text-gray-500">No items are running low</p>
              ) : (
                <div className="space-y-4">
                  {items
                    .filter(item => item.quantity <= item.min_quantity)
                    .map((item) => (
                      <ItemCard key={item.id} item={item} />
                    ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 