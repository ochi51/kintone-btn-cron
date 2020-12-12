const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

const AWS = require('aws-sdk');
const SSM = new AWS.SecretsManager();

const env = async () => {
  const value = await SSM.getSecretValue({SecretId: process.env.SecretId}).promise();
  return JSON.parse(value.SecretString);
};

exports.handler = async (event, context) => {

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
  });
  const page = await browser.newPage();

  const data = await env();
  const domain = data.DOMAIN;
  const username = data.USERNAME;
  const password = data.PASSWORD;
  const url = data.APP_URL;
  const id = data.ELEMENT_ID;
  console.log(domain, username, password, url, id);

  // ログイン
  await page.goto(domain + '/login', {waitUntil: 'networkidle2'});
  await page.type('input[name=username]', username);
  await page.type('input[name=password]', password);
  await (await page.$('input[type=submit]')).click();
  await page.waitForResponse(domain);

  // ボタンクリック
  await page.goto(url, {waitUntil: 'networkidle2'});
  await page.waitForSelector('#' + id);
  await page.click('#' + id);

  // ボタンクリックに非同期処理がないパターン
  // ボタンのテキストをコンソールログに出る
  const element = await page.$('#' + id);
  console.log(await (await element.getProperty('innerText')).jsonValue());

  // ボタンクリック後に特定の要素が生成されるパターン
  // タイムアウトを変更する場合は、template.yml の KintoneBtnCron の Timeout も合わせて変更する方が良い
  // await page.waitForSelector('#hoge', {timeout: 30000});

  // ボタンクリック後にリロードされるパターン
  // タイムアウトを変更する場合は、template.yml の KintoneBtnCron の Timeout も合わせて変更する方が良い
  // await page.waitForNavigation({timeout: 30000});

  // ボタンクリック後のフックがなく、指定時間待つことで解決するパターン
  // タイムアウトを変更する場合は、template.yml の KintoneBtnCron の Timeout も合わせて変更する方が良い
  // await page.waitForTimeout(30000);
}
