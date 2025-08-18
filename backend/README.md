# Circlecamp Auto-Chain (Backend)

Express API that plans sections, writes content, and fetches images for your preview.
No DB required. Returns JSON the frontend can render immediately.

## Quick start
```bash
cd circlecamp\backend
npm install
copy .env.example .env   # then fill keys
npm run dev
```

## Endpoint
POST `/api/chain/start`

Request body:
```json
{
  "brief": "ร้านอาหารไทย ชื่อ Thai 76 Kitchen โปรโมชันลด 10%",
  "language": "th",
  "vertical": "restaurant"
}
```

Response:
```json
{
  "plan": { "vertical":"restaurant","sequence":[ "hero","highlights","menu","testimonial","contact" ]},
  "content": [ { "section":"hero", "html":"..." }, ... ],
  "images": { "hero":[{ "url":"...", "credit":"Unsplash/..." }], "menu":[...] }
}
```
