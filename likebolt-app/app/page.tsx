const generateWebsite = async () => {
  setLoading(true);
  setHtml("");

  try {
    console.log("🟡 Sending request to /api/route with prompt:", idea);

    const res = await fetch("/api/route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: idea }),
    });

    console.log("🟡 Response status:", res.status);

    const text = await res.text();
    console.log("🟢 Raw response text:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON parse error:", e);
      setHtml("<h2>Server returned invalid JSON.</h2>");
      setLoading(false);
      return;
    }

    setLoading(false);

    if (data.result) {
      setHtml(`<div style="padding:20px;"><h2>Generated Result:</h2><p>${data.result}</p></div>`);
    } else if (data.error) {
      setHtml(`<h2>Error: ${data.error}</h2>`);
    } else {
      setHtml("<h2>Something went wrong. Please try again.</h2>");
    }
  } catch (error) {
    console.error("💥 Frontend error:", error);
    setHtml("<h2>Server error. Please try again later.</h2>");
    setLoading(false);
  }
};
