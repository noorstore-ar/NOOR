// Revisión diaria de Noor Store: abre la tienda en un navegador real y verifica que todo funcione.
// Si algo falla, el proceso termina con error y GitHub te avisa por mail.
import { chromium } from 'playwright';

const TIENDA = process.env.TIENDA || 'https://noorstorear.mitiendanube.com';
const PRODUCTO = TIENDA + '/productos/clip-5-en-1/';
const problemas = [];
const avisos = [];
const ok = (cond, msj) => { if (cond) console.log('  ✔ ' + msj); else { console.log('  ✘ ' + msj); problemas.push(msj); } };

const navegador = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
const pagina = await navegador.newPage({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
});
const erroresJS = [];
pagina.on('pageerror', e => { if (/noor\.js/.test(e.stack || '')) erroresJS.push(e.message); });

async function abrir(url) {
  const r = await pagina.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await pagina.waitForTimeout(4000);
  const titulo = await pagina.title();
  if (/just a moment|attention required/i.test(titulo)) { problemas.push('La protección anti-robots no dejó revisar ' + url + ' (si se repite varios días, avisar)'); return null; }
  return r;
}
async function bajar(px) { await pagina.mouse.wheel(0, px); await pagina.waitForTimeout(900); }

console.log('\n▶ INICIO');
const r1 = await abrir(TIENDA);
if (r1) {
  ok(r1.status() < 400, 'La tienda responde (código ' + r1.status() + ')');
  const estado = await pagina.evaluate(() => window.NOOR || null);
  ok(!!estado, 'noor.js cargó' + (estado ? ' (versión ' + estado.version + ')' : ''));
  if (estado) {
    ok(estado.errores.length === 0, 'Ninguna sección falló' + (estado.errores.length ? ': ' + estado.errores.join(', ') : ''));
    for (const u of estado.imagenes) {
      const res = await fetch(u, { method: 'HEAD' }).catch(() => null);
      ok(res && res.ok, 'Imagen disponible: ' + decodeURIComponent(u.split('/').pop()));
    }
  }
  for (const [sel, nombre] of [['.noor-hero', 'Banner principal'], ['.noor-benef', '"Cuidamos tu visión"'], ['.noor-cf-wrap', 'Carrusel "Así se usa"'], ['.noor-progreso', 'Línea de progreso']])
    ok(await pagina.$(sel) !== null, nombre);
  await bajar(1500); await pagina.waitForTimeout(1500);
  ok(await pagina.$('.noor-iman') !== null, '"Cambiá de clip en un segundo"');
  const productos = await pagina.$$eval('[data-store^="product-item"], .js-item-product', l => l.filter(e => e.offsetParent !== null).length);
  ok(productos > 0, 'Se ven productos en el inicio (' + productos + ')');
}

console.log('\n▶ PRODUCTO (Clip 5 en 1)');
const r2 = await abrir(PRODUCTO);
if (r2) {
  ok(r2.status() < 400, 'La página del producto responde');
  ok(await pagina.$('.noor-deal') !== null, 'Tarjeta dorada de oferta');
  const precio = await pagina.$eval('#price_display, .js-price-display', e => e.textContent.trim()).catch(() => '');
  ok(/\$\s?\d/.test(precio), 'Precio visible (' + precio + ')');
  ok(await pagina.$('.js-addtocart') !== null, 'Botón de compra');
  ok(await pagina.$('.noor-medidas [class*="noor-anat"], .noor-medidas table') !== null, 'Cuadro de medidas');
  await bajar(1600);
  ok(await pagina.$('.noor-fija.on') !== null, 'Botón de compra fijo al bajar');
  const est = await pagina.evaluate(() => window.NOOR && window.NOOR.errores);
  ok(est && est.length === 0, 'Ninguna sección falló en el producto' + (est && est.length ? ': ' + est.join(', ') : ''));
}
ok(erroresJS.length === 0, 'Sin errores de JavaScript en noor.js' + (erroresJS.length ? ': ' + erroresJS.join(' | ') : ''));

await navegador.close();
console.log('\n' + (problemas.length ? '❌ ' + problemas.length + ' problema(s):\n - ' + problemas.join('\n - ') : '✅ Todo funciona correctamente'));
if (avisos.length) console.log('⚠️ ' + avisos.join('\n⚠️ '));
process.exit(problemas.length ? 1 : 0);
