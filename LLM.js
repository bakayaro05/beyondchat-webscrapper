const API_BASE = 'http://localhost:5000';
const id = 2 //for testing i have set it as 2.

async function getArticles() {
   const res = await fetch(`http://localhost:5000/articles/`)
  return await res.json();
}

const main = async()=>{

 const allarticles = await getArticles();
 console.log(allarticles)

   for (const article of allarticles) {
    console.log('Processing:', article.title);

     // 🔴 THIS is the missing step
  // 1. Google search using title
  // 2. Fetch top 2 external articles
  // 3. Scrape their content
  // 4. Send to LLM
  }



}


main();