import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { ENV } from '@/conf'

interface ExportCsvButtonProps {
  endpoint: string
  params: URLSearchParams
  dataSize: number
  filename: string
  isLoading?: boolean
}

export default function ExportCsvButton({
  endpoint,
  params,
  dataSize,
  filename,
  isLoading = false,
}: ExportCsvButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (dataSize === 0) {
      toast.info('No records to export')
      return
    }

    setIsExporting(true)
    try {
      // Do not use page pagination for exports, remove "page" from params if it exists
      const exportParams = new URLSearchParams(params)
      exportParams.delete('page')

      const url = `${ENV.VITE_BACKEND_BASE_URL}${endpoint}?${exportParams.toString()}`
      const response = await fetch(url, { credentials: 'include' })
      if (!response.ok) {
        const errorData = await response.json()
        toast.error(errorData.detail)
        return
      }
      const blob = await response.blob()
      if (blob.size === 0) {
        toast.info('No records to export')
        return
      }

      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      toast.error('Failed to export CSV')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      variant='outline'
      onClick={handleExport}
      disabled={isExporting || isLoading}
      className='cursor-pointer'
    >
      {isExporting ? (
        <>
          <Spinner className='mr-2 h-4 w-4' />
          Exporting... please wait
        </>
      ) : (
        <>
          <Download className='mr-2 h-4 w-4' />
          Export CSV
        </>
      )}
    </Button>
  )
}
