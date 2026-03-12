import { ENV } from '@/conf'
import type { Project } from '@/types/project-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditProjectModal from './edit-project'
import { Card, CardContent } from '../ui/card'
import { Pencil } from 'lucide-react'
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

// ── Hardcoded Users ────────────────────────────────────────────────────────

const USERS_MAP: Record<string, string> = {
  "615348": "Ashok",
  "964875": "Suraj",
  "882594": "Myisa Beiucy",
  "823465": "kavery",
  "3899927000000201013": "Anslem Prathap",
  "3899927000005965002": "Subhasini T S",
}

// ── Constants ──────────────────────────────────────────────────────────────

const COLUMNS = ['Planning', 'Active', 'On Hold', 'Completed', 'Cancelled']

// ── Helpers ────────────────────────────────────────────────────────────────

function checkOverdue(endDate: string, status: string): boolean {
  if (!endDate || status === 'completed' || status === 'cancelled') return false
  const end = new Date(endDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return end < today
}

// ── DraggableProjectCard ───────────────────────────────────────────────────

function DraggableProjectCard({
  project,
  onEdit,
  navigate,
}: {
  project: any
  onEdit: (p: any) => void
  navigate: (path: string) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: String(project.id),
  })

  const overdue = checkOverdue(project.end_date, project.status)

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={isDragging ? 'opacity-50' : ''}
    >
      <Card
        className={`cursor-grab transition-colors shadow-sm py-0 gap-0 overflow-hidden border-l-4 ${overdue
          ? 'border-l-destructive border hover:bg-destructive/5'
          : 'border-l-primary/50 border hover:bg-muted/30'
          }`}
        onClick={() => navigate(`/projects/${project.id}`)}
      >
        <CardContent className='p-3 text-sm grid gap-1'>
          <div className='flex justify-between items-start gap-2'>
            <p
              className='font-semibold text-base leading-tight cursor-pointer'
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              {project.name}
            </p>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onEdit(project)}
              className='text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0'
            >
              <Pencil className='w-3 h-3' />
            </button>
          </div>

          <div className='grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 mt-1 items-start text-xs'>
            <span className='text-muted-foreground font-medium'>Project Type</span>
            <span className='font-medium'>
              {project.project_type
                ? project.project_type.charAt(0).toUpperCase() + project.project_type.slice(1)
                : '-'}
            </span>

            <span className='text-muted-foreground font-medium'>Status</span>
            <span className='font-medium text-muted-foreground'>
              {project.status
                ? project.status.replace('_', ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
                : '-'}
            </span>

            <span className='text-muted-foreground font-medium'>Initiator</span>
            <span className='font-medium'>{USERS_MAP[project.created_by] || '-'}</span>

            <span className='text-muted-foreground font-medium'>Actioner</span>
            <span className='font-medium truncate max-w-[130px]'>
              {project.actioner_ids?.map((id: string) => USERS_MAP[id]).filter(Boolean).join(', ') || '-'}
            </span>

            <span className='text-muted-foreground font-medium'>Start Date</span>
            <span className='font-medium'>{project.start_date || '-'}</span>

            <span className='text-muted-foreground font-medium'>End Date</span>
            <span className='font-medium'>{project.end_date || '-'}</span>

            <span className='text-muted-foreground font-medium'>Overdue</span>
            <span className={`font-medium ${overdue ? 'text-destructive' : ''}`}>
              {overdue ? 'Yes' : 'No'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ── DroppableProjectColumn ─────────────────────────────────────────────────

function DroppableProjectColumn({
  status,
  projects,
  onEdit,
  navigate,
}: {
  status: string
  projects: any[]
  onEdit: (p: any) => void
  navigate: (path: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[280px] w-full flex flex-col gap-3 h-full p-2 rounded-lg border transition-colors ${isOver ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-50/50 border-border'
        }`}
    >
      <div className='font-semibold text-sm py-2 px-3 bg-muted/50 rounded-md shadow-sm flex justify-between items-center'>
        <span>{status}</span>
        <span className='bg-background text-xs px-2 py-0.5 rounded-full border'>
          {projects.length}
        </span>
      </div>

      <div className='flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-2'>
        {projects.map((p) => (
          <DraggableProjectCard
            key={p.id}
            project={p}
            onEdit={onEdit}
            navigate={navigate}
          />
        ))}
        {projects.length === 0 && (
          <div
            className={`border border-dashed rounded-md p-4 text-center text-xs transition-colors ${isOver ? 'border-zinc-400 text-zinc-400' : 'border-zinc-200 text-zinc-300'
              }`}
          >
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}


export default function ProjectKanban() {
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [activeProject, setActiveProject] = useState<any>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/projects`, {
        credentials: 'include',
      })
      if (res.status === 403) return { forbidden: true }
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const projectList: any[] = projects?.data || []

  const { mutate: updateProjectStatus } = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  function onDragStart(event: DragStartEvent) {
    const p = projectList.find((p) => String(p.id) === String(event.active.id))
    if (p) setActiveProject(p)
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveProject(null)
    if (!over) return
    const status = String(over.id).toLowerCase().replace(' ', '_')
    updateProjectStatus({ id: String(active.id), status })
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className='flex gap-4 pb-4 overflow-x-auto items-start h-[calc(100vh-200px)]'>
          {COLUMNS.map((col) => {
            const colProjects = projectList.filter(
              (p) =>
                (p.status || '').toLowerCase().replace('_', ' ') === col.toLowerCase(),
            )
            return (
              <DroppableProjectColumn
                key={col}
                status={col}
                projects={colProjects}
                onEdit={setEditProject}
                navigate={navigate}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeProject && (
            <Card className='cursor-grabbing shadow-lg opacity-90 border-l-4 border-l-primary/50 py-0'>
              <CardContent className='p-3 text-sm'>
                <p className='font-semibold'>{activeProject.name}</p>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>

      <EditProjectModal
        open={!!editProject}
        onClose={() => setEditProject(null)}
        project={editProject}
        onUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          setEditProject(null)
        }}
      />
    </>
  )
}