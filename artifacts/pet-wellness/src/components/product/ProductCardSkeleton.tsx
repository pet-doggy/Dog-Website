import { Skeleton } from '@/components/ui/skeleton';

export default function ProductCardSkeleton() {
  return (
    <div className="group block">
      <div className="relative bg-card rounded-2xl overflow-hidden aspect-square mb-4 transition-all duration-500 shadow-sm border border-border/50">
        {/* Image skeleton */}
        <Skeleton className="w-full h-full rounded-none" />
      </div>

      {/* Info */}
      <div className="space-y-2 px-1">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 space-y-2">
            {/* Title skeleton */}
            <Skeleton className="h-5 w-3/4" />
            {/* Category skeleton */}
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="text-right space-y-1">
            {/* Price skeleton */}
            <Skeleton className="h-5 w-16" />
          </div>
        </div>
        
        {/* Rating skeleton */}
        <div className="flex items-center gap-1.5 pt-1">
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  );
}
