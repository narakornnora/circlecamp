import dotenv from 'dotenv';
dotenv.config();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function searchUnsplash(keywords=[], perPage=4) {
  if (!UNSPLASH_KEY) return []; // safe fallback: no images
  const q = encodeURIComponent(keywords.join(' '));
  const url = `https://api.unsplash.com/search/photos?query=${q}&per_page=${perPage}&orientation=landscape&content_filter=high`;
  const res = await fetch(url, { headers:{ 'Authorization': `Client-ID ${UNSPLASH_KEY}` } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results || []).map(p => ({
    url: p.urls?.regular,
    thumb: p.urls?.thumb,
    author: p.user?.name,
    credit: `Unsplash/${p.user?.username}`
  }));
}
