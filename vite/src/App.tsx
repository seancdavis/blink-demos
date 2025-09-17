import { Route, Routes } from 'react-router-dom'
import AuthGuard from './components/AuthGuard'
import { AuthProvider } from './contexts/AuthContext'
import { FeedbackProvider } from './contexts/FeedbackContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PostPage from './pages/PostPage'
import ProfilePage from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <SettingsPage />
              </AuthGuard>
            }
          />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </FeedbackProvider>
    </AuthProvider>
  )
}

export default App
