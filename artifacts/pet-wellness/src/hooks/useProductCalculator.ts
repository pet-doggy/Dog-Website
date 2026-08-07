import { useMemo } from 'react';
import { PRODUCT_REGISTRY } from '../lib/productRegistry';

export function useProductCalculator(
  currentProductId: string,
  activeTier: string,
  selectedAddOnIds: string[] = [],
  quantity: number = 1
) {
  return useMemo(() => {
    const mainProduct = PRODUCT_REGISTRY[currentProductId];
    if (!mainProduct) return null;

    const mainTierData = mainProduct.tiers[activeTier];
    if (!mainTierData) return null;

    // 1. Biological Daily Metrics (Bound strictly to the Size Buttons)
    const baseDailyGrams = mainTierData.dailyGrams;
    const baseRehydratedMl = baseDailyGrams * (1 + mainProduct.bloomRatio);

    // Exact cost per day based on what the pet consumes
    const costPerGram = mainProduct.pricePerPack / mainProduct.packWeightGrams;
    const baseDailyCost = Math.round(baseDailyGrams * costPerGram);

    // 2. Physical Commerce Metrics (Bound strictly to the Quantity Dropdown)
    const basePacksRequired = quantity;
    const baseMonthlyCost = basePacksRequired * mainProduct.pricePerPack;

    // Calculates exact timeline duration based on total purchased volume
    const totalGramsPurchased = basePacksRequired * mainProduct.packWeightGrams;
    const totalDaysSupply = Math.floor(totalGramsPurchased / baseDailyGrams);

    // 3. Dynamic Add-on / Cross-Sell Loop Calculations
    let totalAddOnCost = 0;
    let totalAddOnMl = 0;

    const addOnBreakdown = selectedAddOnIds.map((id) => {
      const addOn = PRODUCT_REGISTRY[id];
      if (!addOn) return null;

      const addOnTierData = addOn.tiers[activeTier];

      // IMPORTANT FIX:
      // Add-ons must default to a single packet display, not scale automatically with main quantity
      const addOnPacksRequired = 1;
      const addOnCost = addOnPacksRequired * addOn.pricePerPack;

      totalAddOnCost += addOnCost;
      totalAddOnMl += addOnTierData.dailyGrams * (1 + addOn.bloomRatio);

      return {
        id,
        name: addOn.name,
        packsRequired: addOnPacksRequired,
        monthlyCost: addOnCost
      };
    }).filter(Boolean);

    const grandTotalMonthly = baseMonthlyCost + totalAddOnCost;
    const combinedDailyCost = Number((grandTotalMonthly / 30).toFixed(2));
    const combinedBowlVolumeMl = Math.round(baseRehydratedMl + totalAddOnMl);

    return {
      productName: mainProduct.name,
      tierLabel: mainTierData.label,
      baseDailyGrams,
      baseRehydratedMl,
      basePacksRequired,
      baseMonthlyCost,
      baseDailyCost,
      totalDaysSupply,
      grandTotalMonthly,
      combinedDailyCost,
      combinedBowlVolumeMl,
      addOnBreakdown
    };
  }, [currentProductId, activeTier, selectedAddOnIds, quantity]);
}
