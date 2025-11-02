"use client";
import { useState } from "react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);

  const generateWebsite = async () => {
    setLoading(true);
    setHtml("");

    try {
      const res = await fetch("/api/route", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: idea }),
      });

      console.log("Response status:", res.status);
      const text = await res.text();
      console.log("Raw response text:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        setHtml("<h2>Something went wrong while generating your site.</h2>");
        setLoading(false);
        return;
      }

      if (data.html) {
        setHtml(data.html);
      } else {
        setHtml("<h2>Something went wrong. Please try again.</h2>");
      }
    } catch (error) {
      console.error("Error while fetching:", error);
      setHtml("<h2>Something went wrong. Please try again.</h2>");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#111",
        color: "white",
      }}
    >
      <div style={{ width: "35%", padding: "20px" }}>
        <h2>AI Website Builder</h2>
        <p>Type your website idea below:</p>
        <textarea
          placeholder="Example: A modern landing page for an AI startup..."
          style={{
            width: "100%",
            height: "200px",
            marginTop: "10px",
            padding: "10px",
          }}
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
