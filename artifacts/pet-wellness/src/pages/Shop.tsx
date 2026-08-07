import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductCard from '@/components/product/ProductCard';
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown, Check, X, Loader2 } from 'lucide-react';
import { useLocation, useSearch } from 'wouter';

export default function Shop() {
  const { data: products, isLoading: isProductsLoading } = useProducts();
  
  const [location] = useLocation();
  const searchString = useSearch();
  const searchParams = new URLSearchParams(searchString || '');

  const [sortBy, setSortBy] = useState<string>('Featured');

  const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low'];

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    let result = [...products];
    


    const searchTerm = searchParams.get('search');
    if (searchTerm) {
      const lowerQuery = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.short_description?.toLowerCase().includes(lowerQuery) ||
        p.category?.name?.toLowerCase().includes(lowerQuery)
      );
    }

    switch (sortBy) {
      case 'Price: Low to High':
        result.sort((a, b) => (a.variants?.[0]?.selling_price || 0) - (b.variants?.[0]?.selling_price || 0));
        break;
      case 'Price: High to Low':
        result.sort((a, b) => (b.variants?.[0]?.selling_price || 0) - (a.variants?.[0]?.selling_price || 0));
        break;
      default:
        // Featured - keep original order based on created_at
        break;
    }

    return result;
  }, [products, sortBy, location, searchString]);

  const mapToCardProps = (p: any) => {
    const coverImage = p.images?.find((i: any) => i.is_cover)?.image_url || p.images?.[0]?.image_url || '';
    const variant = p.variants?.[0] || { selling_price: 0, mrp: 0 };
    return {
      id: p.id,
      name: p.name,
      category: p.category?.name || '',
      price: variant.selling_price,
      mrp: variant.mrp,
      rating: p.overall_rating || 5.0,
      reviewsCount: p.total_reviews_count || p.reviews?.length || 0,
      image: coverImage,
      badges: p.badges || [],
      slug: p.slug
    };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartDrawer />

      <main className="flex-grow pt-36 pb-24">
        {/* Header */}
        <div className="bg-card py-16 mb-12 border-b border-border/50">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">The Collection</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              Scientifically validated formulas. Cold-pressed. Heritage-soil sourced. Choose the product that aligns with your companion's biological needs.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            


            {/* Main Content */}
            <div className="flex-1">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-8">


                <p className="text-sm text-muted-foreground hidden sm:block">
                  Showing {filteredProducts.length} products
                </p>

                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                  <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-sm font-medium hover:bg-card transition-colors">
                      {sortBy}
                      <ChevronDown size={14} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                      <div className="p-2 space-y-1">
                        {sortOptions.map(option => (
                          <button
                            key={option}
                            onClick={() => setSortBy(option)}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortBy === option ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              {isProductsLoading ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                   {[...Array(6)].map((_, i) => (
                     <ProductCardSkeleton key={i} />
                   ))}
                 </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...mapToCardProps(product)} />
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && !isProductsLoading && (
                <div className="text-center py-20 bg-card/50 rounded-2xl border border-border/50">
                  <h3 className="font-serif text-xl mb-2">No products found</h3>
                  <p className="text-muted-foreground">Adjust your filters to discover our biological formulations.</p>
                  <button 
                    onClick={() => {
                      window.location.href = '/shop';
                    }}
                    className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />


    </div>
  );
}

