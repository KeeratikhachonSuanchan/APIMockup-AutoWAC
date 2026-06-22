export default function Home() {
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>WAC Mockup API</h1>
      <p>
        <a href="/swagger" style={{ fontSize: "1.2rem" }}>
          Swagger UI
        </a>
      </p>
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
          แก้ไข VariableCost (body: Id, VariableCost)
        </li>
        <li>
          <strong>DELETE</strong> /api/wac?wacId=1
          <br />
          ลบข้อมูล WAC (query param: id)
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
      </ul>
    </main>
  );
}
