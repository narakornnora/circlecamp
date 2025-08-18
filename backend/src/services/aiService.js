import { log } from '../utils/logger.js';

/**
 * Use OpenAI to (1) plan sections, (2) write content HTML snippets, (3) translate TH->EN keywords.
 * Uses fetch with the Chat Completions format (works on Node >=18).
 */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini'; // light & fast

async function openai(messages, temperature=0.5) {
  if (!OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY');
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature
    })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error('OpenAI error: ' + txt);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function planSections(brief, vertical='generic') {
  const sys = `You are a senior web IA/UX planner. Output a JSON with keys: vertical, sequence.
- sequence is an array of section ids to render AFTER the header: choose from [hero, highlights, services, menu, gallery, testimonial, pricing, faq, contact].
- keep it short and relevant to the business.`;
  const user = `Business brief: ${brief}\nAssume vertical: ${vertical}. Reply ONLY JSON.`;
  const txt = await openai([{role:'system', content: sys},{role:'user', content: user}], 0.3);
  try { return JSON.parse(txt); } catch(e) {
    // fallback
    return { vertical, sequence: ['hero','highlights','contact'] };
  }
}

export async function generateContentBlocks(brief, plan, language='th') {
  const sys = `You write clean, tasteful HTML snippets for each section (no <html> or <head>).
Return an array of objects: [{section: 'hero', html: '<section>...</section>'}, ...].
- Language: ${language}
- Tone: friendly, expert copywriter.
- Keep images as HTML comments like <!-- image: keywords --> where needed.`;
  const user = `Brief: ${brief}\nPlan: ${JSON.stringify(plan)}`;
  const txt = await openai([{role:'system', content: sys},{role:'user', content: user}], 0.6);
  // Best-effort JSON extraction
  const start = txt.indexOf('['); const end = txt.lastIndexOf(']');
  const json = (start>=0 && end>start) ? txt.slice(start, end+1) : '[]';
  try { return JSON.parse(json); } catch(e) { return []; }
}

export async function translateKeywordsToEnglish(keywords, sourceLang='th') {
  if (!keywords?.length) return [];
  const sys = `Translate to concise English keywords for image search (Unsplash). Only return a JSON array of strings.`;
  const user = `Source language: ${sourceLang}. Keywords: ${JSON.stringify(keywords)}`;
  const txt = await openai([{role:'system', content: sys},{role:'user', content: user}], 0.2);
  try { return JSON.parse(txt); } catch { return keywords; }
}
