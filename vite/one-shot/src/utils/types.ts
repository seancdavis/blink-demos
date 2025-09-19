export type User = {
  id: string;
  username: string;
  password: string;
  avatarSrc: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
};

export type PostWithUser = Post & {
  user: User;
  date: string;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
};

export type PaginationData = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPosts: number;
};

export type FeedbackType = 'error' | 'success' | 'info';

export type FeedbackData = {
  type: FeedbackType;
  message: string;
};