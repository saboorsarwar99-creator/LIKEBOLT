import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt provided" }), { status: 400 });
    }

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: `Create a simple, styled HTML landing page for this idea: ${prompt}`,
    });

    const html = completion.output[0]?.content[0]?.text || "<h2>Error: No output received</h2>";

    return new Response(JSON.stringify({ html }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Failed to generate site." }), { status: 500 });
  }
}
