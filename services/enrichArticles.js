import { minimalScrapper } from "../scrappers/minimalScrapper.js"
import { structureWithLLM } from "./llm_structurer.js"
import db from '../database/db.js'



function fetchArticleById(id) {
  const stmt = db.prepare('SELECT * FROM articles WHERE id = ?')
  const article = stmt.get(id)
  if (!article) throw new Error('Article not found')
  return article

}

async function googleSearch(title) {
  const query = `${title} blogs`

  const res = await fetch(
    `https://www.googleapis.com/customsearch/v1` +
      `?key=${process.env.API_KEY}` +
      `&cx=${process.env.CX}` +
      `&q=${encodeURIComponent(query)}`
  )

  const data = await res.json()

  if (!data.items || data.items.length === 0) {
    return []
  }

  return data.items.slice(0, 2).map(item => ({
    title: item.title,
    link: item.link
  }))
}

async function updateArticle(id, url, content, source = "groq-llm") {
   const stmt = db.prepare(`
    UPDATE articles
    SET structured_content = ?, new_source = ?, url = ?
    WHERE id = ?
  `)
  const result = stmt.run(content, source, url, id)
  return {
    success: true,
    updatedId: id,
    changes: result.changes
  }
}

/**
 *  MAIN SERVICE FUNCTION
 */
export async function enrichArticleById(id) {
  const article = await fetchArticleById(id)

  console.log('Enriching:', article.title)

  // 1. Google search
  const newArticles = await googleSearch(article.title)

  // 2. Scrape content
  const externalContents = []
  const sourceUrls = []

  for (const item of newArticles) {
    const content = await minimalScrapper(item.link)
    externalContents.push(content)
    sourceUrls.push(item.link)
  }

  // 3. LLM structuring
  const structured = await structureWithLLM({
    originalTitle: article.title,
    originalContent: article.content,
    externalContents
  })

  // 4. Save back to DB
  return await updateArticle(
    id,
    JSON.stringify(sourceUrls),
    structured,
    "groq-llm"
  )
}
