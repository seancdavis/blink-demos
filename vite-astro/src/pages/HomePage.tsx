import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import NewPostFormGate from '../components/NewPostFormGate'
import PostCard from '../components/PostCard'
import Pagination from '../components/Pagination'
import { useAuth } from '../contexts/AuthContext'
import type { PostWithUser, PaginationResult } from '@utils/types'

const HomePage: React.FC = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const [pagination, setPagination] = useState<PaginationResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/.netlify/functions/posts-list?page=1')
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
  }, [])

  if (loading) {
    return (
      <Layout title="Home Feed">
        <div className="container">
          <p>Loading...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Home Feed">
      <div className="container-xs">
        <NewPostFormGate user={user} />
      </div>
      <div className="container">
        <h1>Latest posts</h1>
        <div className="post-card-grid">
          {posts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
        {pagination && <Pagination pagination={pagination} />}
      </div>
    </Layout>
  )
}

export default HomePage