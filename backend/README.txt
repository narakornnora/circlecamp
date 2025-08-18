Circlecamp Backend Add-on (SAFE, Non-Destructive)
=================================================
ชุดนี้ "เพิ่ม" ความสามารถให้ backend เดิมของคุณ โดย **ไม่ต้องทับ server.js**
เพียงแค่ import และ mount routes ใหม่ 2 เส้นทางเท่านั้น

เพิ่มอะไรบ้าง
-------------
1) POST /api/generate
   - รับ { brief: { business_name, vertical, audience, promo, tone, phone, line, email, address } }
   - ถ้ามี OPENAI_API_KEY + UNSPLASH_ACCESS_KEY จะใช้ AI + Unsplash
   - ถ้าไม่มี จะ fallback เป็น HTML พร้อมสไลด์ตัวอย่างทันที (ไม่ล่ม ไม่ค้าง)

2) POST /api/chat/next
   - Q&A ทีละข้อ (ไม่มี DB) — ใช้ sessionId ใน payload
   - ถ้าไม่ส่ง sessionId จะเริ่ม session ใหม่และคืนคำถามแรก
   - ส่ง answer เข้ามา จะอัปเดตข้อมูล แล้วคืนคำถามถัดไป
   - เมื่อครบ/พร้อม กด "สร้างเว็บ" → เรียก /api/generate โดยส่ง { sessionId } ได้

ไฟล์ในแพ็ก
-----------
routes/generate.js
routes/chat.js
services/aiService.js
services/imageService.js
README.txt  (ไฟล์นี้)

วิธีติดตั้ง (ไม่ทับของเดิม)
---------------------------
1) คัดลอกโฟลเดอร์และไฟล์เหล่านี้ไปไว้ใน backend ของคุณ:
   C:\circlecamp\backend\routes\generate.js
   C:\circlecamp\backend\routes\chat.js
   C:\circlecamp\backend\services\aiService.js
   C:\circlecamp\backend\services\imageService.js

2) เปิด server.js ของ backend เดิม แล้ว "เพิ่ม 3 บรรทัด" นี้:
   // ===== เพิ่มบนหัวไฟล์ (ส่วน import) =====
   import generateRouter from './routes/generate.js';
   import chatRouter from './routes/chat.js';

   // ===== เพิ่มก่อน app.listen(...) =====
   app.use('/api/generate', generateRouter);
   app.use('/api/chat', chatRouter);

3) (แนะนำ) เปิด CORS ถ้ายังไม่ได้เปิด
   import cors from 'cors';
   app.use(cors({ origin: 'http://localhost:3000', methods: ['GET','POST','OPTIONS'] }));

4) ตั้งค่า .env (ถ้ามีคีย์)
   OPENAI_API_KEY=xxx
   UNSPLASH_ACCESS_KEY=xxx

5) รีสตาร์ท backend:
   npm run dev

ทดสอบเร็ว
----------
curl -X POST http://localhost:5050/api/generate \
  -H "Content-Type: application/json" \
  -d "{\"brief\":{\"business_name\":\"Thai 76 Kitchen\",\"vertical\":\"restaurant\"}}"

หรือเริ่ม Q&A:
curl -X POST http://localhost:5050/api/chat/next -H "Content-Type: application/json" -d "{}"
(จะได้ {sessionId, nextQuestion})
แล้วส่งคำตอบต่อไปเรื่อยๆ พร้อม sessionId เดิม
