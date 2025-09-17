export type User = {
  id: string
  username: string
  password: string
  avatarSrc: string
}

export type Post = {
  id: string
  title: string
  content: string
  userId: string
  createdAt: string
}

export type PostWithUser = Post & { user: User } & {
  date: string
  postId: string
  content: string
}

export type PaginationResult = {
  postIds: string[]
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  totalPosts: number
}
