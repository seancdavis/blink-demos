import React, { useState, useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import Pagination from '../components/Pagination'
import type { PostWithUser, PaginationResult } from '@utils/types'

const PostsPage: React.FC = () => {
  const { page } = useParams<{ page: string }>()
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [pagination, setPagination] = useState<PaginationResult | null>(null)
  const [loading, setLoading] = useState(true)

  const currentPage = parseInt(page || '1')

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`/.netlify/functions/posts-list?page=${currentPage}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts)
          setPagination(data.pagination)
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [currentPage])

  if (loading) {
    return (
      <HelmetProvider>
        <Layout title={`Posts - Page ${currentPage}`}>
          <div className="container">
            <p>Loading...</p>
          </div>
        </Layout>
      </HelmetProvider>
    )
  }

  return (
    <HelmetProvider>
      <Layout title={`Posts - Page ${currentPage}`}>
        <div className="container">
          <h1>Posts - Page {currentPage}</h1>
          <div className="post-card-grid">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
          {pagination && <Pagination pagination={pagination} />}
        </div>
      </Layout>
    </HelmetProvider>
  )
}

export default PostsPage