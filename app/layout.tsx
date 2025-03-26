import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CNM Makerspace Ops",
  description: "Operations management system for CNM Makerspace",
};

async function getUserName() {
  const cookieStore = cookies();
  const supabase = await createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('Session check:', {
    hasSession: !!session,
    error,
    user: session?.user,
    email: session?.user?.email
  });

  if (error) {
    console.error('Error getting session:', error);
    return { name: 'Guest', isAuthenticated: false };
  }

  if (!session) {
    console.log('No active session found');
    return { name: 'Guest', isAuthenticated: false };
  }

  return { 
    name: session.user.email?.split('@')[0] || 'Guest',
    isAuthenticated: true,
    email: session.user.email
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserName();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">CNM Makerspace Ops</h1>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Welcome, {user.name}</span>
                  {user.isAuthenticated ? (
                    <Link
                      href="/login?action=signout"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sign Out
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </header>
            <nav className="border-b border-gray-200 bg-white">
              <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900">
                      Makerspace
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link
                      href="/assets"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Assets
                    </Link>
                    <Link
                      href="/inventory"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Inventory
                    </Link>
                    <Link
                      href="/quests"
                      className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      Quests
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
