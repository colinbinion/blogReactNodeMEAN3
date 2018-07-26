const puppeteer = require('puppeteer');

test('adds two numbers', () => {
  const sum = 1 + 2;

  expect(sum).toEqual(3);
});

test('launching browser', async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto('localhost:3000');
});
