import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <h2 className="text-2xl font-bold mb-4">Transaction Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        The transaction page you're looking for doesn't exist.
      </p>
      <Link
        href="/transactions"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Transactions
      </Link>
    </div>
  );
} 