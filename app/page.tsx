'use client';

import Image from 'next/image';

import { useSession } from 'next-auth/react';

import { AuthStatus } from '@/components/AuthStatus';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    // The main landmark is defined in the <main> tag below.
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <main className="flex w-full max-w-4xl flex-col items-center gap-12 py-16 px-8">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={150}
          height={30}
          priority
        />

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-900">
            Next.js App with Authentication
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Dev server is running.
          </p>
        </div>

        <AuthStatus session={session} status={status} />
      </main>
    </div>
  );
}
