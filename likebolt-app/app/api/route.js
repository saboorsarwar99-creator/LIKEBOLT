import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response("Prompt is missing", { status: 400 });
    }

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const html = response.choices[0]?.message?.content || "<p>Something went wrong.</p>";

    return new Response(JSON.stringify({ html }), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response("Error: " + error.message, { status: 500 });
  }
}
