export async function POST(req) {
  try {
    const { prompt } = await req.json();

    // Check if the API key exists
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ No OPENAI_API_KEY found in environment variables");
      return new Response(
        JSON.stringify({ error: "Server: No OpenAI API key found" }),
        { status: 500 }
      );
    }

    // Send request to OpenAI
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    // Log the response for debugging
    const raw = await r.text();
    console.error("📜 OpenAI status:", r.status);
    console.error("📜 OpenAI body:", raw);

    // Handle errors
    if (!r.ok) {
      return new Response(
        JSON.stringify({ error: "OpenAI request failed", details: raw }),
        { status: 500 }
      );
    }

    // Parse and send result
    const data = JSON.parse(raw);
    return new Response(
      JSON.stringify({ result: data.choices[0].message.content }),
      { status: 200 }
    );

  } catch (e) {
    console.error("💥 Server error:", e);
    return new Response(
      JSON.stringify({ error: "Server crashed", details: e.message }),
      { status: 500 }
    );
  }
}
