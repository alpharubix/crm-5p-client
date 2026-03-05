import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import type { Deal } from '@/types'
import { ENV } from '@/conf'
import users from '@/utils/users.json'
import Pagination from '@/components/shared/pagination'
import { useNavigate } from 'react-router-dom'
import { formatExactDate } from '@/utils/date-formatter'

const DealsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page) : 1
  })

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['deals', currentPage],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())

      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/deals?${params.toString()}`,
        {
          credentials: 'include',
        },
      )
      if (!res.ok) throw new Error('Failed to fetch deals')
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  const DealsData: Deal[] = data?.data || []
  const pageInfo = data?.page_info || { page: 1, total_pages: 1 }
  // console.log(pageInfo)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
  }

  const handleRowClick = async (id: string) => {
    try {
      await queryClient.ensureQueryData({
        queryKey: ['deal', id],
        queryFn: async () => {
          const res = await fetch(
            `${ENV.VITE_BACKEND_BASE_URL}/deals?deal_id=${id}`,
            { credentials: 'include' },
          )
          if (!res.ok) throw new Error('Failed to fetch deal')
          return res.json()
        },
      })
      navigate(`/deals/${id}`)
    } catch (error) {
      navigate(`/deals/${id}`)
    }
  }

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Deals Database</h1>
          <p className='text-muted-foreground'>
            Manage your potential deals here.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className='w-24 h-4' />
        ) : (
          <div className='flex gap-2 items-center justify-start'>
            <h3 className='font-semibold text-muted-foreground'>
              Total Deals :
            </h3>
            <p className='text-muted-foreground'>{pageInfo.data_size || 0}</p>
          </div>
        )}

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='cursor-pointer'
            onClick={() => refetch()}
          >
            {isLoading ? (
              <Spinner className='h-4 w-4' />
            ) : (
              <RefreshCw className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>

      <div className='flex flex-col gap-4 min-w-0'>
        <div className='border rounded-md p-2 overflow-y-auto h-[calc(90vh-200px)]'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <Spinner className='h-8 w-8 text-muted-foreground' />
            </div>
          ) : (
            <Table>
              <TableCaption>A list of recent deals.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Account Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Deal Type</TableHead>
                  <TableHead>Case Stage</TableHead>
                  <TableHead>Disbursement Amount</TableHead>
                  <TableHead>Deal Call Back DateTime</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {DealsData.map((deal) => (
                  <TableRow
                    key={deal.id}
                    className='cursor-pointer hover:bg-accent'
                    onClick={() => handleRowClick(deal.id)}
                  >
                    <TableCell className='font-medium'>
                      {deal.account_name}
                    </TableCell>

                    <TableCell>
                      {(users as Record<string, string>)[deal.deal_owner_id] ||
                        '-'}
                    </TableCell>

                    <TableCell>{deal.deal_type || '-'}</TableCell>

                    <TableCell>{deal.case_stage || '-'}</TableCell>

                    <TableCell>{deal.disbursed_amount || '-'}</TableCell>

                    <TableCell>
                      {deal.deal_call_back_datetime
                        ? formatExactDate(
                            deal.deal_call_back_datetime,
                            'dd MMM yyyy, hh:mm a',
                          )
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
        <Pagination
          currentPage={pageInfo.page}
          totalPages={pageInfo.total_pages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

export default DealsPage
