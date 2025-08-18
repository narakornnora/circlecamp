import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function plan(brief){
  const t = (brief?.vertical || '').toLowerCase();
  const vertical =
    /restaurant|อาหาร|คาเฟ่|cafe|ร้าน/.test(t) ? 'restaurant' :
    /clinic|คลินิก|ทันต|hospital/.test(t) ? 'clinic' :
    /hotel|รีสอร์ท|โรงแรม/.test(t) ? 'hotel' :
    /e-?commerce|shop|store|ขาย|สินค้า/.test(t) ? 'ecommerce' :
    /salon|สปา|ทำผม|ทำเล็บ/.test(t) ? 'salon' :
    /real ?estate|อสังหา|บ้าน|คอนโด/.test(t) ? 'realestate' :
    /school|academy|เรียน|สถาบัน|ติว/.test(t) ? 'education' :
    'generic';
  const sequences = {
    restaurant:['hero','highlights','menu','testimonial','contact'],
    clinic:['hero','services','gallery','testimonial','booking'],
    hotel:['hero','rooms','highlights','testimonial','booking'],
    ecommerce:['hero','products','highlights','testimonial','contact'],
    salon:['hero','services','gallery','testimonial','booking'],
    realestate:['hero','listings','highlights','testimonial','contact'],
    education:['hero','services','testimonial','faq','contact'],
    generic:['hero','features','gallery','testimonial','contact']
  };
  return { vertical, sequence: sequences[vertical] };
}

export function selectTemplate(name='default'){
  const map = JSON.parse(fs.readFileSync(path.join(__dirname,'mappers','templateMap.json'),'utf-8'));
  return map[name] || map['default'];
}

export function imageKeywords(vertical='generic'){
  const kw = JSON.parse(fs.readFileSync(path.join(__dirname,'mappers','imageKeywords.json'),'utf-8'));
  return kw[vertical] || kw['generic'];
}

export function buildPrompt(brief, planObj){
  const promptPath = path.join(__dirname,'prompts','prompt_webgen.md');
  const base = fs.readFileSync(promptPath,'utf-8');
  const payload = {
    business_name: brief?.business_name || '',
    vertical: planObj.vertical,
    tone: brief?.tone || 'friendly',
    audience: brief?.audience || '',
    promo: brief?.promo || '',
    contacts: {
      phone: brief?.phone || '',
      line: brief?.line || '',
      email: brief?.email || '',
      address: brief?.address || ''
    },
    image_keywords_hint: imageKeywords(planObj.vertical)
  };
  const jsonPayload = JSON.stringify(payload, null, 2);
  return base + '\n\n---\nJSON:\n```json\n' + jsonPayload + '\n```\n';
}

export function injectAfterHeader(themeHtml, blocksHtml, injectAfter='</header>'){
  const m = themeHtml.toLowerCase().indexOf(injectAfter.toLowerCase());
  if(m !== -1){
    const idx = m + injectAfter.length;
    return themeHtml.slice(0, idx) + '\n' + blocksHtml + '\n' + themeHtml.slice(idx);
  }
  const b = themeHtml.toLowerCase().indexOf('</body>');
  if(b !== -1){
    return themeHtml.slice(0, b) + '\n' + blocksHtml + '\n' + themeHtml.slice(b);
  }
  return themeHtml + blocksHtml;
}
