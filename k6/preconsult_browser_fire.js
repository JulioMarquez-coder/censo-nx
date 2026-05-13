// Julio A. Márquez Torres

/**
 Prueba con k6 + navegador para validar acceso anónimo
 en una página de preconsulta.
 
 Propósito:
 Este script simula múltiples usuarios accediendo a una URL
 de preconsulta sin autenticarse, con el fin de verificar si la aplicación
 permite la entrada anónima y registrar evidencia útil para análisis
 en logs o en la base de datos.
 
 Objetivo de la prueba:
  - Confirmar que usuarios anónimos pueden acceder a la página.
  - Generar actividad que varios usuarios entren para observar comportamiento de la aplicación.
 
  Herramientas utilizadas:
  - k6
  - k6/browser
  - Chromium
 */

import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

/**
  Configuración del escenario de carga.
 
  Se usa "ramping-vus" para aumentar y reducir gradualmente
  la cantidad de usuarios virtuales (VUs).
 
  Flujo del escenario:
  - Comienza con 1 usuario virtual.
  - Sube progresivamente hasta 20 usuarios.
  - Mantiene carga estable.
  - Luego reduce la carga hasta 0.
 */
export const options = {
  scenarios: {
    ui: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '20s', target: 10 }, // calentamiento inicial
        { duration: '20s', target: 20 }, // aumenta la carga
        { duration: '20s', target: 20 }, // se mantiene la carga
        { duration: '20s', target: 0 },  // finalización gradual
      ],
      options: {
        browser: { type: 'chromium' },
      },
    },
  },
};

export default async function () {
  // Crea una nueva página del navegador para cada usuario virtual
  const page = await browser.newPage();

  // Define el tiempo máximo de espera para navegación
  page.setDefaultNavigationTimeout(60000);

  /**
    Se genera un identificador único por usuario virtual y tiempo,
    útil para relacionar tráfico con registros en base de datos o logs.
   */
  const marker = `k6_${Date.now()}_vu${__VU}`;

  /**
    URL bajo prueba.
    Se añade el parámetro k6run para identificar cada ejecución.
   */
  const url = `https://app.dzeus.com/account/preconsult/1?k6run=${marker}`;

  // Variable que almacenará si la validación fue exitosa o no
  let ok = false;

  try {
    /**
      Escucha solicitudes que podrían estar relacionadas con:
      - tracking
      - sesiones
      - eventos
      - auditoría
      - analytics
    * - endpoints de API
       Esto permite observar actividad relevante durante la prueba.
     */
    page.on('request', (req) => {
      const u = req.url();
      if (/track|event|audit|visit|anon|session|log|analytics|\/api\//i.test(u)) {
        console.log(`[VU ${__VU}] REQ ${req.method()} ${u}`);
      }
    });

    
     // Navega hacia la URL objetivo esperando a que cargue el DOM.
    
    const res = await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    // Obtiene el código de estado HTTP de la respuesta
    const status = res ? res.status() : 0;

    // Espera a que exista el body de la página antes de continuar
    await page.waitForSelector('body', { timeout: 15000 });

    // Obtiene la URL final y el contenido HTML de la página cargada
    const finalUrl = page.url();
    const html = await page.content();

    /**
      Validaciones para determinar si el acceso fue realmente anónimo:
      - La URL final no debe apuntar a login.
      - El HTML no debe contener indicadores típicos de pantalla de login.
     */
    const pareceLoginUrl = /login|sign-in|auth/i.test(finalUrl);
    const pareceLoginHtml = /password|sign in|log in|iniciar sesi[oó]n/i.test(html);

    /**
      Se considera éxito si:
      - el estado HTTP está entre 200 y 499,
      - no hubo redirección a login,
      - y el contenido no parece una pantalla de autenticación.
     */
    ok = status >= 200 && status < 500 && !pareceLoginUrl && !pareceLoginHtml;

    /**
     Registro en consola para facilitar correlación con evidencia
     en logs o base de datos.
     */
    console.log(`[VU ${__VU}] marker=${marker} status=${status} finalUrl=${finalUrl}`);


  } catch (e) {
    /**
     Si ocurre un error durante la navegación o validación,
     se registra en consola y se marca la prueba como fallida.
     */
    console.log(`[VU ${__VU}] ERROR: ${String(e)}`);
    ok = false;
  } finally {
    /**
     Verificación final del caso de prueba.
     Confirma que el usuario anónimo logró entrar sin ser enviado a login.
     */
    check(ok, {
      'Entró anónimo (no login) y cargó': (v) => v === true,
    });

    /**
     Se mantiene la página abierta unos segundos para generar
     más tráfico y actividad antes de cerrarla.
     */
    sleep(8);

    // Cierra la página del navegador
    await page.close();
  }

  // Pausa breve entre iteraciones
  sleep(1);
}