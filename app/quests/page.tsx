import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Link from 'next/link';

export default function QuestsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quest-Master System</h1>
        <p className="mt-2 text-lg text-gray-700">
          Complete quests to earn tokens, improve the makerspace, and climb the leaderboard!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-800">
              The Quest-Master system is designed to encourage member participation in makerspace operations and maintenance. Each quest represents a specific task or challenge that helps improve the makerspace.
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-800">
              <li>Complete quests to earn tokens</li>
              <li>Tokens can be used for shop access or equipment rentals</li>
              <li>Track your progress on the leaderboard</li>
              <li>Earn special badges and recognition</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Quest Categories</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Maintenance Quests</h3>
              <p className="text-gray-800">Help keep tools and equipment in working order</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Training Quests</h3>
              <p className="text-gray-800">Learn new skills and share knowledge</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Organization Quests</h3>
              <p className="text-gray-800">Keep the space clean and organized</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Community Quests</h3>
              <p className="text-gray-800">Help other members and improve the community</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Rewards</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Tokens</h3>
              <p className="text-gray-800">Earn tokens for completing quests. Use them for:</p>
              <ul className="list-inside list-disc space-y-1 text-gray-800">
                <li>Extended shop access</li>
                <li>Equipment rentals</li>
                <li>Special workshops</li>
                <li>Exclusive events</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Recognition</h3>
              <p className="text-gray-800">Earn badges and climb the leaderboard to become a Makerspace Favorite!</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-800">
              Ready to start your quest? Browse available quests and begin earning tokens today!
            </p>
            <div className="flex justify-end">
              <Link href="/quests/available">
                <Button>View Available Quests</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 