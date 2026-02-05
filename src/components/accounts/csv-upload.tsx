import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { RefreshCw, Upload } from 'lucide-react'
import Dropzone, { type DropzoneState } from 'shadcn-dropzone'

import { ENV } from '@/conf'
import { Button } from '../ui/button'
import { Spinner } from '../ui/spinner'
import { toast } from 'sonner'
import { useAuth } from '@/context/auth-context'

const UploadCsv = ({
  isLoading,
  refetch,
}: {
  isLoading: boolean
  refetch: () => void
}) => {
  const { user } = useAuth()

  const canUpload = user?.role?.toLowerCase().includes('admin')

  return (
    <>
      <div className='flex gap-2'>
        {canUpload && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant='outline' size='icon'>
                {isLoading ? (
                  <Spinner className='h-4 w-4' />
                ) : (
                  <Upload className='h-4 w-4' />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-30'>
              <Dropzone
                multiple={false}
                accept={{
                  'text/csv': ['.csv'],
                  'application/vnd.ms-excel': ['.csv'],
                }}
                onDrop={(acceptedFiles, fileRejections) => {
                  if (fileRejections.length) {
                    console.log('Rejected:', fileRejections)
                    return
                  }

                  const file = acceptedFiles[0]

                  if (!file.name.toLowerCase().endsWith('.csv')) {
                    console.log('Not a CSV file')
                    return
                  }

                  const asyncUpload = async () => {
                    try {
                      const formData = new FormData()
                      formData.append('file', file)

                      const res = await fetch(
                        `${ENV.VITE_BACKEND_BASE_URL}/accounts/upload-accounts-csv`,
                        {
                          method: 'POST',
                          body: formData,
                          credentials: 'include',
                        },
                      )

                      if (!res.ok) throw new Error('Upload failed')

                      toast.success((await res.json()).message)
                    } catch (error) {
                      toast.error('Failed to upload accounts')
                    }
                  }
                  asyncUpload()
                }}
              >
                {(dropzone: DropzoneState) => (
                  <>
                    {dropzone.isDragAccept ? (
                      <div className='text-sm font-medium'>
                        Drop your files here!
                      </div>
                    ) : (
                      <div className='flex items-center flex-col gap-1.5'>
                        <div className='flex items-center flex-row gap-0.5 text-sm font-medium'>
                          Upload files
                        </div>
                      </div>
                    )}
                  </>
                )}
              </Dropzone>
            </PopoverContent>
          </Popover>
        )}
        <Button
          variant='outline'
          size='icon'
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner className='h-4 w-4' />
          ) : (
            <RefreshCw className='h-4 w-4' />
          )}
        </Button>
      </div>
    </>
  )
}

export default UploadCsv
