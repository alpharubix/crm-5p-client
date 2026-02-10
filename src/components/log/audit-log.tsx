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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock data to simulate backend response
const MOCK_LOGS = [
  {
    id: 'log_1',
    user: {
      name: 'Sandip Kumar Jena ',
      email: 'sandip.kumar@r1xchange.com',
      avatar: '/avatars/01.png',
    },
    action: 'create',
    module: 'Contacts',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    details: {
      last_name: 'Scott',
      email: 'michael@dundermifflin.com',
    },
  },
  {
    id: 'log_2',
    user: {
      name: 'Ayush Dingane',
      email: 'ayush.dingane@r1xchange.com',
      avatar: '/avatars/02.png',
    },
    action: 'update',
    module: 'Accounts',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    details: { account_name: 'S K R AGENCY', distcode: '87227' },
  },
  {
    id: 'log_3',
    user: {
      name: 'Digamber Pandey',
      email: 'digamber.pandey@r1xchange.com',
      avatar: '/avatars/01.png',
    },
    action: 'update',
    module: 'Contacts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    details: { phone: '9876543210', city: 'Mumbai' },
  },
  {
    id: 'log_4',
    user: {
      name: 'Digamber Pandey',
      email: 'digamber.pandey@r1xchange.com',
      avatar: '/avatars/03.png',
    },
    action: 'create',
    module: 'Accounts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    details: {
      account_name: 'AMRUTHA VARSHINI AGENCIES',
      industry: 'FMCG',
      revenue: '500000',
    },
  },
  {
    id: 'log_5',
    user: {
      name: 'Arjun J',
      email: 'arjun.j@r1xchange.com',
      avatar: '/avatars/02.png',
    },
    action: 'update',
    module: 'Contacts',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    details: { mobile: '8765432109', designation: 'Manager' },
  },
  {
    id: 'log_6',
    user: {
      name: 'Ayush Dingane',
      email: 'ayush.dingane@r1xchange.com',
      avatar: '/avatars/02.png',
    },
    action: 'update',
    module: 'Accounts',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    details: { account_name: 'A V PHARMA', state: 'Maharashtra' },
  },
  {
    id: 'log_7',
    user: {
      name: 'Sahil Kispotta',
      email: 'sahil.kispotta@r1xchange.com',
      avatar: '/avatars/02.png',
    },
    action: 'update',
    module: 'Accounts',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    details: {
      account_name: 'A V PHARMA',
      pincode: '400001',
      country: 'India',
    },
  },
]

const ITEMS_PER_PAGE = 6

export default function AuditLogs() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredLogs = MOCK_LOGS.filter((log) => {
    const matchesFilter = filter === 'all' || log.action === filter
    const matchesSearch =
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.module.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  )

  const handleFilterChange = (value: string) => {
    setFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return (
          <Badge
            variant='outline'
            className='bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
          >
            Create
          </Badge>
        )
      case 'update':
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

  return (
    <div className='flex flex-1 flex-col gap-4 p-2 md:p-4 pt-0'>
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight'>Audit Logs</h2>
          <p className='text-muted-foreground'>
            View and track basic creation and update activities.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Activity History</CardTitle>
            <div className='flex items-center gap-2'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search logs...'
                  value={search}
                  onChange={handleSearchChange}
                  className='pl-8 w-[250px]'
                />
              </div>
              <Select value={filter} onValueChange={handleFilterChange}>
                <SelectTrigger className='w-[150px]'>
                  <div className='flex items-center gap-2'>
                    <Filter className='h-4 w-4' />
                    <SelectValue placeholder='Filter by action' />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>All Actions</SelectItem>
                  <SelectItem value='create'>Create</SelectItem>
                  <SelectItem value='update'>Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className='text-right'>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className='h-24 text-center text-muted-foreground'
                    >
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className='flex items-center gap-2'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage src={log.user.avatar} />
                            <AvatarFallback>
                              {log.user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col'>
                            <span className='font-medium text-sm'>
                              {log.user.name}
                            </span>
                            <span className='text-xs text-muted-foreground'>
                              {log.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <Badge variant='secondary' className='font-normal'>
                          {log.module}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className='flex flex-wrap gap-1'>
                          {Object.entries(log.details).map(([key, value]) => (
                            <span
                              key={key}
                              className='inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs'
                            >
                              <span className='text-muted-foreground font-medium'>
                                {key.replace(/_/g, ' ')}:
                              </span>
                              <span className='text-foreground'>{value}</span>
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className='text-right whitespace-nowrap text-muted-foreground'>
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination Controls */}
          <div className='flex items-center justify-between pt-4'>
            <p className='text-sm text-muted-foreground'>
              Showing {filteredLogs.length === 0 ? 0 : startIndex + 1}–
              {Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)} of{' '}
              {filteredLogs.length} logs
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
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage >= totalPages}
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
