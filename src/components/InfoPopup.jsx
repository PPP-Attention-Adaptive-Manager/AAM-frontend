import { useEffect, useState } from 'react'

export function InfoPopup({ storageKey, title, message, autoHideMs = 6000, className = '' }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const hasSeenPopup = window.sessionStorage.getItem(storageKey)

    if (!hasSeenPopup) {
      const openTimer = window.setTimeout(() => {
        setOpen(true)
        window.sessionStorage.setItem(storageKey, '1')
      }, 900)

      const hideTimer = window.setTimeout(() => {
        setOpen(false)
      }, autoHideMs)

      return () => {
        window.clearTimeout(openTimer)
        window.clearTimeout(hideTimer)
      }
    }

    return undefined
  }, [autoHideMs, storageKey])

  if (!open) {
    return null
  }

  return (
    <aside className={`info-popup ${className}`.trim()}>
      <div className="info-popup-topline">
        <span className="info-popup-tag">{title}</span>
        <button className="info-popup-close" type="button" onClick={() => setOpen(false)} aria-label="Close popup">
          ×
        </button>
      </div>
      <p>{message}</p>
    </aside>
  )
}
