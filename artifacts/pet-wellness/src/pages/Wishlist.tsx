import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/data/products';
import { useShop } from '@/store/ShopContext';
import { Heart } from 'lucide-react';
import { Link } from 'wouter';

export default function WishlistPage() {
  const { wishlist } = useShop();
  
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <CartDrawer />
      
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif mb-4 flex items-center justify-center gap-4">
              <Heart className="text-primary" size={32} />
              Saved Products
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto font-light">
              Curate your companion's ideal wellness regimen.
            </p>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-24 bg-card rounded-3xl border border-border border-dashed max-w-3xl mx-auto">
              <Heart size={48} strokeWidth={1} className="mx-auto mb-6 text-muted-foreground/50" />
              <h2 className="text-2xl font-serif mb-4">No saved items</h2>
              <p className="text-muted-foreground mb-8">You haven't added any products to your wishlist yet.</p>
              <Link href="/shop" className="inline-flex px-8 py-4 bg-foreground text-background rounded-full font-medium hover:bg-primary transition-colors">
                Explore Collection
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistedProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  id={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  mrp={product.originalPrice || product.price}
                  rating={product.rating}
                  reviewsCount={product.reviewCount}
                  image={product.images[0]}
                  badges={[]}
                  slug={product.slug}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

