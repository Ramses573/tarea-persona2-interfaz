import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Load the actual pure modules as ESM without changing Expo's package type.
async function sourceModule(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}
const { fetchCatalogItems, CatalogApiError } = await sourceModule('../src/features/catalog/services/catalogApi.js');
const { normalizeItem } = await sourceModule('../src/features/catalog/adapters/normalizeItem.js');

test('GET returns articles and forwards the cancellation signal', async (t) => {
  const records = [{ id: 12, title: 'React Native', tag_list: ['reactnative'] }];
  const controller = new AbortController();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://dev.to/api/articles?tag=reactnative&per_page=30');
    assert.equal(options.method, 'GET');
    assert.equal(options.headers.Accept, 'application/vnd.forem.api-v1+json');
    assert.equal(options.signal, controller.signal);
    return new Response(JSON.stringify(records));
  });
  assert.deepEqual(await fetchCatalogItems({ signal: controller.signal }), records);
});

test('an empty array is a valid successful response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('[]'));
  assert.deepEqual(await fetchCatalogItems(), []);
});

for (const status of [404, 429, 500]) {
  test(`HTTP ${status} is classified without parsing an error page`, async (t) => {
    t.mock.method(globalThis, 'fetch', async () => new Response('<html>Error</html>', { status }));
    await assert.rejects(fetchCatalogItems(), e => e instanceof CatalogApiError && e.type === 'http' && e.status === status);
  });
}

test('network rejection is classified separately', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(fetchCatalogItems(), e => e.type === 'network');
});

test('an aborted request keeps AbortError for hook cleanup', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new DOMException('Aborted', 'AbortError'); });
  await assert.rejects(fetchCatalogItems(), { name: 'AbortError' });
});

test('invalid JSON is rejected', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('invalid json'));
  await assert.rejects(fetchCatalogItems(), e => e.type === 'invalid-json');
});

for (const payload of [{ articles: [] }, null]) {
  test(`unexpected payload ${JSON.stringify(payload)} is rejected`, async (t) => {
    t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify(payload)));
    await assert.rejects(fetchCatalogItems(), e => e.type === 'invalid-data');
  });
}

test('DEV fields map to the card contract and supported filters', () => {
  const card = normalizeItem({ id: 42, title: 'Diseño con React Native', description: 'Ejemplo', cover_image: 'https://example.com/cover.png', tag_list: ['reactnative', 'design'], reading_time_minutes: 4 });
  assert.deepEqual(card, { id: '42', title: 'Diseño con React Native', subtitle: 'Diseño', description: 'Ejemplo', image: 'https://example.com/cover.png', badge: 'REACTNATIVE', meta: 'Lectura: 4 min' });
});

test('missing optional fields have usable fallbacks', () => {
  const card = normalizeItem({ id: 1, tag_list: ['unknown'] });
  assert.equal(card.subtitle, 'Desarrollo');
  assert.equal(card.title, 'Elemento #1');
  assert.equal(card.description, 'Sin descripción disponible.');
  assert.match(card.image, /^https:\/\//);
});
