import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { ShopProvider } from '@/store/ShopContext';
import { StoreProvider } from '@/store/StoreContext';

import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetail from '@/pages/ProductDetail';
import CartPage from '@/pages/Cart';
import WishlistPage from '@/pages/Wishlist';
import ContactPage from '@/pages/Contact';
import PaymentStatus from '@/pages/PaymentStatus';
import ResumeCheckout from '@/pages/ResumeCheckout';
import About from '@/pages/About';
import Journal from '@/pages/Journal';
import JournalArticle from '@/pages/JournalArticle';
import FAQPage from '@/pages/FAQPage';
import Referrals from '@/pages/Referrals';

// Legal Pages
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TermsConditions from '@/pages/legal/TermsConditions';
import ShippingPolicy from '@/pages/legal/ShippingPolicy';
import RefundReturnPolicy from '@/pages/legal/RefundReturnPolicy';
import CancellationPolicy from '@/pages/legal/CancellationPolicy';
import Disclaimer from '@/pages/legal/Disclaimer';
import LoyaltyProgram from '@/pages/legal/LoyaltyProgram';

import ScrollToTop from '@/components/layout/ScrollToTop';

// Admin Pages
import CategoryForm from '@/pages/admin/categories/CategoryForm';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminLogin from '@/pages/admin/AdminLogin';
import ProductList from '@/pages/admin/products/ProductList';
import ProductForm from '@/pages/admin/products/ProductForm';
import { Toaster as HotToaster } from 'react-hot-toast';
import WhatsAppWidget from '@/components/ui/WhatsAppWidget';
import Settings from '@/pages/admin/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={CartPage} />
      <Route path="/wishlist" component={WishlistPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/payment-status" component={PaymentStatus} />
      <Route path="/checkout/resume/:cartId" component={ResumeCheckout} />
      <Route path="/about" component={About} />
      <Route path="/journal" component={Journal} />
      <Route path="/journal/:slug" component={JournalArticle} />
      <Route path="/faqs" component={FAQPage} />
      <Route path="/referrals" component={Referrals} />
      
      {/* Legal Routes */}
      <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
      <Route path="/legal/terms-conditions" component={TermsConditions} />
      <Route path="/legal/shipping-policy" component={ShippingPolicy} />
      <Route path="/legal/refund-return-policy" component={RefundReturnPolicy} />
      <Route path="/legal/cancellation-policy" component={CancellationPolicy} />
      <Route path="/legal/disclaimer" component={Disclaimer} />
      <Route path="/legal/loyalty-program" component={LoyaltyProgram} />

      {/* Admin Routes */}
      <Route path="/admin-panel-user/login" component={AdminLogin} />
      <Route path="/admin-panel-user" component={() => <Redirect to="/admin-panel-user/products" />} />
      <Route path="/admin-panel-user/products" component={() => <AdminLayout><ProductList /></AdminLayout>} />
      <Route path="/admin-panel-user/products/new" component={() => <AdminLayout><ProductForm /></AdminLayout>} />
      <Route path="/admin-panel-user/products/edit/:id" component={() => <AdminLayout><ProductForm /></AdminLayout>} />
      <Route path="/admin-panel-user/categories/edit/:id">
        <AdminLayout><CategoryForm /></AdminLayout>
      </Route>
      <Route path="/admin-panel-user/settings" component={() => <AdminLayout><Settings /></AdminLayout>} />



      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Anti-Copy Logic
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };
    
    const handleDragStart = (e: DragEvent) => {
      if (e.target instanceof HTMLImageElement) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ShopProvider>
          <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-[#B89D5D]/20 selection:text-[#12333B]">
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
                <ScrollToTop />
                <Router />
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
            <HotToaster position="bottom-right" />
            <WhatsAppWidget />
          </div>
        </ShopProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
