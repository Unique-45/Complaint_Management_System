import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session.user?.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Role: <span className="font-semibold">{session.user?.role}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">Total Issues</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">Resolved</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-900">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">0</p>
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900">Critical</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">0</p>
          </div>
        </div>

        <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
          Create New Issue
        </button>
      </div>
    </>
  );
}