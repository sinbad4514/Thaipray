const fs = require('fs');
const path = require('path');

const prayersDir = path.join(__dirname, 'prayers');
const prayerFiles = fs.readdirSync(prayersDir).filter(f => f.endsWith('.html'));

const today = new Date().toISOString().split('T')[0];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://thaipray.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`;

prayerFiles.sort().forEach(file => {
  sitemap += `  <url>
    <loc>https://thaipray.com/prayers/${file.replace(/\.html$/, "")}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
});

sitemap += `  <url>
    <loc>https://thaipray.com/prayer-sequence</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`Updated Sitemap with all ${prayerFiles.length + 2} pages automatically!`);
