"use client";

import { useState } from "react";

export default function Home() {
  const [resetStatus, setResetStatus] = useState("");

  async function handleReset() {
    setResetStatus("Resetting...");
    const res = await fetch("/api/reset", { method: "POST" });
    const data = await res.json();
    setResetStatus(data.message);
    setTimeout(() => setResetStatus(""), 3000);
  }

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>WAC Mockup API</h1>
      <p>
        <a href="/swagger" style={{ fontSize: "1.2rem" }}>
          Swagger UI
        </a>
      </p>

      <button
        onClick={handleReset}
        style={{
          padding: "0.6rem 1.2rem",
          fontSize: "1rem",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Reset Mockup Data
      </button>
      {resetStatus && (
        <span style={{ marginLeft: "1rem", color: "#28a745" }}>
          {resetStatus}
        </span>
      )}

      <h2>Endpoints</h2>
      <ul>
        <li>
          <strong>POST</strong> /api/wac/search
          <br />
          ดึงข้อมูล Auto WAC (body: filter + pagination)
        </li>
        <li>
          <strong>POST</strong> /api/wac
          <br />
          เพิ่มข้อมูล WAC
        </li>
        <li>
          <strong>PATCH</strong> /api/wac/variable-cost
          <br />
          แก้ไข VariableCost (body: id, variableCost)
        </li>
        <li>
          <strong>DELETE</strong> /api/wac?wacId=1
          <br />
          ลบข้อมูล WAC (query param: wacId)
        </li>
        <li>
          <strong>POST</strong> /api/wac-log/search
          <br />
          ดึงข้อมูล Transaction Log (body: filter + pagination)
        </li>
        <li>
          <strong>POST</strong> /api/wac-log/export
          <br />
          Export Transaction Log เป็น Excel (body: filter)
        </li>
        <li>
          <strong>POST</strong> /api/reset
          <br />
          Reset ข้อมูลกลับเป็นค่าเริ่มต้น
        </li>
      </ul>
    </main>
  );
}
