import puppeteer from 'puppeteer';


const main = async()=>{

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.goto('https://beyondchats.com/blogs/');

const lastpage= await page.evaluate(()=>{
 
    const nav = document.querySelector('.ct-pagination');
    const pagenoe=nav.querySelectorAll('.page-numbers');
    const data=Array.from(pagenoe).map(el=>{
        return el.innerText;
        })
   
    return data[data.length-2]

});

console.log(lastpage);
let base_url = 'https://beyondchats.com/blogs/page';


await page.goto(`${base_url}/${lastpage}/`);

const allarticles = await page.evaluate(()=>{
   const articles = document.querySelectorAll('article')
   return Array.from(articles).slice(0,5).map((article)=>{
     const title = article.querySelector('a').getAttribute('aria-label');
     const url = article.querySelector('a').getAttribute('href');
     return {title,url}
   })
});

await browser.close();

console.log(allarticles);

}


main();