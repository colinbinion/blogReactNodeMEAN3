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
  // await browser.close();
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

  expect(url).toMatch(/accounts\.google\.com/)
});

test.only('signed in shows logout button', async () => {
  const id = '5b566378388f8b26e5729aa5';

  const Buffer = require('safe-buffer').Buffer;
  const sessionObject = {
    passport: {
      user: id
    }
  };
  const sessionString = Buffer.from(JSON.stringify(sessionObject)).toString('base64');

  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=', +sessionString);

  console.log('====================================');
  console.log(sessionString, sig);
  console.log('====================================');

  await page.setCookie({
    name: 'session',
    value: sessionString
  });
  await page.setCookie({
    name: 'session.sig',
    value: sig
  });
  await page.reload('localhost:3000');
  await page.waitFor('a[href="/auth/logout"]');

  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
});
