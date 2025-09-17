import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './contexts/AuthContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'
import PostsPage from './pages/PostsPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <FeedbackProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/posts/p/:page" element={<PostsPage />} />
            <Route path="/@:username" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </FeedbackProvider>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App