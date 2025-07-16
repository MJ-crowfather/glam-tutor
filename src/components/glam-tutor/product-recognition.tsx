"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { recognizeProductAction, type RecognizeMakeupProductOutput } from "@/app/(actions)/ai-actions";
import { UploadCloud, Sparkles, Wand2, LinkIcon, Beaker, ShoppingBag } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";

export function ProductRecognition() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecognizeMakeupProductOutput | null>(null);
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

    const actionResult = await recognizeProductAction(previewUrl);

    if (actionResult.success) {
      setResult(actionResult.data);
    } else {
      toast({ title: "Recognition Failed", description: actionResult.error, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const renderResult = () => {
    if (isLoading) {
      return (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>
      );
    }

    if (!result) return null;

    const { productInformation, similarProducts, trustedArticles } = result;

    return (
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-accent flex items-center"><Wand2 className="mr-2" />Product Identified</CardTitle>
          <p className="text-lg font-semibold">{productInformation.brand} - {productInformation.productName}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Usage Guidance</h3>
            <p className="text-muted-foreground">{productInformation.usageGuidance}</p>
          </div>
          <Accordion type="multiple" className="w-full">
            {productInformation.ingredients && (
              <AccordionItem value="ingredients">
                <AccordionTrigger><Beaker className="mr-2 text-accent"/>Ingredients</AccordionTrigger>
                <AccordionContent>
                  {productInformation.ingredients}
                </AccordionContent>
              </AccordionItem>
            )}
            <AccordionItem value="similar-products">
              <AccordionTrigger><ShoppingBag className="mr-2 text-accent"/>Similar Products / Dupes</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2">
                  {similarProducts.map((product, i) => <Badge key={i} variant="secondary">{product}</Badge>)}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="trusted-articles">
              <AccordionTrigger><LinkIcon className="mr-2 text-accent"/>Trusted Articles & Reviews</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-2">
                  {trustedArticles.map((link, i) => (
                    <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{link}</a></li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-primary/30 rounded-lg text-center bg-primary/5">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />
        <Button variant="outline" size="lg" onClick={() => fileInputRef.current?.click()}>
          <UploadCloud className="mr-2" />
          {file ? "Change Image" : "Upload Image"}
        </Button>
        {previewUrl && (
          <div className="mt-4">
            <Image
              src={previewUrl}
              alt="Product preview"
              width={200}
              height={200}
              className="rounded-lg object-cover aspect-square shadow-lg"
            />
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-2">{file ? file.name : "No file selected"}</p>
      </div>

      <Button onClick={handleAnalyzeClick} disabled={!file || isLoading} className="w-full">
        <Sparkles className="mr-2" />
        {isLoading ? "Recognizing..." : "Recognize Product"}
      </Button>

      {result && (
        <div className="mt-6">
          {renderResult()}
        </div>
      )}
    </div>
  );
}
