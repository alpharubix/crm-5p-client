import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ProjectDetail from './project-detail'
import CreateProjectForm from './create-project'
import type { Project } from '@/types/project-types'
import ProjectList from './project-list'
import ProjectKanban, { type ProjectFilters } from './project-kanban'
// import { DUMMY_PROJECTS } from '@/conf'
import { LayoutList, KanbanSquare, FilterX, Search } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { PROJECT_TYPES, STATUSES } from '@/conf'
import { Input } from '../ui/input'
import { USERS_MAP } from './create-task'

const defaultFilters: ProjectFilters = {
  search: '',
  assignee_id: 'all',
  start_date: '',
  end_date: '',
  project_type: 'all',
  status: 'all',
}
const STATUS_OPTIONS = [
  { label: 'Planning', value: 'planning' },
  { label: 'Active', value: 'active' },
  { label: 'On Hold', value: 'on_hold' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Pending Approve', value: 'pending_for_approve' },
  { label: 'Pending Review', value: 'pending_for_review' },
  { label: 'Rejected', value: 'rejected' },
]
export default function Project() {
  const [projects, setProjects] = useState<Project[]>([])
  const [modalState, setModalState] = useState<'closed' | 'create' | 'detail'>(
    'closed',
  )
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [filters, setFilters] = useState<ProjectFilters>(defaultFilters)
  // UI binds to this (no API calls)
  const [localFilters, setLocalFilters] =
    useState<ProjectFilters>(defaultFilters)

  // useQuery in the child components listens to this
  const [appliedFilters, setAppliedFilters] =
    useState<ProjectFilters>(defaultFilters)

  function setFilter(key: keyof ProjectFilters, value: string) {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  function applyFilters() {
    setAppliedFilters(localFilters)
  }

  function clearFilters() {
    setLocalFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }
  function openCreate() {
    setSelectedProject(null)
    setModalState('create')
  }

  function handleCreated(project: Project) {
    setProjects((prev) => [project, ...prev])
    setSelectedProject(project)
    setModalState('detail')
  }

  function handleSelectProject(project: Project) {
    setSelectedProject(project)
    setModalState('detail')
  }

  function handleClose() {
    setModalState('closed')
    setSelectedProject(null)
  }

  return (
    <div className='w-full h-full p-4 flex flex-col max-w-[1240px] mx-auto'>
      <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex items-center justify-between mb-6 shrink-0'>
          <div>
            <h1 className='text-lg font-semibold'>Projects</h1>
            <p className='text-xs mt-0.5'>{/* {projects.length} projects */}</p>
          </div>
          <div className='flex items-center gap-3'>
            {/* <div className="flex bg-muted p-1 rounded-md border">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center px-2 py-1.5 rounded-sm transition-colors ${viewMode === 'list' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title="List View"
              >
                <KanbanSquare className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center justify-center px-2 py-1.5 rounded-sm transition-colors ${viewMode === 'kanban' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                title="Kanban View"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div> */}
            <Button size='sm' onClick={openCreate}>
              + New Project
            </Button>
          </div>
        </div>
        {/* FILTER BAR */}
        <div className='flex flex-wrap items-center gap-3 mb-4 p-3  border rounded-md shadow-sm shrink-0'>
          <Input
            placeholder='Search name...'
            className='h-8 text-xs w-[180px]'
            value={localFilters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />

          <Select
            value={localFilters.assignee_id}
            onValueChange={(v) => setFilter('assignee_id', v)}
          >
            <SelectTrigger className='h-8 text-xs w-[140px]'>
              <SelectValue placeholder='Assignee' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Assignees</SelectItem>
              {Object.entries(USERS_MAP).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={localFilters.project_type}
            onValueChange={(v) => setFilter('project_type', v)}
          >
            <SelectTrigger className='h-8 text-xs w-[130px]'>
              <SelectValue placeholder='Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Types</SelectItem>
              {PROJECT_TYPES.map((t) => (
                <SelectItem key={t} value={t.toLowerCase()}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* FIXED: Using STATUS_OPTIONS array here */}
          <Select
            value={localFilters.status}
            onValueChange={(v) => setFilter('status', v)}
          >
            <SelectTrigger className='h-8 text-xs w-[140px]'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className='flex items-center gap-1'>
            <Input
              type='date'
              className='h-8 text-xs w-[120px]'
              value={localFilters.start_date}
              onChange={(e) => setFilter('start_date', e.target.value)}
              title='Start Date'
            />
            <span className='text-zinc-400 text-xs'>-</span>
            <Input
              type='date'
              className='h-8 text-xs w-[120px]'
              value={localFilters.end_date}
              onChange={(e) => setFilter('end_date', e.target.value)}
              title='End Date'
            />
          </div>

          <div className='flex items-center gap-2 ml-auto'>
            <Button
              size='sm'
              onClick={applyFilters}
              className='h-8 text-xs px-3 bg-blue-600 hover:bg-blue-700 text-white'
            >
              <Search size={14} className='mr-1.5' /> Apply
            </Button>

            {(localFilters.search ||
              localFilters.assignee_id !== 'all' ||
              localFilters.project_type !== 'all' ||
              localFilters.status !== 'all' ||
              localFilters.start_date ||
              localFilters.end_date) && (
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
          {viewMode === 'list' ? (
            <ProjectKanban filters={appliedFilters} />
          ) : (
            <ProjectList />
          )}
        </div>
      </div>
      <Dialog
        open={modalState !== 'closed'}
        onOpenChange={(o) => {
          if (!o) handleClose()
        }}
      >
        {modalState === 'create' && (
          <CreateProjectForm onCreated={handleCreated} onCancel={handleClose} />
        )}
        {/* {modalState === 'detail' && selectedProject && (
          <ProjectDetail project={selectedProject} onClose={handleClose} />
        )} */}
      </Dialog>
    </div>
  )
}
