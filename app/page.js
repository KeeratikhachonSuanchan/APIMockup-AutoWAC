export default function Home() {
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>WAC Mockup API</h1>
      <p>
        <a href="/swagger" style={{ fontSize: "1.2rem" }}>Swagger UI</a>
      </p>
      <h2>Endpoints</h2>
      <ul>
        <li>
          <strong>GET</strong> /api/wac?SearchKey=&Page=1&Limit=10
          <br />ดึงข้อมูล Auto WAC
        </li>
        <li>
          <strong>POST</strong> /api/wac
          <br />เพิ่มข้อมูล WAC
        </li>
        <li>
          <strong>PATCH</strong> /api/wac/:id/variable-cost
          <br />แก้ไข VariableCost
        </li>
        <li>
          <strong>DELETE</strong> /api/wac/:id
          <br />ลบข้อมูล WAC
        </li>
        <li>
          <strong>GET</strong> /api/wac-log?SearchKey=&DateFrom=&DateTo=&ItemSearchKey=&Page=1&Limit=10
          <br />ดึงข้อมูล Transaction Log
        </li>
      </ul>
    </main>
  );
}
