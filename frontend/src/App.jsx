import { Routes, Route } from 'react-router-dom'
import ArticleList from './pages/ArticleList'
import ArticleDetail from './pages/ArticleDetail'

export default function App() {
  return (
    <Routes>
      <Route index element={<ArticleList />} />
      <Route path="articles/:id" element={<ArticleDetail />} />
    </Routes>
  )
}
