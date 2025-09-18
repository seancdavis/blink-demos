import { useState, useRef } from 'react';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Feedback } from '../components/Feedback';
import { feedbackData } from '../utils/feedback-data';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  useDocumentTitle('Edit profile | Blink (Vite)');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [fileSizeError, setFileSizeError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateUser } = useAuth();

  const maxSizeBytes = 2 * 1024 * 1024; // 2 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.size > maxSizeBytes) {
        setFileSizeError(true);
      } else {
        setFileSizeError(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError('avatar_required');
      return;
    }

    if (selectedFile.size > maxSizeBytes) {
      setError('avatar_too_large');
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('avatar', selectedFile);

      // Get stored token for authorization
      const token = localStorage.getItem('blink_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('/api/user/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      let data;
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        setError('Server response was not valid JSON');
        return;
      }

      if (!response.ok) {
        if (response.status === 400) {
          setError(data.feedbackKey || 'avatar_required');
        } else {
          setError(data.error || 'Upload failed');
        }
        return;
      }

      // Update user context with new avatar
      if (data.user) {
        updateUser(data.user);
      }

      setSuccess('avatar_uploaded');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      // Re-enable after 10 seconds as fallback
      setTimeout(() => {
        setIsSubmitting(false);
      }, 10000);
    }
  };

  return (
    <div className="container-xs">
      <h1>Edit profile</h1>

      <Feedback
        feedbackKey={error && error in feedbackData ? error as any : null}
        customMessage={error && !(error in feedbackData) ? error : undefined}
        type="error"
      />

      <Feedback
        feedbackKey={success && success in feedbackData ? success as any : null}
        type="success"
      />

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="avatar">Avatar</label>
          <input
            type="file"
            name="avatar"
            id="avatar"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            required
            disabled={isSubmitting}
          />
          <small className="form-help">
            Maximum file size: 2 MB. Supported formats: JPG, PNG, GIF, WebP
          </small>
          {fileSizeError && (
            <div className="form-error">
              File is too large. Please select an image under 2 MB.
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            className="button"
            type="submit"
            disabled={isSubmitting || fileSizeError || !selectedFile}
          >
            {isSubmitting ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
}