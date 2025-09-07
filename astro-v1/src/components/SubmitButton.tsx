import { useState, useEffect } from 'react'

interface SubmitButtonProps {
  children: React.ReactNode
  loadingText: string
  formId?: string
  timeout?: number
}

export default function SubmitButton({
  children,
  loadingText,
  formId,
  timeout = 5000,
}: SubmitButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const form = formId ? (document.getElementById(formId) as HTMLFormElement) : null

    if (form) {
      const handleSubmit = () => {
        if (isSubmitting) return false

        setIsSubmitting(true)

        // Re-enable after timeout as fallback
        setTimeout(() => {
          setIsSubmitting(false)
        }, timeout)

        return true
      }

      form.addEventListener('submit', handleSubmit)

      return () => {
        form.removeEventListener('submit', handleSubmit)
      }
    }
  }, [formId, isSubmitting, timeout])

  return (
    <button className="button" type="submit" disabled={isSubmitting}>
      {isSubmitting ? loadingText : children}
    </button>
  )
}
