import { useEffect, useRef } from 'react'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function GlobalProgressBar() {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 100,
      minimum: 0.1,
    })
  }, [])

  useEffect(() => {
    const isLoading = isFetching > 0 || isMutating > 0

    if (isLoading) {
      // If loading starts, clear any pending stop timer and start immediately
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      NProgress.start()
    } else {
      // If loading stops, wait a bit before completing to handle sequential fetches
      timerRef.current = setTimeout(() => {
        NProgress.done()
      }, 200)
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isFetching, isMutating])

  return null
}
