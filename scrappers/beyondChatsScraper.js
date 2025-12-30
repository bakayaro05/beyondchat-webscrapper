// scrappers/beyondChatsScraper.js
import puppeteer from "puppeteer";

async function scrapeBeyondChats() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://beyondchats.com/blogs/');

  const lastpage = await page.evaluate(() => {
    const nav = document.querySelector('.ct-pagination');
    const pages = nav.querySelectorAll('.page-numbers');
    return pages[pages.length - 2].innerText;
  });

  const base_url = 'https://beyondchats.com/blogs/page';
  await page.goto(`${base_url}/${lastpage}/`);

  const allarticles = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article'))
      .slice(0, 5)
      .map(article => ({
        title: article.querySelector('a').getAttribute('aria-label'),
        url: article.querySelector('a').getAttribute('href')
      }));
  });

  const fullArticles = [];
  const source = "https://beyondchats.com/blogs";

  for (const article of allarticles) {
    const page2 = await browser.newPage();
    await page2.goto(article.url, { waitUntil: "domcontentloaded" });

    const content = await page2.evaluate(() => {
      const container = document.querySelector(
        'div.elementor-widget-theme-post-content'
      );
      return container ? container.innerText.trim() : '';
    });

    await page2.close();

    fullArticles.push({ ...article, content, source });
  }

  await browser.close();
  return fullArticles;
}

export { scrapeBeyondChats };
