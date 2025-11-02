export async function POST(req) {
  try {
    const { idea } = await req.json();

    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ No OpenAI API key found in environment variables");
      return new Response(
        JSON.stringify({ error: "Server: Missing API key" }),
        { status: 500 }
      );
    }

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
            content: `Generate a simple HTML and CSS website for this idea: ${idea}. Return only clean HTML.`,
          },
        ],
      }),
    });

    const raw = await response.text();
    console.log("📜 OpenAI status:", response.status);
    console.log("📜 OpenAI body:", raw);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: "OpenAI request failed", details: raw }),
        { status: 500 }
      );
    }

    const data = JSON.parse(raw);

    return new Response(
      JSON.stringify({ html: data.choices[0].message.content }),
      { status: 200 }
    );

  } catch (error) {
    console.error("💥 Server error:", error);
    return new Response(
      JSON.stringify({ error: "Server crashed", details: error.message }),
      { status: 500 }
    );
  }
}
