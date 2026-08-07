import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface QuantityOption {
  label: string;
  packs: number;
  recommended?: boolean;
}

export default function Settings() {
  const [quantities, setQuantities] = useState<QuantityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'product_quantities')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.value) {
        setQuantities(data.value as unknown as QuantityOption[]);
      } else {
        // Default values if not set
        setQuantities([
          { label: 'Small Pets', packs: 1 },
          { label: 'Medium Pets', packs: 2 },
          { label: 'Large Pets', packs: 3, recommended: true }
        ]);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // First check if the key exists
      const { data: existing } = await supabase
        .from('settings')
        .select('id')
        .eq('key', 'product_quantities')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('settings')
          .update({ value: quantities, updated_at: new Date().toISOString() })
          .eq('key', 'product_quantities');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('settings')
          .insert({ key: 'product_quantities', value: quantities });
        if (error) throw error;
      }

      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateQuantity = (index: number, field: keyof QuantityOption, value: any) => {
    const newQuantities = [...quantities];
    if (field === 'recommended' && value === true) {
      // Unset recommended for all others
      newQuantities.forEach(q => q.recommended = false);
    }
    newQuantities[index] = { ...newQuantities[index], [field]: value };
    setQuantities(newQuantities);
  };

  const addQuantity = () => {
    setQuantities([...quantities, { label: 'New Option', packs: 1 }]);
  };

  const removeQuantity = (index: number) => {
    setQuantities(quantities.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif text-[#12333B]">Store Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#12333B] text-white px-4 py-2 rounded-lg hover:bg-[#12333B]/90 transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border/50 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-medium text-[#12333B]">Product Quantities</h2>
            <p className="text-sm text-muted-foreground mt-1">Configure the quantity options shown on the product page.</p>
          </div>
          <button
            onClick={addQuantity}
            className="flex items-center gap-2 text-sm bg-[#F7F5F2] text-[#12333B] px-3 py-1.5 rounded-lg hover:bg-[#EFECE5]"
          >
            <Plus size={16} />
            Add Option
          </button>
        </div>

        <div className="space-y-4">
          {quantities.length === 0 && (
            <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-muted-foreground">No quantity options defined.</p>
            </div>
          )}
          
          {quantities.map((quantity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 border border-border/50 rounded-xl bg-gray-50/50">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Label</label>
                  <input
                    type="text"
                    value={quantity.label}
                    onChange={(e) => updateQuantity(index, 'label', e.target.value)}
                    className="w-full border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#12333B]"
                    placeholder="e.g. Small Pets"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Packs</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity.packs}
                      onChange={(e) => updateQuantity(index, 'packs', parseInt(e.target.value) || 1)}
                      className="w-full border border-border/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#12333B]"
                    />
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quantity.recommended || false}
                        onChange={(e) => updateQuantity(index, 'recommended', e.target.checked)}
                        className="rounded border-gray-300 text-[#12333B] focus:ring-[#12333B]"
                      />
                      <span className="text-sm font-medium text-foreground">Recommended</span>
                    </label>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeQuantity(index)}
                className="mt-6 text-red-500 hover:text-red-700 p-1"
                title="Remove option"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg text-blue-800">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p>These settings affect how product quantities are displayed on the product details page across the storefront. Changes are applied immediately after saving.</p>
        </div>
      </div>
    </div>
  );
}
