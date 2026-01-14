"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  analyzeProductAction,
  type AnalyzeProductOutput,
} from "@/app/(actions)/ai-actions";
import { UploadCloud, Sparkles, AlertTriangle, CheckCircle, Bot, Leaf, Link as LinkIcon, Replace, Building, Info, Sigma } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeProductOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!file || !previewUrl) {
      toast({ title: ">>> ERROR: NO FILE SELECTED", description: "Please upload an image to initiate analysis.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const actionResult = await analyzeProductAction(previewUrl);
    
    if (actionResult.success) {
      setResult(actionResult.data);
    } else {
      toast({ title: ">>> ANALYSIS FAILED", description: actionResult.error, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const renderResult = () => {
    if (isLoading) {
      return (
        <div className="w-full max-w-4xl mt-8 terminal-box p-4 md:p-6 space-y-6">
          <div className="flex justify-center items-center gap-2">
            <Sigma className="animate-spin text-accent" />
            <h2 className="text-xl font-headline text-accent text-glow">ANALYZING...</h2>
          </div>
          <Skeleton className="h-8 w-3/4 mx-auto bg-muted/50" />
          <Skeleton className="h-4 w-1/2 mx-auto bg-muted/50" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-24 w-full bg-muted/50" />
            <Skeleton className="h-32 w-full bg-muted/50" />
            <Skeleton className="h-24 w-full bg-muted/50" />
          </div>
        </div>
      );
    }

    if (!result) return null;

    const renderPricing = () => {
      const prices = [
        { currency: 'USD', value: result.pricing.usd },
        { currency: 'INR', value: result.pricing.inr },
        { currency: 'GBP', value: result.pricing.gbp },
      ].filter(p => p.value);

      if (prices.length === 0) return <p className="text-muted-foreground">// Pricing information not available //</p>;

      return prices.map(p => (
        <span key={p.currency} className="text-foreground font-semibold bg-primary/20 px-3 py-1 rounded">
          {p.currency}: {p.value}
        </span>
      ));
    };

    return (
      <div className="w-full max-w-4xl mt-8 terminal-box p-4 md:p-6 space-y-8">
        <header className="text-center pb-4 border-b-2 border-accent/30">
          <h2 className="text-2xl font-headline text-accent text-glow uppercase tracking-widest">Analysis Complete</h2>
          <p className="text-xl font-semibold text-foreground pt-2">{result.productName}</p>
          <p className="text-sm text-muted-foreground">// by {result.manufacturer} //</p>
        </header>
        
        <section>
          <h3 className="font-bold text-lg mb-3 text-accent/90 flex items-center gap-2"><Info />Summary</h3>
          <p className="text-muted-foreground bg-black/20 p-4 rounded-md">{result.summary}</p>
        </section>

        <section>
          <h3 className="font-bold text-lg mb-3 text-accent/90">Pricing Estimate</h3>
          <div className="flex flex-wrap gap-4">{renderPricing()}</div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-green-400"><CheckCircle />Pros</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {result.pros.map((pro, i) => <li key={i}>{pro}</li>)}
            </ul>
          </section>
          <section>
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-red-400"><AlertTriangle />Cons</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              {result.cons.map((con, i) => <li key={i}>{con}</li>)}
            </ul>
          </section>
        </div>
        
        <section>
          <h3 className="font-bold text-lg mb-3 text-accent/90 flex items-center gap-2"><Replace />Alternatives</h3>
          <div className="space-y-3">
            {result.alternatives.map((alt, i) => (
              <div key={i} className="text-muted-foreground bg-black/20 p-3 rounded-md">
                <p className="font-semibold text-foreground/90">{alt.name}</p>
                <p className="text-sm italic my-1">"{alt.reason}"</p>
                {alt.link && (
                  <a href={alt.link} target="_blank" rel="noopener noreferrer" className="text-accent/80 hover:text-accent text-xs flex items-center gap-1">
                    <LinkIcon size={12} /> View Product
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
            <h3 className="font-bold text-lg mb-3 text-accent/90 flex items-center gap-2"><Leaf />Veganism Review</h3>
            <p className="text-muted-foreground whitespace-pre-wrap bg-black/20 p-4 rounded-md">{result.veganAnalysis}</p>
        </section>
        
        <section>
            <h3 className="font-bold text-lg mb-3 text-accent/90 flex items-center gap-2"><Building />Company Analysis</h3>
            <p className="text-muted-foreground whitespace-pre-wrap bg-black/20 p-4 rounded-md">{result.companyAnalysis}</p>
        </section>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center space-y-6">
       <div className="w-full p-6 text-center terminal-box border-2 border-dashed border-accent/20">
        <h2 className="text-2xl font-bold font-headline mb-2 text-glow uppercase tracking-wider">Product Identification</h2>
        <p className="text-muted-foreground mb-6">// Upload an image to begin AI-powered analysis //</p>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video bg-black/30 rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/30 hover:border-accent/50 transition-colors cursor-pointer group"
          >
            {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Product preview"
                  width={300}
                  height={168}
                  className="rounded-md object-contain h-full w-full"
                />
            ) : (
              <div className="text-center text-muted-foreground group-hover:text-accent transition-colors">
                <UploadCloud className="mx-auto h-10 w-10 mb-2" />
                <p>Click to Upload Image</p>
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground h-4">// {file ? file.name : "No file selected"} //</p>
        </div>
      </div>

      <Button onClick={handleAnalyzeClick} disabled={!file || isLoading} size="lg" className="w-full text-lg py-7 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-widest transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/30 disabled:shadow-none">
        <Sparkles className={cn("mr-2", isLoading && "animate-pulse")} />
        {isLoading ? "ANALYZING..." : "GET INSIGHT"}
      </Button>

      {renderResult()}
    </div>
  );
}
