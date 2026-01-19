import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-blue-800">BMI Health Check Platform</h1>
        <p className="text-xl text-gray-600 text-center max-w-2xl">
          Calculate your Body Mass Index (BMI), track your history, and monitor your health trends.
        </p>
        
        <div className="flex gap-4 mt-8">
          <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">
            Login
          </Link>
          <Link href="/register" className="px-6 py-3 bg-white text-blue-600 rounded-lg shadow-lg hover:bg-gray-50 transition border border-blue-200">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
