export const FOOTER = {
  brand: {
    name: 'ResumeAI',
    tagline: 'AI-powered ATS resume analysis to help you land your dream job.',
  },
  contact: {
    email: 'contact@resumeai.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
  },
  services: [
    { label: 'ATS Resume Analysis', href: '#' },
    { label: 'Keyword Optimization', href: '#' },
    { label: 'Career Coaching', href: '#' },
    { label: 'Resume Writing', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'FAQ', href: '#' },
  ],
  copyright: `© ${new Date().getFullYear()} ResumeAI. All rights reserved.`,
  credit: 'Designed & Developed by',
  creditName: 'PANKAJ',
};

export const API = {
  analyze: '/api/analyze',
  health: '/api/health',
};
