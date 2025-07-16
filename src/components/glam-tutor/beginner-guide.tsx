"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const beginnerRoutines = [
  {
    title: "The 5-Minute 'Everyday Natural' Look",
    description: "Perfect for work, school, or a casual day out. This look enhances your natural features without looking heavy.",
    steps: [
      {
        title: "Step 1: Prep Your Skin",
        content: "Start with a clean, moisturized face. Apply a pea-sized amount of primer to create a smooth canvas.",
        videoUrl: "https://www.youtube.com/embed/fPrt_oW_m1Y",
        terms: [{ term: "Primer", definition: "A base for foundation that allows it to go on smoother and last longer." }],
      },
      {
        title: "Step 2: Even Out Your Skin Tone",
        content: "Use a lightweight BB cream or tinted moisturizer. Apply with your fingers or a sponge, blending from the center of your face outwards.",
        videoUrl: "https://www.youtube.com/embed/zR3r_3jY9ms",
        terms: [{ term: "BB Cream", definition: "A multitasking product that combines moisturizer, primer, SPF, and light coverage." }],
      },
      {
        title: "Step 3: Conceal Blemishes",
        content: "Dab a small amount of concealer on any blemishes or under-eye circles. Gently tap to blend, don't rub.",
        videoUrl: "https://www.youtube.com/embed/dK_2s3Hk22c",
        terms: [],
      },
      {
        title: "Step 4: Add a Touch of Color",
        content: "Smile and apply a cream blush to the apples of your cheeks. Blend upwards towards your temples.",
        videoUrl: "https://www.youtube.com/embed/Dwu2Pq6d2hY",
        terms: [{ term: "Cream Blush", definition: "A blush with a creamy texture, great for a natural, dewy finish." }],
      },
      {
        title: "Step 5: Define Your Eyes",
        content: "Curl your lashes and apply one coat of mascara. Wiggle the wand at the base of your lashes and pull through to the tips.",
        videoUrl: "https://www.youtube.com/embed/rNp6j9p4AnA",
        terms: [],
      },
    ],
  },
    {
    title: "Simple Evening 'Soft Glam' Look",
    description: "A simple yet elegant look for a dinner or special occasion. It focuses on a soft smokey eye and a nude lip.",
    steps: [
      {
        title: "Step 1: Foundation & Concealer",
        content: "Apply a medium-coverage foundation for a flawless base. Use concealer under the eyes and on any spots, blending well.",
        videoUrl: "https://www.youtube.com/embed/7m_t_Pu59n4",
        terms: [],
      },
      {
        title: "Step 2: Soft Smokey Eye",
        content: "Apply a neutral brown eyeshadow all over the lid. Use a slightly darker shade in the crease and blend well. Add a touch of shimmer to the center of the lid.",
        videoUrl: "https://www.youtube.com/embed/rN8e_p04pso",
        terms: [{ term: "Crease", definition: "The indentation of your eyelid, just above your eyeball." }],
      },
      {
        title: "Step 3: Eyeliner & Mascara",
        content: "Use a brown or black pencil eyeliner along the top lash line and smudge it slightly for a softer look. Apply two coats of mascara.",
        videoUrl: "https://www.youtube.com/embed/4I-DWQf-6fA",
        terms: [],
      },
      {
        title: "Step 4: Brows & Cheeks",
        content: "Fill in your eyebrows lightly with a brow pencil or powder. Apply a warm-toned blush and a touch of highlighter on the cheekbones.",
        videoUrl: "https://www.youtube.com/embed/PWo1b2P2iMk",
        terms: [{ term: "Highlighter", definition: "A product used to attract light, creating the illusion of brightness and height." }],
      },
      {
        title: "Step 5: Nude Lip",
        content: "Line your lips with a nude lip liner and fill them in with a matching satin or matte lipstick.",
        videoUrl: "https://www.youtube.com/embed/8F48u_mYn5g",
        terms: [],
      },
    ],
  },
];

export function BeginnerGuide() {
  return (
    <TooltipProvider>
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {beginnerRoutines.map((routine, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left font-headline text-xl hover:no-underline">
              {routine.title}
            </AccordionTrigger>
            <AccordionContent>
              <p className="mb-4 text-muted-foreground">{routine.description}</p>
              <div className="space-y-4">
                {routine.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="md:grid md:grid-cols-2 md:gap-6 p-4 rounded-lg border bg-card">
                    <div className="prose prose-sm max-w-none">
                      <h4 className="font-bold mb-2 flex items-center">{step.title}
                        {step.terms.map((term, termIndex) => (
                          <Tooltip key={termIndex} delayDuration={100}>
                            <TooltipTrigger asChild>
                              <span className="ml-2 cursor-help"><Info size={14} /></span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p><strong>{term.term}:</strong> {term.definition}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </h4>
                      <p>{step.content}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                       <div className="aspect-video w-full">
                         <iframe
                           className="w-full h-full rounded-md"
                           src={step.videoUrl}
                           title={`YouTube video for ${step.title}`}
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                           allowFullScreen
                         ></iframe>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TooltipProvider>
  );
}
