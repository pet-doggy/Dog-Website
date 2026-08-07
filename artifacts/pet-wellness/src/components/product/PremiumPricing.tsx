import React from 'react';
import { ShieldCheck, Gift } from 'lucide-react';

interface OrderSummaryItem {
  name: string;
  value: number;
  icon?: string;
  is_bonus_item?: boolean;
}

interface PremiumPricingProps {
  quantity: number;
  finalPayablePrice: number;
  baseMrp: number; // MRP for a single unit
  orderSummaryItems?: OrderSummaryItem[];
  daysPerUnit?: number;
  badgeText?: string;
  calculator?: any;
}

export default function PremiumPricing({ quantity, finalPayablePrice, baseMrp, orderSummaryItems = [], daysPerUnit = 30, badgeText = 'Best Value Guaranteed', calculator }: PremiumPricingProps) {
  // 1. Product Duration
  const totalDurationDays = quantity * daysPerUnit;

  // 2. Main Product MRP (Total)
  const mainProductTotalMrp = baseMrp * quantity;

  // 3. Bonus Items Total Value
  const totalBonusValue = orderSummaryItems.reduce((sum, item) => sum + (item.value || 0), 0);

  // 4. Original Total Value
  const originalTotalValue = mainProductTotalMrp + totalBonusValue;

  // 5. Discount
  const discount = originalTotalValue - finalPayablePrice;

  // 6. Per Day Cost
  const perDayCost = calculator ? calculator.combinedDailyCost : daysPerUnit;

  return (
    <div className="bg-white rounded-[24px] border border-border/60 shadow-sm overflow-hidden mb-8 transition-all duration-300">
      {/* Top Section - Headline Pricing */}
      <div className="bg-[#EFECE5] p-4 pb-5 flex flex-col items-center text-center relative border-b border-border/50">
        {badgeText && (
          <div className="absolute top-0 right-0 bg-[#12333B] text-[#D7D2C9] text-[9px] uppercase font-bold tracking-widest py-1 px-3 rounded-bl-xl shadow-sm">
            {badgeText}
          </div>
        )}

        <p className="text-[12px] md:text-[13px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-1">
          Your Investment
        </p>
        
        <h2 className="text-3xl md:text-4xl font-serif text-[#12333B] font-bold mb-2">
          ₹{perDayCost}<span className="text-base md:text-lg font-sans text-muted-foreground font-normal">/day</span>
        </h2>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg md:text-xl font-bold text-foreground">
            Pay ₹{finalPayablePrice.toLocaleString()}
          </span>
          {discount > 0 && (
            <span className="text-sm md:text-base text-muted-foreground line-through font-medium opacity-70">
              ₹{originalTotalValue.toLocaleString()}
            </span>
          )}
        </div>

        {discount > 0 && (
          <div className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-[12px] md:text-[13px] font-bold flex items-center shadow-sm">
            You Save ₹{discount.toLocaleString()}
          </div>
        )}
      </div>

      {/* Invoice Breakdown Section */}
      <div className="p-4 md:p-5">
        <h3 className="text-[11px] md:text-[12px] uppercase tracking-widest font-bold text-muted-foreground mb-4">
          Order Summary & Included Value
        </h3>

        <div className="space-y-2 text-[12px] md:text-[13px] font-medium text-foreground/80">
          
          {/* Main Product */}
          <div className="flex justify-between items-center pb-2 border-b border-dashed border-border">
            <span>Main Product (x{quantity})</span>
            <span>₹{mainProductTotalMrp.toLocaleString()}</span>
          </div>

          {/* Bonus Items or Addons */}
          {calculator ? (
            calculator.addOnBreakdown.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-2 border-b border-dashed border-border text-foreground/70">
                <span className="flex items-center gap-1.5">
                  <Gift size={12} className="text-[#B89D5D]" />
                  {item.name} (x{item.packsRequired})
                </span>
                <span>₹{(item.monthlyCost || 0).toLocaleString()}</span>
              </div>
            ))
          ) : (
            orderSummaryItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center pb-2 border-b border-dashed border-border text-foreground/70">
                <span className="flex items-center gap-1.5">
                  <Gift size={12} className="text-[#B89D5D]" />
                  {item.name}
                </span>
                <span>₹{(item.value || 0).toLocaleString()}</span>
              </div>
            ))
          )}

          {/* Spacer */}
          <div className="pt-0.5"></div>

          {/* Totals */}
          <div className="flex justify-between items-center text-foreground font-semibold">
            <span>Total Value</span>
            <span>₹{originalTotalValue.toLocaleString()}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between items-center text-[#166534] font-bold">
              <span>Discount Applied</span>
              <span>-₹{discount.toLocaleString()}</span>
            </div>
          )}

          <div className="pt-2 border-b border-border/80"></div>

          {/* Final Payable */}
          <div className="flex justify-between items-center pt-2 pb-1 text-base md:text-lg font-bold text-[#B89D5D]">
            <span>Final Payable Amount</span>
            <span>₹{finalPayablePrice.toLocaleString()}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
