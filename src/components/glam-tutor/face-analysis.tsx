"use client";

import { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  analyzeFaceAction,
  iterateLookAction,
  type AnalyzeMakeupImageOutput,
  type IterateMakeupLookOutput,
} from "@/app/(actions)/ai-actions";
import { UploadCloud, Sparkles, Wand2, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";
import { Textarea } from "../ui/textarea";

export function FaceAnalysis() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeMakeupImageOutput | IterateMakeupLookOutput | null>(null);
  const [originalLook, setOriginalLook] = useState<string>("");
  const [feedback, setFeedback] = useState("");
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

    const actionResult = await analyzeFaceAction(previewUrl);
    
    if (actionResult.success) {
      setResult(actionResult.data);
      setOriginalLook(actionResult.data.recommendations);
    } else {
      toast({ title: "Analysis Failed", description: actionResult.error, variant: "destructive" });
    }
    setIsLoading(false);
  };

  const handleIterationClick = async (prompt: string) => {
    setIsLoading(true);
    const currentLook = 'recommendations' in result! ? result.recommendations : (result as IterateMakeupLookOutput).refinedLook;
    
    const actionResult = await iterateLookAction(originalLook, prompt);
    if (actionResult.success) {
      setResult(actionResult.data);
    } else {
      toast({ title: "Iteration Failed", description: actionResult.error, variant: "destructive" });
    }
    setIsLoading(false);
  }

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

    if ('faceShape' in result) {
      return (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-accent flex items-center"><Sparkles className="mr-2"/>Your Personalized Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Your Features:</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>Face Shape:</strong> {result.faceShape}</li>
                <li><strong>Skin Tone:</strong> {result.skinTone}</li>
                <li><strong>Eye Color:</strong> {result.eyeColor}</li>
                <li><strong>Lip Shape:</strong> {result.lipShape}</li>
                <li><strong>Current Makeup:</strong> {result.currentMakeup}</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg">AI Recommended Routine:</h3>
              <p className="whitespace-pre-wrap">{result.recommendations}</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    if ('refinedLook' in result) {
       return (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-accent flex items-center"><Wand2 className="mr-2"/>Refined Makeup Look</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <h3 className="font-bold text-lg">New Recommended Routine:</h3>
                <p className="whitespace-pre-wrap">{result.refinedLook}</p>
            </div>
             <div className="space-y-2 mt-4">
                <h3 className="font-bold text-lg">Reasoning:</h3>
                <p className="text-muted-foreground italic">"{result.reasoning}"</p>
            </div>
          </CardContent>
        </Card>
       )
    }
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
              alt="Face preview"
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
        {isLoading ? "Analyzing..." : "Analyze My Face"}
      </Button>

      {result && (
        <div className="space-y-4">
          {renderResult()}
          <Card>
            <CardHeader>
                <CardTitle className="text-xl font-headline">Iterate on this Look</CardTitle>
                <CardDescription>Not quite right? Let's try something different.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => handleIterationClick('show another')} disabled={isLoading}><RefreshCw className="mr-2"/>Show Another</Button>
                <Button variant="secondary" onClick={() => handleIterationClick('simpler')} disabled={isLoading}><ThumbsDown className="mr-2"/>Make it Simpler</Button>
                <Button variant="secondary" onClick={() => handleIterationClick('different vibe')} disabled={isLoading}><Wand2 className="mr-2"/>Different Vibe</Button>
              </div>
              <div className="flex gap-2">
                <Textarea placeholder="Or type your own feedback, e.g., 'more dramatic eyes'" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                <Button onClick={() => handleIterationClick(feedback)} disabled={isLoading || !feedback}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
