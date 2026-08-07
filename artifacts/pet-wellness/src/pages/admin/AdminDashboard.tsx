import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useStore } from '@/store/StoreContext';
import { Package, FolderTree, TrendingUp, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { products, categories } = useStore();

  useEffect(() => {
    if (localStorage.getItem('admin_authenticated') !== 'true') {
      setLocation('/admin-panel-user/login');
    }
  }, [setLocation]);

  const stats = [
    { label: 'Total Products', value: products.length.toString(), icon: Package, change: '+12%' },
    { label: 'Monthly Revenue', value: '₹1.2M', icon: TrendingUp, change: '+18%' },
    { label: 'New Customers', value: '1,240', icon: Users, change: '+5%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#12333B] mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to the Ancestral Essence control panel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-semibold text-[#12333B] mb-1">{stat.value}</h3>
              <span className="text-xs font-medium text-emerald-600">{stat.change} from last month</span>
            </div>
            <div className="w-12 h-12 bg-[#F7F5F2] rounded-full flex items-center justify-center text-[#12333B]">
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm min-h-[300px]">
          <h3 className="font-medium text-lg mb-4">Recent Orders</h3>
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-xl">
            Orders module coming soon
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm min-h-[300px]">
          <h3 className="font-medium text-lg mb-4">Top Products</h3>
          <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border-2 border-dashed border-border/50 rounded-xl">
            Analytics module coming soon
          </div>
        </div>
      </div>
    </div>
  );
}
