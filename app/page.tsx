"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  async function handleCopy() {
    await navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const endpoints = [
    { method: "POST", path: "/api/wac/search", desc: "Search Auto WAC", body: "filter + pagination" },
    { method: "POST", path: "/api/wac", desc: "Add WAC item", body: "rawCode, rawName, dcCuttingCode, dcName, supplierCode, supplierName" },
    { method: "PATCH", path: "/api/wac/variable-cost", desc: "Update VariableCost", body: "id, variableCost" },
    { method: "DELETE", path: "/api/wac?wacId=1", desc: "Delete WAC item", body: "query: wacId" },
    { method: "POST", path: "/api/wac-log/search", desc: "Search Transaction Log", body: "filter + pagination" },
    { method: "POST", path: "/api/wac-log/export", desc: "Export Log as CSV", body: "filter" },
    { method: "PATCH", path: "/api/wac-log/status", desc: "Update Log Status", body: "requestNo, status" },
    { method: "POST", path: "/api/reset", desc: "Reset all data", body: "none" },
  ];

  const methodColor: Record<string, string> = {
    POST: "#49cc90",
    PATCH: "#fca130",
    DELETE: "#f93e3e",
  };

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "2rem", maxWidth: "900px", margin: "0 auto", color: "#333" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0 }}>WAC Mockup API</h1>
        <p style={{ color: "#666", margin: "0.25rem 0 0" }}>Weighted Average Cost - Mock Server</p>
      </div>

      {baseUrl && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.6rem 1rem", backgroundColor: "#e8f4fd", border: "1px solid #bee5eb",
          borderRadius: "6px", marginBottom: "1.5rem", fontSize: "0.9rem",
        }}>
          <span style={{ color: "#666" }}>Base URL:</span>
          <code style={{ fontFamily: "monospace", fontWeight: 600, color: "#0c5460" }}>{baseUrl}</code>
          <button
            onClick={handleCopy}
            style={{
              marginLeft: "auto", padding: "0.3rem 0.75rem", fontSize: "0.8rem",
              backgroundColor: copied ? "#28a745" : "#0c5460", color: "white",
              border: "none", borderRadius: "4px", cursor: "pointer",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <a
          href="/swagger"
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "0.6rem 1.2rem", backgroundColor: "#6c63ff", color: "white",
            borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
          }}
        >
          Swagger UI
        </a>
        <a
          href="/data"
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "0.6rem 1.2rem", backgroundColor: "#17a2b8", color: "white",
            borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
          }}
        >
          Data Viewer
        </a>
        <a
          href="/logs"
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "0.6rem 1.2rem", backgroundColor: "#fd7e14", color: "white",
            borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500,
          }}
        >
          API Logs
        </a>
      </div>

      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem", color: "#444" }}>
        API Endpoints
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {endpoints.map((ep) => (
          <div
            key={ep.path + ep.method}
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.6rem 1rem", backgroundColor: "white",
              border: "1px solid #e0e0e0", borderRadius: "6px",
              borderLeft: `4px solid ${methodColor[ep.method] ?? "#999"}`,
            }}
          >
            <span style={{
              fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700,
              color: "white", backgroundColor: methodColor[ep.method] ?? "#999",
              padding: "0.15rem 0.5rem", borderRadius: "4px", minWidth: "55px", textAlign: "center",
            }}>
              {ep.method}
            </span>
            <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "#333", fontWeight: 500 }}>
              {ep.path}
            </span>
            <span style={{ color: "#888", fontSize: "0.8rem", marginLeft: "auto" }}>
              {ep.desc}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
