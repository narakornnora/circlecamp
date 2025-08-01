'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { ChatMessage } from '@/types';
import { mockChatMessages } from '@/data/mockData';
import { generateId, formatDate } from '@/utils';
import Link from 'next/link';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: generateId(),
        content: getAIResponse(input),
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const getAIResponse = (_userInput: string): string => {
    const responses = [
      'เยี่ยมเลย! ฉันจะช่วยคุณสร้างเว็บไซต์ที่เหมาะสมกับความต้องการนั้น คุณมีสีหรือธีมที่ชอบเป็นพิเศษไหม?',
      'ฟังดูน่าสนใจมาก! ฉันแนะนำให้ใช้สีโทนที่สื่อถึงความน่าเชื่อถือและความเป็นมืออาชีพ คุณต้องการให้มีหน้าไหนบ้างในเว็บไซต์?',
      'ดีเลย! ฉันจะสร้างเว็บไซต์ที่มีหน้าหลัก, เกี่ยวกับเรา, บริการ และติดต่อเรา คุณต้องการเพิ่มอะไรอีกไหม?',
      'เสร็จแล้ว! ฉันได้สร้างเว็บไซต์ตามความต้องการของคุณเรียบร้อยแล้ว ต้องการดูตัวอย่างหรือไม่?',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">AI Website Builder</h1>
            <p className="opacity-90">บอกความต้องการของคุณ AI จะช่วยสร้างเว็บไซต์ให้</p>
          </div>

          {/* Chat Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatDate(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    </div>
                    <span className="text-sm">AI กำลังตอบ...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="พิมพ์ข้อความ..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ส่ง
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex flex-wrap gap-3">
            <Link
              href="/preview"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              ดูตัวอย่าง
            </Link>
            <Link
              href="/editor"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              แก้ไขเว็บไซต์
            </Link>
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
              เริ่มใหม่
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 เคล็ดลับการใช้งาน</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• บอกประเภทธุรกิจหรือเว็บไซต์ที่ต้องการ</li>
            <li>• ระบุสีหรือธีมที่ชอบ</li>
            <li>• บอกเนื้อหาหรือหน้าที่ต้องการ</li>
            <li>• AI จะแนะนำและปรับปรุงตามความต้องการ</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}