import React from 'react';

interface Props {
  richDescription?: string;
  description: string;
}

export default function ProductDescription({ richDescription, description }: Props) {
  return (
    <section className="py-16 md:py-24 bg-[#F7F5F2]">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl prose prose-lg prose-headings:font-serif prose-p:text-muted-foreground prose-a:text-primary">
        <h2 className="text-3xl md:text-4xl font-serif mb-12 text-center not-prose">Product Details</h2>
        
        {/* CMS Rich Text Field */}
        {richDescription ? (
          <div dangerouslySetInnerHTML={{ __html: richDescription }} />
        ) : (
          <p>{description}</p>
        )}
      </div>
    </section>
  );
}

