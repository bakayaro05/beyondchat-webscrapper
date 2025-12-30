import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchArticleById, enrichArticle } from '../api/articles'

export default function ArticleDetail() {
  const { id } = useParams()

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enriching, setEnriching] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticleById(id)
      .then(data => {
        setArticle(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Loading article...</p>
  if (error) return <p>Error: {error}</p>
  if (!article) return <p>Article not found</p>


    const handleEnrich = async () => {
    try {
      console.log("Enriching article ID:", article.id)
  
      setEnriching(true)
      await enrichArticle(id)

      // Re-fetch updated article
      const updated = await fetchArticleById(id)
      setArticle(updated)
    } catch (err) {
      alert('Failed to enrich article')
    } finally {
      setEnriching(false)
    }
  }


    return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>{article.title}</h2>

      <button onClick={handleEnrich} disabled={enriching}>
        {enriching ? 'Enriching...' : 'Enrich Article'}
      </button>

      <hr />

      <h3>Original Content</h3>
      <p style={{ whiteSpace: 'pre-line' }}>
        {article.content}
      </p>

      {article.structured_content && (
        <>
          <hr />
          <h3>Enriched Content</h3>
          <p style={{ whiteSpace: 'pre-line' }}>
            {article.structured_content}
          </p>
        </>
      )}

      {article.url && (
  <>
    <hr />
    <h4>References</h4>
    <p style={{ whiteSpace: 'pre-line' }}>
      {article.url}
    </p>
  </>
)}

    </div>
  )
}

