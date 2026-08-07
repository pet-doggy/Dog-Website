import React, { useState } from 'react';
import { HelpCircle, Tag, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
  description?: string;
  isBestseller?: boolean;
}

interface CompleteTheBowlProps {
  products?: Product[];
  selectedItems?: Record<string, number>;
  onUpdateItems?: (items: Record<string, number>) => void;
}

export default function CompleteTheBowl({ products = [], selectedItems = {}, onUpdateItems }: CompleteTheBowlProps) {
  // Use actual products if available, otherwise fallback to placeholders that match the mockup
  const displayItems = products.length > 0 ? products.slice(0, 3).map(p => ({
    ...p,
    description: p.description || 'Clean protein topper for palatability & enrichment',
    isBestseller: true
  })) : [
    { 
      id: '1', 
      name: 'Chicken Crispies Companion Pack', 
      price: 399, 
      image: '', 
      description: 'Clean protein topper for palatability & enrichment',
      isBestseller: true 
    },
    { 
      id: '2', 
      name: 'Gutsense GI Support Topper', 
      price: 1450, 
      image: '', 
      description: 'Supports optimal digestion & nutrient absorption' 
    },
    { 
      id: '3', 
      name: 'Omega Boost', 
      price: 660, 
      image: '', 
      description: 'Supports skin hydration & coat health' 
    },
  ];

  const toggleSelection = (id: string) => {
    if (!onUpdateItems) return;
    
    const next = { ...selectedItems };
    if (next[id]) {
      delete next[id];
    } else {
      next[id] = 1;
    }
    onUpdateItems(next);
  };

  const updateQuantity = (id: string, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onUpdateItems) return;
    
    const currentQty = selectedItems[id] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    const next = { ...selectedItems };
    if (newQty === 0) {
      delete next[id];
    } else {
      next[id] = newQty;
    }
    onUpdateItems(next);
  };

  // Calculate totals for add-ons (if needed elsewhere, though we remove the summary box)
  const addOnsTotal = displayItems.reduce((sum, item) => {
    const qty = selectedItems[item.id || item.name] || 0;
    return sum + (item.price * qty);
  }, 0);

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 border-b border-gray-200 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              Complete the Bowl: Enhance Your 30-Day Clinical Plan
            </h2>
            <p className="text-sm text-gray-600">Curated companions for compounding clinical success.</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-4">
          
          {/* Products List */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayItems.map((item, index) => {
              const itemId = item.id || item.name;
              const quantity = selectedItems[itemId] || 0;
              const isSelected = quantity > 0;
              
              return (
                <div 
                  key={index} 
                  onClick={() => toggleSelection(itemId)}
                  className={`border rounded-lg p-3 flex gap-3 cursor-pointer transition-all ${
                    isSelected ? 'border-gray-900 bg-gray-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Checkbox */}
                  <div className="pt-1">
                    <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-gray-800 border-gray-800 text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Image Placeholder */}
                  <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded shrink-0 relative overflow-hidden flex items-center justify-center text-gray-300">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8">
                        <path d="M4 4l16 16M4 20L20 4" />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col justify-between flex-grow min-w-0">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-1 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm leading-tight pr-1 truncate w-full" title={item.name}>
                          {item.name}
                        </h3>
                        {item.isBestseller && (
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                            Bestseller
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-snug line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-[11px] sm:text-xs font-medium text-gray-900 mt-2 flex flex-wrap items-center justify-between gap-2 min-h-[26px]">
                      <div>₹{item.price}/packet</div>
                      {isSelected ? (
                        <div className="flex items-center gap-1 border border-gray-300 rounded bg-white px-1 py-0.5 shadow-sm">
                          <button 
                            onClick={(e) => updateQuantity(itemId, -1, e)}
                            className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors font-medium"
                          >
                            -
                          </button>
                          <span className="w-4 text-center font-semibold text-[11px]">{quantity}</span>
                          <button 
                            onClick={(e) => updateQuantity(itemId, 1, e)}
                            className="w-5 h-5 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors font-medium"
                          >
                            +
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
