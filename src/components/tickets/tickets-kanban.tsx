import { useState } from 'react'
import { FilterX, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import TicketsKanbanView, { type KanbanFilters } from './tickets-kanban-view'
import { Label } from '../ui/label'

interface LocalFilters {
  search: string
  type_of_loan: string
  ticket_status: string
  assignee_id: string
  created_from: string
  created_to: string
}

const defaultFilters: LocalFilters = {
  search: '',
  type_of_loan: 'all',
  ticket_status: 'all',
  assignee_id: 'all',
  created_from: '',
  created_to: '',
}

function getDefaultDates() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return {
    created_from: from.toISOString().split('T')[0],
    created_to: to.toISOString().split('T')[0],
  }
}

export default function TicketsKanban() {
  const [defaultDates] = useState(getDefaultDates)
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    ...defaultFilters,
    created_from: defaultDates.created_from,
    created_to: defaultDates.created_to,
  })
  const [appliedFilters, setAppliedFilters] =
    useState<KanbanFilters>(defaultDates)
  const [hasApplied, setHasApplied] = useState(true)

  function setFilter(key: keyof LocalFilters, value: string) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    const f: KanbanFilters = {}
    if (localFilters.search) f.account_name = localFilters.search
    if (localFilters.type_of_loan !== 'all')
      f.type_of_loan = localFilters.type_of_loan
    if (localFilters.ticket_status !== 'all')
      f.ticket_status = localFilters.ticket_status
    if (localFilters.created_from) f.created_from = localFilters.created_from
    if (localFilters.created_to) f.created_to = localFilters.created_to
    setAppliedFilters(f)
    setHasApplied(true)
  }
  const hasActiveFilters = true // dates are always set

  function clearFilters() {
    const cleared: LocalFilters = {
      search: '',
      type_of_loan: 'all',
      ticket_status: 'all',
      assignee_id: 'all',
      created_from: '',
      created_to: '',
    }
    setLocalFilters(cleared)
    setAppliedFilters({})
  }

  // const hasActiveFilters =
  //   localFilters.search ||
  //   localFilters.assignee_id !== 'all' ||
  //   localFilters.type_of_loan !== 'all' ||
  //   localFilters.ticket_status !== 'all' ||
  //   localFilters.created_from !== defaultDates.created_from ||
  //   localFilters.created_to !== defaultDates.created_to

  return (
    <div className='w-full h-full p-4 flex flex-col max-w-[1240px] mx-auto'>
      <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex items-center justify-between mb-6 shrink-0'>
          <h1 className='text-lg font-semibold'>Tickets Kanban</h1>
        </div>

        <div className='flex flex-wrap items-center gap-3 mb-4 p-3 border rounded-md shadow-sm shrink-0'>
          <Input
            placeholder='Account name...'
            className='h-8 text-xs w-[180px]'
            value={localFilters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />

          <Select
            value={localFilters.type_of_loan}
            onValueChange={(v) => setFilter('type_of_loan', v)}
          >
            <SelectTrigger className='h-8 text-xs w-40'>
              <SelectValue placeholder='Type of Loan' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>--Type of Loan--</SelectItem>
              <SelectItem value='SCF'>SCF</SelectItem>
              <SelectItem value='SCF Renewal'>SCF Renewal</SelectItem>
              <SelectItem value='SCF Enhancement'>SCF Enhancement</SelectItem>
              <SelectItem value='SCF (Renewal and Enhancement)'>
                SCF (Renewal and Enhancement)
              </SelectItem>
              <SelectItem value='Open SCF'>Open SCF</SelectItem>
              <SelectItem value='BT-SCF'>BT-SCF</SelectItem>
              <SelectItem value='Unsecured OD'>Unsecured OD</SelectItem>
              <SelectItem value='Unsecured Term Loan'>
                Unsecured Term Loan
              </SelectItem>
              <SelectItem value='Secured Loan'>Secured Loan</SelectItem>
              <SelectItem value='Vehicle Loan'>Vehicle Loan</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={localFilters.ticket_status}
            onValueChange={(v) => setFilter('ticket_status', v)}
          >
            <SelectTrigger className='h-8 text-xs w-[140px]'>
              <SelectValue placeholder='Ticket Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>--Ticket Status--</SelectItem>
              <SelectItem value='Yet to Lender Login'>
                Yet to Lender Login
              </SelectItem>
              <SelectItem value='Lender Review'>Lender Review</SelectItem>
              <SelectItem value='In Credit'>In Credit</SelectItem>
              <SelectItem value='Approved'>Approved</SelectItem>
              <SelectItem value='Disbursed'>Disbursed</SelectItem>
              <SelectItem value='Rejected'>Rejected</SelectItem>
              <SelectItem value='Not Interested'>Not Interested</SelectItem>
              <SelectItem value='RM - Doc QC'>RM - Doc QC</SelectItem>
              <SelectItem value='CPI Analysis'>CPI Analysis</SelectItem>
              <SelectItem value='Pendency Raised by Lender'>
                Pendency Raised by Lender
              </SelectItem>
              <SelectItem value='Pendency Resolved'>
                Pendency Resolved
              </SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor='from_date'>From -</Label>
          <Input
            id='from_date'
            type='date'
            className='h-8 text-xs w-[140px]'
            value={localFilters.created_from}
            onChange={(e) => setFilter('created_from', e.target.value)}
          />
          <Label htmlFor='to_date'>To -</Label>
          <Input
            id='to_date'
            type='date'
            className='h-8 text-xs w-[140px]'
            value={localFilters.created_to}
            onChange={(e) => setFilter('created_to', e.target.value)}
          />
          <div className='flex items-center gap-2 ml-auto'>
            <Button
              size='sm'
              onClick={applyFilters}
              className='h-8 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white'
            >
              <Search size={14} className='mr-1.5' /> Apply
            </Button>

            {hasActiveFilters && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='h-8 text-xs text-zinc-500 hover:text-zinc-800 px-2'
              >
                <FilterX size={14} className='mr-1' /> Clear
              </Button>
            )}
          </div>
        </div>

        <div className='flex-1 overflow-hidden'>
          <TicketsKanbanView filters={appliedFilters} enabled={hasApplied} />
        </div>
      </div>
    </div>
  )
}
