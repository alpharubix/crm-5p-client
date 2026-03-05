import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ENV } from '@/conf'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import usersData from '@/utils/users.json'

const users: Record<string, string> = usersData

const ITEMS_PER_PAGE = 20

export default function AuditLogs() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', currentPage],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())

      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/audit-logs?${params.toString()}`,
        { credentials: 'include' },
      )

      if (!res.ok) throw new Error('Failed to fetch audit logs')
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  const logs = data?.data || []
  const pageInfo = data?.page_info || { page: 1, total: 1 }
  const totalPages = Math.ceil(pageInfo.total / ITEMS_PER_PAGE)

  const getActionBadge = (action: string) => {
    const normalizedAction = action.toLowerCase()
    switch (normalizedAction) {
      case 'create':
      case 'created':
        return (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
          >
            Create
          </Badge>
        )
      case 'update':
      case 'updated':
        return (
          <Badge
            variant='outline'
            className='bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          >
            Update
          </Badge>
        )
      default:
        return <Badge variant='outline'>{action}</Badge>
    }
  }

  const getPayloadDisplay = (payload: any) => {
    const jsonString = JSON.stringify(payload)
    const isLong = jsonString.length > 50

    const displayContent = (
      <code className='text-xs bg-muted px-1 py-0.5 rounded'>
        {isLong ? `${jsonString.substring(0, 50)}...` : jsonString}
      </code>
    )

    if (isLong) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className='cursor-help font-mono'>{displayContent}</div>
            </TooltipTrigger>
            <TooltipContent className='max-w-[400px] break-all p-2'>
              <pre className='text-xs whitespace-pre-wrap'>
                {JSON.stringify(payload, null, 2)}
              </pre>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return displayContent
  }

  return (
    <div className='flex flex-1 flex-col gap-4 p-4'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Audit Logs</h2>
          <p className='text-muted-foreground'>
            View and track basic creation and update activities.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className='h-[calc(80vh-200px)] overflow-y-scroll'>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Payload</TableHead>
                  <TableHead className='text-right'>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className='h-24 text-center'>
                      <div className='flex justify-center flex-col items-center gap-2'>
                        <Spinner className='h-6 w-6' />
                        <span className='text-muted-foreground'>
                          Loading logs...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-24 text-center text-muted-foreground'
                    >
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => {
                    const userName = users[log.user_id]
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Avatar className='h-8 w-8'>
                              <AvatarFallback>
                                {userName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                              <span className='font-medium text-sm'>
                                {userName}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell>
                          <Badge variant='secondary' className='font-normal'>
                            {log.entity}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPayloadDisplay(log.payload)}</TableCell>
                        <TableCell className='text-right whitespace-nowrap text-muted-foreground'>
                          {log.created_at}
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <div className='flex items-center justify-between pt-4 mx-4'>
          <p className='text-sm text-muted-foreground'>
            Showing {logs.length === 0 ? 0 : (currentPage - 1) * 20 + 1}–
            {Math.min(currentPage * 20, pageInfo.total)} of {pageInfo.total}{' '}
            logs
          </p>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className='h-4 w-4' />
              Previous
            </Button>
            <span className='text-sm text-muted-foreground px-2'>
              Page {currentPage} of {totalPages || 1}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
            >
              Next
              <ChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
