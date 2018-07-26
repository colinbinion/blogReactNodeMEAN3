const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');

});

afterEach(async () => {
  await browser.close();
});

test('header has correct text', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  // const browser = await puppeteer.launch({
  //   headless: false
  // });
  // const page = await browser.newPage();
  // await page.goto('localhost:3000');

  // const text = await page.$eval('a.brand-logo', el => el.innerHTML);

  expect(text).toEqual('Blogster');
});

test('click login initiates oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  console.log('====================================');
  console.log(url);
  console.log('====================================');
});
