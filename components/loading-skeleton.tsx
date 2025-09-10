export function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/80 to-slate-100/50">
      <div className="animate-pulse">
        {/* Hero Section Skeleton */}
        <div className="py-20 px-4 bg-gradient-to-r from-slate-700 to-slate-800">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1">
                <div className="h-12 bg-slate-300/50 rounded-lg mb-4 shimmer"></div>
                <div className="h-8 bg-slate-300/50 rounded-lg mb-6 w-3/4 shimmer"></div>
                <div className="h-6 bg-slate-300/50 rounded-lg mb-2 w-1/2 shimmer"></div>
                <div className="space-y-2 mb-8">
                  <div className="h-4 bg-slate-300/50 rounded w-full shimmer"></div>
                  <div className="h-4 bg-slate-300/50 rounded w-5/6 shimmer"></div>
                </div>
                <div className="flex gap-4">
                  <div className="h-12 bg-slate-300/50 rounded-lg w-32 shimmer"></div>
                  <div className="h-12 bg-slate-300/50 rounded-lg w-32 shimmer"></div>
                </div>
              </div>
              <div className="w-48 h-48 bg-slate-300/50 rounded-2xl shimmer"></div>
            </div>
          </div>
        </div>

      {/* Content Sections Skeleton */}
      <div className="container mx-auto px-4 max-w-4xl">
        {[1, 2, 3].map((section) => (
          <div key={section} className="bg-slate-50 rounded-lg p-6 mb-8">
            <div className="h-8 bg-slate-200 rounded-lg mb-6 w-48"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-4/5"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}