import { browser } from 'k6/browser';

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
};

export default async function () {
  const page = await browser.newPage();

  try {
    await page.goto('https://app.dzeus.com/account/preconsult/1');

    await page.waitForSelector('text=¿Quieres evitar salas de espera');

    await page.waitForTimeout(2000);
  } finally {
    await page.close();
  }
}
