import { minimalScrapper } from "./all_scrapper.js";
import { structureWithLLM } from "./llm_structurer.js";
const API_BASE = 'http://localhost:5000';
const id = 2 //for testing i have set it as 2.

async function getArticles() {
   const res = await fetch(`http://localhost:5000/articles/`)
  return await res.json();
}

async function googleSearch(title) {
  const query = `${title} blogs`;

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1` +
    `?key=${process.env.API_KEY}` +
    `&cx=${process.env.CX}` +
    `&q=${encodeURIComponent(query)}`
  );

  const data = await res.json();


  if (!data.items || data.items.length === 0) {
    console.warn('⚠️ No search results found');
    return [];
  }

  return data.items.slice(0, 2).map(item => ({
    title: item.title,
    link: item.link
  }));
}

async function updateArticle(id, url,content, source="groq-llm") {
  const res = await fetch(`${API_BASE}/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      content,
      source,
      url
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update article ${id}: ${err}`);
  }

  return res.json();
}


const main = async()=>{

 const allarticles = await getArticles();
 console.log(allarticles)

   for (const article of allarticles) {

    console.log('Processing:', article.title);
    

    
  // 1. Google search using title
  //2. Fetch top 2 external articles
   const newarticles = await googleSearch(article.title)
  console.log(newarticles)
  // 3. Scrape their content
  const all_content=[]
  const all_url=[]
  for ( const newarticle of newarticles){
    const content =await  minimalScrapper(newarticle.link)
    all_content.push(content);
    all_url.push(newarticle.link)
  }
   console.log("Scraped contents length:", all_content.map(c => c.length));

   // 4. Send to LLM
  const structured = await structureWithLLM({
  originalTitle: article.title,
  originalContent: article.content,
  externalContents: all_content
});
  
const urlString = JSON.stringify(all_url);
console.log("🧠 LLM Structured JSON Output:\n", structured);
const updateres=await updateArticle(article.id, urlString,structured, "groq-llm")
console.log(updateres)

  }

    

}


main();