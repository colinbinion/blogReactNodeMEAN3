const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');

});

test('launching browser', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  // const browser = await puppeteer.launch({
  //   headless: false
  // });
  // const page = await browser.newPage();
  // await page.goto('localhost:3000');

  // const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});
