export const DAYS_PER_MONTH = 30;

function deepFreeze(obj: any) {
  Object.values(obj).forEach((value) => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return Object.freeze(obj);
}

export const PRODUCT_REGISTRY: Record<string, any> = deepFreeze({
  mealBase: {
    id: "mealBase",
    name: "Meal Base",
    pricePerPack: 300,
    packWeightGrams: 100,
    bloomRatio: 6,
    targetAllocation: "80% Core Meal Requirement",
    tiers: {
      cat: { label: "Cats", dailyGrams: 16 },
      small: { label: "Small Dogs", dailyGrams: 37 },
      medium: { label: "Medium Dogs", dailyGrams: 72 },
      large: { label: "Large Dogs", dailyGrams: 120 },
      xlarge: { label: "Extra Large", dailyGrams: 158 },
    },
  },

  harmony: {
    id: "harmony",
    name: "Harmony",
    pricePerPack: 599,
    packWeightGrams: 150,
    bloomRatio: 5,
    targetAllocation: "80% Clinical Topper Requirement",
    tiers: {
      cat: { label: "Cats", dailyGrams: 15 },
      small: { label: "Small Dogs", dailyGrams: 34 },
      medium: { label: "Medium Dogs", dailyGrams: 66 },
      large: { label: "Large Dogs", dailyGrams: 110 },
      xlarge: { label: "Extra Large", dailyGrams: 145 },
    },
  },

  gutSense: {
    id: "gutSense",
    name: "Gut Sense",
    pricePerPack: 599,
    packWeightGrams: 150,
    bloomRatio: 5,
    targetAllocation: "80% Clinical Topper Requirement",
    tiers: {
      cat: { label: "Cats", dailyGrams: 15 },
      small: { label: "Small Dogs", dailyGrams: 36 },
      medium: { label: "Medium Dogs", dailyGrams: 69 },
      large: { label: "Large Dogs", dailyGrams: 116 },
      xlarge: { label: "Extra Large", dailyGrams: 152 },
    },
  },

  chickenCrispies: {
    id: "chickenCrispies",
    name: "Chicken Crispies",
    pricePerPack: 299,
    packWeightGrams: 85,
    bloomRatio: 0,
    targetAllocation: "20% Functional Treat Reward",
    tiers: {
      cat: { label: "Cats", dailyGrams: 4 },
      small: { label: "Small Dogs", dailyGrams: 9 },
      medium: { label: "Medium Dogs", dailyGrams: 18 },
      large: { label: "Large Dogs", dailyGrams: 30 },
      xlarge: { label: "Extra Large", dailyGrams: 40 },
    },
  },

  sourLoops: {
    id: "sourLoops",
    name: "Sour Loops",
    pricePerPack: 299,
    packWeightGrams: 85,
    bloomRatio: 0,
    targetAllocation: "20% Functional Treat Reward",
    tiers: {
      cat: { label: "Cats", dailyGrams: 7 },
      small: { label: "Small Dogs", dailyGrams: 16 },
      medium: { label: "Medium Dogs", dailyGrams: 31 },
      large: { label: "Large Dogs", dailyGrams: 52 },
      xlarge: { label: "Extra Large", dailyGrams: 69 },
    },
  },
});

export function getProductById(productId: string) {
  return PRODUCT_REGISTRY[productId] ?? null;
}

export function getTierForProduct(productId: string, tierId: string) {
  return PRODUCT_REGISTRY[productId]?.tiers?.[tierId] ?? null;
}
