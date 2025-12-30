import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../api/articles'

export default function ArticleList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchArticles()
      .then(data => {
        setArticles(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2>Articles</h2>

      {articles.map(article => (
        <div key={article.id}>
          <Link to={`/articles/${article.id}`}>
            {article.title}
          </Link>
        </div>
      ))}
    </div>
  )
}
