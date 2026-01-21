import http from 'k6/http';
import { check, sleep } from 'k6';

/**
 * options = configuración global del test.
 * Aquí defines:
 * - cómo se va a ejecutar (scenarios)
 * - qué condiciones deben cumplirse (thresholds)
 */
export const options = {
  scenarios: {
    /**
     * stress_entry = nombre del escenario (puedes tener varios).
     * executor: 'ramping-vus' = k6 sube/baja la cantidad de usuarios virtuales (VUs) por etapas.
     */
    stress_entry: {
      executor: 'ramping-vus',

      // startVUs: cuántos VUs empiezan al segundo 0
      startVUs: 0,

      /**
       * stages = rampa de carga. Cada stage tiene:
       * - duration: cuánto dura esa etapa
       * - target: a cuántos VUs quiere llegar y mantener durante esa etapa
       */
      stages: [
        { duration: '15s', target: 50 },    // warm-up: calienta (evita “shock” inicial)
        { duration: '30s', target: 200 },   // ramp: sube a 200
        { duration: '30s', target: 500 },   // ramp 2: sube a 500
        { duration: '30s', target: 1000 },  // stress fuerte: sube a 1000
        { duration: '15s', target: 0 },     // cool-down: baja a 0 (termina)
      ],

      /**
       * gracefulRampDown: si la rampa baja de VUs, permite que terminen “con calma”
       * en vez de matar VUs de golpe.
       */
      gracefulRampDown: '30s',

      /**
       * gracefulStop: cuando termina el escenario, k6 da este tiempo para que
       * los VUs terminen la iteración actual antes de cortar.
       */
      gracefulStop: '30s',
    },
  },

  /**
   * thresholds = reglas de "pasa / falla".
   * Si se violan, el test se considera fallido (aunque termine).
   */
  thresholds: {
    // rate<0.02 = menos de 2% de requests fallidos
    http_req_failed: ['rate<0.02'],

    // p(95)<2000 = el 95% de las requests deben ser < 2000 ms (2s)
    http_req_duration: ['p(95)<2000'],
  },
};

/**
 * default function = lo que hace cada VU en un loop.
 * Cada VU repite esto una y otra vez durante el tiempo del escenario.
 */
export default function () {
  // La ruta que estás estresando (entrada/HTML inicial)
  const url = 'https://app.dzeus.com/account/preconsult/1';

  /**
   * http.get = hace una petición HTTP GET.
   * res = respuesta (status, headers, body, timings, etc.)
   */
  const res = http.get(url, {
    // redirects: permite seguir redirects (302, 301, etc.) hasta 5 saltos
    redirects: 5,

    /**
     * tags: etiquetas para agrupar métricas.
     * Útil si luego haces más requests (assets, APIs, etc.)
     * y quieres ver métricas separadas por "name".
     */
    tags: { name: 'dzeus_entry_html' },

    // responseType: 'text' = k6 tratará el body como texto (HTML)
    responseType: 'text',

    // headers: simula un navegador básico (no exacto, pero razonable)
    headers: {
      'User-Agent': 'k6-stress',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
  });

  /**
   * check() = validaciones.
   * Si un check falla, NO detiene el test, pero cuenta en "checks_failed"
   * y puede afectar thresholds si tú pones thresholds sobre checks.
   */
  check(res, {
    // Acepta 200 OK o cualquier 3xx (redirect)
    'status 200/3xx': (r) =>
      r.status === 200 || (r.status >= 300 && r.status < 400),

    // Verifica que exista Content-Type (ej: text/html)
    'content-type presente': (r) =>
      (r.headers['Content-Type'] || '').length > 0,

    // Verifica que el body exista y tenga contenido
    'tiene contenido': (r) =>
      typeof r.body === 'string' && r.body.length > 0,
  });

  /**
   * sleep(1) = "think time".
   * Hace que cada usuario espere 1 segundo antes de repetir el loop.
   * Sin esto, los VUs harían requests lo más rápido posible (menos realista).
   */
  sleep(1);
}
