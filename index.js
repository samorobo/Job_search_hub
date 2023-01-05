
const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

 app.use((_req, res, next) => {
 res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');

  next();
 });

app.get('/search', async (req, res) => {
  const searchQuery = req.query.q; // get the search query from the request query string
  const pageNumber = req.query.pn; // get the page number from the request query string

  // Call the run() function with the search query and page number
  const results = await run(searchQuery, pageNumber);

  // Send the results as a JSON response
  res.json(results);
});

app.listen(5500, () => {
  console.log('Server listening on port 5500');
});

async function run(searchQuery, pageNumber) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Use the search query and page number to generate the URL
const url = `https://www.simplyhired.com/search?q=${searchQuery}&sb=dd&pn=${pageNumber}&job`;

//const url = `https://www.simplyhired.com/search?q=accountant&sb=dd&pn=1&job`;




  await page.goto(url, { waitUntil: 'networkidle2' });

  const pageJobs = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('#job-list .SerpJob-jobCard.card'),
      (e) => ({
        title: e.querySelector('h3').innerText,
        location: e.querySelector('.jobposting-location span').innerText,
        Description: e.querySelector('p').innerText,
        url: e.querySelector('.jobposting-title a').href,
      })
    )
  );

  await browser.close();

  // console.log(pageJobs)
  return pageJobs;
}
