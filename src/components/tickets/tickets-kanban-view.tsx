import { useState } from 'react'
import { Card, CardContent } from '../ui/card'
import { useNavigate } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'

export interface TicketData {
  id: string
  ticketName: string
  lenderName: string
  typeOfLoan: string
  ticketStage: string
  lenderLoginDate: string
  status: string
}

const DUMMY_TICKETS: TicketData[] = [
  {
    id: '1',
    ticketName: 'TKT-1001',
    lenderName: 'Tyger Capital Private Ltd',
    typeOfLoan: 'SCF',
    ticketStage: 'RM - Doc QC',
    lenderLoginDate: '2026-03-25',
    status: 'Yet to Lender',
  },
  {
    id: '2',
    ticketName: 'TKT-1002',
    lenderName: 'Kotak Mahindra Bank Ltd',
    typeOfLoan: 'Unsecured OD',
    ticketStage: 'CPI Analysis',
    lenderLoginDate: '2026-03-20',
    status: 'Lender Review',
  },
  {
    id: '3',
    ticketName: 'TKT-1003',
    lenderName: 'Profectus Capital Private Ltd',
    typeOfLoan: 'Secured Loan',
    ticketStage: 'Approval Pending',
    lenderLoginDate: '2026-03-28',
    status: 'In Credit',
  },
  {
    id: '4',
    ticketName: 'TKT-1004',
    lenderName: 'Rupifi Private Ltd',
    typeOfLoan: 'Open SCF',
    ticketStage: 'Sanctioned',
    lenderLoginDate: '2026-03-10',
    status: 'Approved',
  },
  {
    id: '5',
    ticketName: 'TKT-1005',
    lenderName: 'Aditya Birla Capital Limited',
    typeOfLoan: 'SCF Renewal',
    ticketStage: 'Disbursed',
    lenderLoginDate: '2026-03-05',
    status: 'Disbursed',
  },
]

const COLUMNS = [
  'Yet to Lender',
  'Lender Review',
  'In Credit',
  'Approved',
  'Disbursed',
  'Rejected',
  'Not Interested',
]

const COLUMN_STYLES: Record<string, { header: string; dot: string }> = {
  'Yet to Lender': {
    header: 'text-zinc-500 border-zinc-300',
    dot: 'bg-zinc-400',
  },
  'Lender Review': {
    header: 'text-blue-600 border-blue-300',
    dot: 'bg-blue-500',
  },
  'In Credit': {
    header: 'text-emerald-600 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  Approved: {
    header: 'text-orange-700 border-orange-300',
    dot: 'bg-orange-500',
  },
  Disbursed: {
    header: 'text-purple-600 border-purple-300',
    dot: 'bg-purple-500',
  },
  Rejected: { header: 'text-red-600 border-red-300', dot: 'bg-red-500' },
  'Not Interested': {
    header: 'text-zinc-600 border-zinc-300',
    dot: 'bg-zinc-600',
  },
}

function DraggableTicketCard({ ticket }: { ticket: TicketData }) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ticket.id,
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? 'opacity-50' : ''}
    >
      <Card
        className={`transition-colors py-0 gap-0 overflow-hidden cursor-grab hover:bg-muted/30`}
        onClick={() => navigate(`/kanban-update-tickets`)}
      >
        <CardContent className='p-3 text-sm grid gap-1'>
          <div className='flex justify-between items-start gap-2'>
            <p className='font-semibold text-base leading-tight'>
              {ticket.ticketName}
            </p>
          </div>

          <div className='grid grid-cols-[110px_1fr] gap-x-2 gap-y-1 mt-2 items-start text-xs'>
            <span className='text-muted-foreground font-medium'>
              Lender Name
            </span>
            <span
              className='font-medium line-clamp-1'
              title={ticket.lenderName}
            >
              {ticket.lenderName || '-'}
            </span>

            <span className='text-muted-foreground font-medium'>
              Type of Loan
            </span>
            <span className='font-medium'>{ticket.typeOfLoan || '-'}</span>

            <span className='text-muted-foreground font-medium'>
              Ticket Stage
            </span>
            <span className='font-medium'>{ticket.ticketStage || '-'}</span>

            <span className='text-muted-foreground font-medium'>
              Lender Login Date
            </span>
            <span className='font-medium'>{ticket.lenderLoginDate || '-'}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DroppableTicketColumn({
  status,
  tickets,
}: {
  status: string
  tickets: TicketData[]
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const style = COLUMN_STYLES[status] || {
    header: 'text-zinc-500',
    dot: 'bg-zinc-400',
  }

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[280px] w-full flex flex-col gap-3 h-full p-2 rounded border transition-colors ${
        isOver ? 'border-zinc-300' : 'border-border'
      }`}
    >
      <div
        className={`flex items-center gap-2 pb-2 border-b mb-1 ${style.header}`}
      >
        <span className={`w-2 h-2 rounded shrink-0 ${style.dot}`} />
        <span className='text-xs font-semibold uppercase tracking-wide'>
          {status}
        </span>
        <span className='ml-auto text-xs font-mono'>{tickets.length}</span>
      </div>
      <div className='flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-2'>
        {tickets.map((t) => (
          <DraggableTicketCard key={t.id} ticket={t} />
        ))}
        {tickets.length === 0 && (
          <div
            className={`border border-dashed rounded p-4 text-center text-xs transition-colors ${
              isOver
                ? 'border-zinc-400 text-zinc-400'
                : 'border-zinc-200 text-zinc-300'
            }`}
          >
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}

export default function TicketsKanbanView({ filters }: { filters: any }) {
  const [ticketsList, setTicketsList] = useState<TicketData[]>(DUMMY_TICKETS)
  const [activeTicket, setActiveTicket] = useState<TicketData | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  function onDragStart(event: DragStartEvent) {
    const ticket = ticketsList.find((t) => t.id === event.active.id)
    if (ticket) setActiveTicket(ticket)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTicket(null)
    if (!over) return

    const newStatus = String(over.id)

    setTicketsList((prev) =>
      prev.map((t) => (t.id === active.id ? { ...t, status: newStatus } : t)),
    )
  }

  // Basic filtering visually applied to local tickets
  const filteredTickets = ticketsList.filter((t) => {
    if (
      filters.search &&
      !t.ticketName.toLowerCase().includes(filters.search.toLowerCase()) &&
      !t.lenderName.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    if (
      filters.typeOfLoan !== 'all' &&
      t.typeOfLoan.toLowerCase().replace(/ /g, '_') !== filters.typeOfLoan
    )
      return false
    // we can add more basic mock filtering if needed
    return true
  })

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className='flex gap-4 pb-4 overflow-x-auto items-start h-full min-h-0'>
        {COLUMNS.map((col) => {
          const colTickets = filteredTickets.filter((t) => t.status === col)
          return (
            <DroppableTicketColumn
              key={col}
              status={col}
              tickets={colTickets}
            />
          )
        })}
      </div>

      <DragOverlay>
        {activeTicket && (
          <Card className='cursor-grabbing shadow-lg opacity-90 border-l-4 border-l-primary/50 py-0'>
            <CardContent className='p-3 text-sm'>
              <p className='font-semibold'>{activeTicket.ticketName}</p>
            </CardContent>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  )
}
