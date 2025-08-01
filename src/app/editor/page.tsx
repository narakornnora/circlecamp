'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function EditorPage() {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Layout>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            {sidebarOpen && <h2 className="text-lg font-semibold">เครื่องมือแก้ไข</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* Tools */}
              <div className="flex-1 p-4 space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">องค์ประกอบ</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'ข้อความ', icon: '📝' },
                      { name: 'รูปภาพ', icon: '🖼️' },
                      { name: 'ปุ่ม', icon: '🔘' },
                      { name: 'ฟอร์ม', icon: '📋' },
                    ].map((tool) => (
                      <button
                        key={tool.name}
                        className="w-full flex items-center p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                        draggable
                      >
                        <span className="text-xl mr-3">{tool.icon}</span>
                        <span className="text-sm">{tool.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">เลย์เอาต์</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'แถว', icon: '📏' },
                      { name: 'คอลัมน์', icon: '📐' },
                      { name: 'กริด', icon: '⚏' },
                    ].map((layout) => (
                      <button
                        key={layout.name}
                        className="w-full flex items-center p-3 border rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
                        draggable
                      >
                        <span className="text-xl mr-3">{layout.icon}</span>
                        <span className="text-sm">{layout.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedElement && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">คุณสมบัติ</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ข้อความ</label>
                        <input
                          type="text"
                          className="w-full text-sm border rounded px-2 py-1"
                          placeholder="พิมพ์ข้อความ..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">สี</label>
                        <div className="flex space-x-2">
                          {['#3B82F6', '#EF4444', '#10B981', '#F59E0B'].map((color) => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">ขนาด</label>
                        <select className="w-full text-sm border rounded px-2 py-1">
                          <option>เล็ก</option>
                          <option>กลาง</option>
                          <option>ใหญ่</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Assistant */}
              <div className="p-4 border-t bg-blue-50">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-sm">🤖</span>
                  </div>
                  <span className="text-sm font-medium">AI ผู้ช่วย</span>
                </div>
                <p className="text-xs text-blue-700 mb-2">
                  ต้องการความช่วยเหลือในการแก้ไข?
                </p>
                <button className="w-full bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition-colors">
                  ถาม AI
                </button>
              </div>
            </>
          )}
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">แก้ไขเว็บไซต์</h1>
              <div className="text-sm text-gray-500">ร้านกาแฟของฉัน</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                ยกเลิก
              </button>
              <Link
                href="/preview"
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                ดูตัวอย่าง
              </Link>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                บันทึก
              </button>
            </div>
          </div>

          {/* Editor Canvas */}
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Editable Website Preview */}
              <div className="relative">
                {/* Header Section */}
                <header 
                  className={`bg-amber-800 text-white p-6 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${
                    selectedElement === 'header' ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedElement('header')}
                >
                  <nav className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">ร้านกาแฟของฉัน</h1>
                    <ul className="hidden md:flex space-x-6">
                      <li><a href="#" className="hover:text-amber-200">หน้าหลัก</a></li>
                      <li><a href="#" className="hover:text-amber-200">เมนู</a></li>
                      <li><a href="#" className="hover:text-amber-200">เกี่ยวกับเรา</a></li>
                      <li><a href="#" className="hover:text-amber-200">ติดต่อ</a></li>
                    </ul>
                  </nav>
                </header>

                {/* Hero Section */}
                <section 
                  className={`bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${
                    selectedElement === 'hero' ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedElement('hero')}
                >
                  <h2 className="text-4xl font-bold text-amber-900 mb-4">
                    ยินดีต้อนรับสู่ร้านกาแฟของฉัน
                  </h2>
                  <p className="text-amber-800 text-lg mb-6">กาแฟชั้นเยี่ยม บรรยากาศอบอุ่น</p>
                  <button 
                    className={`bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${
                      selectedElement === 'hero-button' ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedElement('hero-button');
                    }}
                  >
                    ดูเมนู
                  </button>
                </section>

                {/* Menu Section */}
                <section 
                  className={`p-8 cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${
                    selectedElement === 'menu' ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedElement('menu')}
                >
                  <h3 className="text-2xl font-bold text-center mb-6">เมนูแนะนำ</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {['เอสเปรสโซ่', 'คาปูชิโน่', 'ลาเต้'].map((item, i) => (
                      <div key={i} className="text-center p-4 border rounded-lg">
                        <div className="w-24 h-24 bg-amber-100 rounded-full mx-auto mb-3"></div>
                        <h4 className="font-semibold">{item}</h4>
                        <p className="text-amber-600 font-bold">฿{80 + i * 10}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Contact Section */}
                <footer 
                  className={`bg-gray-800 text-white p-8 text-center cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${
                    selectedElement === 'footer' ? 'ring-2 ring-blue-400' : ''
                  }`}
                  onClick={() => setSelectedElement('footer')}
                >
                  <h3 className="text-xl font-bold mb-4">ติดต่อเรา</h3>
                  <p className="mb-2">📍 123 ถนนสุขุมวิท กรุงเทพ</p>
                  <p className="mb-2">📞 02-123-4567</p>
                  <p>✉️ info@mycoffee.com</p>
                </footer>

                {/* Selection Indicator */}
                {selectedElement && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    แก้ไข: {selectedElement}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}