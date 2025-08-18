import { Router } from 'express';

// In-memory session store (no DB)
const SESS = new Map();
const STEPS = [
  { key:'business_name', q:'ชื่อธุรกิจของคุณคืออะไร?' },
  { key:'vertical', q:'ประเภทเว็บ/ประเภทธุรกิจ? (เช่น ร้านอาหาร คลินิก โรงแรม ฯลฯ)' },
  { key:'audience', q:'กลุ่มลูกค้าหลักคือใคร?' },
  { key:'promo', q:'มีโปรโมชันหรือจุดขายเด่นอะไร?' },
  { key:'tone', q:'โทนภาษา/บุคลิกที่ต้องการ? (เป็นกันเอง/พรีเมียม/สนุก ฯลฯ)' },
  { key:'contact', q:'เบอร์ติดต่อ/Line/Email/ที่อยู่ (ใส่เท่าที่มี)' },
];

function newSession() {
  const id = Math.random().toString(36).slice(2,9);
  SESS.set(id, { idx:0, data:{} });
  return id;
}

export const router = Router();

router.post('/next', (req,res)=>{
  let { sessionId, answer } = req.body || {};
  if (!sessionId || !SESS.has(sessionId)) sessionId = newSession();
  const st = SESS.get(sessionId);

  if (typeof answer === 'string' && answer.trim()) {
    const step = STEPS[st.idx] || null;
    if (step) {
      st.data[step.key] = answer.trim();
      st.idx = Math.min(st.idx+1, STEPS.length);
    }
  }

  if (st.idx >= STEPS.length) {
    return res.json({ sessionId, done:true, collected: st.data, message:'ครบคำถามแล้ว กด "สร้างเว็บไซต์" เพื่อดูพรีวิวได้เลย' });
  } else {
    const step = STEPS[st.idx];
    return res.json({ sessionId, done:false, nextQuestion: step.q, collected: st.data });
  }
});
