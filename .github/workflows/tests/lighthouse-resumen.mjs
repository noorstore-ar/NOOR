// Resume los informes de Lighthouse (velocidad, accesibilidad, buenas prácticas y SEO) en castellano.
// Falla (y GitHub te avisa por mail) solo si SEO, accesibilidad o buenas prácticas bajan del mínimo.
import { readFileSync, readdirSync, appendFileSync } from 'node:fs';

const MINIMOS = { seo: 80, accessibility: 70, 'best-practices': 70 };   // la velocidad solo se informa
const NOMBRES = { performance: 'Velocidad', accessibility: 'Accesibilidad', 'best-practices': 'Buenas prácticas', seo: 'SEO' };
const PAGINAS = { home: 'Inicio', producto: 'Clip 5 en 1' };
const icono = n => (n >= 90 ? '🟢' : n >= 50 ? '🟠' : '🔴');

let md = '## Informe semanal de Lighthouse\n\n| Página | ' + Object.values(NOMBRES).join(' | ') + ' |\n|---|---|---|---|---|\n';
const problemas = [], mejoras = [];

for (const archivo of readdirSync('lh').filter(f => f.endsWith('.report.json'))) {
  const clave = archivo.replace('.report.json', '');
  const r = JSON.parse(readFileSync('lh/' + archivo, 'utf8'));
  const fila = [];
  for (const cat of Object.keys(NOMBRES)) {
    const n = Math.round((r.categories[cat]?.score ?? 0) * 100);
    fila.push(icono(n) + ' ' + n);
    if (MINIMOS[cat] && n < MINIMOS[cat]) problemas.push(`${PAGINAS[clave] || clave}: ${NOMBRES[cat]} en ${n} (mínimo ${MINIMOS[cat]})`);
  }
  md += `| ${PAGINAS[clave] || clave} | ${fila.join(' | ')} |\n`;
  // Las 5 mejoras más importantes de la página
  const peso = {};
  for (const cat of Object.values(r.categories)) for (const ref of cat.auditRefs) peso[ref.id] = Math.max(peso[ref.id] || 0, ref.weight || 0);
  Object.values(r.audits)
    .filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable')
    .sort((a, b) => (peso[b.id] || 0.5) * (1 - b.score) - (peso[a.id] || 0.5) * (1 - a.score))
    .slice(0, 5)
    .forEach(a => mejoras.push(`${PAGINAS[clave] || clave}: ${a.title}`));
}
md += '\n🟢 90–100 bien · 🟠 50–89 mejorable · 🔴 0–49 mal\n';
if (mejoras.length) md += '\n### Lo que más conviene mejorar\n' + mejoras.map(m => '- ' + m).join('\n') + '\n';
md += problemas.length ? '\n### ❌ Debajo del mínimo\n' + problemas.map(p => '- ' + p).join('\n') + '\n' : '\n✅ Todo por encima de los mínimos.\n';

console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
process.exit(problemas.length ? 1 : 0);
