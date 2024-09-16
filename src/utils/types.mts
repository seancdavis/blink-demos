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
