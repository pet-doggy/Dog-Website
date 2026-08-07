import { useEffect, useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { journalArticles } from '@/data/journalArticles';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ChevronRight, ArrowLeft, Share2, Link as LinkIcon, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function JournalArticle() {
  const [, params] = useRoute('/journal/:slug');
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [scrollProgress, setScrollProgress] = useState(0);

  const slug = params?.slug;
  const articleIndex = journalArticles.findIndex(a => a.slug === slug);
  const article = journalArticles[articleIndex];

  useEffect(() => {
    if (!article && slug) {
      setLocation('/journal');
    }
  }, [article, slug, setLocation]);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) return null;

  const prevArticle = articleIndex > 0 ? journalArticles[articleIndex - 1] : null;
  const nextArticle = articleIndex < journalArticles.length - 1 ? journalArticles[articleIndex + 1] : null;
  
  const relatedArticles = journalArticles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleUrl);
    toast({
      title: "Link Copied",
      description: "Article link has been copied to your clipboard.",
    });
  };

  const handleShare = (platform: string) => {
    let shareUrl = '';
    const text = encodeURIComponent(article.title);
    const url = encodeURIComponent(articleUrl);
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* SEO & JSON-LD */}
      <title>{`${article.title} - Ancestral Journal`}</title>
      <meta name="description" content={article.excerpt} />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={articleUrl} />
      <meta property="og:image" content={article.featuredImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.excerpt} />
      <meta name="twitter:image" content={article.featuredImage} />
      <link rel="canonical" href={articleUrl} />

      {/* JSON-LD Article Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "image": [
          article.featuredImage
        ],
        "datePublished": article.date,
        "author": [{
            "@type": "Person",
            "name": article.author
        }]
      })}} />
      
      {/* Custom FAQ Schema provided via the article */}
      {article.jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: article.jsonLd }} />
      )}

      {/* Reading Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-grow pt-[120px] pb-16 px-4 md:px-8 max-w-4xl mx-auto w-full">


        {/* Article Header */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-serif mb-6 text-foreground leading-tight">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{article.author}</span>
          </div>
        </header>



        {/* Article Content */}
        <article className="prose prose-lg prose-stone dark:prose-invert max-w-none mb-16
          prose-headings:font-serif prose-headings:font-medium
          prose-a:text-primary hover:prose-a:text-primary/80
          prose-img:rounded-xl
          prose-p:leading-relaxed"
        >
          {article.content}
        </article>

        {/* Share Section */}
        <div className="flex flex-col items-center justify-center gap-4 py-8 border-t border-b border-border mb-12">
          <h3 className="text-lg font-serif">Share this article</h3>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={() => handleShare('twitter')}>
              <Twitter className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('facebook')}>
              <Facebook className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleShare('linkedin')}>
              <Linkedin className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 mb-16">
          {prevArticle ? (
            <Link href={`/journal/${prevArticle.slug}`} className="flex-1 flex items-center p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group">
              <ArrowLeft className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Previous</div>
                <div className="font-medium line-clamp-1">{prevArticle.title}</div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          
          {nextArticle ? (
            <Link href={`/journal/${nextArticle.slug}`} className="flex-1 flex items-center justify-end p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors group text-right">
              <div className="text-right">
                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Next</div>
                <div className="font-medium line-clamp-1">{nextArticle.title}</div>
              </div>
              <ChevronRight className="w-5 h-5 ml-3 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* Related Articles */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Link key={rel.id} href={`/journal/${rel.slug}`} className="group block bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow">
                <h4 className="font-serif text-xl font-medium line-clamp-2 group-hover:text-primary transition-colors">{rel.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Journal */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <Link href="/journal">Back to Journal</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
