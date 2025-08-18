
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { request } = require('undici');
const { v2: Translate } = require('@google-cloud/translate');

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '2mb' }));

const PORT = process.env.PORT || 5050;
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const translate = new Translate.Translate();

async function translateToEn(text) {
  if (!text) return '';
  try {
    const [translated] = await translate.translate(String(text), 'en');
    return translated;
  } catch (e) {
    console.error('translate error:', e.message);
    return String(text);
  }
}

async function searchUnsplash(q, count = 3) {
  if (!UNSPLASH_KEY) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${count}&orientation=landscape`;
  try {
    const { body } = await request(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
    const data = await body.json();
    const arr = Array.isArray(data.results) ? data.results.slice(0, count).map(x => x?.urls?.regular).filter(Boolean) : [];
    return arr;
  } catch (e) {
    console.error('unsplash error:', e.message);
    return [];
  }
}

function sec({ title, text, img }) {
  return `
  <section class="sec">
    <div class="wrap">
      <div class="txt">
        <h2>${title}</h2>
        <p>${text}</p>
      </div>
      <div class="pic">
        <img src="${img}" alt="${title}"/>
      </div>
    </div>
  </section>`;
}

function htmlShell({ brand, slides, sections, contact }) {
  const slidesHtml = slides.map((s, i) => `<div class="slide ${i===0?'active':''}"><img src="${s}" alt="slide ${i+1}"/></div>`).join('');
  const sectionsHtml = sections.join('\n');
  return `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${brand} – เว็บไซต์ตัวอย่าง</title>
<style>
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:0;color:#0f172a;line-height:1.6}
header{background:#0b3f2f;color:#fff;padding:24px 16px;text-align:center}
header h1{margin:0;font-size:28px}
.hero{position:relative;height:52vh;overflow:hidden}
.slide{position:absolute;inset:0;opacity:0;transition:opacity .8s ease}
.slide.active{opacity:1}
.slide img{width:100%;height:100%;object-fit:cover}
.sec{padding:56px 16px;background:#fff;border-top:1px solid #e5e7eb}
.sec:nth-child(even){background:#f7f7f7}
.wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.2fr .8fr;gap:28px;align-items:center}
.pic img{width:100%;border-radius:12px}
footer{padding:36px 16px;background:#0b3f2f;color:#fff;text-align:center}
.cta{display:inline-block;margin-top:10px;padding:10px 16px;background:#11895b;color:#fff;border-radius:6px;text-decoration:none}
@media(max-width:900px){.wrap{grid-template-columns:1fr} .hero{height:36vh}}
</style>
<script>
let i=0;window.addEventListener('load',()=>{
  const s=[...document.querySelectorAll('.slide')];
  if(s.length){setInterval(()=>{s[i].classList.remove('active');i=(i+1)%s.length;s[i].classList.add('active');},4000);}
});
</script>
</head>
<body>
<header>
  <h1>${brand}</h1>
  <div class="hero">${slidesHtml}</div>
</header>
${sectionsHtml}
<footer>
  <div>ติดต่อเรา • ${contact?.phone || ''} • ${contact?.line || ''} • ${contact?.email || ''}</div>
  <a class="cta" href="#">จอง/ติดต่อ</a>
</footer>
</body>
</html>`;
}

app.get('/', (_req,res) => res.send('✅ Generator ready on ' + PORT));

app.post('/generate-site', async (req, res) => {
  try {
    const {
      businessName = 'My Brand',
      vertical = 'restaurant',
      city = 'Bangkok',
      highlights = ['คุณภาพดี','บริการรวดเร็ว','ราคาเป็นมิตร'],
      contact = { phone:'', line:'', email:'' }
    } = req.body || {};

    const thaiBase = [businessName, city, ...highlights];
    const baseEN = (await Promise.all(thaiBase.map(t => translateToEn(t)))).filter(Boolean);

    const slideQ = `${baseEN[0] || 'brand'} ${baseEN[1] || ''}`.trim() || (await translateToEn(vertical));
    const slides = (await searchUnsplash(slideQ, 3));
    if (slides.length < 3) {
      const vQ = await translateToEn(vertical);
      const more = await searchUnsplash(vQ, 3 - slides.length);
      slides.push(...more);
    }

    const planMap = {
      restaurant: [
        { title: 'รสชาติต้นตำรับ', text: 'คัดสรรวัตถุดิบสดใหม่ ปรุงด้วยความใส่ใจทุกจาน', kw: 'thai food top view' },
        { title: 'เมนูยอดนิยม', text: 'ผัดไทย/ต้มยำ/แกงเขียวหวาน เสิร์ฟร้อนๆหอมกรุ่น', kw: 'pad thai' },
        { title: 'บรรยากาศร้าน', text: 'อบอุ่น เป็นกันเอง เหมาะทั้งครอบครัวและเพื่อน', kw: 'restaurant interior' }
      ],
      clinic: [
        { title: 'ทีมแพทย์เชี่ยวชาญ', text: 'อธิบายละเอียด ใส่ใจทุกเคส มาตรฐานปลอดภัย', kw: 'doctor with patient' },
        { title: 'เทคโนโลยีทันสมัย', text: 'อุปกรณ์สะอาด ทันสมัย มั่นใจได้ทุกขั้นตอน', kw: 'clean clinic' },
        { title: 'บริการเป็นกันเอง', text: 'นัดหมายสะดวก ให้คำปรึกษาฟรี', kw: 'reception clinic' }
      ],
      hotel: [
        { title: 'ห้องพักสบาย', text: 'เตียงนุ่ม สิ่งอำนวยความสะดวกครบครัน', kw: 'hotel room interior' },
        { title: 'ทำเลดีเยี่ยม', text: 'ใกล้แหล่งท่องเที่ยว/ขนส่ง เดินทางสะดวก', kw: 'city view' },
        { title: 'สิ่งอำนวยความสะดวก', text: 'สระว่ายน้ำ ฟิตเนส อาหารเช้าโฮมเมด', kw: 'hotel lobby' }
      ]
    };
    const plan = planMap[vertical] || [
      { title: 'เกี่ยวกับเรา', text: 'บริการด้วยใจ ใส่ใจทุกรายละเอียด', kw: await translateToEn(vertical) }
    ];

    const sections = [];
    for (const p of plan) {
      const en = await translateToEn(p.kw);
      const img = (await searchUnsplash(en||'brand', 1))[0] || slides[0];
      sections.push(sec({ title: p.title, text: p.text, img }));
    }

    const html = htmlShell({ brand: businessName, slides, sections, contact });
    return res.json({ ok:true, html });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, error: e.message || 'failed' });
  }
});

app.listen(PORT, () => console.log(`🚀 Backend on http://localhost:${PORT}`));
