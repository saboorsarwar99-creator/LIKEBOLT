"use client";
import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWebsite = async () => {
    setLoading(true);
    setHtml("");

    const res = await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idea }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.html) {
      setHtml(data.html);
    } else {
      setHtml("<h2>Something went wrong. Please try again.</h2>");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: "#111", color: "white" }}>
      <div style={{ width: "35%", padding: "20px" }}>
        <h2>AI Website Builder</h2>
        <p>Type your website idea below:</p>
        <textarea
          placeholder="Example: A modern landing page for an AI startup..."
          style={{ width: "100%", height: "200px", marginTop: "10px", padding: "10px" }}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />
        <button
          onClick={generateWebsite}
          style={{
            marginTop: "15px",
            padding: "10px",
            width: "100%",
            cursor: "pointer",
            background: "#4CAF50",
            color: "white",
            border: "none",
          }}
        >
          {loading ? "Generating..." : "Generate Website"}
        </button>
      </div>
      <div
        style={{
          flex: 1,
          background: "white",
          color: "black",
          padding: "20px",
          overflowY: "scroll",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}