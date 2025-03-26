import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Makerspace Asset Management</h1>
        <p className="mt-2 text-lg text-gray-600">
          Welcome to the makerspace asset management system. Track tools, equipment, and inventory in one place.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/assets" className="block">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold">Assets</h2>
            <p className="mt-2 text-gray-600">Manage tools and equipment</p>
          </div>
        </Link>

        <Link href="/inventory" className="block">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold">Inventory</h2>
            <p className="mt-2 text-gray-600">Track consumables and supplies</p>
          </div>
        </Link>

        <Link href="/quests" className="block">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
            <h2 className="text-xl font-semibold">Quests</h2>
            <p className="mt-2 text-gray-600">Complete tasks and earn achievements</p>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="mt-4 flex gap-4">
          <Link href="/assets/new">
            <Button>Add New Asset</Button>
          </Link>
          <Link href="/inventory/new">
            <Button>Add Inventory Item</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
