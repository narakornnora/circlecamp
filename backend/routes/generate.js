import { Router } from 'express';
import { planSections, writeSectionHTML, translateKeywordsToEN } from '../services/aiService.js';
import { searchUnsplash } from '../services/imageService.js';

// Try to collect brief from session-like (optional), or direct brief body
function normalizeBrief(body={}){
  const b = body.brief || body || {};
  return {
    business_name: b.business_name || b.businessName || 'เว็บไซต์ของคุณ',
    vertical: b.vertical || 'business',
    audience: b.audience || '',
    promo: b.promo || '',
    tone: b.tone || 'เป็นกันเอง มืออาชีพ',
    phone: b.phone || (b.contact?.phone||''),
    line: b.line || (b.contact?.line||''),
    email: b.email || (b.contact?.email||''),
    address: b.address || (b.contact?.address||'')
  };
}

function briefToText(b){
  const s=(v)=> (typeof v==='string'?v.trim():'');
  return [
    `ชื่อธุรกิจ: ${s(b.business_name)}`,
    `ประเภทธุรกิจ: ${s(b.vertical)}`,
    `กลุ่มลูกค้า: ${s(b.audience)}`,
    `จุดเด่น/โปรโมชัน: ${s(b.promo)}`,
    `โทนภาษา: ${s(b.tone)}`,
    `ติดต่อ: ${s(b.phone)||'-'} ${s(b.line)||''} ${s(b.email)||''}`,
    `ที่อยู่: ${s(b.address)||''}`
  ].filter(Boolean).join('\n');
}

function staticHTML(briefText) {
  const slides = ['modern business','creative team','minimal banner'].map((k,i)=>`
    <div class="slide ${i===0?'active':''}"><img src="https://source.unsplash.com/1600x900/?${encodeURIComponent(k)}" alt="${k}"/></div>
  `).join('');
  return `<!doctype html><html lang="th"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Preview</title>
<style>
:root{--ink:#0f172a;--brand:#0b3f2f;--accent:#11895b}
*{box-sizing:border-box}body{margin:0;color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
header{background:var(--brand);color:#fff;padding:20px 16px;text-align:center}
.hero{position:relative;height:50vh;overflow:hidden}
.slide{position:absolute;inset:0;opacity:0;transition:opacity .8s}
.slide.active{opacity:1}.slide img{width:100%;height:100%;object-fit:cover}
main{max-width:1100px;margin:24px auto;padding:0 16px}
section{padding:24px 0;border-top:1px solid #eee}
.cta{display:inline-block;margin-top:10px;padding:10px 16px;background:var(--accent);color:#fff;border-radius:8px;text-decoration:none}
pre{white-space:pre-wrap;background:#f6f6f6;padding:12px;border-radius:8px}
</style>
<script>
let i=0;window.addEventListener('load',()=>{const s=[...document.querySelectorAll('.slide')];
if(s.length){setInterval(()=>{s[i].classList.remove('active');i=(i+1)%s.length;s[i].classList.add('active');},4000);}});
</script>
</head><body>
<header><h1>ตัวอย่างพรีวิว</h1><div class="hero">${slides}</div></header>
<main>
  <section><h2>สรุปบรีฟ</h2><pre>${briefText}</pre><a class="cta" href="#">ติดต่อเรา</a></section>
  <section><h2>เนื้อหาตัวอย่าง</h2><p>นี่คือโครงพรีวิวเบื้องต้นจากบรีฟของคุณ ถ้าต้องการให้ AI คิด section/คอนเทนต์/ภาพแบบเต็ม ให้ตั้งค่า OPENAI_API_KEY และ UNSPLASH_ACCESS_KEY แล้วเรียกใหม่</p></section>
</main>
</body></html>`;
}

export const router = Router();

router.post('/', async (req,res)=>{
  try{
    const brief = normalizeBrief(req.body||{});
    const briefText = briefToText(brief);

    // Try full AI pipeline first
    let html = null;
    try {
      const plan = await planSections(briefText, brief.vertical);
      const blocks = await writeSectionHTML(briefText, plan, 'th');

      // collect keywords from HTML comments
      const kwBySection = {};
      for (const b of blocks) {
        const matches = [...(b.html?.matchAll(/<!--\s*image:\s*([^>]+)\s*-->/gi) || [])];
        const kws = matches.map(m => m[1].trim()).filter(Boolean);
        if (kws.length) kwBySection[b.section] = kws;
      }
      // translate + fetch images
      const images = {};
      for (const sec in kwBySection) {
        const en = await translateKeywordsToEN(kwBySection[sec], 'th');
        images[sec] = await searchUnsplash(en, 4);
      }

      // assemble simple HTML (header + sections)
      const slides = (images.hero?.length ? images.hero : []).slice(0,3).map((im,i)=>`
        <div class="slide ${i===0?'active':''}"><img src="${im.url}" alt="${im.credit||'image'}"/></div>
      `).join('');

      const sectionsHTML = blocks.map(b => b.html).join('\n');

      html = `<!doctype html><html lang="th"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${brief.business_name}</title>
<style>
:root{--ink:#0f172a;--brand:#0b3f2f;--accent:#11895b}
*{box-sizing:border-box}body{margin:0;color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
header{background:var(--brand);color:#fff;padding:20px 16px;text-align:center}
.hero{position:relative;height:56vh;overflow:hidden}
.slide{position:absolute;inset:0;opacity:0;transition:opacity .8s}
.slide.active{opacity:1}.slide img{width:100%;height:100%;object-fit:cover}
main{max-width:1100px;margin:24px auto;padding:0 16px}
section{padding:24px 0;border-top:1px solid #eee}
</style>
<script>
let i=0;window.addEventListener('load',()=>{const s=[...document.querySelectorAll('.slide')];
if(s.length){setInterval(()=>{s[i].classList.remove('active');i=(i+1)%s.length;s[i].classList.add('active');},4000);}});
</script>
</head><body>
<header><h1>${brief.business_name}</h1><div class="hero">${slides}</div></header>
<main>${sectionsHTML}</main>
</body></html>`;
    } catch(e) {
      html = null;
    }

    // Fallback (no keys or any error)
    if (!html) html = staticHTML(briefText);

    return res.json({ ok:true, html });
  } catch(e){
    return res.status(500).json({ ok:false, error: e.message || 'failed' });
  }
});
