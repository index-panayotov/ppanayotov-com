import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-slate-300">404</h1>
        <h2 className="text-3xl font-semibold text-slate-700 mt-4">Page Not Found</h2>
        <p className="text-slate-600 mt-2 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
