const BASE_URL = 'http://localhost:5000'
//FOR FETCHING EVERY ARTICLE
export async function fetchArticles(){

    const response = await fetch(`${BASE_URL}/articles`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
        },
    })

    if (!response.ok) {
    throw new Error('Failed to fetch articles')
  }

  return response.json()

}

//FOR FETCHING BY ID
export async function fetchArticleById(id) {
  const response = await fetch(`${BASE_URL}/articles/${id}`,{
    method : 'GET',
    headers: {
        'Content-Type' : 'application/json',
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch article')
  }

  return response.json()
}
//For ENRICH
export async function enrichArticle(id) {
  const response = await fetch(`${BASE_URL}/articles/${id}/enrich`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to enrich article')
  }

  return response.json()
}
