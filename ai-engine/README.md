# AI Engine (Prompts + Template/Image Mapping)

จุดประสงค์: แยก "สมอง" ออกจาก UI/Backend เพื่อให้อัปเดตได้ง่าย  
- รวม prompt หลัก, โครงสร้างข้อมูล (schema), ตัวเลือก template, และตัว mapping คีย์เวิร์ดรูป

## โครงสร้าง
```
/prompts/prompt_webgen.md         → Prompt หลัก (Thai-first, อังกฤษเสริม)
/prompts/prompt_sections.md       → Promptย่อย สร้าง Section ทีละบล็อก
/mappers/templateMap.json         → รายชื่อตัวเลือกเทมเพลต และตำแหน่ง inject
/mappers/imageKeywords.json       → map vertical → keyword รูปแบบต่าง ๆ
engine.js                         → ฟังก์ชันหลัก: plan, selectTemplate, buildPrompt, parse
test_run.js                       → ตัวอย่างการเรียกใช้งาน (node test_run.js)
```

## ใช้ยังไง
1) ปรับ prompt ในโฟลเดอร์ `prompts/` ให้เหมาะกับแบรนด์คุณ
2) ปรับ mapping ของรูปใน `mappers/imageKeywords.json`
3) ใน backend เรียกใช้ `engine.js` เพื่อสร้าง payload ส่งไปยังโมเดล (OpenAI/อื่น ๆ)

> แนะนำ: ให้ backend เรียก `engine.plan(brief)` → `engine.buildPrompt(plan)` → ส่งไป AI → แล้ว parse/assemble กับธีม
