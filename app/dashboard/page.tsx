'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSignOutClick = async () => {
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Error signing out: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleGoHomeClick = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

          <div className="space-y-4 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                User Information
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">ID:</span> {session.user.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{' '}
                  {session.user.email}
                </p>
                {session.user.name && (
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{' '}
                    {session.user.name}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Session Status
              </h3>
              <p className="text-green-600 font-medium">✓ Authenticated</p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSignOutClick}
              className="rounded-md bg-red-600 px-6 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Sign Out
            </button>
            <button
              onClick={handleGoHomeClick}
              className="rounded-md bg-gray-600 px-6 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Go to Home
            </button>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            🎉 NextAuth.js is working!
          </h3>
          <p className="text-blue-800">
            This is a protected route. You can only see this page when
            authenticated. Your session is managed securely with httpOnly
            cookies.
          </p>
        </div>
      </div>
    </div>
  );
}
