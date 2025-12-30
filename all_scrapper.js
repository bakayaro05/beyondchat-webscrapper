import puppeteer from "puppeteer";


async function  minimalScrapper(link){
const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto(link)

await page.goto(link, { waitUntil: "domcontentloaded" });

// allow JS-rendered content
await new Promise(resolve => setTimeout(resolve, 2000));

// scroll to trigger lazy content
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

const content = await page.evaluate(() => {


  const paragraphs = Array.from(document.querySelectorAll("p"))
    .map(p => p.innerText.trim())
    .filter(text => text.length > 50); // remove junk

  const text = paragraphs.join("\n\n");

  // if meaningful, return
  if (text.length > 800) return text;

  // fallback
  return document.body.innerText.trim();
});

await browser.close();
return content;

}
export {minimalScrapper}