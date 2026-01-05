import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Label } from '@/components/ui/label'
import DateField from '@/components/shared/date-field'
import Pagination from '@/components/shared/pagination'
import { RefreshCw } from 'lucide-react'

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

const DUMMY_ACCOUNTS = [
  {
    id: 1,
    accountName: 'JULI ENTERPRISES',
    accountOwner: 'Digamber Pandey',
    accountStatus: 'Awareness',
    source: 'Himalaya',
    businessType: 'Distributor',
    city: 'LUCKNOW',
    state: 'Uttar Pradesh',
    callBack: 'Jan 1, 2026 01:00 PM',
  },
  {
    id: 2,
    accountName: 'JANTA MEDICINE CENTER',
    accountOwner: 'Sahil Kispotta',
    accountStatus: 'Assessment',
    source: 'Himalaya',
    businessType: 'Distributor',
    city: 'DORAHA',
    state: 'Punjab',
    callBack: 'Dec 8, 2025 01:00 PM',
  },
  {
    id: 3,
    accountName: 'Naresh Kumar & Sons',
    accountOwner: 'Sahil Kispotta',
    accountStatus: 'Lender Review',
    source: 'Himalaya',
    businessType: 'Distributor',
    city: 'ABOHAR',
    state: 'Punjab',
    callBack: 'Dec 5, 2025 04:30 PM',
  },
]

export default function AccountsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [accounts] = useState(DUMMY_ACCOUNTS)

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    accountName: searchParams.get('accountName') || '',
    accountStatus: searchParams.get('accountStatus') || '',
    source: searchParams.get('source') || '',
    businessType: searchParams.get('businessType') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
    pincode: searchParams.get('pincode') || '',
    businessStatus: searchParams.get('businessStatus') || '',
    callBackDate: searchParams.get('callBackDate')
      ? new Date(searchParams.get('callBackDate')!)
      : undefined,
  })

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          params.set(key, value.toISOString())
        } else {
          params.set(key, String(value))
        }
      }
    })
    setSearchParams(params)
  }

  const handleClear = () => {
    setFilters({
      accountName: '',
      accountStatus: '',
      source: '',
      businessType: '',
      city: '',
      state: '',
      pincode: '',
      businessStatus: '',
      callBackDate: undefined,
    })
    setSearchParams(new URLSearchParams())
  }

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Filter Logic (Client-side implementation)
  const filteredAccounts = accounts.filter((acc) => {
    return (
      (filters.accountName === '' ||
        acc.accountName
          .toLowerCase()
          .includes(filters.accountName.toLowerCase())) &&
      (filters.accountStatus === '' ||
        acc.accountStatus === filters.accountStatus) &&
      (filters.source === '' || acc.source === filters.source) &&
      (filters.businessType === '' ||
        acc.businessType === filters.businessType) &&
      (filters.city === '' ||
        acc.city.toLowerCase().includes(filters.city.toLowerCase())) &&
      (filters.state === '' ||
        acc.state.toLowerCase().includes(filters.state.toLowerCase()))
      // Add other filters as needed
    )
  })

  const totalPages = Math.ceil(filteredAccounts.length / ITEMS_PER_PAGE)
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Accounts Database</h1>
          <p className='text-muted-foreground'>Manage your accounts here.</p>
        </div>

        <Button variant='outline' size='icon'>
          <RefreshCw className='h-4 w-4' />
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
                {paginatedAccounts.map((acc) => (
                  <TableRow
                    key={acc.id}
                    className='cursor-pointer hover:bg-accent'
                    onClick={() => navigate(`/accounts/${acc.id}`)}
                  >
                    <TableCell className='font-medium text-primary '>
                      {acc.accountName}
                    </TableCell>
                    <TableCell className='text-primary '>
                      {acc.accountOwner}
                    </TableCell>
                    <TableCell className='text-primary '>
                      {acc.accountStatus}
                    </TableCell>
                    <TableCell className='text-primary '>
                      {acc.source}
                    </TableCell>
                    <TableCell className='text-primary '>
                      {acc.businessType}
                    </TableCell>
                    <TableCell className='text-primary '>{acc.city}</TableCell>
                    <TableCell className='text-primary '>{acc.state}</TableCell>
                    <TableCell className='text-primary '>
                      {acc.callBack}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}
