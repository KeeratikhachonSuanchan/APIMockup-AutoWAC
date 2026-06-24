"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

interface LogEntry {
  id: number;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  duration: number;
  requestHeaders: Record<string, string>;
  requestBody: string | null;
  responseBody: string | null;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selected, setSelected] = useState<LogEntry | null>(null);
  const [detailTab, setDetailTab] = useState<"headers" | "request" | "response">("request");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchLogs = useCallback(async () => {
    const res = await fetch("/api/api-logs");
    const data = await res.json();
    setLogs(data);
  }, []);

  useEffect(() => {
    fetchLogs();
    if (!autoRefresh) return;
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, [fetchLogs, autoRefresh]);

  async function clearLogs() {
    await fetch("/api/api-logs", { method: "DELETE" });
    setLogs([]);
    setSelected(null);
  }

  const filtered = useMemo(() => {
    let result = logs;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.method.toLowerCase().includes(q) ||
          l.path.toLowerCase().includes(q) ||
          String(l.status).includes(q) ||
          l.timestamp.includes(q)
      );
    }
    if (dateFrom) {
      result = result.filter((l) => l.timestamp.slice(0, 10) >= dateFrom);
    }
    if (dateTo) {
      result = result.filter((l) => l.timestamp.slice(0, 10) <= dateTo);
    }
    return result;
  }, [logs, search, dateFrom, dateTo]);

  const methodColor: Record<string, string> = {
    POST: "#49cc90",
    PATCH: "#fca130",
    DELETE: "#f93e3e",
    GET: "#61affe",
  };

  const statusColor = (s: number) =>
    s < 300 ? "#49cc90" : s < 400 ? "#61affe" : s < 500 ? "#fca130" : "#f93e3e";

  function formatJson(str: string | null) {
    if (!str) return "—";
    try {
      return JSON.stringify(JSON.parse(str), null, 2);
    } catch {
      return str;
    }
  }

  const inputStyle = {
    padding: "0.35rem 0.6rem",
    fontSize: "0.8rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  };

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1.5rem", color: "#333", display: "flex", flexDirection: "column", height: "100vh", boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem", flexShrink: 0 }}>
        <a href="/" style={{ color: "#6c63ff", textDecoration: "none", fontSize: "0.85rem" }}>Home</a>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>API Logs</h1>
        <span style={{ fontSize: "0.8rem", color: "#888" }}>{filtered.length}/{logs.length} entries</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.8rem", color: "#666", display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
            Auto-refresh
          </label>
          <button onClick={fetchLogs} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", backgroundColor: "#6c63ff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Refresh
          </button>
          <button onClick={clearLogs} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Clear
          </button>
        </div>
      </div>

      <div style={{
        display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap",
        padding: "0.5rem 0.75rem", backgroundColor: "#f8f9fa", border: "1px solid #ddd",
        borderRadius: "6px", marginBottom: "0.75rem", flexShrink: 0,
      }}>
        <input
          type="text"
          placeholder="Search method, path, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: "180px" }}
        />
        <span style={{ fontSize: "0.8rem", color: "#666" }}>From</span>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} style={inputStyle} />
        <span style={{ fontSize: "0.8rem", color: "#666" }}>To</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} style={inputStyle} />
        {(search || dateFrom || dateTo) && (
          <button
            onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
            style={{ padding: "0.35rem 0.6rem", fontSize: "0.8rem", backgroundColor: "#999", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: "1rem", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: "auto", border: "1px solid #ddd", borderRadius: "6px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0", position: "sticky", top: 0 }}>
                <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: "#555" }}>Date</th>
                <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: "#555" }}>Time</th>
                <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: "#555" }}>Method</th>
                <th style={{ padding: "0.5rem", textAlign: "left", fontWeight: 600, color: "#555" }}>Path</th>
                <th style={{ padding: "0.5rem", textAlign: "center", fontWeight: 600, color: "#555" }}>Status</th>
                <th style={{ padding: "0.5rem", textAlign: "right", fontWeight: 600, color: "#555" }}>ms</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
                    {logs.length === 0 ? "No API calls logged yet" : "No results matching filter"}
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => { setSelected(log); setDetailTab("request"); }}
                    style={{
                      cursor: "pointer",
                      backgroundColor: selected?.id === log.id ? "#e8f4fd" : "white",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseEnter={(e) => { if (selected?.id !== log.id) e.currentTarget.style.backgroundColor = "#f5f5f5"; }}
                    onMouseLeave={(e) => { if (selected?.id !== log.id) e.currentTarget.style.backgroundColor = "white"; }}
                  >
                    <td style={{ padding: "0.4rem 0.5rem", whiteSpace: "nowrap", color: "#888", fontFamily: "monospace" }}>
                      {log.timestamp.slice(0, 10)}
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem", whiteSpace: "nowrap", color: "#555", fontFamily: "monospace" }}>
                      {log.timestamp.slice(11)}
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem" }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: "0.7rem", fontWeight: 700,
                        color: "white", backgroundColor: methodColor[log.method] ?? "#999",
                        padding: "0.1rem 0.4rem", borderRadius: "3px",
                      }}>
                        {log.method}
                      </span>
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem", fontFamily: "monospace", fontSize: "0.8rem" }}>
                      {log.path}
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem", textAlign: "center" }}>
                      <span style={{ fontFamily: "monospace", fontWeight: 600, color: statusColor(log.status) }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: "0.4rem 0.5rem", textAlign: "right", fontFamily: "monospace", color: "#888" }}>
                      {log.duration}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ width: "45%", minWidth: "300px", border: "1px solid #ddd", borderRadius: "6px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {selected ? (
            <>
              <div style={{ padding: "0.75rem", backgroundColor: "#f8f9fa", borderBottom: "1px solid #ddd" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{
                    fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 700,
                    color: "white", backgroundColor: methodColor[selected.method] ?? "#999",
                    padding: "0.15rem 0.5rem", borderRadius: "3px",
                  }}>
                    {selected.method}
                  </span>
                  <span style={{ fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 500 }}>{selected.path}</span>
                  <span style={{ marginLeft: "auto", fontFamily: "monospace", fontWeight: 600, color: statusColor(selected.status) }}>
                    {selected.status}
                  </span>
                </div>
                <div style={{ fontSize: "0.75rem", color: "#888" }}>
                  {selected.timestamp} | {selected.duration}ms
                </div>
              </div>
              <div style={{ display: "flex", borderBottom: "1px solid #ddd" }}>
                {(["headers", "request", "response"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setDetailTab(t)}
                    style={{
                      flex: 1, padding: "0.4rem", fontSize: "0.8rem", fontWeight: 500,
                      border: "none", cursor: "pointer",
                      backgroundColor: detailTab === t ? "white" : "#f5f5f5",
                      color: detailTab === t ? "#6c63ff" : "#666",
                      borderBottom: detailTab === t ? "2px solid #6c63ff" : "none",
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <pre style={{
                flex: 1, margin: 0, padding: "0.75rem", fontSize: "0.75rem",
                fontFamily: "monospace", overflowY: "auto", backgroundColor: "#1e1e1e",
                color: "#d4d4d4", whiteSpace: "pre-wrap", wordBreak: "break-all",
              }}>
                {detailTab === "headers"
                  ? JSON.stringify(selected.requestHeaders, null, 2)
                  : detailTab === "request"
                  ? formatJson(selected.requestBody)
                  : formatJson(selected.responseBody)}
              </pre>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: "0.9rem" }}>
              Select a log entry to view details
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
