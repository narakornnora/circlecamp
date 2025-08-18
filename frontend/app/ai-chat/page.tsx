"use client";
import { useRef, useState, useEffect } from "react";

type Msg = { id: string; role: "ai" | "user" | "sys"; text: string };
const uid = () => Math.random().toString(36).slice(2, 9);

export default function AIChatPage() {
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: uid(),
      role: "ai",
      text:
        "สวัสดีครับ 👋 บอกผม: ชื่อธุรกิจ / ประเภทเว็บ / กลุ่มลูกค้า / โปรโมชัน / ช่องทางติดต่อ แล้วกด “สร้างเว็บ” ได้เลย",
    },
  ]);

  const frameRef = useRef<HTMLIFrameElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const brief = useRef({
    business_name: "",
    vertical: "",
    audience: "",
    promo: "",
    phone: "",
    line: "",
    email: "",
    address: "",
  }).current;

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs]);

  const add = (role: Msg["role"], text: string) =>
    setMsgs((m) => [...m, { id: uid(), role, text }]);

  const parseThai = (t: string) => {
    let m: RegExpMatchArray | null;
    if ((m = t.match(/ชื่อ(ธุรกิจ|แบรนด์|ร้าน)?[:\- ]?([^\n,]+)/i))) brief.business_name = m[2] ? m[3].trim() : m[1].trim();
    if ((m = t.match(/ประเภท[:\- ]?([^\n,]+)/i))) brief.vertical = m[1].trim();
    if ((m = t.match(/กลุ่ม(ลูกค้า)?[:\- ]?([^\n,]+)/i))) brief.audience = (m[2] ? m[3] : m[1]).trim();
    if ((m = t.match(/โปร(โมชัน)?[:\- ]?([^\n,]+)/i))) brief.promo = (m[2] ? m[3] : m[1]).trim();
    if ((m = t.match(/โทร[:\- ]?([0-9 \-]+)/i))) brief.phone = m[1].trim();
    if ((m = t.match(/line[:\- ]?([^\n, ]+)/i))) brief.line = m[1].trim();
    if ((m = t.match(/(email|mail)[:\- ]?([^\n, ]+)/i))) brief.email = m[2].trim();
    if ((m = t.match(/ที่อยู่[:\- ]?([^\n]+)/i))) brief.address = m[1].trim();
  };

  const send = () => {
    if (!input.trim()) return;
    add("user", input.trim());
    parseThai(input.trim());
    setInput("");
    setTimeout(() => add("ai", "รับทราบ ✅ ถ้าพร้อมกด “สร้างเว็บ” ได้เลย"), 200);
  };

  const buildSite = async () => {
    try {
      setBusy(true);
      add("sys", "⏳ กำลังสร้างเว็บ…");
      const backend = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5050";
      const r = await fetch(`${backend}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief }),
      });
      const d = await r.json();
      if (d?.ok) {
        if (frameRef.current) frameRef.current.srcdoc = d.html;
        add("ai", "✨ พรีวิวถูกอัปเดตแล้ว (ดูด้านหลังกล่องแชท)");
      } else {
        add("ai", "⚠️ สร้างไม่สำเร็จ ลองใหม่อีกครั้งได้ครับ");
      }
    } catch {
      add("ai", "❌ เชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* พรีวิวเต็มจออยู่ “ชั้นหลังสุด” */}
      <iframe
        ref={frameRef}
        title="preview"
        src="/theme/index.html"
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          border: "0",
          background: "#fff",
          zIndex: 0,
        }}
      />

      {/* ชั้นกลาง: จัดให้อยู่กลางจอเป๊ะ */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        {open ? (
          /* กล่องแชท */
          <div
            style={{
              width: "min(760px, 94vw)",
              height: "76vh",
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #c7eadb",
              boxShadow: "0 22px 70px rgba(0,0,0,.18)",
              display: "flex",
              flexDirection: "column",
              pointerEvents: "auto",
            }}
          >
            {/* header */}
            <div
              style={{
                padding: "12px 16px",
                background: "linear-gradient(90deg,#047857,#059669)",
                color: "#ecfdf5",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "rgba(255,255,255,.15)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  🤖
                </div>
                <div style={{ lineHeight: 1.1 }}>
                  <div style={{ fontWeight: 700 }}>AI Builder</div>
                  <div style={{ fontSize: 12, opacity: 0.9 }}>คุยเพื่อสร้างเว็บ + พรีวิวสด</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {busy && <span style={{ fontSize: 12, opacity: 0.9 }}>กำลังสร้าง…</span>}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    borderRadius: 8,
                    padding: "4px 8px",
                    background: "rgba(255,255,255,.12)",
                    color: "#ecfdf5",
                    border: "none",
                    cursor: "pointer",
                  }}
                  title="ย่อ"
                >
                  –
                </button>
              </div>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              style={{ flex: 1, overflow: "auto", padding: 16, background: "#f8fafc" }}
            >
              {msgs.map((m) => (
                <div
                  key={m.id}
                  style={{
                    marginBottom: 12,
                    display: "flex",
                    justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "78%",
                      border: "1px solid #e5e7eb",
                      borderRadius: 16,
                      padding: "8px 12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
                      background: m.role === "user" ? "#047857" : "#fff",
                      color: m.role === "user" ? "#fff" : "#111827",
                      fontStyle: m.role === "sys" ? "italic" : "normal",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* input */}
            <div
              style={{
                padding: 12,
                borderTop: "1px solid #e5e7eb",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
                background: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label
                  style={{
                    cursor: "pointer",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "8px 12px",
                    fontSize: 14,
                    background: "#fff",
                  }}
                >
                  แนบไฟล์
                  <input
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setFileName(f?.name || null);
                      if (f) add("sys", `📎 แนบไฟล์: ${f.name}`);
                    }}
                  />
                </label>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="พิมพ์บรีฟ เช่น ชื่อร้าน ประเภท โปรโมชัน ช่องทางติดต่อ…"
                  style={{
                    flex: 1,
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "10px 12px",
                    outline: "none",
                  }}
                />

                <button
                  onClick={send}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  ส่ง
                </button>
                <button
                  onClick={buildSite}
                  disabled={busy}
                  style={{
                    borderRadius: 12,
                    padding: "10px 14px",
                    background: "#047857",
                    color: "#fff",
                    opacity: busy ? 0.6 : 1,
                    cursor: busy ? "not-allowed" : "pointer",
                    border: "none",
                  }}
                >
                  สร้างเว็บ
                </button>
              </div>
              {fileName && (
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>ไฟล์: {fileName}</div>
              )}
            </div>
          </div>
        ) : (
          /* minimized button */
          <button
            onClick={() => setOpen(true)}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              borderRadius: 999,
              boxShadow: "0 10px 24px rgba(0,0,0,.18)",
              padding: 12,
              background: "#047857",
              color: "#fff",
              pointerEvents: "auto",
              border: "none",
              cursor: "pointer",
            }}
            title="เปิดแชท"
          >
            💬
          </button>
        )}
      </div>
    </>
  );
}