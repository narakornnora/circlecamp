import { plan, selectTemplate, imageKeywords, buildPrompt, injectAfterHeader } from './engine.js';
import fs from 'fs';

const brief = {
  business_name: "Thai 76 Kitchen",
  vertical: "restaurant",
  tone: "friendly",
  promo: "มื้อกลางวันลด 10%",
  phone: "02-123-4567",
  line: "@thai76",
  email: "info@thai76.com",
  address: "สุขุมวิท กรุงเทพฯ"
};

const p = plan(brief);
console.log('PLAN:', p);
console.log('KEYWORDS:', imageKeywords(p.vertical));

const pro = buildPrompt(brief, p);
console.log('\nPROMPT HEAD (first 400 chars):\n', pro.slice(0,400), '...');

// Mock blocks
const blocks = `<section class="sec-hero"><!-- image: restaurant hero, thai food --><h1>เดโม</h1></section>`;
const theme = `<!doctype html><html><body><header>HEADER</header><main></main><footer>FOOTER</footer></body></html>`;

const out = injectAfterHeader(theme, blocks, '</header>');
fs.writeFileSync('out_demo.html', out, 'utf-8');
console.log('\nWrote out_demo.html');
