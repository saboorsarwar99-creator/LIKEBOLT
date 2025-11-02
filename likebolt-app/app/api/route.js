import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    console.log("DEBUG: API key loaded?", !!process.env.OPENAI_API_KEY);

    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Missing OpenAI API key on server" }),
        { status: 500 }
      );
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const html = completion.choices[0]?.message?.content || "<p>Something went wrong.</p>";
    return new Response(html, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
