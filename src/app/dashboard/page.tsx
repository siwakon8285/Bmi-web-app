import { getSession, logout } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UserDashboard from '@/components/UserDashboard';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">BMI Health Dashboard</h1>
          <div className="flex items-center gap-4">
            {session.user.role === 'admin' && (
              <Link href="/mis" className="px-4 py-2 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition shadow-md">
                Admin MIS
              </Link>
            )}
            <span className="text-gray-600 font-medium">Hello, {session.user.username}</span>
            <form
              action={async () => {
                'use server';
                await logout();
                redirect('/login');
              }}
            >
              <button className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                Logout
              </button>
            </form>
          </div>
        </header>
        
        <UserDashboard user={session.user} />
      </div>
    </div>
  );
}
