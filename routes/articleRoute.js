import express from 'express'
import db from '../database/db.js'
import {enrichArticleById} from '../services/enrichArticles.js'
const router = express.Router()

//FOR READING. (R)
router.get('/', async (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM articles').all();

    if (rows.length === 0) {
      console.log("DB empty → scraping...");
      const { scrapeBeyondChats } = await import('../scrappers/beyondChatsScraper.js');
      const scrapedArticles = await scrapeBeyondChats();
      console.log("Scraped articles:", scrapedArticles);
      const insert = db.prepare(`
        INSERT INTO articles (title, url, content, source)
        VALUES (?, ?, ?, ?)   
      `);

      for (const a of scrapedArticles) {
  insert.run(a.title, a.url, a.content,a.source);
}

      const rowsAfterInsert = db.prepare('SELECT * FROM articles').all();
      return res.json(rowsAfterInsert);

    }

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//FOR READING. (R) with id
router.get('/:id',(req,res)=>{
    try {
const {id}=req.params
 const getArticles=db.prepare('SELECT * FROM articles where id = ?')
 const articles=getArticles.get(id)
 res.json(articles)
    }
    catch(err){
         res.status(500).json({ error: err.message });
    }
})


//Creating a new article. (C)
router.post('/',(req,res)=>{


try{
  const {title,url,content,source}=req.body;
  const insertArticle=db.prepare('INSERT INTO articles (title,url,content,source)  VALUES (?,?,?,?)')
  const result = insertArticle.run(title,url,content,source)
  res.json({id :  result.lastInsertRowid, title : title})
}
catch(err){
    res.status(500).json({error : err.message});
}

})

//Updating a new article. (U)

router.put('/:id',(req,res)=>{

  try{

    const {id} =req.params
    const {content , source, url} = req.body

    const updateArticle= db.prepare('UPDATE articles SET  structured_content = ? ,  new_source = ?, url = ? WHERE id = ? ')
    updateArticle.run(content,source,url,id)
     res.json({message : "Updated."})     

  }
  catch(err){
    res.status(500).json({error:err.message});
  }


})

//For deleting (D)

router.delete('/:id', (req, res) => {
  try {
    const del = db.prepare('DELETE FROM articles WHERE id = ?');
    const result = del.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json({message : "Deleted."});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Enrich article using LLM pipeline
router.post('/:id/enrich', async (req, res) => {
  try {
    const { id } = req.params
    const result = await enrichArticleById(id)
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


export default router;