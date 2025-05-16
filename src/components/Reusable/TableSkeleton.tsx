import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  hasActions?: boolean;
  showHeader?: boolean;
}

export default function TableSkeleton({
  rowCount = 5,
  columnCount = 5,
  hasActions = true,
  showHeader = true,
}: TableSkeletonProps) {
  // Calculate the actual column count including the actions column if needed
  const actualColumnCount = hasActions ? columnCount + 1 : columnCount;

  return (
    <div className="w-full">
      <div className="rounded-md border">
        {/* Table Header Skeleton */}
        {showHeader && (
          <div className="flex items-center p-4 border-b bg-muted/50">
            {Array(actualColumnCount)
              .fill(0)
              .map((_, colIndex) => (
                <div
                  key={`header-${colIndex}`}
                  className={`flex-1 ${colIndex !== actualColumnCount - 1 ? 'mr-4' : ''}`}
                >
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
          </div>
        )}

        {/* Table Rows Skeleton */}
        {Array(rowCount)
          .fill(0)
          .map((_, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className={`flex items-center p-4 ${rowIndex !== rowCount - 1 ? 'border-b' : ''}`}
            >
              {Array(actualColumnCount)
                .fill(0)
                .map((_, colIndex) => (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`flex-1 ${colIndex !== actualColumnCount - 1 ? 'mr-4' : ''}`}
                  >
                    <Skeleton className="h-6 w-full" />
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function SpinnerSkeleton() {
  return (
    <div className="relative flex justify-center items-center">
      <div className="animate-spin rounded-full border-4 border-muted border-t-primary h-12 w-12" />
    </div>
  );
}
