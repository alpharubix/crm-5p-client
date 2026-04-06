import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import CreateProjectForm from '../projects/create-project'
import type { Project } from '@/types/project-types'
import ProjectList from '../projects/project-list'
import ProjectKanban, { type ProjectFilters } from '../projects/project-kanban'
import DealsKanbanView from './deals-kanban-view'
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
import { USERS_MAP } from '../projects/create-task'

const defaultFilters: ProjectFilters = {
  search: '',
  assignee_id: 'all',
  start_date: '',
  end_date: '',
  project_type: 'all',
  status: 'all',
}

const DUMMY_PROJECTS = [
  {
    id: '1',
    DealName: 'Deal-1001',
    DealId: '1001',
    DealOwner: 'Ashok',
    LenderName: 'Kotak',
  },
  {
    id: '2',
    DealName: 'Deal-1002',
    DealId: '1002',
    DealOwner: 'sandeep',
    LenderName: 'Axis',
  },
  {
    id: '3',
    DealName: 'Deal-1003',
    DealId: '1003',
    DealOwner: 'sandeep',
    LenderName: 'Axis',
  },
  {
    id: '4',
    DealName: 'Deal-1004',
    DealId: '1004',
    DealOwner: 'Arjun',
    LenderName: 'Indusind',
  },
]

export default function DealsKanban() {
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
            <h1 className='text-lg font-semibold'>Deals Kanban</h1>
            <p className='text-xs mt-0.5'>{/* {projects.length} projects */}</p>
          </div>
          <Button>Create +</Button>
        </div>
        {/* FILTER BAR */}
        <div className='flex flex-wrap items-center gap-3 mb-4 p-3  border rounded-md shadow-sm shrink-0'>
          <Input
            placeholder='Deal name...'
            className='h-8 text-xs w-[180px]'
            value={localFilters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          />

          <Select value={localFilters.assignee_id}>
            <SelectTrigger className='h-8 text-xs w-[140px]'>
              <SelectValue placeholder='Deal Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Deal Type</SelectItem>
              <SelectItem value='ntb'>NTB</SelectItem>
              <SelectItem value='ntc'>NTC</SelectItem>
              <SelectItem value='ntl'>NTL</SelectItem>
              <SelectItem value='adhoc'>Adhoc</SelectItem>
              <SelectItem value='renewal'>Renewal</SelectItem>
              <SelectItem value='renewal_enhancement'>
                Renewal & Enhancement
              </SelectItem>
              <SelectItem value='existing'>Existing</SelectItem>
            </SelectContent>
          </Select>

          <Select value={localFilters.project_type}>
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
              <SelectItem value='unsecured_term_loan'>
                Unsecured Term Loan
              </SelectItem>
              <SelectItem value='secured_loan'>Secured Loan</SelectItem>
              <SelectItem value='secured_bt'>Secured BT</SelectItem>
              <SelectItem value='vehicle_loan'>Vehicle Loan</SelectItem>
            </SelectContent>
          </Select>
          {/* FIXED: Using STATUS_OPTIONS array here */}
          <Select value={localFilters.status}>
            <SelectTrigger className='h-8 text-xs '>
              <SelectValue placeholder='Lender Name' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Lender Name</SelectItem>
            </SelectContent>
          </Select>

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
          {viewMode === 'list' ? <DealsKanbanView /> : <ProjectList />}
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
