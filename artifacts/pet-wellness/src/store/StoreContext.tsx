import { createContext, useContext, useEffect, useState } from 'react';
import { Product, products as initialProducts } from '@/data/products';
import { Category, defaultCategories } from '@/data/categories';

interface StoreContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ancestral_products_v1');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  const [categories, setCategoriesState] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ancestral_categories_v1');
      return saved ? JSON.parse(saved) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  });

  const setProducts = (newProducts: Product[]) => {
    setProductsState(newProducts);
    localStorage.setItem('ancestral_products_v1', JSON.stringify(newProducts));
  };

  const setCategories = (newCategories: Category[]) => {
    setCategoriesState(newCategories);
    localStorage.setItem('ancestral_categories_v1', JSON.stringify(newCategories));
  };

  return (
    <StoreContext.Provider value={{ products, setProducts, categories, setCategories }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
