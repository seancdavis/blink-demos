import { useState } from 'react'

interface FileUploadProps {
  name: string
  accept: string
  maxSizeMB: number
  required?: boolean
}

export default function FileUpload({ name, accept, maxSizeMB, required = false }: FileUploadProps) {
  const [error, setError] = useState<string>('')

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      if (file.size > maxSizeBytes) {
        setError(`File is too large. Please select a file under ${maxSizeMB} MB.`)
        setIsValid(false)
      } else {
        setError('')
        setIsValid(true)
      }
    }
  }

  return (
    <div>
      <label htmlFor={name}>Avatar</label>
      <input
        type="file"
        name={name}
        id={name}
        accept={accept}
        required={required}
        onChange={handleFileChange}
      />
      <small className="form-help">
        Maximum file size: {maxSizeMB} MB. Supported formats: JPG, PNG, GIF, WebP
      </small>
      {error && (
        <div className="form-error" style={{ display: 'block' }}>
          {error}
        </div>
      )}
      <style>{`
        .form-error {
          color: red;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .form-help {
          color: #666;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  )
}
