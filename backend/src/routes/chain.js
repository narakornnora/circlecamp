import { Router } from 'express';
import { planSections, generateContentBlocks, translateKeywordsToEnglish } from '../services/aiService.js';
import { searchUnsplash } from '../services/imageService.js';
import { log } from '../utils/logger.js';

export const router = Router();

router.post('/start', async (req, res) => {
  try {
    const { brief='', language='th', vertical='generic' } = req.body || {};
    if (!brief.trim()) return res.status(400).json({ error: 'Missing brief' });

    // 1) IA plan
    const plan = await planSections(brief, vertical);
    log('plan', plan);

    // 2) Content HTML blocks
    const content = await generateContentBlocks(brief, plan, language);

    // 3) Extract keywords from HTML comments and translate to EN
    const allKeywords = [];
    for (const b of content) {
      const matches = [...(b.html?.matchAll(/<!--\s*image:\s*([^>]+)\s*-->/gi) || [])];
      const kws = matches.map(m => m[1].trim()).filter(Boolean);
      allKeywords.push({ section: b.section, keywords: kws });
    }
    // translate & fetch images per section
    const images = {};
    for (const item of allKeywords) {
      const en = await translateKeywordsToEnglish(item.keywords, language);
      images[item.section] = await searchUnsplash(en, 4);
    }

    res.json({ plan, content, images });
  } catch (e) {
    res.status(500).json({ error: e.message || String(e) });
  }
});
