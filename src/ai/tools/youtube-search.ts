'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const searchYoutube = ai.defineTool(
  {
    name: 'searchYoutube',
    description: 'Search for a youtube video.',
    inputSchema: z.object({
      query: z.string(),
    }),
    outputSchema: z.string(),
  },
  async input => {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(
        input.query
      )}&key=${process.env.YOUTUBE_API_KEY}`
    );
    const json = await res.json();
    const videoId = json.items[0].id.videoId;
    return `https://www.youtube.com/embed/${videoId}`;
  }
);
