const fs = require('fs');
const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    const simps = ['https://www.simplyhired.com/search?q=remote&sb=dd&job', 
                  'https://www.simplyhired.com/search?q=remote&sb=dd&pn=2&job',
                  'https://www.simplyhired.com/search?q=remote&sb=dd&pn=3&job',
                  'https://www.simplyhired.com/search?q=remote&sb=dd&pn=4&job',
                  'https://www.simplyhired.com/search?q=remote&sb=dd&pn=5&job'];

    let jobs = [];

    for (let i = 0; i < simps.length; i++) {
        const url = simps[i];

        await page.goto(url, { waitUntil: 'networkidle2' });

        const pageJobs = await page.evaluate(() =>
            Array.from(document.querySelectorAll('#job-list .SerpJob-jobCard.card'), (e) => ({
                title: e.querySelector('h3').innerText,
                location: e.querySelector('.jobposting-location span').innerText,
                Description: e.querySelector('p').innerText,
                url: e.querySelector('.jobposting-title a').href,
            })));

        fs.writeFileSync(`page${i}.json`, JSON.stringify(pageJobs));
        jobs = pageJobs;
    }

    await browser.close();
}

run();
