import { FOOTER, type LinkItem } from '../utils/config.js';

const icons: Record<string, string> = {
  email: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  address: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

function linkCol(title: string, items: LinkItem[]): string {
  if (!items || !items.length) return '';
  return `
    <div class="footer-col">
      <h4>${title}</h4>
      <ul class="footer-links">
        ${items.map(s => `<li><a href="${s.href}">${s.label}</a></li>`).join('')}
      </ul>
    </div>
  `;
}

export function Footer(): string {
  const { brand, contact, services, company, copyright, credit, creditName } = FOOTER;

  return `
    <footer>
      <div class="footer-line"></div>
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-brand">
            <span class="footer-logo">Resume<span class="accent">AI</span></span>
            <p class="footer-desc">${brand.tagline}</p>
          </div>
        </div>
        <div class="footer-col">
          <h4>Contact</h4>
          <ul class="footer-contact">
            <li>${icons.email}<a href="mailto:${contact.email}">${contact.email}</a></li>
            <li>${icons.address}<span>${contact.address}</span></li>
            <li>${icons.phone}<span>${contact.phone}</span></li>
          </ul>
        </div>
        ${linkCol('Services', services)}
        ${linkCol('Company', company)}
      </div>
      <div class="footer-divider"></div>
      <div class="footer-bottom">
        <span class="footer-copy">${copyright}</span>
        <span class="footer-credit">${credit} <span class="footer-name">${creditName}</span></span>
      </div>
    </footer>
  `;
}
