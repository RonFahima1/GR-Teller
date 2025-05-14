export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-lg border p-4 space-y-2"
          >
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
} 