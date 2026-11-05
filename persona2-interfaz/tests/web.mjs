import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(appDir, 'dist');
const evidence = resolve(appDir, '../docs/desarrollo/evidencias/persona4');
await readFile(resolve(dist, 'index.html')); // Run npm run export first.
await mkdir(evidence, { recursive: true });
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ico': 'image/x-icon' };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = resolve(dist, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!file.startsWith(dist + sep)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const baseURL = `http://127.0.0.1:${server.address().port}`;
let browser;
try {
  browser = await chromium.launch({ headless: true, ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) });
} catch (error) {
  await new Promise(r => server.close(r));
  throw error;
}
const results = [];
const API = 'https://dev.to/api/articles?*';
const imageURL = 'https://example.test/test-image.svg';
const fixture = [
  { id: 101, title: 'Artículo de diseño', description: 'Registro controlado para verificar presentación y filtros.', tag_list: ['design', 'reactnative'], reading_time_minutes: 4, cover_image: imageURL },
  { id: 102, title: 'Artículo de desarrollo', description: 'Registro controlado para verificar favoritos.', tag_list: ['javascript'], reading_time_minutes: 6, cover_image: imageURL },
];
const visible = (page, text) => page.getByText(text, { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
async function scenario(id, name, handler, { live = false, width = 390 } = {}) {
  const only = process.argv.find(arg => arg.startsWith('--only='))?.slice(7);
  if (only && only !== id) return;
  const context = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: 'block' });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  if (!live) await page.route(imageURL, route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#dbeafe"/><text x="30" y="120" font-size="22" fill="#1e40af">Imagen de prueba</text></svg>' }));
  try {
    const detail = await handler(page);
    assert.deepEqual(errors, [], 'No uncaught JavaScript errors');
    await page.screenshot({ path: resolve(evidence, `${id}.png`) });
    results.push({ id, name, status: 'PASS', detail, errors });
  } catch (error) {
    console.error(error.message);
    await page.screenshot({ path: resolve(evidence, `${id}-fallo.png`) });
    results.push({ id, name, status: 'FAIL', error: error.message, errors });
    process.exitCode = 1;
  } finally { await context.close(); }
  console.log(`${results.at(-1).status} ${id}: ${name}`);
}
async function jsonRoute(page, data, status = 200) {
  await page.route(API, route => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(data) }));
}
try {
  await scenario('01-carga', 'Loading remains visible until the API responds', async page => {
    let release;
    const gate = new Promise(r => { release = r; });
    await page.route(API, async route => { await gate; await route.fulfill({ json: fixture }); });
    await page.goto(baseURL);
    await visible(page, 'Cargando interfaz y datos...');
    await page.waitForTimeout(800); // Explicit regression for the old 500 ms mock timer.
    assert.equal(await page.getByText('Arquitectura React Native', { exact: true }).count(), 0);
    assert.equal(await page.getByText('No se encontraron elementos', { exact: true }).count(), 0);
    await page.screenshot({ path: resolve(evidence, '01-carga-en-progreso.png') });
    release();
    await visible(page, 'Artículo de diseño');
    return 'No mock records and no empty-state message during loading.';
  });
  await scenario('02-interacciones', 'Cards, images, filters and favorite toggle', async page => {
    await jsonRoute(page, fixture);
    await page.goto(baseURL);
    await visible(page, '2 reg. | ♥ 0');
    await page.getByText('♡ Guardar', { exact: true }).first().click();
    await visible(page, '2 reg. | ♥ 1');
    await page.getByText('Desarrollo', { exact: true }).click();
    await visible(page, '1 reg. | ♥ 1');
    await visible(page, 'Artículo de desarrollo');
    assert.equal(await page.getByText('Artículo de diseño', { exact: true }).count(), 0);
    await page.getByText('Todos', { exact: true }).click();
    await visible(page, '♥ Guardado');
    await page.getByText('♥ Guardado', { exact: true }).click();
    await visible(page, '2 reg. | ♥ 0');
    await page.waitForFunction(() => [...document.images].some(i => i.complete && i.naturalWidth > 0));
    return '2 records; favorite 0 → 1 → 0; filter 2 → 1 → 2; image loaded.';
  });
  await scenario('03-vacia', 'An empty response is displayed as an empty list', async page => {
    await jsonRoute(page, []);
    await page.goto(baseURL);
    await visible(page, 'No se encontraron elementos');
    await visible(page, '0 reg. | ♥ 0');
    return 'HTTP 200 with [] shows the empty state.';
  });
  await scenario('04-http', 'HTTP failure is distinct from an empty response', async page => {
    await jsonRoute(page, { error: 'Server error' }, 500);
    await page.goto(baseURL);
    await visible(page, 'No se pudieron cargar los artículos (HTTP 500). Intenta más tarde.');
    assert.equal(await page.getByText('No se encontraron elementos', { exact: true }).count(), 0);
    return 'HTTP 500 shows the error banner without the empty-state message.';
  });
  await scenario('05-red', 'Network failure is reported', async page => {
    await page.route(API, route => route.abort('internetdisconnected'));
    await page.goto(baseURL);
    await visible(page, 'No fue posible conectar con la API. Revisa la conexión e intenta de nuevo.');
    return 'The API request is intentionally aborted; the local app remains available.';
  });
  for (const [id, body] of [['06-json', 'not json'], ['07-estructura', '{"articles":[]}']]) {
    await scenario(id, 'An invalid response is reported', async page => {
      await page.route(API, route => route.fulfill({ contentType: 'application/json', body }));
      await page.goto(baseURL);
      await visible(page, 'La API devolvió una respuesta que no se pudo procesar.');
      return `Controlled response: ${body}`;
    });
  }
  await scenario('08-ancho-320', 'Header content fits a 320 px viewport', async page => {
    await jsonRoute(page, fixture);
    await page.goto(baseURL);
    await visible(page, '2 reg. | ♥ 0');
    const box = await page.getByText('2 reg. | ♥ 0', { exact: true }).boundingBox();
    assert.ok(box.x >= 0 && box.x + box.width <= 320, `Counter outside viewport: ${JSON.stringify(box)}`);
    return 'Counter fully visible at 320 × 844.';
  }, { width: 320 });
  if (process.argv.includes('--live')) {
    await scenario('09-api-real', 'Real DEV.to API response renders in the browser', async page => {
      const [response] = await Promise.all([
        page.waitForResponse(r => r.url().startsWith('https://dev.to/api/articles?'), { timeout: 30000 }),
        page.goto(baseURL),
      ]);
      assert.ok(response.ok(), `HTTP ${response.status()}`);
      const data = await response.json();
      assert.ok(Array.isArray(data) && data.length > 0);
      await visible(page, `${data.length} reg. | ♥ 0`);
      await visible(page, data[0].title);
      await page.waitForFunction(() => document.images.length > 0 && document.images[0].complete && document.images[0].naturalWidth > 0, null, { timeout: 15000 });
      const imageStatus = await page.evaluate(() => [...document.images].map(i => ({ loaded: i.complete && i.naturalWidth > 0 })));
      return { status: response.status(), records: data.length, firstTitle: data[0].title, imageStatus };
    }, { live: true });
  }
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
  await writeFile(resolve(evidence, 'resultados-web.json'), JSON.stringify({ executedAt: new Date().toISOString(), node: process.version, viewport: '390 × 844 unless otherwise stated', results }, null, 2));
}
