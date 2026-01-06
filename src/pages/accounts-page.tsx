import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import DateField from '@/components/shared/date-field'
import Pagination from '@/components/shared/pagination'
import { RefreshCw } from 'lucide-react'
import { ENV } from '@/conf'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
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
import { useQuery } from '@tanstack/react-query'

export default function AccountsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    accountName: '',
    accountStatus: '',
    source: '',
    businessType: '',
    city: '',
    state: '',
    pincode: '',
    businessStatus: '',
    callBackDate: undefined as Date | undefined,
  })

  // Separate state for applied filters (what the query actually uses)
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['accounts', currentPage, appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())

      if (appliedFilters.accountName)
        params.set('company_name', appliedFilters.accountName)
      if (appliedFilters.accountStatus)
        params.set('account_status', appliedFilters.accountStatus)
      if (appliedFilters.source) params.set('source', appliedFilters.source)
      if (appliedFilters.businessType)
        params.set('type_of_business', appliedFilters.businessType)
      if (appliedFilters.city) params.set('city', appliedFilters.city)
      if (appliedFilters.state) params.set('state', appliedFilters.state)
      if (appliedFilters.pincode) params.set('pincode', appliedFilters.pincode)
      if (appliedFilters.businessStatus)
        params.set('business_status', appliedFilters.businessStatus)
      if (appliedFilters.callBackDate)
        params.set(
          'call_back_date_time',
          appliedFilters.callBackDate.toISOString()
        )

      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL_LOCAL}/accounts?${params.toString()}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
  })

  const accounts = data?.data || []
  const pageInfo = data?.page_info || { page: 1, total_pages: 1 }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.set('page', '1')

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          params.set(key, value.toISOString())
        } else {
          params.set(key, String(value))
        }
      }
    })

    // Update URL params
    setSearchParams(params)

    // Apply filters to trigger query
    setAppliedFilters(filters)
    setCurrentPage(1)
  }

  const handleClear = () => {
    const emptyFilters = {
      accountName: '',
      accountStatus: '',
      source: '',
      businessType: '',
      city: '',
      state: '',
      pincode: '',
      businessStatus: '',
      callBackDate: undefined,
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

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Accounts Database</h1>
          <p className='text-muted-foreground'>Manage your accounts here.</p>
        </div>

        <Button
          variant='outline'
          size='icon'
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className='grid grid-cols-[260px_1fr] gap-4'>
        <div className='border rounded-md p-3 space-y-4 bg-background h-fit'>
          <h3 className='font-semibold text-sm'>Filter Accounts by</h3>

          <div className='space-y-2'>
            <Label>Account Name</Label>
            <Input
              placeholder='Account Name'
              value={filters.accountName}
              onChange={(e) =>
                handleFilterChange('accountName', e.target.value)
              }
            />
          </div>

          <div className='space-y-2'>
            <Label>Account Status</Label>
            <Select
              value={filters.accountStatus}
              onValueChange={(val) => handleFilterChange('accountStatus', val)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Account Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Awareness'>Awareness</SelectItem>
                <SelectItem value='Attention'>Attention</SelectItem>
                <SelectItem value='Assessment'>Assessment</SelectItem>
                <SelectItem value='Not Interested'>Not Interested</SelectItem>
                <SelectItem value='Location Unserviceable'>
                  Location Unserviceable
                </SelectItem>
                <SelectItem value='Lender Review'>Lender Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Source</Label>
            <Select
              value={filters.source}
              onValueChange={(val) => handleFilterChange('source', val)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Source' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Himalaya'>Himalaya</SelectItem>
                <SelectItem value='CavinKare'>CavinKare</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Type of Business</Label>
            <Select
              value={filters.businessType}
              onValueChange={(val) => handleFilterChange('businessType', val)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Type of Business' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='-None-'>-None-</SelectItem>
                <SelectItem value='Manufacturer'>Manufacturer</SelectItem>
                <SelectItem value='Distributor'>Distributor</SelectItem>
                <SelectItem value='Franchise/FOFO'>Franchise/FOFO</SelectItem>
                <SelectItem value='Wholesale Trader'>
                  Wholesale Trader
                </SelectItem>
                <SelectItem value='Retailer'>Retailer</SelectItem>
                <SelectItem value='Super Stockist'>Super Stockist</SelectItem>
                <SelectItem value='Sub Distributor'>Sub Distributor</SelectItem>
                <SelectItem value='Inst Customers'>Inst Customers</SelectItem>
                <SelectItem value='Govt Institutions'>
                  Govt Institutions
                </SelectItem>
                <SelectItem value='Co Operative Society'>
                  Co Operative Society
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>City</Label>
            <Input
              placeholder='City'
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label>State</Label>
            <Input
              placeholder='State'
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label>Pincode</Label>
            <Input
              placeholder='Pincode'
              value={filters.pincode}
              onChange={(e) => handleFilterChange('pincode', e.target.value)}
            />
          </div>

          <div className='space-y-2'>
            <Label>Business Status</Label>
            <Select
              value={filters.businessStatus}
              onValueChange={(val) => handleFilterChange('businessStatus', val)}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Business Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Active'>Active</SelectItem>
                <SelectItem value='Inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2 flex flex-col'>
            <Label>Call Back Date</Label>
            <DateField
              value={filters.callBackDate}
              isEdit={true}
              onChange={(date) => handleFilterChange('callBackDate', date)}
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

        <div className='flex flex-col gap-4 min-w-0'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64 border rounded-md'>
              <RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
            </div>
          ) : (
            <>
              <div className='border rounded-md p-2 overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account Name</TableHead>
                      <TableHead>Account Owner</TableHead>
                      <TableHead>Account Status</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Type of Business</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Call Back Date / Time</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {accounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className='text-center h-24'>
                          No accounts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      accounts.map((acc: any) => (
                        <TableRow
                          key={acc.id}
                          className='cursor-pointer hover:bg-accent'
                          onClick={() => navigate(`/accounts/${acc.id}`)}
                        >
                          <TableCell className='font-medium text-primary'>
                            {acc.account_name}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.owner?.full_name || '—'}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.account_status || '—'}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.source || '—'}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.type_of_business || '—'}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.city || '—'}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.state || '—'}
                          </TableCell>
                          <TableCell className='text-primary'>
                            {acc.call_back_date_time
                              ? new Date(
                                  acc.call_back_date_time
                                ).toLocaleString()
                              : '—'}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
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
