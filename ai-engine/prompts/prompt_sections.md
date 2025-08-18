# Section Generator (Thai)
ให้สร้างเฉพาะ **1 section** ต่อคำสั่ง โดยคงรูปแบบ HTML ที่เข้ากับธีมทั่วไป:
- ต้องมีรูป (ระบุคีย์เวิร์ดไว้ในคอมเมนต์ `<!-- image: ... -->`)
- ต้องมีข้อความและ CTA สั้น ๆ
- หลีกเลี่ยงการใช้ CSS inline เยอะเกินไป

อินพุต (JSON):
```json
{ "vertical": "restaurant", "section": "menu", "tone": "friendly" }
```

ส่งออก (HTML snippet):
- ตัวอย่าง
```html
<section class="sec-menu">
  <!-- image: tom yum soup, pad thai, thai curry -->
  <div class="container">
    <h2>เมนูแนะนำ</h2>
    ...
  </div>
</section>
```
