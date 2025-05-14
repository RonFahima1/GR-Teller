import { useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { PaginationMeta } from '@/lib/pagination';

interface LazyListProps<T> {
  items: T[];
  loadMore: () => Promise<T[]>;
  hasMore: boolean;
  isLoading: boolean;
  renderItem: (item: T) => React.ReactNode;
  paginationMeta?: PaginationMeta;
}

export const LazyList = <T,>({ 
  items, 
  loadMore, 
  hasMore, 
  isLoading, 
  renderItem,
  paginationMeta
}: LazyListProps<T>) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !isFetching && !isLoading) {
          setIsFetching(true);
          loadMore()
            .then(() => setIsFetching(false))
            .catch((error) => {
              console.error('Error loading more items:', error);
              setIsFetching(false);
            });
        }
      },
      { threshold: 0.1 }
    );

    const lastItem = document.querySelector('.lazy-list-item:last-child');
    if (lastItem) {
      observer.observe(lastItem);
    }

    return () => {
      if (lastItem) {
        observer.unobserve(lastItem);
      }
    };
  }, [hasMore, isFetching, isLoading, loadMore]);

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={index}
          className="lazy-list-item"
        >
          {renderItem(item)}
        </div>
      ))}
      
      {isLoading && (
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      )}

      {paginationMeta && (
        <div className="flex justify-between items-center px-4 py-2">
          <span>
            Showing {paginationMeta.currentPage} of {paginationMeta.totalPages} pages
          </span>
          <span>
            {paginationMeta.totalItems} total items
          </span>
        </div>
      )}
    </div>
  );
};
