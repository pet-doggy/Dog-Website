import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (sessionStorage.getItem('admin_authenticated') === 'true') {
      setLocation('/admin-panel-user/products');
    }
  }, [setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'omkar') {
      sessionStorage.setItem('admin_authenticated', 'true');
      setLocation('/admin-panel-user/products');
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#F7F5F2] rounded-full flex items-center justify-center">
            <Lock className="text-[#12333B] w-8 h-8" />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl mb-2 text-[#12333B]">Admin Access</h1>
          <p className="text-muted-foreground text-sm">Please enter the master password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter Password"
              className={`w-full h-14 px-6 bg-[#F8F9FA] rounded-2xl border transition-all outline-none text-center tracking-widest ${
                error ? 'border-red-500 text-red-500' : 'border-border/50 focus:border-[#12333B]'
              }`}
            />
            {error && <p className="text-red-500 text-xs text-center mt-2 font-medium">Incorrect password</p>}
          </div>
          
          <button
            type="submit"
            className="w-full h-14 bg-[#12333B] hover:bg-[#1a2015] text-white rounded-2xl font-medium transition-colors"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
