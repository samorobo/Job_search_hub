const fs = require('fs');
const puppeteer = require('puppeteer');

//Async function for using pupeteer
async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.simplyhired.com/');

    await page.type('.TextInput-field', 'Remote');
    await page.click('button.HomepageSearchBar-searchSubmitButton');
    await page.click(".pagination .next-pagination a");

//page evealuation into JSON format
    const jobs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('#job-list .SerpJob-jobCard.card'), (e) => ({
            title: e.querySelector('.jobposting-title h3').innerText,
            company: e.querySelector('.Jobposting-labelWithIcon .jobposting-company').innerText,
            Description: e.querySelector('.jobposting-snippet p').innerText,
            url: e.querySelector('.jobposting-title a').href,
           location: e.querySelector('.JobPosting-labelWithIcon .jobposting-location').innerText,
        })));
    

        console.log(jobs);
// Save data to a JSON file
// fs.writeFile('courses.json', JSON.stringify(courses), (err) => {
//     if (err) throw err;
//     console.log('File saved');
// });
    

    await browser.close();
}

run();