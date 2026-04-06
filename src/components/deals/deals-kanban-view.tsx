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

export interface DealData {
  id: string
  dealName: string
  dealId: string
  dealOwner: string
  lenderName: string
  status: string
}

const DUMMY_TICKETS: DealData[] = [
  {
    id: '1771',
    dealName: 'JASODA ENTERPRISES',
    dealId: '1771',
    dealOwner: 'Anslem Prathap',
    lenderName: 'HDFC Bank',
    status: 'Active',
  },
  {
    id: '71',
    dealName: 'RUDRA ENTERPRISES',
    dealId: '71',
    dealOwner: 'Digamber Pandey',
    lenderName: 'Kotak Mahindra Bank Ltd',
    status: 'Disbursed',
  },
  {
    id: '3',
    dealName: 'Del-1003',
    dealId: '1003',
    dealOwner: 'sandeep',
    lenderName: 'Profectus Capital Private Ltd',
    status: 'Achievement',
  },
  {
    id: '87',
    dealName: 'RIYA BANGLES',
    dealId: '87',
    dealOwner: 'Ayush Dingane',
    lenderName: 'Kotak Mahindra Bank Ltd',
    status: 'Commercials NI',
  },
]

const COLUMNS = [
  'Deal Created',
  'Lender Review',
  'Lender Rejected',
  'Achievement',
  'Not Interested',
]

const COLUMN_STYLES: Record<string, { header: string; dot: string }> = {
  'Deal Created': {
    header: 'text-zinc-500 border-zinc-300',
    dot: 'bg-zinc-400',
  },
  'Lender Review': {
    header: 'text-blue-600 border-blue-300',
    dot: 'bg-blue-500',
  },
  'Lender Rejected': {
    header: 'text-emerald-600 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  Achievement: {
    header: 'text-orange-700 border-orange-300',
    dot: 'bg-orange-500',
  },
  'Not Interested': {
    header: 'text-purple-600 border-purple-300',
    dot: 'bg-purple-500',
  },
}

function DraggableTicketCard({ deal }: { deal: DealData }) {
  const navigate = useNavigate()
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: deal.id,
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
        onClick={() => navigate(`/deals/${deal.id}`)}
      >
        <CardContent className='p-3 text-sm grid gap-1'>
          <div className='flex justify-between items-start gap-2'>
            <p className='font-semibold text-base leading-tight'>
              {deal.dealName}
            </p>
          </div>

          <div className='grid grid-cols-[110px_1fr] gap-x-2 gap-y-1 mt-2 items-start text-xs'>
            <span className='text-muted-foreground font-medium'>Deal ID</span>
            <span className='font-medium line-clamp-1' title={deal.dealId}>
              {deal.dealId || '-'}
            </span>

            <span className='text-muted-foreground font-medium'>
              Deal Owner
            </span>
            <span className='font-medium'>{deal.dealOwner || '-'}</span>

            <span className='text-muted-foreground font-medium'>
              Lender Name
            </span>
            <span className='font-medium'>{deal.lenderName || '-'}</span>
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
  tickets: DealData[]
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
          <DraggableTicketCard key={t.id} deal={t} />
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

export default function TicketsKanbanView() {
  const [ticketsList, setTicketsList] = useState<DealData[]>(DUMMY_TICKETS)
  const [activeTicket, setActiveTicket] = useState<DealData | null>(null)

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

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className='flex gap-4 pb-4 overflow-x-auto items-start h-full min-h-0'>
        {COLUMNS.map((col) => {
          const colTickets = ticketsList.filter((t) => t.status === col)
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
              <p className='font-semibold'>{activeTicket.dealName}</p>
            </CardContent>
          </Card>
        )}
      </DragOverlay>
    </DndContext>
  )
}
