import { Skeleton } from '@/components/ui/skeleton';

export default function ProductHeroSkeleton() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Images Skeleton */}
        <div className="flex gap-4 h-[400px] md:h-[500px] lg:h-[700px]">
          {/* Vertical Thumbnails */}
          <div className="hidden md:flex flex-col items-center gap-3 w-20 flex-shrink-0">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 flex flex-col gap-3 py-1 w-full">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-20 h-24 rounded-xl flex-shrink-0" />
              ))}
            </div>
            <Skeleton className="w-8 h-8 rounded-full" />
          </div>

          {/* Main Image */}
          <Skeleton className="flex-1 rounded-[32px]" />
        </div>

        {/* Right: Content Skeleton */}
        <div className="flex flex-col pt-4 lg:pt-8">
          
          {/* Top badges & rating */}
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-24 h-6 rounded-full" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-24 h-4" />
            </div>
          </div>

          {/* Title */}
          <Skeleton className="h-12 md:h-16 w-3/4 mb-4" />

          {/* Subtitle/Description */}
          <div className="space-y-2 mb-8">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>

          {/* Timer block */}
          <Skeleton className="h-24 w-full rounded-xl mb-8" />

          {/* Variants */}
          <div className="mb-8 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>

          {/* Add to Cart Button */}
          <Skeleton className="h-14 w-full rounded-full mb-4" />
          
          {/* Guarantees */}
          <Skeleton className="h-6 w-1/2 mx-auto mb-8" />

          {/* Accordions */}
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-lg" />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
