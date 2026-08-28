const fs = require('fs');
const path = require('path');

const prayers = [
  // Deities & Sacred Figures
  'thao-wessuwan',
  'phra-phrom',
  'naga-srisuttho',
  'ai-khai',
  'xian-pae',
  'guanyin',
  'ganesha',
  'lakshmi',
  'rahu',
  'trimurti',
  'shiva',
  'kali',
  'luangpu-thuat',
  'luangpho-sothon',
  'upakut-luck',
  'love-lakshmi',

  // Core Prayers & Routines
  'katha-ngoen-lan',
  'chinnabanchon',
  'itipiso',
  'itipiso-108',
  'mahachakrapat',
  'bahum-mahaka',
  'bedtime',
  'bedtime-complete',
  'share-merit',
  'morning-routine',
  'uposatha-routine',
  'dhammacakka',
  'dhammacakka-short',
  'karma-forgiveness',
  'wealth-before-opening-shop',
  'turtle-house',
  'diamond-armor',
  'mangphu-kham',
  'night-protection',
  'seven-paritta',
  'metta',
  'solot-mongkhon',
  'itipiso-reverse',
  'ksitigarbha',

  // Birthday Prayers
  'birthday-sunday',
  'birthday-monday',
  'birthday-tuesday',
  'birthday-wednesday-day',
  'birthday-wednesday-night',
  'birthday-thursday',
  'birthday-friday',
  'birthday-saturday'
];

const allUrls = [
  'https://thaipray.com/',
  'https://thaipray.com/prayer-sequence.html',
  ...prayers.map(p => `https://thaipray.com/prayers/${p}.html`)
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>2026-08-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === 'https://thaipray.com/' ? '1.0' : '0.85'}</priority>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapContent, 'utf-8');
console.log(`Updated Sitemap with ${allUrls.length} pages!`);
