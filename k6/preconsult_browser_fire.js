// En este código se analiza cuando usuarios anonimos aparecen en la base de datos de fire base. 
// Se pudo confirmar que 66. 
import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ui: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
       { duration: '20s', target: 10 },  // warm-up
        { duration: '20s', target: 20 },
        { duration: '20s', target: 20 },
        { duration: '20s', target: 0 },   // ramp-down
      ],
      options: { browser: { type: 'chromium' } },
    },
  },
};

export default async function () {
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  // marcador único por VU + timestamp (sirve para buscar en DB/logs)
  const marker = `k6_${Date.now()}_vu${__VU}`;
  const url = `https://app.dzeus.com/account/preconsult/1?k6run=${marker}`;

  let ok = false;

  try {
    // Log de requests "sospechosos" de tracking/session
    page.on('request', (req) => {
      const u = req.url();
      if (/track|event|audit|visit|anon|session|log|analytics|\/api\//i.test(u)) {
        console.log(`[VU ${__VU}] REQ ${req.method()} ${u}`);
      }
    });

    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const status = res ? res.status() : 0;

    await page.waitForSelector('body', { timeout: 15000 });

    const finalUrl = page.url();
    const html = await page.content();

    // “anónimo” normalmente NO debería mandarte a login
    const pareceLoginUrl = /login|sign-in|auth/i.test(finalUrl);
    const pareceLoginHtml = /password|sign in|log in|iniciar sesi[oó]n/i.test(html);

    ok = status >= 200 && status < 500 && !pareceLoginUrl && !pareceLoginHtml;

    // evidencia en consola para correlacionar con DB/logs
    console.log(`[VU ${__VU}] marker=${marker} status=${status} finalUrl=${finalUrl}`);

    // (opcional) screenshot evidencia
    // await page.screenshot({ path: `screenshots/${marker}.png` });
  } catch (e) {
    console.log(`[VU ${__VU}] ERROR: ${String(e)}`);
    ok = false;
  } finally {
    check(ok, { 'Entró anónimo (no login) y cargó': (v) => v === true });

    // Mantener la página abierta para que haya más tiempo de tráfico/actividad
    sleep(8); // <-- pon 5, 10, 20 segundos, lo que quieras

    await page.close();
  }
  sleep(1);
}
