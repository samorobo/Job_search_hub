const puppeteer = require("puppeteer");

const sleep = ms => new Promise(resolve => setTimeout(resolve), ms);

const scrapeTextSelectors = async (browser, url, textSelectors) => {
  let page;

  try {
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(50 * 1000);
    page.goto(url);
    const dataPromises = textSelectors.map(async ({name, sel}) => {
      await page.waitForSelector(sel);
      return [name, await page.$eval(sel, e => e.innerText)];
    });
    return Object.fromEntries(await Promise.all(dataPromises));
  }
  finally {
    page?.close();
  }
};

const urls = [
  "https://www.youtube.com/watch?v=cw9FIeHbdB8",
  "https://www.youtube.com/watch?v=imy1px59abE",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
];
const textSelectors = [
  {name: "channel", sel: "#text > a"},
  {name: "title", sel: "#container > h1"},
  {name: "views", sel: ".view-count"},
  {name: "subs", sel: "#owner-sub-count"},
];

let browser;
(async () => {
  browser = await puppeteer.launch({headless: true});

  for (;; await sleep(60 * 1000)) {
    const data = await Promise.allSettled(urls.map(url => 
      scrapeTextSelectors(browser, url, textSelectors)
    ));
    console.log(data);
  }
})()
  .catch(err => console.error(err))
  .finally(() => browser?.close())
;