'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ChatWidget() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'สวัสดีครับ! ผมคือ AI ผู้ช่วยสร้างเว็บไซต์ 😊 บอกได้เลยอยากได้เว็บแบบไหน' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/chat', { messages: newMessages });
      setMessages([...newMessages, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'เกิดข้อผิดพลาดในการเชื่อมต่อ backend' }]);
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px',
      width: '350px', maxHeight: '500px',
      background: 'white', borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{flex: 1, padding: '10px', overflowY: 'auto'}}>
        {messages.map((m, i) => (
          <div key={i} style={{margin: '8px 0', textAlign: m.role === 'user' ? 'right' : 'left'}}>
            <span style={{
              display: 'inline-block',
              padding: '8px 12px',
              borderRadius: '12px',
              background: m.role === 'user' ? '#007bff' : '#f1f0f0',
              color: m.role === 'user' ? 'white' : 'black'
            }}>{m.content}</span>
          </div>
        ))}
      </div>
      <div style={{display: 'flex', borderTop: '1px solid #eee'}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' ? sendMessage() : null}
          placeholder="พิมพ์ข้อความ..."
          style={{flex: 1, border: 'none', padding: '10px'}}
        />
        <button onClick={sendMessage} style={{padding: '10px 15px', background: '#007bff', color: 'white', border: 'none'}}>ส่ง</button>
      </div>
    </div>
  );
}