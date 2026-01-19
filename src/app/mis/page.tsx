import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import MISDashboard from '@/components/MISDashboard';
import Link from 'next/link';

export default async function MISPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403 Forbidden</h1>
          <p className="text-gray-600 mb-8">You do not have permission to access this page.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Executive MIS Report</h1>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition shadow-sm">
              Back to Dashboard
            </Link>
          </div>
        </header>
        
        <MISDashboard />
      </div>
    </div>
  );
}
