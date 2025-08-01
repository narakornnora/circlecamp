import { ChatMessage, WebsiteTemplate, ProjectData } from '@/types';

export const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    content: 'สวัสดีครับ! ผมคือ AI ที่จะช่วยคุณสร้างเว็บไซต์แบบมืออาชีพ คุณต้องการสร้างเว็บไซต์ประเภทไหนครับ?',
    role: 'assistant',
    timestamp: new Date('2024-01-01T10:00:00Z'),
  },
  {
    id: '2',
    content: 'ผมอยากได้เว็บไซต์สำหรับร้านกาแฟครับ',
    role: 'user',
    timestamp: new Date('2024-01-01T10:01:00Z'),
  },
  {
    id: '3',
    content: 'เยี่ยมเลยครับ! สำหรับร้านกาแฟ ผมจะสร้างเว็บไซต์ที่มีสีโทนอบอุ่น มีหน้าแสดงเมนู รีวิว และข้อมูลติดต่อ คุณมีชื่อร้านและสีที่ชอบแล้วไหมครับ?',
    role: 'assistant',
    timestamp: new Date('2024-01-01T10:02:00Z'),
  },
];

export const mockTemplates: WebsiteTemplate[] = [
  {
    id: '1',
    name: 'Coffee Shop Modern',
    description: 'เทมเพลตสำหรับร้านกาแฟสไตล์โมเดิร์น พร้อมเมนูและแกลเลอรี่',
    category: 'Restaurant',
    thumbnail: '/placeholder-cafe.jpg',
  },
  {
    id: '2',
    name: 'Business Portfolio',
    description: 'เทมเพลตสำหรับธุรกิจและผลงาน เน้นความเป็นมืออาชีพ',
    category: 'Business',
    thumbnail: '/placeholder-business.jpg',
  },
  {
    id: '3',
    name: 'Creative Agency',
    description: 'เทมเพลตสำหรับเอเจนซี่สร้างสรรค์ ดีไซน์ทันสมัย',
    category: 'Creative',
    thumbnail: '/placeholder-creative.jpg',
  },
];

export const mockProjects: ProjectData[] = [
  {
    id: '1',
    name: 'ร้านกาแฟของฉัน',
    description: 'เว็บไซต์ร้านกาแฟสไตล์โมเดิร์น',
    template: mockTemplates[0],
    created_at: new Date('2024-01-01T10:00:00Z'),
    updated_at: new Date('2024-01-01T10:30:00Z'),
    status: 'preview',
  },
];