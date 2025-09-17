import { useState, useRef, type FormEvent, type ChangeEvent } from 'react'

export default function SettingsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showError, setShowError] = useState(false)
  const [buttonText, setButtonText] = useState('Upload')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const maxSizeBytes = 2 * 1024 * 1024 // 2 MB

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > maxSizeBytes) {
        setShowError(true)
        setButtonDisabled(true)
      } else {
        setShowError(false)
        setButtonDisabled(false)
      }
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const file = fileInputRef.current?.files?.[0]

    if (file && file.size > maxSizeBytes) {
      e.preventDefault()
      setShowError(true)
      return false
    }

    if (isSubmitting) {
      e.preventDefault()
      return false
    }

    setIsSubmitting(true)
    setButtonDisabled(true)
    setButtonText('Uploading...')

    // Re-enable after 10 seconds as fallback (file uploads may take longer)
    setTimeout(() => {
      setIsSubmitting(false)
      setButtonDisabled(false)
      setButtonText('Upload')
    }, 10000)
  }

  return (
    <form
      action="/api/user/upload-avatar"
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="avatar">Avatar</label>
        <input
          type="file"
          name="avatar"
          id="avatar"
          accept="image/*"
          required
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <small className="form-help">
          Maximum file size: 2 MB. Supported formats: JPG, PNG, GIF, WebP
        </small>
        {showError && (
          <div className="form-error">File is too large. Please select an image under 2 MB.</div>
        )}
      </div>

      <div className="form-actions">
        <button className="button" type="submit" disabled={buttonDisabled}>
          {buttonText}
        </button>
      </div>
    </form>
  )
}
