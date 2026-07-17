import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.toString()));
  await page.goto('http://localhost:3000/#/');
  await new Promise(r => setTimeout(r, 1000));
  // click the first review link
  await page.evaluate(() => {
     document.querySelector('a[href^="#/reviews/"]').click();
  });
  await new Promise(r => setTimeout(r, 2000));
  console.log('ERRORS:', errors);
  await browser.close();
})();
