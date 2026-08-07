import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { LayoutDashboard, Package, FolderTree, ShoppingCart, Settings, LogOut } from 'lucide-react';
import { Link } from 'wouter';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  
  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') !== 'true') {
      setLocation('/admin-panel-user/login');
    }

    let timeoutId: NodeJS.Timeout;

    const checkActivity = () => {
      const lastActivity = sessionStorage.getItem('admin_last_activity');
      if (lastActivity && Date.now() - parseInt(lastActivity) > 300000) {
        handleLogout();
        return false;
      }
      return true;
    };

    if (!checkActivity()) return;

    const resetTimer = () => {
      sessionStorage.setItem('admin_last_activity', Date.now().toString());
      clearTimeout(timeoutId);
      // 5 minutes = 300,000 ms
      timeoutId = setTimeout(() => {
        handleLogout();
      }, 300000);
    };

    // Initialize timer
    resetTimer();

    // Listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer, true));

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer, true));
    };
  }, [setLocation]);

  const handleLogout = async () => {
    sessionStorage.removeItem('admin_authenticated');
    try {
      const { data } = await supabase
        .from('products')
        .select('slug')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (data?.slug) {
        setLocation(`/product/${data.slug}`);
      } else {
        setLocation('/');
      }
    } catch (e) {
      setLocation('/');
    }
  };

  const navItems = [
    { name: 'Products', path: '/admin-panel-user/products', icon: Package },
    { name: 'Settings', path: '/admin-panel-user/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navigation */}
        <header className="h-20 bg-white border-b border-border/50 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 shadow-sm">
           <div className="flex items-center gap-6">
             <img src="/logo.png" alt="Ancestral" className="h-12 md:h-14 object-contain" />
             <div className="flex items-center gap-2 md:gap-4 ml-2 md:ml-4 border-l pl-4 md:pl-6 border-border/50">
               {navItems.map(item => (
                 <Link 
                   key={item.name}
                   href={item.path} 
                   className={`flex items-center gap-2 text-sm font-medium transition-colors px-3 py-2 md:px-4 md:py-2.5 rounded-xl ${
                     location.startsWith(item.path) 
                       ? 'bg-[#12333B] text-white shadow-sm' 
                       : 'text-muted-foreground hover:bg-[#F7F5F2] hover:text-[#12333B]'
                   }`}
                 >
                   <item.icon size={16} />
                   <span className="hidden sm:inline">{item.name}</span>
                 </Link>
               ))}
             </div>
           </div>
           
           <button 
             onClick={handleLogout} 
             className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-2 md:px-4 md:py-2.5 rounded-xl"
           >
             <LogOut size={18} />
             <span className="hidden sm:inline">Sign Out</span>
           </button>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
