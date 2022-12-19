const fs = require('fs');
const puppeteer = require('puppeteer');

//Async function for using pupeteer
async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.simplyhired.com/search?q=remote&sb=dd&job');
   await page.click(".pagination .next-pagination a").href;
//    let i = 0;
//    while (i <= 20){
//     await page.click(".pagination .next-pagination a").href;
//    }
  

//page evealuation into JSON format
    const jobs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#job-list .SerpJob-jobCard.card'), (e) => ({
            title: e.querySelector('h3').innerText,
            //company: e.querySelector('.Jobposting-labelWithIcon .jobposting-company').innerText,
            Description: e.querySelector('p').innerText,
            url: e.querySelector('.jobposting-title a').href,
        })));
    

        //console.log(jobs);
// Save data to a JSON file
fs.writeFile('jobs.json', JSON.stringify(jobs), (err) => {
    if (err) throw err;
    console.log('File saved');
});
    

    await browser.close();
}

run();