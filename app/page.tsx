"use client";

import { useState } from "react";

export default function Home() {
  const [resetMsg, setResetMsg] = useState("");
  const [requestNo, setRequestNo] = useState("");
  const [status, setStatus] = useState("success");
  const [statusMsg, setStatusMsg] = useState("");

  async function handleReset() {
    setResetMsg("Resetting...");
    const res = await fetch("/api/reset", { method: "POST" });
    const data = await res.json();
    setResetMsg(data.message);
    setTimeout(() => setResetMsg(""), 3000);
  }

  async function handleStatusUpdate() {
    if (!requestNo.trim()) {
      setStatusMsg("กรุณากรอก Request No.");
      return;
    }
    setStatusMsg("Updating...");
    const res = await fetch("/api/wac-log/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestNo: requestNo.trim(), status }),
    });
    const data = await res.json();
    setStatusMsg(data.success ? `${data.message} (${status})` : data.error);
    if (data.success) setTimeout(() => setStatusMsg(""), 3000);
  }

  const btnStyle = {
    padding: "0.5rem 1rem",
    fontSize: "1rem",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  };

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", maxWidth: "800px" }}>
      <h1>WAC Mockup API</h1>
      <p>
        <a href="/swagger" style={{ fontSize: "1.2rem" }}>Swagger UI</a>
      </p>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        <button onClick={handleReset} style={{ ...btnStyle, backgroundColor: "#dc3545" }}>
          Reset Mockup Data
        </button>
        {resetMsg && <span style={{ color: "#28a745", alignSelf: "center" }}>{resetMsg}</span>}
      </div>

      <h2>Update Log Status</h2>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Request No. (e.g. WAC_20260514000001)"
          value={requestNo}
          onChange={(e) => setRequestNo(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "0.9rem", width: "320px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "0.9rem", border: "1px solid #ccc", borderRadius: "4px" }}
        >
          <option value="success">success</option>
          <option value="pending">pending</option>
          <option value="failed">failed</option>
        </select>
        <button onClick={handleStatusUpdate} style={{ ...btnStyle, backgroundColor: "#007bff" }}>
          Update Status
        </button>
      </div>
      {statusMsg && (
        <p style={{ color: statusMsg.includes("successfully") ? "#28a745" : "#dc3545", margin: "0.5rem 0" }}>
          {statusMsg}
        </p>
      )}

      <h2>Endpoints</h2>
      <ul>
        <li>
          <strong>POST</strong> /api/wac/search
          <br />ดึงข้อมูล Auto WAC (body: filter + pagination)
        </li>
        <li>
          <strong>POST</strong> /api/wac
          <br />เพิ่มข้อมูล WAC
        </li>
        <li>
          <strong>PATCH</strong> /api/wac/variable-cost
          <br />แก้ไข VariableCost (body: id, variableCost)
        </li>
        <li>
          <strong>DELETE</strong> /api/wac?wacId=1
          <br />ลบข้อมูล WAC (query param: wacId)
        </li>
        <li>
          <strong>POST</strong> /api/wac-log/search
          <br />ดึงข้อมูล Transaction Log (body: filter + pagination)
        </li>
        <li>
          <strong>POST</strong> /api/wac-log/export
          <br />Export Transaction Log เป็น CSV (body: filter)
        </li>
        <li>
          <strong>PATCH</strong> /api/wac-log/status
          <br />อัปเดต Status ของ Log (body: requestNo, status)
        </li>
        <li>
          <strong>POST</strong> /api/reset
          <br />Reset ข้อมูลกลับเป็นค่าเริ่มต้น
        </li>
      </ul>
    </main>
  );
}
