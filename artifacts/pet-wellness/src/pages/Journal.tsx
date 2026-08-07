import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'wouter';
import { journalArticles } from '@/data/journalArticles';
import { Button } from '@/components/ui/button';

export default function Journal() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-grow pt-[140px] pb-12 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-foreground">The Ancestral Journal</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our latest articles, research, and deep dives into canine longevity and ancestral nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {journalArticles.map((article) => (
            <article key={article.id} className="group flex flex-col bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-border">
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-serif font-medium mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  <Link href={`/journal/${article.slug}`}>{article.title}</Link>
                </h2>
                
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-grow">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-sm font-medium text-foreground">{article.author}</span>
                  <Button variant="ghost" size="sm" asChild className="group-hover:text-primary">
                    <Link href={`/journal/${article.slug}`}>Read Article</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
