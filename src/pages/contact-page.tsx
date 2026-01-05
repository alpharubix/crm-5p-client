import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
import { toast } from 'sonner'

import type { Lead } from '@/types'
import Pagination from '@/components/shared/pagination'
import { formatExactDate } from '@/utils/date-formatter'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function LeadsPage() {
  const navigate = useNavigate()

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  /* ---------------- Filters ---------------- */
  const [searchParams, setSearchParams] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [filters, setFilters] = useState({
    phone: searchParams.get('phone') || '',
    email: searchParams.get('email') || '',
    city: searchParams.get('city') || '',
    state: searchParams.get('state') || '',
  })

  // Sync state with URL changes (e.g. back button)
  useEffect(() => {
    setFilters({
      phone: searchParams.get('phone') || '',
      email: searchParams.get('email') || '',
      city: searchParams.get('city') || '',
      state: searchParams.get('state') || '',
    })
    const page = searchParams.get('page')
    setCurrentPage(page ? parseInt(page) : 1)
  }, [searchParams])

  // Fetch leads with pagination and filters
  const fetchLeads = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      if (filters.phone) params.set('phone', filters.phone)
      if (filters.email) params.set('email', filters.email)
      if (filters.city) params.set('city', filters.city)
      if (filters.state) params.set('state', filters.state)

      const res = await fetch(
        `http://localhost:8080/accounts/?${params.toString()}`
      )
      if (res.ok) {
        const data = await res.json()
        console.log(data)
        setLeads(data.data)
        if (data.page_info) {
          setTotalPages(data.page_info.total_pages)
        }
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [currentPage, searchParams]) // refetch on page or param change

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filters.phone) params.set('phone', filters.phone)
    if (filters.email) params.set('email', filters.email)
    if (filters.city) params.set('city', filters.city)
    if (filters.state) params.set('state', filters.state)
    // Reset to page 1 on search
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleClear = () => {
    setSearchParams(new URLSearchParams())
    // State will sync via useEffect
  }

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
  }

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    console.log(formData)
    return

    try {
      const res = await fetch('http://localhost:8080/leads/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Lead added successfully')
        setIsDialogOpen(false)
        fetchLeads()
        setFormData({
          full_name: '',
          phone_number: '',
          designation: '',
          city: '',
          state: '',
        })
      } else {
        const err = await res.json()
        toast.error(err.detail || 'Error adding lead')
      }
    } catch {
      toast.error('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='p-4 space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold'>Contacts Database</h1>
          <p className='text-muted-foreground'>Manage your contacts here.</p>
        </div>

        <div className='flex gap-2'>
          <Button variant='outline' size='icon' onClick={fetchLeads}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* ---------------- Layout ---------------- */}
      <div className='grid grid-cols-[260px_1fr] gap-4'>
        {/* -------- Filters -------- */}
        {/* -------- Filters -------- */}
        <div className='border rounded-md p-3 space-y-4 h-fit'>
          <h3 className='font-semibold text-sm'>Filter Contacts by</h3>

          <div className='space-y-2'>
            <Label>Mobile / Phone</Label>
            <Input
              name='phone'
              placeholder='Mobile / Phone'
              value={filters.phone}
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

          <div className='space-y-2'>
            <Label>State</Label>
            <Input
              name='state'
              placeholder='State'
              value={filters.state}
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
        {/* -------- Table -------- */}
        <div className='flex flex-col gap-4'>
          <div className='border rounded-md p-2'>
            <Table>
              <TableCaption>Contacts list</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {leads.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className='text-center h-24'>
                      No contacts found
                    </TableCell>
                  </TableRow>
                ) : (
                  leads.map((lead) => (
                    <TableRow
                      key={lead.id}
                      className='cursor-pointer hover:bg-accent'
                      onClick={() => navigate('/update-contacts')}
                    >
                      <TableCell>
                        <div className='font-medium'>{lead.full_name}</div>
                        <div className='text-xs text-muted-foreground'>
                          {lead.company || 'Individual'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>{lead.email}</div>
                        <div className='text-xs text-muted-foreground'>
                          {lead.phone_number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className='text-xs'>
                          Created: {formatExactDate(lead.created_at) || '—'}
                        </div>
                        <div className='text-xs'>
                          Updated: {formatExactDate(lead.updated_at) || '—'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
