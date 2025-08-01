'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { mockTemplates, mockProjects } from '@/data/mockData';
import { WebsiteTemplate } from '@/types';
import Link from 'next/link';

export default function PreviewPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const currentProject = mockProjects[0];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ตัวอย่างเว็บไซต์</h1>
              <p className="text-gray-600">ดูและเลือกเทมเพลตที่ AI สร้างให้คุณ</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'desktop'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'mobile'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                  </svg>
                  Mobile
                </button>
              </div>
              
              <Link
                href="/editor"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                แก้ไขเว็บไซต์
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Template Selector */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold mb-4">เลือกเทมเพลต</h3>
            <div className="space-y-3">
              {mockTemplates.map((template, index) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(index)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTemplate === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {template.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Browser Bar */}
              <div className="bg-gray-100 px-4 py-3 flex items-center space-x-2 border-b">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 bg-white rounded px-3 py-1 ml-4">
                  <span className="text-gray-500 text-sm">
                    https://{currentProject.name.replace(/\s+/g, '-').toLowerCase()}.circlecamp.app
                  </span>
                </div>
              </div>

              {/* Preview Content */}
              <div className={`${viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'} transition-all duration-300`}>
                <MockWebsitePreview template={mockTemplates[selectedTemplate]} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/chat"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            กลับไปปรับแต่ง
          </Link>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            เผยแพร่เว็บไซต์
          </button>
        </div>
      </div>
    </Layout>
  );
}

function MockWebsitePreview({ template }: { template: WebsiteTemplate }) {
  if (template.category === 'Restaurant') {
    return (
      <div className="bg-white">
        {/* Header */}
        <header className="bg-amber-800 text-white p-6">
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

        {/* Hero */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 p-8 text-center">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">ยินดีต้อนรับสู่ร้านกาแฟของฉัน</h2>
          <p className="text-amber-800 text-lg mb-6">กาแฟชั้นเยี่ยม บรรยากาศอบอุ่น</p>
          <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700">
            ดูเมนู
          </button>
        </section>

        {/* Menu Preview */}
        <section className="p-8">
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
      </div>
    );
  }

  // Default business template
  return (
    <div className="bg-white">
      <header className="bg-blue-600 text-white p-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">บริษัทของฉัน</h1>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#" className="hover:text-blue-200">หน้าหลัก</a></li>
            <li><a href="#" className="hover:text-blue-200">บริการ</a></li>
            <li><a href="#" className="hover:text-blue-200">เกี่ยวกับเรา</a></li>
            <li><a href="#" className="hover:text-blue-200">ติดต่อ</a></li>
          </ul>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 text-center">
        <h2 className="text-4xl font-bold text-blue-900 mb-4">{template.name}</h2>
        <p className="text-blue-800 text-lg mb-6">{template.description}</p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          เรียนรู้เพิ่มเติม
        </button>
      </section>

      <section className="p-8">
        <h3 className="text-2xl font-bold text-center mb-6">บริการของเรา</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {['บริการ A', 'บริการ B', 'บริการ C'].map((service, i) => (
            <div key={i} className="text-center p-4 border rounded-lg">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-3"></div>
              <h4 className="font-semibold">{service}</h4>
              <p className="text-gray-600">คำอธิบายบริการ</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}