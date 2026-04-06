import { useState } from 'react'
import { Button } from '../ui/button'
import { FilterX, Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Input } from '../ui/input'
import TicketsKanbanView from './tickets-kanban-view'

// Filters definition
export interface TicketFilters {
  search: string
  ticketLogin: string
  typeOfLoan: string
  ticketStage: string
}

const defaultFilters: TicketFilters = {
  search: '',
  ticketLogin: 'all',
  typeOfLoan: 'all',
  ticketStage: 'all',
}

export default function TicketsKanban() {
  const [localFilters, setLocalFilters] =
    useState<TicketFilters>(defaultFilters)
  const [appliedFilters, setAppliedFilters] =
    useState<TicketFilters>(defaultFilters)

  function setFilter(key: keyof TicketFilters, value: string) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    setAppliedFilters(localFilters)
  }

  function clearFilters() {
    setLocalFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  return (
    <div className='w-full h-full p-4 flex flex-col max-w-[1240px] mx-auto'>
      <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex items-center justify-between mb-6 shrink-0'>
          <div>
            <h1 className='text-lg font-semibold'>Tickets Kanban</h1>
          </div>
          <Button size='sm' className='cursor-pointer'>
            Create +
          </Button>
        </div>
        {/* FILTER BAR */}
        <div className='flex flex-wrap items-center gap-3 mb-4 p-3 border rounded-md shadow-sm shrink-0'>
          <Select
            value={localFilters.ticketLogin}
            onValueChange={(val) => setFilter('ticketLogin', val)}
          >
            <SelectTrigger className='h-8 text-xs w-[140px]'>
              <SelectValue placeholder='Ticket Login' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Ticket Login</SelectItem>
              <SelectItem value='approved'>Approved</SelectItem>
              <SelectItem value='disapproved'>Disapproved</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={localFilters.typeOfLoan}
            onValueChange={(val) => setFilter('typeOfLoan', val)}
          >
            <SelectTrigger className='h-8 text-xs w-[130px]'>
              <SelectValue placeholder='Type of Loan' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Type of Loan</SelectItem>
              <SelectItem value='scf'>SCF</SelectItem>
              <SelectItem value='scf_renewal'>SCF Renewal</SelectItem>
              <SelectItem value='scf_enhancement'>SCF Enhancement</SelectItem>
              <SelectItem value='scf_renewal_enhancement'>
                SCF (Renewal and Enhancement)
              </SelectItem>
              <SelectItem value='open_scf'>Open SCF</SelectItem>
              <SelectItem value='open_scf_renewal'>Open SCF Renewal</SelectItem>
              <SelectItem value='open_scf_enhancement'>
                Open SCF Enhancement
              </SelectItem>
              <SelectItem value='open_scf_renewal_enhancement'>
                Open SCF (Renewal and Enhancement)
              </SelectItem>
              <SelectItem value='bt_scf'>BT-SCF</SelectItem>
              <SelectItem value='bt_open_scf'>BT-Open SCF</SelectItem>
              <SelectItem value='unsecured_od'>Unsecured OD</SelectItem>
              <SelectItem value='unsecured_term'>
                Unsecured Term Loan
              </SelectItem>
              <SelectItem value='secured_loan'>Secured Loan</SelectItem>
              <SelectItem value='secured_bt'>Secured BT</SelectItem>
              <SelectItem value='vehicle_loan'>Vehicle Loan</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={localFilters.ticketStage}
            onValueChange={(val) => setFilter('ticketStage', val)}
          >
            <SelectTrigger className='h-8 text-xs w-[140px]'>
              <SelectValue placeholder='Ticket Stage' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Ticket Stage</SelectItem>
              <SelectItem value='rm_doc_qc'>RM - Doc QC</SelectItem>
              <SelectItem value='cpi_analysis'>CPI Analysis</SelectItem>
              <SelectItem value='pendency_raised_by_lender'>
                Pendency Raised by Lender
              </SelectItem>
              <SelectItem value='pendency_resolved'>
                Pendency Resolved
              </SelectItem>
              <SelectItem value='gst_finfort_initiated'>
                GST Finfort - Initiated
              </SelectItem>
              <SelectItem value='gst_finfort_completed'>
                GST Finfort - Completed
              </SelectItem>
              <SelectItem value='jr_credit_manager_review'>
                Jr Credit Manager Review
              </SelectItem>
              <SelectItem value='pd_pending'>PD Pending</SelectItem>
              <SelectItem value='pd_completed'>PD Completed</SelectItem>
              <SelectItem value='sr_credit_manager_review'>
                Sr Credit Manager Review
              </SelectItem>
              <SelectItem value='ncm_review'>NCM Review</SelectItem>
              <SelectItem value='approval_pending'>Approval Pending</SelectItem>
              <SelectItem value='commercial_shared_with_cust'>
                Commercial Shared with Cust
              </SelectItem>
              <SelectItem value='cust_accepted_loan_offer'>
                Cust Accepted Loan Offer
              </SelectItem>
              <SelectItem value='pf_paid'>PF Paid</SelectItem>
              <SelectItem value='sanctioned'>Sanctioned</SelectItem>
              <SelectItem value='sl_sign_and_psd_initiated'>
                SL Sign and PSD Initiated
              </SelectItem>
              <SelectItem value='sl_sign_and_psd_completed'>
                SL Sign and PSD Completed
              </SelectItem>
              <SelectItem value='disbursed'>Disbursed</SelectItem>
              <SelectItem value='rejected'>Rejected</SelectItem>
              <SelectItem value='not_interested'>Not Interested</SelectItem>
            </SelectContent>
          </Select>

          <div className='flex items-center gap-2 ml-auto'>
            <Button
              size='sm'
              onClick={applyFilters}
              className='h-8 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            >
              <Search size={14} className='mr-1.5' /> Apply
            </Button>

            {(localFilters.search ||
              localFilters.ticketLogin !== 'all' ||
              localFilters.typeOfLoan !== 'all' ||
              localFilters.ticketStage !== 'all') && (
              <Button
                variant='ghost'
                size='sm'
                onClick={clearFilters}
                className='h-8 text-xs text-zinc-500 hover:text-zinc-800 px-2 cursor-pointer'
              >
                <FilterX size={14} className='mr-1' /> Clear
              </Button>
            )}
          </div>
        </div>
        <div className='flex-1 overflow-hidden'>
          <TicketsKanbanView filters={appliedFilters} />
        </div>
      </div>
    </div>
  )
}
