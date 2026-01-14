import { Header } from '@/components/insight-lens/header';
import { ProductAnalyzer } from '@/components/insight-lens/product-analyzer';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-code">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col items-center">
        <ProductAnalyzer />
      </main>
      <footer className="py-6 text-center text-xs text-muted-foreground/50">
        <p>// Your privacy is our priority. All analyses are performed in-session and are not stored. //</p>
      </footer>
    </div>
  );
}
