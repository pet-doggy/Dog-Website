import LegalLayout from '@/components/layout/LegalLayout';

export default function Disclaimer() {
  return (
    <LegalLayout
      title="Disclaimers"
      lastUpdated="October 15, 2026"
      seoTitle="Disclaimers | Ancestral Essence"
      seoDescription="Read our disclaimers regarding dietary considerations, veterinary consultation, and product usage for Ancestral Essence products."
      toc={[]}
    >
      <h2 className="mt-12">Dietary Considerations for Specialized Health Needs</h2>
      <p>
        Our ancestral blends and toppers feature exceptionally rich concentrations of real animal 
        protein. If your pet has a diagnosed metabolic, renal (kidney), or hepatic (liver) condition where 
        a protein-restricted diet has been medically recommended, these high-protein formulas may not 
        be suitable.
      </p>
      <p>
        The choice to introduce or modify your pet’s diet with our products remains entirely at the 
        discretion and risk of the pet owner. Unsure if a blend fits your pet's specific medical 
        profile? We highly recommend booking a specialized, one-on-one consultation with our 
        in-house veterinarians to safely tailor your pet's nutritional plan.
      </p>

      <h2 className="mt-12">Individual Conditions & Results Disclaimer</h2>
      <p>
        Every pet is biologically unique. Variations in individual gut microbiomes, life stages, breed 
        sensitivities, and underlying health history mean that results (such as coat shine, stool 
        consistency, or allergy relief) will vary from pet to pet. Transition your pet to new functional 
        ingredients gradually to prevent temporary digestive adjustments.
      </p>

      <h2 className="mt-12">Usage & Veterinary Consultation</h2>
      <p>
        While our recipes are formulated using whole-food ancestral based nutrition and 
        veterinary-backed research, they are intended to complement, not replace, professional 
        veterinary medical care. If your pet has a diagnosed medical condition, is on a strict therapeutic 
        diet, or is experiencing persistent symptoms, always consult your veterinarian before introducing 
        any new supplement, topper, or treat.
      </p>

      <h2 className="mt-12">Product & Health Disclaimer</h2>
      <p>
        Our products including Sour Loops, Chicken Crispies, Coastal Catch, Organ Blend, Ocean 
        Whitefish, Egg Crispies, Base Meal, Harmony, and Gutsense are premium functional treats 
        and daily meal toppers designed to support your pet's general health and vitality. They are not 
        prescription veterinary medicine, pharmaceutical drugs, or therapeutic cures for any medical 
        condition, illness, or disease.
      </p>
    </LegalLayout>
  );
}
