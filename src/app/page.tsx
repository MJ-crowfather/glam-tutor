import { Header } from '@/components/glam-tutor/header';
import { FaceAnalysis } from '@/components/glam-tutor/face-analysis';
import { ProductRecognition } from '@/components/glam-tutor/product-recognition';
import { BeginnerGuide } from '@/components/glam-tutor/beginner-guide';
import { ChatAssistant } from '@/components/glam-tutor/chat-assistant';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScanFace, PackageSearch, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Tabs defaultValue="face-analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-6 bg-primary/[0.08] rounded-lg p-1 h-auto">
            <TabsTrigger value="face-analysis" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex-wrap justify-center"><ScanFace className="mr-2" /> AI Makeup Analysis</TabsTrigger>
            <TabsTrigger value="product-recognition" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex-wrap justify-center"><PackageSearch className="mr-2" /> AI Product Recognition</TabsTrigger>
            <TabsTrigger value="beginner-guide" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md flex-wrap justify-center"><GraduationCap className="mr-2" /> Beginner's Guide</TabsTrigger>
          </TabsList>
          <TabsContent value="face-analysis">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">AI Makeup Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Upload a clear, front-facing photo of yourself to get a personalized makeup routine. Our AI will analyze your unique features to provide tailored recommendations.</p>
                <FaceAnalysis />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="product-recognition">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">AI Product Recognition</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">Have a makeup product you're curious about? Upload a photo to identify its brand, name, and usage. Get reviews, alternatives, and more.</p>
                <ProductRecognition />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="beginner-guide">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-3xl text-primary">Beginner's Guide</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-muted-foreground mb-6">New to makeup? Explore our curated beginner-friendly routines. Each guide includes simple steps, product suggestions, and video tutorials to help you get started.</p>
                <BeginnerGuide />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <ChatAssistant />
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Your privacy is our priority. All analyses are performed in-session and are not stored.</p>
      </footer>
    </div>
  );
}
