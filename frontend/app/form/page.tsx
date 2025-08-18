'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Form() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  const questions = {
    1: "คุณอยากได้เว็บไซต์เกี่ยวกับอะไรครับ?",
    2: "ประเภทเว็บไซต์ เช่น ร้านอาหาร ร้านค้า หรือผลงานส่วนตัว?",
    3: "ชื่อเว็บไซต์ที่ต้องการคืออะไร?",
    4: "คุณอยากได้โทนสีแบบไหน?",
  };

  const handleAnswer = (value) => {
    setAnswers({...answers, [step]: value});
    if (step < Object.keys(questions).length) {
      setStep(step+1);
    } else {
      router.push('/preview');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>{questions[step]}</h2>
      <input type="text" onKeyDown={(e)=>{ if(e.key==='Enter') handleAnswer(e.target.value); }} />
      <p>Step {step} / {Object.keys(questions).length}</p>
      <button onClick={()=>handleAnswer('ข้าม')}>ถัดไป</button>
    </div>
  );
}
