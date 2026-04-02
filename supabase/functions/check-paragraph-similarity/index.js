import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

serve(async (req) => {
  const { text1, text2 } = await req.json();

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert at detecting plagiarism and semantic similarity between two paragraphs. Compare the following two texts and output a JSON with 'similarity_score' (0-100) and 'ai_generated_probability' (0-100).",
        },
        {
          role: "user",
          content: `Text 1: ${text1}\n\nText 2: ${text2}`,
        },
      ],
      response_format: { type: "json_object" },
    }),
  });

  const data = await response.json();
  const analysis = JSON.parse(data.choices[0].message.content);

  return new Response(JSON.stringify(analysis), {
    headers: { "Content-Type": "application/json" },
  });
});
