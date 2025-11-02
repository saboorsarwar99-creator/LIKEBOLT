export async function POST(req) {
  try {
    // Log to confirm function runs
    console.log("✅ API route reached");

    // Log if the API key exists
    const apiKeyExists = !!process.env.OPENAI_API_KEY;
    console.log("🔑 OPENAI_API_KEY exists:", apiKeyExists);

    if (!apiKeyExists) {
      return new Response(
        JSON.stringify({
          error: "Missing OpenAI API Key on server",
        }),
        { status: 500 }
      );
    }

    // Read input from the request
    const { idea } = await req.json();
    console.log("💡 Website idea received:", idea);

    // Send request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Generate a complete responsive HTML and CSS website for this idea: "${idea}". Return only clean HTML.`,
          },
        ],
      }),
    });

    const raw = await response.text();
    console.log("📜 OpenAI raw response:", raw);

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "OpenAI request failed",
          status: response.status,
          details: raw,
        }),
        { status: 500 }
      );
    }

    const data = JSON.parse(raw);
    const html = data.choices?.[0]?.message?.content || "<h1>Error: No HTML returned</h1>";

    return new Response(JSON.stringify({ html }), { status: 200 });
  } catch (error) {
    console.error("💥 API route crashed:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
