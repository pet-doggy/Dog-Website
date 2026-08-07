import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Review } from '@/data/products';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: Review) => void;
  initialReview?: Review | null;
}

export default function ReviewModal({ isOpen, onClose, onSave, initialReview }: ReviewModalProps) {
  const [formData, setFormData] = useState<Partial<Review>>({
    customerName: '',
    petName: '',
    rating: 5.0,
    reviewText: '',
    date: new Date().toISOString().split('T')[0],
    verified: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialReview) {
        setFormData(initialReview);
      } else {
        setFormData({
          customerName: '',
          petName: '',
          rating: 5.0,
          reviewText: '',
          date: new Date().toISOString().split('T')[0],
          verified: true,
        });
      }
    }
  }, [isOpen, initialReview]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      // For number inputs, keep as string to allow typing decimals like "4.", convert to number on submit
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customerName && formData.reviewText) {
      onSave({
        ...formData,
        rating: Number(formData.rating) || 5.0,
        id: initialReview?.id || Date.now().toString() + Math.random().toString(),
      } as Review);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialReview ? "Edit Review" : "Add Review"} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">Customer Name *</label>
            <input 
              required 
              name="customerName" 
              value={formData.customerName || ''} 
              onChange={handleChange} 
              className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none focus:border-[#12333B] text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">Pet Name (Optional)</label>
            <input 
              name="petName" 
              value={formData.petName || ''} 
              onChange={handleChange} 
              className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none focus:border-[#12333B] text-sm" 
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">Rating (1.0 - 5.0) *</label>
            <input 
              required 
              type="number" 
              step="0.1" 
              min="1" 
              max="5" 
              name="rating" 
              value={formData.rating || 5} 
              onChange={handleChange} 
              className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none focus:border-[#12333B] text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#12333B]">Review Date *</label>
            <input 
              required 
              type="date" 
              name="date" 
              value={formData.date || ''} 
              onChange={handleChange} 
              className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none focus:border-[#12333B] text-sm" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[#12333B]">Review Text *</label>
          <textarea 
            required 
            name="reviewText" 
            value={formData.reviewText || ''} 
            onChange={handleChange} 
            rows={4} 
            className="w-full p-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none focus:border-[#12333B] text-sm resize-none" 
          />
        </div>

        <div className="flex items-center gap-3">
          <input 
            type="checkbox" 
            id="verified" 
            name="verified" 
            checked={formData.verified || false} 
            onChange={handleChange} 
            className="w-5 h-5 rounded border-border/50 text-[#12333B] focus:ring-[#12333B]" 
          />
          <label htmlFor="verified" className="text-sm font-medium text-[#12333B] cursor-pointer">
            Verified Purchase
          </label>
        </div>

        {/* Live Preview Card */}
        <div className="mt-8 border-t border-border/50 pt-8">
          <p className="text-sm font-medium text-muted-foreground mb-4">Live Preview</p>
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-[#12333B]">{formData.customerName || 'Customer Name'}</span>
                  {formData.verified && <span className="text-[10px] uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">Verified</span>}
                </div>
                {formData.petName && <p className="text-sm text-muted-foreground">Parent of {formData.petName}</p>}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-sm">{formData.rating}</span>
                <span className="text-[#D4AF37]">★</span>
              </div>
            </div>
            <p className="text-[#12333B] leading-relaxed mb-4">{formData.reviewText || 'Review description will appear here...'}</p>
            <p className="text-sm text-muted-foreground">{formData.date}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.customerName || !formData.reviewText}
            className="px-6 py-2.5 bg-[#12333B] hover:bg-[#1a2015] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {initialReview ? "Update Review" : "Add Review"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
