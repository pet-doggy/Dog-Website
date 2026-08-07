import { Product } from '@/data/products';
import { useShop } from '@/store/ShopContext';
import { Heart, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'wouter';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badges: any[];
  slug: string;
}

export default function ProductCard({ 
  id, name, category, price, mrp, rating, reviewsCount, image, badges, slug 
}: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useShop();
  const isWishlisted = isInWishlist(id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: `${id}-default`,
      productId: id,
      variantId: 'default',
      name: name,
      image: image,
      price: price,
      quantity: 1,
      size: 'Default'
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  // Use a fallback if the generated asset isn't ready
  const imageUrl = image?.startsWith('@assets') 
    ? image 
    : image || 'https://placehold.co/600x800/f3f4f6/a1a1aa?text=' + encodeURIComponent(name);

  const isNew = badges?.some(b => b.title?.toLowerCase().includes('new'));
  const hasDiscount = mrp > price;
  const discountPercent = hasDiscount ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <Link href={`/product/${slug}`} className="group block">
      <div className="relative bg-card rounded-2xl overflow-hidden aspect-square mb-4 transition-all duration-500 shadow-sm border border-[#E49B0F] hover:shadow-xl hover:shadow-[#E49B0F]/20 hover:-translate-y-1">
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-background text-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              New Origin
            </span>
          )}
          {hasDiscount && (
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Image */}
        <img 
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-full font-medium shadow-lg border border-[#E49B0F] hover:bg-primary/90 transition-colors"
          >
            <ShoppingBag size={18} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1.5 px-1">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h3 className="font-serif text-lg leading-tight line-clamp-1">{name}</h3>
            <p className="text-sm text-muted-foreground">{category}</p>
          </div>
          <div className="text-right">
            <span className="font-medium text-lg">₹{price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="block text-sm text-muted-foreground line-through">₹{mrp.toFixed(2)}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 pt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? 'text-[#e5a040] fill-[#e5a040]' : 'text-gray-300 fill-gray-300'}`}
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewsCount})</span>
        </div>
      </div>
    </Link>
  );
}
