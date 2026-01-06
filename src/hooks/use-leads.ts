import { useEffect, useState } from 'react'
import type { Lead } from '@/types'
import { ENV } from '@/conf'

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeads = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL_LOCAL}/accounts/`)
      if (res.ok) {
        const data = await res.json()
        console.log("data", data);
        setLeads(data.data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [])

  return { leads, loading, fetchLeads }
}
