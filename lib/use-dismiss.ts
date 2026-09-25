import { useEffect } from 'react'

/** Kunci scroll body + tutup dengan tombol Escape selama `active` */
export function useDismiss(active: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!active) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [active, onDismiss])
}
