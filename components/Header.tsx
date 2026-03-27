'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600">
          Complaint System
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-6">
            <li>
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/issues" className="text-gray-600 hover:text-indigo-600">
                Issues
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-sm text-gray-600">{session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}