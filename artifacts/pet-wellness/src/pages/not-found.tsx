import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-70 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-70 pointer-events-none" />
      
      <div className="max-w-2xl w-full mx-4 relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-black text-gray-900 tracking-tighter drop-shadow-sm">404</h1>
          <div className="h-2 w-24 bg-primary mx-auto mt-6 rounded-full" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          Oops! You've wandered off the trail.
        </h2>
        
        <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto flex items-center gap-2 rounded-full h-12 px-8 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center gap-2 rounded-full h-12 px-8 hover:bg-gray-50 transition-all">
              <Search className="w-4 h-4" />
              Browse Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
