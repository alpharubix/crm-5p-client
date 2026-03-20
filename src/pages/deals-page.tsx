import { Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
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
import { formatAmount } from '@/utils/number-formatter'
import HighlightedText from '@/components/shared/highlighted-text'

const LENDER_NAMES = [
  'Kotak Mahindra Bank Ltd',
  'Tyger Capital Private Ltd',
  'Profectus Capital Private Ltd',
  'Rupifi Private Ltd',
  'Niyogin Fintech Ltd',
  'Mintifi Finserve Private Limited',
  'Aditya Birla Capital Limited',
  'Muthoot Fincorp Limited',
  'FlexiLoans Technologies Pvt Ltd',
  'Hero Fincorp Ltd',
]

const LOAN_TYPES = [
  'SCF',
  'SCF Renewal',
  'SCF Enhancement',
  'SCF (Renewal and Enhancement)',
  'Open SCF',
  'Open SCF Renewal',
  'Open SCF Enhancement',
  'Open SCF (Renewal and Enhancement)',
  'BT-SCF',
  'BT-Open SCF',
  'Unsecured OD',
  'Unsecured Term Loan',
  'Secured Loan',
  'Secured BT',
  'Vehicle Loan',
]

const CASE_STATUSES = [
  'Yet to Lender Login',
  'Lender Review',
  'In Credit',
  'Approved',
  'Disbursed',
  'Rejected',
  'Not Interested',
]

const TYPE_OF_CASE_LOGIN = ['Fresh', 'Spillover']

const TICKET_LOGIN = ['true', 'false']

const DealsPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()

  const [filters, setFilters] = useState({
    accountName: searchParams.get('accountName') || '',
    lenderName: searchParams.get('lenderName') || '',
    caseStatus: searchParams.get('caseStatus') || '',
    ticketLogin: searchParams.get('ticketLogin') || '',
    loanType: searchParams.get('loanType') || '',
    typeOfCaseLogin: searchParams.get('typeOfCaseLogin') || '',
    dealOwnerId: searchParams.get('dealOwnerId') || '',
  })

  const [appliedFilters, setAppliedFilters] = useState(filters)

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page) : 1
  })

  const { data: ownerResponse, isSuccess } = useQuery({
    queryKey: ['deal-owners'],
    queryFn: async () => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/user/filter`, {
        credentials: 'include',
      })
      if (res.status === 403) return { forbidden: true }
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    retry: false,
  })

  const showOwnerFilter = isSuccess && !ownerResponse?.forbidden
  const owners = ownerResponse?.data ?? []

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['deals', currentPage, appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())

      if (appliedFilters.accountName)
        params.set('account_name', appliedFilters.accountName)
      if (appliedFilters.lenderName)
        params.set('lender_name', appliedFilters.lenderName)
      if (appliedFilters.caseStatus)
        params.set('case_status', appliedFilters.caseStatus)
      if (appliedFilters.ticketLogin)
        params.set('ticket_login', appliedFilters.ticketLogin)
      if (appliedFilters.loanType)
        params.set('loan_type', appliedFilters.loanType)
      if (appliedFilters.typeOfCaseLogin)
        params.set('type_of_case_login', appliedFilters.typeOfCaseLogin)
      if (appliedFilters.dealOwnerId)
        params.set('deal_owner_id', appliedFilters.dealOwnerId)

      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/deals?${params.toString()}`,
        {
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error('Failed to fetch deals')
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  const DealsData: Deal[] = data?.data || []
  const pageInfo = data?.page_info || { page: 1, total_pages: 1 }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('page', '1')
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, String(value))
    })
    setSearchParams(params)
    setAppliedFilters(filters)
    setCurrentPage(1)
  }

  const handleClear = () => {
    const emptyFilters = {
      accountName: '',
      lenderName: '',
      caseStatus: '',
      ticketLogin: '',
      loanType: '',
      typeOfCaseLogin: '',
      dealOwnerId: '',
    }
    setFilters(emptyFilters)
    setAppliedFilters(emptyFilters)
    setSearchParams(new URLSearchParams())
    setCurrentPage(1)
  }

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
            { credentials: 'include' }
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
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deals Database</h1>
          <p className="text-muted-foreground">
            Manage your potential deals here.
          </p>
        </div>

        {isLoading ? (
          <Skeleton className="w-24 h-4" />
        ) : (
          <div className="flex gap-2 items-center justify-start">
            <h3 className="font-semibold text-muted-foreground">
              Total Deals :
            </h3>
            <p className="text-muted-foreground">{pageInfo.data_size || 0}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => navigate('/deals-create')}
          >
            <Plus className="h-4 w-4" />
            Create Deal
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={() => refetch()}
          >
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-4">
        {/* Filter sidebar */}
        <div className="border rounded-md p-3 space-y-4 bg-background overflow-y-auto h-[calc(100vh-200px)]">
          <h3 className="font-semibold text-sm">Filter Deals by</h3>

          {/* Account Name */}
          <div className="space-y-2">
            <Label>Deal Name</Label>
            <Input
              placeholder="Account Name"
              value={filters.accountName}
              onChange={e => handleFilterChange('accountName', e.target.value)}
            />
          </div>

          {/* Deal Owner */}
          {showOwnerFilter && (
            <div className="space-y-2">
              <Label>Deal Owner</Label>
              <Select
                value={filters.dealOwnerId}
                onValueChange={val => handleFilterChange('dealOwnerId', val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Deal Owner" />
                </SelectTrigger>
                <SelectContent>
                  {owners.map((owner: any) => (
                    <SelectItem key={owner.id} value={owner.id}>
                      {owner.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Lender Name */}
          <div className="space-y-2">
            <Label>Lender Name</Label>
            <Select
              value={filters.lenderName}
              onValueChange={val => handleFilterChange('lenderName', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lender Name" />
              </SelectTrigger>
              <SelectContent>
                {LENDER_NAMES.map(name => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Case Status */}
          <div className="space-y-2">
            <Label>Case Status</Label>
            <Select
              value={filters.caseStatus}
              onValueChange={val => handleFilterChange('caseStatus', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Case Status" />
              </SelectTrigger>
              <SelectContent>
                {CASE_STATUSES.map(status => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ticket Login */}
          <div className="space-y-2">
            <Label>Ticket Login</Label>
            <Select
              value={filters.ticketLogin}
              onValueChange={val => handleFilterChange('ticketLogin', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ticket Login" />
              </SelectTrigger>
              <SelectContent>
                {TICKET_LOGIN.map(val => (
                  <SelectItem key={val} value={val}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loan Type */}
          <div className="space-y-2">
            <Label>Type of Loan</Label>
            <Select
              value={filters.loanType}
              onValueChange={val => handleFilterChange('loanType', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type of Loan" />
              </SelectTrigger>
              <SelectContent>
                {LOAN_TYPES.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type of Case Login */}
          <div className="space-y-2">
            <Label>Type of Case Login</Label>
            <Select
              value={filters.typeOfCaseLogin}
              onValueChange={val => handleFilterChange('typeOfCaseLogin', val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Type of Case Login" />
              </SelectTrigger>
              <SelectContent>
                {TYPE_OF_CASE_LOGIN.map(type => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-2">
            <Button className="flex-1 cursor-pointer" onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex flex-col gap-4 min-w-0 h-[calc(100vh-200px)]">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 border rounded-md">
              <Spinner className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="border rounded-md flex-1 overflow-auto relative">
                <table className="w-full caption-bottom text-sm">
                  <TableHeader>
                    <TableRow className="sticky top-0 z-10 bg-background hover:bg-accent">
                      <TableHead>Deal Name</TableHead>
                      <TableHead>Deal Owner</TableHead>
                      <TableHead>Lender Name</TableHead>
                      <TableHead>Case Status</TableHead>
                      <TableHead>Ticket Login</TableHead>
                      <TableHead>Type of Loan</TableHead>
                      <TableHead>Type of Case Login</TableHead>
                      <TableHead>Call Back Date/Time</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {DealsData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No deals found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      DealsData.map(deal => (
                        <TableRow
                          key={deal.id}
                          className="cursor-pointer hover:bg-accent"
                          onClick={() => handleRowClick(deal.id)}
                        >
                          <TableCell className="font-medium">
                            <HighlightedText
                              text={deal.account_name}
                              highlight={appliedFilters.accountName}
                            />
                          </TableCell>

                          <TableCell>
                            {(users as Record<string, string>)[
                              deal.deal_owner_id
                            ] || '-'}
                          </TableCell>

                          <TableCell>{deal.lender_name || '-'}</TableCell>

                          <TableCell>{deal.case_status || '-'}</TableCell>

                          <TableCell>{deal.ticket_login || '-'}</TableCell>

                          <TableCell>{deal.loan_type || '-'}</TableCell>

                          <TableCell>
                            {deal.type_of_case_login || '-'}
                          </TableCell>

                          <TableCell>
                            {deal.deal_call_back_datetime
                              ? formatExactDate(
                                  deal.deal_call_back_datetime,
                                  'dd MMM yyyy, hh:mm a'
                                )
                              : '—'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </table>
              </div>

              <Pagination
                currentPage={pageInfo.page}
                totalPages={pageInfo.total_pages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default DealsPage
