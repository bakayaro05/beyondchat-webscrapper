import express from 'express'
import db from '../database/db.js'

const router = express.Router()

//FOR READING. (R)
router.get('/',(req,res)=>{
    try {
 const getArticles=db.prepare('SELECT * FROM articles')
 const articles=getArticles.all()
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
    const {content , source} = req.body

    const updateArticle= db.prepare('UPDATE articles SET  structured_content = ? ,  new_source = ? WHERE id = ? ')
    updateArticle.run(content,source,id)
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







export default router;