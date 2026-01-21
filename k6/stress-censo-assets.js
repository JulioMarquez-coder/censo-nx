import http from 'k6/http';
import { check, sleep } from 'k6';

// ✅ Cambia esto si quieres:
// - "main"  = baja solo assets principales (recomendado)
// - "all"   = baja TODO lo que encuentre (más pesado)
const ASSET_MODE = __ENV.ASSET_MODE || 'main';

// Límites para evitar bajar 200 cosas y romper tu máquina/Internet
const MAX_MAIN_ASSETS = Number(__ENV.MAX_MAIN_ASSETS || 8); // principales
const MAX_ALL_ASSETS = Number(__ENV.MAX_ALL_ASSETS || 25);  // todos

export const options = {
  scenarios: {
    stress_entry: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '15s', target: 50 },
        { duration: '30s', target: 200 },
        { duration: '30s', target: 500 },
        { duration: '30s', target: 1000 },
        { duration: '15s', target: 0 },
      ],
      gracefulRampDown: '30s',
      gracefulStop: '30s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<2000'],
  },
};

function unique(arr) {
  return Array.from(new Set(arr));
}

function resolveUrl(baseUrl, maybeRelative) {
  try {
    return new URL(maybeRelative, baseUrl).toString();
  } catch (_) {
    return null;
  }
}

function extractAssets(html, baseUrl) {
  // Saca src/href típicos de scripts y stylesheets
  const urls = [];

  // <script src="...">
  const scriptRe = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  while ((m = scriptRe.exec(html)) !== null) {
    const u = resolveUrl(baseUrl, m[1]);
    if (u) urls.push(u);
  }

  // <link rel="stylesheet" href="...">
  const cssRe = /<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  while ((m = cssRe.exec(html)) !== null) {
    const u = resolveUrl(baseUrl, m[1]);
    if (u) urls.push(u);
  }

  // (Opcional) preload/prefetch que a veces trae JS/CSS principales
  const preloadRe = /<link[^>]+rel=["']preload["'][^>]+href=["']([^"']+)["'][^>]*>/gi;
  while ((m = preloadRe.exec(html)) !== null) {
    const u = resolveUrl(baseUrl, m[1]);
    if (u) urls.push(u);
  }

  return unique(urls);
}

function pickMainAssets(assetUrls) {
  // Heurística simple: prioriza JS/CSS (bundle) y cosas "main"
  const js = assetUrls.filter((u) => u.includes('.js') || u.includes('javascript'));
  const css = assetUrls.filter((u) => u.includes('.css'));

  const prioritized = [
    ...js.filter((u) => /main|runtime|polyfills|vendor|chunk/i.test(u)),
    ...css,
    ...js,
  ];

  return unique(prioritized).slice(0, MAX_MAIN_ASSETS);
}

export default function () {
  const url = 'https://app.dzeus.com/account/preconsult/1';

  // 1) HTML inicial
  const res = http.get(url, {
    redirects: 5,
    tags: { name: 'entry_html' },
    responseType: 'text',
    headers: {
      'User-Agent': 'k6-stress',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  check(res, {
    'HTML status 200/3xx': (r) =>
      r.status === 200 || (r.status >= 300 && r.status < 400),
    'HTML content-type presente': (r) =>
      (r.headers['Content-Type'] || '').length > 0,
    'HTML tiene contenido': (r) =>
      typeof r.body === 'string' && r.body.length > 0,
  });

  // Si por alguna razón no hay body, no sigas a assets para evitar errores
  if (!res.body) {
    sleep(1);
    return;
  }

  // 2) Extraer assets desde el HTML
  const allAssets = extractAssets(res.body, url);

  // 3) Elegir cuáles bajar
  let chosen;
  if (ASSET_MODE === 'all') {
    chosen = allAssets.slice(0, MAX_ALL_ASSETS);
  } else {
    chosen = pickMainAssets(allAssets);
  }

  // 4) Bajar assets en batch (en paralelo)
  if (chosen.length > 0) {
    const reqs = chosen.map((assetUrl) => [
      'GET',
      assetUrl,
      null,
      {
        redirects: 3,
        tags: { name: 'assets' },
        headers: {
          'User-Agent': 'k6-stress',
          Accept: '*/*',
        },
      },
    ]);

    const responses = http.batch(reqs);

    // Checks básicos para assets
    check(responses, {
      'Assets: todos 200/3xx': (arr) =>
        arr.every((r) => r && (r.status === 200 || (r.status >= 300 && r.status < 400))),
      'Assets: content-type presente': (arr) =>
        arr.every((r) => r && (r.headers['Content-Type'] || '').length > 0),
    });
  }

  sleep(1);
}
