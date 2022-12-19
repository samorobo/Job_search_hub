const fs = require('fs');
const puppeteer = require('puppeteer');

//Async function for using pupeteer
async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.simplyhired.com/search?q=remote');

    //await page.type('.TextInput-field', 'Remote');
   // const navigationPromise = page.waitForNavigation({ waitUntil: ['load', 'networkidle2'] });
    //await page.click('.simple-item');
    

//page evealuation into JSON format
    const jobs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#job-list .SerpJob-jobCard.card'), (e) => ({
            title: e.querySelector('h3').innerText,
            //company: e.querySelector('.Jobposting-labelWithIcon .jobposting-company').innerText,
            Description: e.querySelector('p').innerText,
            url: e.querySelector('.jobposting-title a').href,
          // location: e.querySelector('.JobPosting-labelWithIcon .jobposting-location').innerText,
        })));
    
        await page.click(".pagination .next-pagination a");
        console.log(jobs);
// Save data to a JSON file
// fs.writeFile('jobs.json', JSON.stringify(jobs), (err) => {
//     if (err) throw err;
//     console.log('File saved');
// });
    

    await browser.close();
}

run();