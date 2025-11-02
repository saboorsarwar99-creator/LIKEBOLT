import OpenAI from "openai";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    const key = process.env.OPENAI_API_KEY;
    console.log("DEBUG: OPENAI_API_KEY starts with:", key ? key.substring(0, 8) : "MISSING");

    if (!key) {
      return new Response(
        JSON.stringify({ error: "API key missing on server" }),
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey: key });

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
