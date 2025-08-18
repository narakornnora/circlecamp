import dotenv from 'dotenv';
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

async function callOpenAI(messages, temperature=0.5) {
  if (!OPENAI_API_KEY) return null;
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: MODEL, temperature, messages })
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content || null;
}

export async function planSections(briefText, vertical='generic') {
  const sys = `You are an information architect. Return JSON with {vertical, sequence:[hero,highlights,services,menu,gallery,testimonial,pricing,faq,contact]}. Keep relevant and short.`;
  const user = `Brief: ${briefText}\nVertical: ${vertical}. Reply ONLY JSON.`;
  const out = await callOpenAI([{role:'system',content:sys},{role:'user',content:user}], 0.3);
  try { return out ? JSON.parse(out) : { vertical, sequence:['hero','highlights','contact'] }; }
  catch { return { vertical, sequence:['hero','highlights','contact'] }; }
}

export async function writeSectionHTML(briefText, plan, language='th') {
  const sys = `You write clean HTML snippets (no <html> wrapper). Return an array like [{section:'hero', html:'<section>...</section>'}, ...]. Language: ${language}. Use tasteful copy. Put desired image keywords inside comments: <!-- image: ... -->`;
  const user = `Brief: ${briefText}\nPlan: ${JSON.stringify(plan)}`;
  const out = await callOpenAI([{role:'system',content:sys},{role:'user',content:user}], 0.6);
  if (!out) return [];
  const s = out.indexOf('['), e = out.lastIndexOf(']');
  try { return JSON.parse(out.slice(s, e+1)); } catch { return []; }
}

export async function translateKeywordsToEN(keywords=[], sourceLang='th') {
  if (!keywords?.length) return [];
  const out = await callOpenAI([
    {role:'system',content:'Translate keywords to concise English JSON array for image search (Unsplash).'},
    {role:'user',content:`Source=${sourceLang}. Keywords=${JSON.stringify(keywords)}`}
  ], 0.1);
  try { return out ? JSON.parse(out) : keywords; } catch { return keywords; }
}
