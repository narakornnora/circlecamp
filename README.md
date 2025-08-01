# CircleCamp - AI Website Builder

## แนวคิด
CircleCamp คือระบบสร้างเว็บไซต์ด้วย AI ที่ฉลาดและตอบโจทย์คนอยากมีเว็บแบบมืออาชีพ  
- เน้นให้ผู้ใช้ “คุยกับ AI” (ไม่ต้องเลือกธีมเอง)  
- AI สอบถามความต้องการ, สร้างเว็บ, สร้างภาพและเนื้อหาให้ตรงใจ  
- สร้าง header, section, logo, ภาพ และเนื้อหาโดยใช้ AI
- มีระบบ local asset ให้ AI ใช้ข้อมูลภายในก่อนออก API ภายนอก  
- AI เรียนรู้จากการใช้งานจริงของลูกค้า เพื่อแนะนำและสร้างเว็บได้ดีขึ้นเรื่อย ๆ  
- มีระบบ preview และ feedback ก่อนเข้า editor  
- Editor แบบ WYSIWYG ที่ใช้งานง่าย พร้อม AI คอยช่วยเหลือ  
- ทดลองใช้งานฟรี 15 วัน ก่อนสมัครสมาชิก

## ฟีเจอร์เด่น
- Chatbot แบบมืออาชีพที่สอบถามและเข้าใจความต้องการผู้ใช้
- สร้างเว็บไซต์อัตโนมัติพร้อมรูปและเนื้อหาที่ตรงประเภทเว็บ
- ระบบ asset manager สำหรับภาพ/เนื้อหา/theme ใน local ก่อนเรียก API
- AI สร้างภาพประกอบสวยงาม (header, section, logo, สโลแกน ฯลฯ)
- ระบบ preview, feedback และปรับเปลี่ยนตามความต้องการ
- WYSIWYG Editor ที่แก้ไขง่าย พร้อม AI เป็นพี่เลี้ยง
- รองรับการเปลี่ยนเว็บเก่าให้ทันสมัยและสวยกว่าเดิม
- Subscription ทดลองฟรี 15 วัน จากนั้น 199 บาท/เดือน
- สมัครสมาชิกด้วยเบอร์โทรและอีเมลแบบง่ายสุด

## โครงสร้างโปรเจกต์เบื้องต้น
```
circlecamp/
├── README.md
├── .gitignore
├── package.json / requirements.txt
├── src/
│   ├── server/          # local server, asset manager
│   ├── ai/              # chatbot, image gen, logic
│   ├── assets/          # local resource: images, themes, content templates
│   ├── web/             # frontend: chat UI, preview, editor WYSIWYG
│   └── utils/           # helper functions, translation, keyword extraction
├── docs/
│   └── system-design.md # flow การทำงาน, business logic
```

## วิธีเริ่มต้น
1. Clone repo นี้
2. ติดตั้ง dependencies
3. รัน server (local) และ frontend

## Roadmap (สำหรับพัฒนา)
- [ ] ระบบ Chatbot + UI
- [ ] Wizard สอบถามความต้องการ
- [ ] Logic สร้างเว็บจาก keyword
- [ ] ระบบดึงภาพ/เนื้อหาจาก local asset ก่อนเรียก API
- [ ] ระบบสร้าง header/logo/section อัตโนมัติ
- [ ] ระบบ preview และ feedback
- [ ] WYSIWYG editor
- [ ] ระบบสมาชิกและ subscription

## ติดต่อ
สร้างโดย narakornnora