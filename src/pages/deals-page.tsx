import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import DateField from '@/components/shared/date-field'

import type { Deal } from '@/types'
import { formatExactDate } from '@/utils/date-formatter'
import { ENV } from '@/conf'

const ITEMS_PER_PAGE = 5

const DealsPage = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/deals`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to fetch contacts')
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  const DealsData: Deal[] = data?.data || []
  console.log(DealsData)

  const [deals] = useState<Deal[]>(DealsData)
  const [currentPage, setCurrentPage] = useState(1)

  const [filters, setFilters] = useState({
    dealType: searchParams.get('dealType') || '',
    dealStatus: searchParams.get('dealStatus') || '',
    lender: searchParams.get('lender') || '',
    disbursementDate: searchParams.get('disbursementDate')
      ? new Date(searchParams.get('disbursementDate')!)
      : undefined,
  })

  useEffect(() => {
    setCurrentPage(1)
  }, [searchParams])

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.dealType) params.set('dealType', filters.dealType)
    if (filters.dealStatus) params.set('dealStatus', filters.dealStatus)
    if (filters.lender) params.set('lender', filters.lender)
    if (filters.disbursementDate)
      params.set('disbursementDate', filters.disbursementDate.toISOString())
    setSearchParams(params)
  }

  const handleClear = () => {
    setFilters({
      dealType: '',
      dealStatus: '',
      lender: '',
      disbursementDate: undefined,
    })
    setSearchParams(new URLSearchParams())
  }

  // Derive applied filters from URL for the list
  const appliedFilters = {
    dealType: searchParams.get('dealType') || '',
    dealStatus: searchParams.get('dealStatus') || '',
    lender: searchParams.get('lender') || '',
    disbursementDate: searchParams.get('disbursementDate') || '',
  }

  const filteredDeals = deals.filter((deal) => {
    const matchType =
      appliedFilters.dealType === '' ||
      deal.deal_type
        ?.toLowerCase()
        .includes(appliedFilters.dealType.toLowerCase())
    const matchStatus =
      appliedFilters.dealStatus === '' ||
      deal.stage
        ?.toLowerCase()
        .includes(appliedFilters.dealStatus.toLowerCase())
    const matchLender =
      appliedFilters.lender === '' ||
      deal.lender?.toLowerCase().includes(appliedFilters.lender.toLowerCase())

    // Date matching - simple string match on ISO date start for now, or just substring
    // Original code: deal.closing_date?.startsWith(filters.disbursementDate)
    // If we use Date picker, we might want to compare dates.
    // Let's stick to string startsWith if we convert Date to YYYY-MM-DD
    let matchDate = true
    if (appliedFilters.disbursementDate) {
      // Convert ISO string from URL back to YYYY-MM-DD or similar to match whatever format deals use
      // Deals use ISO.
      const dateParam = new Date(appliedFilters.disbursementDate)
        .toISOString()
        .split('T')[0]
      matchDate = deal.closing_date?.startsWith(dateParam) || false
    }

    return matchType && matchStatus && matchLender && matchDate
  })

  const totalPages = Math.ceil(filteredDeals.length / ITEMS_PER_PAGE)

  const paginatedDeals = filteredDeals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>Deals Database</h1>
          <p className='text-muted-foreground'>
            Manage your potential deals here.
          </p>
        </div>

        <Button variant='outline' size='icon'>
          <RefreshCw className='h-4 w-4' />
        </Button>
      </div>

      <div className='grid grid-cols-[260px_1fr] gap-4'>
        <div className='border rounded-md p-3 space-y-4 bg-background h-fit'>
          <h3 className='font-semibold text-sm'>Filter Deals by</h3>

          <div className='space-y-2'>
            <Label>Deal Type</Label>
            <Input
              placeholder='Deal Type'
              value={filters.dealType}
              onChange={(e) =>
                setFilters({ ...filters, dealType: e.target.value })
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Deal Status</Label>
            <Select
              value={filters.dealStatus}
              onValueChange={(value) =>
                setFilters({ ...filters, dealStatus: value })
              }
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Deal Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Yet to Lender Login'>
                  Yet to Lender Login
                </SelectItem>
                <SelectItem value='Disbursed'>Disbursed</SelectItem>
                <SelectItem value='Rejected'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Lender Name</Label>
            <Input
              placeholder='Lender Name'
              value={filters.lender}
              onChange={(e) =>
                setFilters({ ...filters, lender: e.target.value })
              }
            />
          </div>

          <div className='space-y-2 flex flex-col'>
            <Label>Disbursement Date</Label>
            <DateField
              value={filters.disbursementDate}
              isEdit={true}
              onChange={(date) =>
                setFilters({ ...filters, disbursementDate: date })
              }
            />
          </div>

          <div className='flex gap-2 pt-2'>
            <Button className='flex-1' onClick={handleSearch}>
              Search
            </Button>
            <Button variant='outline' onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>

        {/* -------- Table -------- */}
        <div className='border rounded-md p-2'>
          <Table>
            <TableCaption>A list of recent deals.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Deal Type</TableHead>
                <TableHead>Case Stage</TableHead>
                <TableHead>Disbursement Amount</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Deal Call Back DateTime</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {DealsData.map((deal) => (
                <TableRow
                  key={deal.id}
                  className='cursor-pointer hover:bg-accent'
                  onClick={() => navigate('/update-deals')}
                >
                  <TableCell className='font-medium'>
                    <div className='text-lg'>{deal.lender}</div>
                    <div className='text-sm text-muted-foreground'>
                      {deal.account_name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className='inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-semibold text-blue-800'>
                      {deal.stage}
                    </span>
                  </TableCell>

                  <TableCell>{formatExactDate(deal.closing_date)}</TableCell>

                  <TableCell>{deal.deal_owner}</TableCell>

                  <TableCell>
                    {formatExactDate(deal.last_activity_time)}
                  </TableCell>

                  <TableCell className='font-semibold'>
                    ₹ {deal.amount}
                  </TableCell>
                </TableRow>
              ))} 
            </TableBody>
          </Table>

          <div className='flex items-center justify-between px-2 py-3'>
            <p className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages || 1}
            </p>

            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>

              <Button
                variant='outline'
                size='sm'
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealsPage
