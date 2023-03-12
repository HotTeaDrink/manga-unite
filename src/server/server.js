const express = require("express");
const mysql = require("mysql");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const app = express();
const port = 8000;
const table = "Sounds";

/*const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PWD,
  database: process.env.MYSQL_DB,
});*/

app.get("/screenshot", async (req, res) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://chapmanganato.com/manga-tz953334/chapter-104"); // URL is given by the "user" (your client-side application)
  htmlContent = await page.content(); // Get the HTML content of the page

  // Respond with the html content

  $ = cheerio.load(htmlContent);
  let div = $("div.container-chapter-reader").html();

  //get the image url from the div

  let img = []; //array to store the image urls

  $("img", div).each(function(i, elem) {
    img[i] = $(this).attr("src");
  });

  //fetching the image from the url and puting it in the div

  for (let i = 0; i < img.length; i++) {
    try {
      fetch(img[i], {
        method: "GET",
        headers: {
          referer: "https://chapmanganato.com",
          refererPolicy: "no-referrer-when-downgrade",
          mode: "no-cors",
        },
      })
        .then((res) => res.blob())
        .then((blob) => {
          console.log(blob);
        });
    } catch (error) {
      console.log(error);
    }
  }

  //respond with the html content

  res.writeHead(200, {
    "Content-Type": "text/html",
    "Content-Length": div.length,
    referer: "https://chapmanganato.com",
  });

  res.end(div);

  await browser.close();
});

app.listen(port, () => {
  console.log(`App server now listening to port ${port}`);
});