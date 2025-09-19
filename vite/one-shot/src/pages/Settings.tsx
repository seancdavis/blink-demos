import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Feedback } from '../components/Feedback';
import { getUserAvatarUrl } from '../utils/user';
import type { FeedbackData } from '../utils/types';

export function Settings() {
  useDocumentTitle('Settings | Blink (Vite)');

  const { user, token, isLoading, updateUser } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFeedback({
          type: 'error',
          message: 'Please select an image file.',
        });
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setFeedback({
          type: 'error',
          message: 'File size must be less than 2MB.',
        });
        return;
      }

      setAvatarFile(file);
      setFeedback(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !token) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Upload avatar if one was selected
      if (avatarFile) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const avatarResponse = await fetch('/api/user/upload-avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        const avatarData = await avatarResponse.json();

        if (avatarResponse.ok) {
          updateUser(avatarData.user);
          setFeedback({
            type: 'success',
            message: 'Avatar updated successfully!',
          });
          setAvatarFile(null);
        } else {
          setFeedback({
            type: 'error',
            message: avatarData.error || 'Failed to upload avatar.',
          });
        }
      } else {
        setFeedback({
          type: 'info',
          message: 'No changes to save.',
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if auth is still initializing
  if (isLoading) {
    return (
      <div className="container">
        <div className="loading-state">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated (will happen via useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="container">
      <main className="settings">
        <header className="settings__header">
          <h1>Account Settings</h1>
          <p>Manage your profile and account preferences.</p>
        </header>

        <Feedback feedback={feedback} onClose={() => setFeedback(null)} />

        <div className="settings__content">
          <section className="settings__section">
            <h2>Profile Information</h2>

            <form onSubmit={handleSubmit} className="settings__form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  value={username}
                  className="form-input"
                  disabled
                  title="Username cannot be changed"
                />
                <div className="form-help">
                  Your username cannot be changed after account creation.
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Avatar</label>
                <div className="avatar-upload">
                  <div className="avatar-upload__preview">
                    <img
                      src={getUserAvatarUrl(user)}
                      alt={`${user.username} avatar`}
                      className="avatar avatar--large"
                    />
                  </div>
                  <div className="avatar-upload__controls">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="avatar-upload__input"
                      id="avatar-input"
                    />
                    <label htmlFor="avatar-input" className="button button--outline">
                      Choose New Avatar
                    </label>
                    <div className="form-help">
                      Supported formats: JPG, PNG, GIF. Max size: 2MB.
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings__actions">
                <button
                  type="submit"
                  disabled={isSubmitting || !avatarFile}
                  className="button"
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}