export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  preview_url?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  template: WebsiteTemplate;
  created_at: Date;
  updated_at: Date;
  status: 'draft' | 'preview' | 'published';
}

export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
}