"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  analyzeProductAction,
  type AnalyzeProductOutput,
} from "@/app/(actions)/ai-actions";
import { UploadCloud, Sparkles, AlertTriangle, CheckCircle, Search, Building } from "lucide-react";
import { Badge } from "../ui/badge";

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
      toast({ title: "No file selected", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setResult(null);

    const actionResult = await analyzeProductAction(previewUrl);
    
    if (actionResult.success) {
      setResult(actionResult.data);
    } else {
      toast({ title: "Analysis Failed", description: actionResult.error, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const renderResult = () => {
    if (isLoading) {
      return (
        <Card className="w-full max-w-4xl mt-6">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <div className="grid md:grid-cols-2 gap-6">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      );
    }

    if (!result) return null;

    return (
        <Card className="w-full max-w-4xl mt-6 bg-secondary/30 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center gap-2"><Search />Analysis Complete</CardTitle>
            <p className="text-xl font-semibold text-foreground pt-2">{result.productName}</p>
            <p className="text-md text-muted-foreground">by {result.manufacturer}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-bold text-lg mb-2 font-headline">Summary</h3>
              <p className="text-muted-foreground">{result.summary}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2 text-green-400 font-headline"><CheckCircle />Pros</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {result.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2 text-red-400 font-headline"><AlertTriangle />Cons</h3>
                 <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  {result.cons.map((con, i) => <li key={i}>{con}</li>)}
                </ul>
              </div>
            </div>
             <div>
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 font-headline"><Building />Company Analysis</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{result.companyAnalysis}</p>
            </div>
          </CardContent>
        </Card>
    );
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center space-y-6">
       <Card className="w-full p-6 text-center border-2 border-dashed border-primary/30">
        <h2 className="text-2xl font-bold font-headline mb-2">Analyze Any Product</h2>
        <p className="text-muted-foreground mb-6">Upload an image of any item to get a detailed AI-powered analysis.</p>
        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          {previewUrl ? (
             <div className="mt-4">
                <Image
                  src={previewUrl}
                  alt="Product preview"
                  width={250}
                  height={250}
                  className="rounded-lg object-cover aspect-square shadow-lg border-2 border-border"
                />
              </div>
          ) : (
            <div className="w-full h-64 bg-secondary/50 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Image preview will appear here</p>
            </div>
          )}
          <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
            <UploadCloud className="mr-2" />
            {file ? "Change Image" : "Upload Image"}
          </Button>
          <p className="text-xs text-muted-foreground h-4">{file ? file.name : "No file selected"}</p>
        </div>
      </Card>

      <Button onClick={handleAnalyzeClick} disabled={!file || isLoading} className="w-full text-lg py-6">
        <Sparkles className="mr-2" />
        {isLoading ? "Analyzing..." : "Get Insight"}
      </Button>

      {renderResult()}
    </div>
  );
}
