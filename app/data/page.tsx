"use client";

import { useState, useEffect, useCallback } from "react";

type Tab = "wac" | "log";

export default function DataPage() {
  const [tab, setTab] = useState<Tab>("wac");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [statusReqNo, setStatusReqNo] = useState("");
  const [statusVal, setStatusVal] = useState("success");
  const [statusMsg, setStatusMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const url = tab === "wac" ? "/api/wac/search" : "/api/wac-log/search";
    const filter = query ? { searchKeyword: query } : {};
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filter, pagination: { page, limit } }),
    });
    const json = await res.json();
    setData(json.data?.items ?? []);
    setTotal(json.data?.pagination?.totalItems ?? 0);
    setLoading(false);
  }, [tab, page, query]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function switchTab(t: Tab) {
    setTab(t);
    setPage(1);
    setSearch("");
    setQuery("");
    setStatusMsg(null);
  }

  function handleSearch() {
    setQuery(search);
    setPage(1);
  }

  async function handleStatusUpdate() {
    if (!statusReqNo.trim()) {
      setStatusMsg({ text: "Please enter Request No.", ok: false });
      return;
    }
    setStatusMsg({ text: "Updating...", ok: true });
    const res = await fetch("/api/wac-log/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestNo: statusReqNo.trim(), status: statusVal }),
    });
    const json = await res.json();
    setStatusMsg({ text: json.success ? `Updated to "${statusVal}"` : json.error, ok: json.success });
    if (json.success) {
      fetchData();
      setTimeout(() => setStatusMsg(null), 3000);
    }
  }

  const totalPages = Math.ceil(total / limit);
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <main style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", padding: "1.5rem", color: "#333" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <a href="/" style={{ color: "#6c63ff", textDecoration: "none", fontSize: "0.85rem" }}>Home</a>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, margin: 0 }}>Data Viewer</h1>
        <div style={{ marginLeft: "auto", display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {resetMsg && <span style={{ color: "#28a745", fontSize: "0.8rem" }}>{resetMsg}</span>}
          <button
            onClick={fetchData}
            style={{
              padding: "0.4rem 0.8rem", fontSize: "0.8rem",
              backgroundColor: "#6c63ff", color: "white", border: "none",
              borderRadius: "4px", cursor: "pointer",
            }}
          >
            Refresh
          </button>
          <button
            onClick={async () => {
              if (!confirm("Are you sure you want to reset?\nAll data will be restored to the initial mockup state.")) return;
              setResetMsg("Resetting...");
              const res = await fetch("/api/reset", { method: "POST" });
              const json = await res.json();
              setResetMsg(json.message);
              fetchData();
              setTimeout(() => setResetMsg(""), 3000);
            }}
            style={{
              padding: "0.4rem 0.8rem", fontSize: "0.8rem",
              backgroundColor: "#dc3545", color: "white", border: "none",
              borderRadius: "4px", cursor: "pointer",
            }}
          >
            Reset Data
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0", marginBottom: "0" }}>
        {(["wac", "log"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            style={{
              padding: "0.5rem 1.5rem", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer",
              border: "1px solid #ddd", borderBottom: tab === t ? "2px solid #6c63ff" : "1px solid #ddd",
              backgroundColor: tab === t ? "white" : "#f5f5f5",
              color: tab === t ? "#6c63ff" : "#666",
              borderRadius: "6px 6px 0 0",
            }}
          >
            {t === "wac" ? "WAC Items" : "WAC Log"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", alignSelf: "center", fontSize: "0.8rem", color: "#888" }}>
          {total} rows
        </span>
      </div>

      <div style={{
        display: "flex", flexDirection: "column", gap: "0.75rem", padding: "0.75rem 1rem",
        backgroundColor: "white", border: "1px solid #ddd", borderTop: "none",
        borderRadius: "0 0 6px 6px", marginBottom: "1rem",
      }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              flex: 1, padding: "0.5rem 0.75rem", fontSize: "0.85rem",
              border: "1px solid #ccc", borderRadius: "6px", outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "0.5rem 1rem", fontSize: "0.85rem", backgroundColor: "#6c63ff",
              color: "white", border: "none", borderRadius: "6px", cursor: "pointer",
            }}
          >
            Search
          </button>
          {query && (
            <button
              onClick={() => { setSearch(""); setQuery(""); setPage(1); }}
              style={{
                padding: "0.5rem 0.75rem", fontSize: "0.85rem", backgroundColor: "#999",
                color: "white", border: "none", borderRadius: "6px", cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>

        {tab === "log" && (
          <div style={{
            display: "flex", gap: "0.5rem", alignItems: "center",
            padding: "0.5rem 0.75rem", backgroundColor: "#f8f9fa",
            borderRadius: "6px", border: "1px solid #e9ecef",
          }}>
            <span style={{ fontSize: "0.8rem", color: "#666", fontWeight: 500 }}>Update Status:</span>
            <input
              type="text"
              placeholder="Request No."
              value={statusReqNo}
              onChange={(e) => setStatusReqNo(e.target.value)}
              style={{
                flex: 1, padding: "0.35rem 0.6rem", fontSize: "0.8rem",
                border: "1px solid #ccc", borderRadius: "4px", outline: "none",
              }}
            />
            <select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
              style={{
                padding: "0.35rem 0.6rem", fontSize: "0.8rem",
                border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "white",
              }}
            >
              <option value="success">success</option>
              <option value="pending">pending</option>
              <option value="failed">failed</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              style={{
                padding: "0.35rem 0.75rem", fontSize: "0.8rem", backgroundColor: "#007bff",
                color: "white", border: "none", borderRadius: "4px", cursor: "pointer",
              }}
            >
              Update
            </button>
            {statusMsg && (
              <span style={{ fontSize: "0.8rem", color: statusMsg.ok ? "#28a745" : "#dc3545" }}>
                {statusMsg.text}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ overflowX: "auto", border: "1px solid #ddd", borderRadius: "6px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "0.5rem 0.75rem", textAlign: "left", fontWeight: 600,
                    borderBottom: "2px solid #ddd", color: "#555", position: "sticky", top: 0,
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length || 1} style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length || 1} style={{ padding: "2rem", textAlign: "center", color: "#999" }}>
                  No data
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "white" : "#fafafa" }}>
                  {columns.map((col) => {
                    const val = row[col];
                    const isStatus = col === "status";
                    const statusColor =
                      val === "success" ? "#28a745" : val === "pending" ? "#ffc107" : val === "failed" ? "#dc3545" : undefined;
                    return (
                      <td
                        key={col}
                        style={{
                          padding: "0.4rem 0.75rem", borderBottom: "1px solid #eee",
                          fontFamily: typeof val === "number" ? "monospace" : "inherit",
                          color: isStatus ? statusColor : typeof val === "boolean" ? "#6c63ff" : "#333",
                          fontWeight: isStatus ? 600 : 400,
                        }}
                      >
                        {String(val ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            style={{
              padding: "0.3rem 0.75rem", fontSize: "0.85rem", border: "1px solid #ddd",
              borderRadius: "4px", cursor: page <= 1 ? "default" : "pointer",
              backgroundColor: page <= 1 ? "#f5f5f5" : "white", color: page <= 1 ? "#ccc" : "#333",
            }}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                padding: "0.3rem 0.6rem", fontSize: "0.85rem",
                border: p === page ? "1px solid #6c63ff" : "1px solid #ddd",
                borderRadius: "4px", cursor: "pointer",
                backgroundColor: p === page ? "#6c63ff" : "white",
                color: p === page ? "white" : "#333",
              }}
            >
              {p}
            </button>
          ))}
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            style={{
              padding: "0.3rem 0.75rem", fontSize: "0.85rem", border: "1px solid #ddd",
              borderRadius: "4px", cursor: page >= totalPages ? "default" : "pointer",
              backgroundColor: page >= totalPages ? "#f5f5f5" : "white",
              color: page >= totalPages ? "#ccc" : "#333",
            }}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
