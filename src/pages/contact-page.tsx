import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ENV } from '@/conf'
import Pagination from '@/components/shared/pagination'
import type { Contact } from '@/types'

export default function ContactsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  /* ---------------- Filters ---------------- */
  // Initialize filters from URL
  const [filters, setFilters] = useState({
    first_name: searchParams.get('first_name') || '',
    last_name: searchParams.get('last_name') || '',
    email: searchParams.get('email') || '',
    city: searchParams.get('city') || '',
  })

  // Separate state for applied filters (what the query actually uses)
  const [appliedFilters, setAppliedFilters] = useState(filters)

  const [currentPage, setCurrentPage] = useState(() => {
    const page = searchParams.get('page')
    return page ? parseInt(page) : 1
  })

  // React Query for fetching contacts
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['contacts', currentPage, appliedFilters],
    queryFn: async () => {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())

      if (appliedFilters.first_name)
        params.set('first_name', appliedFilters.first_name)
      if (appliedFilters.last_name)
        params.set('last_name', appliedFilters.last_name)
      if (appliedFilters.email) params.set('email', appliedFilters.email)
      if (appliedFilters.city) params.set('city', appliedFilters.city)

      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/contacts?${params.toString()}`,
        {
          credentials: 'include',
        }
      )
      if (!res.ok) throw new Error('Failed to fetch contacts')
      return res.json()
    },
  })

  const contacts: Contact[] = data?.data || []
  const pageInfo = data?.page_info || { page: 1, total_pages: 1 }

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.first_name) params.set('first_name', filters.first_name)
    if (filters.last_name) params.set('last_name', filters.last_name)
    if (filters.email) params.set('email', filters.email)
    if (filters.city) params.set('city', filters.city)

    // Reset to page 1 on search
    params.set('page', '1')
    setSearchParams(params)

    // Apply filters to trigger query
    setAppliedFilters(filters)
    setCurrentPage(1)
  }

  const handleClear = () => {
    const emptyFilters = {
      first_name: '',
      last_name: '',
      email: '',
      city: '',
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
          <h1 className='text-2xl font-bold'>Contacts Database</h1>
          <p className='text-muted-foreground'>Manage your contacts here.</p>
        </div>

        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
            />
          </Button>
        </div>
      </div>

      {/* ---------------- Layout ---------------- */}
      <div className='grid grid-cols-[260px_1fr] gap-4'>
        {/* -------- Filters -------- */}
        <div className='border rounded-md p-3 space-y-4 h-fit bg-background'>
          <h3 className='font-semibold text-sm'>Filter Contacts by</h3>

          <div className='space-y-2'>
            <Label>First Name</Label>
            <Input
              name='first_name'
              placeholder='First Name'
              value={filters.first_name}
              onChange={handleFilterChange}
            />
          </div>

          <div className='space-y-2'>
            <Label>Last Name</Label>
            <Input
              name='last_name'
              placeholder='Last Name'
              value={filters.last_name}
              onChange={handleFilterChange}
            />
          </div>

          <div className='space-y-2'>
            <Label>Email</Label>
            <Input
              name='email'
              placeholder='Email'
              value={filters.email}
              onChange={handleFilterChange}
            />
          </div>

          <div className='space-y-2'>
            <Label>City</Label>
            <Input
              name='city'
              placeholder='City'
              value={filters.city}
              onChange={handleFilterChange}
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
        <div className='flex flex-col gap-4 min-w-0 h-[550px]'>
          <div className='border rounded-md p-2 overflow-y-auto'>
            {isLoading ? (
              <div className='flex items-center justify-center h-64'>
                <RefreshCw className='h-8 w-8 animate-spin text-muted-foreground' />
              </div>
            ) : (
              <Table>
                <TableCaption>Contacts list</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>State</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className='text-center h-24'>
                        No contacts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact) => (
                      <TableRow
                        key={contact.id}
                        className='cursor-pointer hover:bg-accent'
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                      >
                        <TableCell>
                          <div className='font-medium'>
                            {contact.first_name} {contact.last_name}
                          </div>
                        </TableCell>
                        <TableCell>{contact.designation || '—'}</TableCell>
                        <TableCell>{contact.mobile || '—'}</TableCell>
                        <TableCell>{contact.phone || '—'}</TableCell>
                        <TableCell>{contact.email || '—'}</TableCell>
                        <TableCell>{contact.city || '—'}</TableCell>
                        <TableCell>{contact.state || '—'}</TableCell>
                      </TableRow>
                    ))
                  )}
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
    </div>
  )
}
