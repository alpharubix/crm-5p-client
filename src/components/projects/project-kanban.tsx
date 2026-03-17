import { ENV } from '@/conf'
import type { Project } from '@/types/project-types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
import { useAuth } from '@/context/auth-context'

// ── Hardcoded Users ────────────────────────────────────────────────────────

const USERS_MAP: Record<string, string> = {
  '3899927000000615348': 'Ashok M',
  '3899927000000964875': 'Suraj Gupta',
  '3899927000000882594': 'Myisa Beiucy',
  '3899927000000723465': 'Kaveri Metri',
  '3899927000000201013': 'Anslem Prathap',
  '3899927000005965002': 'Subhasini TS',
}

const STATUS_MAP: Record<string, string> = {
  Planning: 'planning',
  Active: 'active',
  'On Hold': 'on_hold',
  Completed: 'completed',
  Cancelled: 'cancelled',
  'Pending Approve': 'pending_for_approve',
  'Pending Review': 'pending_for_review',
  Rejected: 'rejected',
}

const COLUMN_STYLES: Record<string, { header: string; dot: string }> = {
  Planning: { header: 'text-zinc-500 border-zinc-300', dot: 'bg-zinc-400' },
  Active: { header: 'text-blue-600 border-blue-300', dot: 'bg-blue-500' },
  'On Hold': { header: 'text-amber-600 border-amber-300', dot: 'bg-amber-500' },
  Completed: {
    header: 'text-emerald-600 border-emerald-300',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    header: 'text-orange-700 border-orange-300',
    dot: 'bg-orange-500',
  },
  'Pending Approve': {
    header: 'text-purple-600 border-purple-300',
    dot: 'bg-purple-500',
  },
  'Pending Review': {
    header: 'text-pink-600 border-pink-300',
    dot: 'bg-pink-500',
  },
  Rejected: {
    header: 'text-red-700 border-red-300',
    dot: 'bg-red-500',
  },
}

const TYPE_STYLES: Record<string, string> = {
  Internal: 'bg-blue-50 text-blue-700',
  External: 'bg-violet-50 text-violet-700',
  'R&d': 'bg-emerald-50 text-emerald-700',
  Support: 'bg-amber-50 text-amber-700',
}

const PRIORITY_STYLES: Record<string, string> = {
  Low: 'text-emerald-600',
  Medium: 'text-amber-600',
  High: 'text-orange-600',
  Critical: 'text-red-600',
}
// ── Constants ──────────────────────────────────────────────────────────────

const COLUMNS = [
  'Pending Approve',
  'Planning',
  'Active',
  'On Hold',
  'Cancelled',
  'Pending Review',
  'Rejected',
]

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
  onStatusChange,
  navigate,
}: {
  project: any
  onEdit: (p: any) => void
  navigate: (path: string) => void
  onStatusChange: (id: string, status: string) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: String(project.id),
  })
  const { user } = useAuth()

  // Derive role for the current user on this project
  const isOwner =
    user &&
    project &&
    String(user.user_id) === String((project as any).created_by)
  const isApprover =
    user &&
    project &&
    String(user.user_id) === String((project as any).approver_id)
  const isAssigneeOnly = !isOwner && !isApprover

  // An Approver can change Status + Team. Only Owner can change everything else.
  const overdue = checkOverdue(project.end_date, project.status)
  const isInitiator =
    user && String(user.user_id) === String(project.created_by)

  const handleAction = async (e: React.MouseEvent, toStatus: string) => {
    e.stopPropagation()
    onStatusChange(project.id, toStatus)
    await fetch(`${ENV.VITE_BACKEND_BASE_URL}/projects/${project.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: toStatus }),
    })
  }
  return (
    <div
      ref={setNodeRef}
      {...(!isAssigneeOnly ? listeners : {})}
      {...(!isAssigneeOnly ? attributes : {})}
      className={isDragging ? 'opacity-50' : ''}
    >
      <Card
        className={`transition-colors shadow-sm py-0 gap-0 overflow-hidden border-l-4 ${
          isAssigneeOnly ? 'cursor-default' : 'cursor-grab'
        } ${
          overdue
            ? 'border-l-red-400 border hover:bg-red-50/60'
            : 'border-l-blue-300 border hover:bg-muted/30'
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
            {isOwner ? (
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(project)
                }}
                className='text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0'
                disabled={!isOwner}
              >
                <Pencil className='w-3 h-3 cursor-pointer' />
              </button>
            ) : null}
          </div>

          <div className='grid grid-cols-[100px_1fr] gap-x-2 gap-y-1 mt-1 items-start text-xs'>
            <span className='text-muted-foreground font-medium'>
              Project Type
            </span>
            <span className='font-medium'>
              {project.project_type
                ? project.project_type.charAt(0).toUpperCase() +
                  project.project_type.slice(1)
                : '-'}
            </span>

            <span className='text-muted-foreground font-medium'>Initiator</span>
            <span className='font-medium'>
              {USERS_MAP[project.created_by] || '-'}
            </span>

            <span className='text-muted-foreground font-medium'>Actioner</span>
            <span className='font-medium truncate max-w-[130px]'>
              {project.actioner_ids
                ?.map((id: string) => USERS_MAP[id])
                .filter(Boolean)
                .join(', ') || '-'}
            </span>

            <span className='text-muted-foreground font-medium'>
              Start Date
            </span>
            <span className='font-medium'>{project.start_date || '-'}</span>

            <span className='text-muted-foreground font-medium'>End Date</span>
            <span className='font-medium'>{project.end_date || '-'}</span>
          </div>

          {/* Footer: type badge + priority + overdue tag */}
          <div className='flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-border'>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                TYPE_STYLES[
                  project.project_type
                    ? project.project_type.charAt(0).toUpperCase() +
                      project.project_type.slice(1)
                    : ''
                ] ?? 'bg-zinc-100 text-zinc-500'
              }`}
            >
              {project.project_type ?? '-'}
            </span>
            <span
              className={`text-[10px] font-medium ${
                PRIORITY_STYLES[
                  project.priority
                    ? project.priority.charAt(0).toUpperCase() +
                      project.priority.slice(1)
                    : ''
                ] ?? 'text-zinc-400'
              }`}
            >
              {project.priority ?? '-'}
            </span>
            {overdue && (
              <span className='ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-100 text-red-700'>
                Overdue
              </span>
            )}
            {project.status === 'pending_for_approve' && isApprover && (
              <div className='flex gap-2 mt-2 pt-2 border-t border-border'>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => handleAction(e, 'planning')}
                  className='flex-1 text-[11px] font-medium py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors'
                >
                  Approve
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => handleAction(e, 'rejected')}
                  className='flex-1 text-[11px] font-medium py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors'
                >
                  Reject
                </button>
              </div>
            )}

            {project.status === 'pending_for_review' && isApprover && (
              <div className='flex gap-2 mt-2 pt-2 border-t border-border'>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => handleAction(e, 'completed')}
                  className='flex-1 text-[11px] font-medium py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors'
                >
                  Approve
                </button>
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => handleAction(e, 'rejected')}
                  className='flex-1 text-[11px] font-medium py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 transition-colors'
                >
                  Reject
                </button>
              </div>
            )}
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
  onStatusChange,
}: {
  status: string
  projects: any[]
  onEdit: (p: any) => void
  navigate: (path: string) => void
  onStatusChange: (id: string, status: string) => void
}) {
  console.log({ projects })
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const style = COLUMN_STYLES[status]
  return (
    <div
      ref={setNodeRef}
      className={`min-w-[280px] w-full flex flex-col gap-3 h-full p-2 rounded-lg border transition-colors ${
        isOver ? 'bg-zinc-100 border-zinc-300' : 'bg-zinc-50/50 border-border'
      }`}
    >
      <div
        className={`flex items-center gap-2 pb-2 border-b mb-1 ${style.header}`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
        <span className='text-xs font-semibold uppercase tracking-wide'>
          {status}
        </span>
        <span className='ml-auto text-xs font-mono'>{projects.length}</span>
      </div>
      <div className='flex flex-col gap-3 flex-1 overflow-y-auto pr-1 pb-2'>
        {projects.map((p) => (
          <DraggableProjectCard
            key={p.id}
            project={p}
            onEdit={onEdit}
            navigate={navigate}
            onStatusChange={onStatusChange}
          />
        ))}
        {projects.length === 0 && (
          <div
            className={`border border-dashed rounded-md p-4 text-center text-xs transition-colors ${
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

export default function ProjectKanban() {
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [activeProject, setActiveProject] = useState<any>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [projectList, setProjectList] = useState<any[]>([])
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

  // const projectList: any[] = projects?.data || []
  useEffect(() => {
    if (projects?.data) {
      setProjectList(
        projects.data.map((p: any) => ({
          ...p,
          id: String(p.id),
          actioner_ids: (p.actioner_ids ?? []).map(String),
        })),
      )
    }
  }, [projects])

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveProject(null)
    if (!over) return

    const newStatus = STATUS_MAP[String(over.id)]

    // optimistic update
    setProjectList((prev) =>
      prev.map((p) =>
        String(p.id) === String(active.id) ? { ...p, status: newStatus } : p,
      ),
    )

    // persist
    updateProjectStatus({ id: String(active.id), status: newStatus })
  }
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

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className='flex gap-4 pb-4 overflow-x-auto items-start h-[calc(100vh-200px)]'>
          {COLUMNS.map((col) => {
            const colProjects = projectList.filter(
              (p) => p.status === STATUS_MAP[col],
            )
            return (
              <DroppableProjectColumn
                key={col}
                status={col}
                projects={colProjects}
                onEdit={setEditProject}
                navigate={navigate}
                onStatusChange={(id, status) =>
                  setProjectList((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, status } : p)),
                  )
                }
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
