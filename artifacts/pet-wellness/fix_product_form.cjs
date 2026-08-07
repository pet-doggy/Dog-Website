const fs = require('fs');
const path = 'src/pages/admin/products/ProductForm.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. useEffect mapping
code = code.replace(
  `price: dbProduct.variants?.[0]?.selling_price || 0,
        originalPrice: dbProduct.variants?.[0]?.mrp || 0,`,
  `price: dbProduct.variants?.find((v: any) => v.sku === 'default')?.selling_price || dbProduct.variants?.[0]?.selling_price || 0,
        originalPrice: dbProduct.variants?.find((v: any) => v.sku === 'default')?.mrp || dbProduct.variants?.[0]?.mrp || 0,
        bundle2Price: dbProduct.variants?.find((v: any) => v.sku === 'bundle2')?.selling_price || 0,
        bundle3Price: dbProduct.variants?.find((v: any) => v.sku === 'bundle3')?.selling_price || 0,`
);

// 2. handleChange logic
code = code.replace(
  `      if (name === 'price') {
        if (next.variants && next.variants.length > 0) {
          next.variants = [...next.variants];
          next.variants[0] = { ...next.variants[0], price: value };
        }
      }`,
  `      if (name === 'price') {
        // Handled in submit
      }`
);

// 3. handleSubmit mapping (including fix for missing variants)
code = code.replace(
  `      const related = {
        basePrice: Number(formData.price) || 0,
        baseOriginalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        variants: formData.variants || [],`,
  `      const currentVariants = formData.variants || [];
      let updatedVariants = currentVariants.map((v: any) => {
        if (v.sku === 'default' || v.size === 'Default' || !v.size) {
          return { ...v, price: Number(formData.price) || 0, originalPrice: Number(formData.originalPrice) || 0, sku: 'default', size: 'Default' };
        }
        if (v.sku === 'bundle2' || v.size === 'Bundle2') {
          return { ...v, price: Number((formData as any).bundle2Price) || 0, sku: 'bundle2', size: 'Bundle2' };
        }
        if (v.sku === 'bundle3' || v.size === 'Bundle3') {
          return { ...v, price: Number((formData as any).bundle3Price) || 0, sku: 'bundle3', size: 'Bundle3' };
        }
        return v;
      });

      if (!updatedVariants.some((v: any) => v.sku === 'default')) {
        updatedVariants.push({
          id: Date.now().toString() + '-def',
          sku: 'default',
          size: 'Default',
          price: Number(formData.price) || 0,
          originalPrice: Number(formData.originalPrice) || 0
        });
      }
      
      const b2 = Number((formData as any).bundle2Price) || 0;
      if (b2 > 0 && !updatedVariants.some((v: any) => v.sku === 'bundle2')) {
        updatedVariants.push({
          id: Date.now().toString() + '-b2',
          sku: 'bundle2',
          size: 'Bundle2',
          price: b2
        });
      }

      const b3 = Number((formData as any).bundle3Price) || 0;
      if (b3 > 0 && !updatedVariants.some((v: any) => v.sku === 'bundle3')) {
        updatedVariants.push({
          id: Date.now().toString() + '-b3',
          sku: 'bundle3',
          size: 'Bundle3',
          price: b3
        });
      }

      const related = {
        basePrice: Number(formData.price) || 0,
        baseOriginalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        bundle2Price: Number((formData as any).bundle2Price) || 0,
        bundle3Price: Number((formData as any).bundle3Price) || 0,
        variants: updatedVariants,`
);

// 4. Update UI Base Price and add originalPrice
code = code.replace(
  `            <div className="space-y-2">
              <label className="text-sm font-medium text-[#283120]">Base Price (Default)</label>
              <input type="number" step="any" name="price" value={formData.price ?? ''} onChange={handleChange} className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none text-sm" />
            </div>
          </div>`,
  `            <div className="space-y-2">
              <label className="text-sm font-medium text-[#283120]">Base Price (Selling Price) *</label>
              <input type="number" step="any" name="price" value={formData.price ?? ''} onChange={handleChange} className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#283120]">Original MRP (Strikethrough)</label>
              <input type="number" step="any" name="originalPrice" value={formData.originalPrice ?? ''} onChange={handleChange} className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none text-sm" />
            </div>
          </div>`
);

// 5. Replace Variants section with Volume Bundles
const variantSection = `        {/* Pricing & Variants */}
        <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-border/50 pb-4 mb-6">
            <h2 className="text-lg font-medium">Pricing & Variants</h2>
            <button type="button" onClick={addVariant} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <Plus size={16} /> Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {formData.variants?.map((v, i) => (
              <div key={v.id} className="flex gap-4 items-center bg-[#F8F9FA] p-4 rounded-xl border border-border/50">
                <GripVertical size={16} className="text-muted-foreground cursor-grab" />
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground">Size/Weight</label>
                  <input value={v.size} onChange={(e) => updateVariant(i, 'size', e.target.value)} placeholder="e.g. 1.5 kg" className="w-full h-9 px-3 bg-white border border-border/50 rounded-lg text-sm outline-none" />
                </div>
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground">Price</label>
                  <input type="number" step="any" value={v.price ?? ''} onChange={(e) => updateVariant(i, 'price', e.target.value)} className="w-full h-9 px-3 bg-white border border-border/50 rounded-lg text-sm outline-none" />
                </div>
                <button type="button" onClick={() => removeVariant(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg mt-5">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {formData.variants?.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No variants added.</p>}
          </div>
        </div>`;

const bundlesSection = `        {/* Volume Bundles Configuration */}
        <div className="bg-white rounded-2xl border border-border/50 p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-[#283120]">Volume Bundles Configuration</h2>
            <p className="text-sm text-muted-foreground mt-1">Configure pricing for Buy 2 and Buy 3 bundles. Leave at 0 if no bundle discount is offered.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#283120]">Buy 2 Final Price (₹)</label>
              <input 
                type="number" 
                name="bundle2Price" 
                value={(formData as any).bundle2Price || ''} 
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none text-sm" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#283120]">Buy 3 Final Price (₹)</label>
              <input 
                type="number" 
                name="bundle3Price" 
                value={(formData as any).bundle3Price || ''} 
                onChange={handleChange}
                className="w-full h-11 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 outline-none text-sm" 
              />
            </div>
          </div>
        </div>`;

code = code.replace(variantSection, bundlesSection);

fs.writeFileSync(path, code);
console.log("ProductForm updated successfully.");
