export interface LinkItem {
  label: string;
  href: string;
}

export interface FooterConfig {
  brand: { name: string; tagline: string };
  contact: { email: string; phone: string; address: string };
  services: LinkItem[];
  company: LinkItem[];
  copyright: string;
  credit: string;
  creditName: string;
}

export const FOOTER: FooterConfig = {
  brand: {
    name: 'ResumeAI',
    tagline: 'AI-powered ATS resume analysis to help you land your dream job.',
  },
  contact: {
    email: 'contact@resumeai.com',
    phone: '+91 8449309324',
    address: 'Bulandshahr, India',
  },
  services: [
    { label: 'ATS Resume Analysis', href: '#' },
    { label: 'Keyword Optimization', href: '#' },
  ],
  company: [],
  copyright: `© ${new Date().getFullYear()} ResumeAI. All rights reserved.`,
  credit: 'Designed & Developed by',
  creditName: 'PANKAJ',
};

export const API = {
  analyze: '/api/analyze',
  health: '/api/health',
} as const;
