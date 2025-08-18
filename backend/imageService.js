import fetch from 'node-fetch';

const UF = (w,h,kw)=>`https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(kw)}`;
const LF = (w,h,kw)=>`https://loremflickr.com/${w}/${h}/${encodeURIComponent(kw)}`;
const PS = (w,h)=>`https://picsum.photos/${w}/${h}`;

export async function fetchStockImage({ kw, w=1200, h=800 }) {
  // Prefer real APIs if keys exist
  const unsKey = process.env.UNSPLASH_ACCESS_KEY;
  const pexKey = process.env.PEXELS_API_KEY;
  const pxbKey = process.env.PIXABAY_API_KEY;

  if (unsKey) {
    try {
      const r = await fetch(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(kw)}&orientation=landscape&client_id=${unsKey}`);
      if (r.ok) {
        const j = await r.json();
        const url = j?.urls?.regular || j?.urls?.full || j?.urls?.small;
        if (url) return url;
      }
    } catch {}
  }
  if (pexKey) {
    try {
      const r = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(kw)}&per_page=1`, { headers: { Authorization: pexKey } });
      if (r.ok) {
        const j = await r.json();
        const url = j?.photos?.[0]?.src?.large || j?.photos?.[0]?.src?.original;
        if (url) return url;
      }
    } catch {}
  }
  if (pxbKey) {
    try {
      const r = await fetch(`https://pixabay.com/api/?key=${pxbKey}&q=${encodeURIComponent(kw)}&image_type=photo&orientation=horizontal&per_page=3`);
      if (r.ok) {
        const j = await r.json();
        const hit = j?.hits?.[0]?.largeImageURL || j?.hits?.[0]?.webformatURL;
        if (hit) return hit;
      }
    } catch {}
  }

  // No keys or failed → fallbacks without keys
  const candidates = [UF(w,h,kw), LF(w,h,kw), PS(w,h)];
  for (const url of candidates) {
    try {
      const r = await fetch(url, { redirect: 'follow' });
      if (r.ok) return r.url || url;
    } catch {}
  }
  // Final fallback → generic picsum
  return PS(w,h);
}
