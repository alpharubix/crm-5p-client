import { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import ProjectDetail from './project-detail'
import CreateProjectForm from './create-project'
import type { Project } from '@/types/project-types'
import ProjectList from './project-list'
import ProjectKanban from './project-kanban'
import { DUMMY_PROJECTS } from '@/conf'
import { LayoutList, KanbanSquare } from 'lucide-react'

export default function Project() {
  const [projects, setProjects] = useState<Project[]>(DUMMY_PROJECTS)
  const [modalState, setModalState] = useState<'closed' | 'create' | 'detail'>(
    'closed',
  )
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')

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
    <div className='h-screen p-4 flex flex-col'>
      <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex items-center justify-between mb-6 shrink-0'>
          <div>
            <h1 className='text-lg font-semibold'>Projects</h1>
            <p className='text-xs mt-0.5'>
              {/* {projects.length} projects */}
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <div className="flex bg-muted p-1 rounded-md border">
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
            </div>
            <Button size='sm' onClick={openCreate}>
              + New Project
            </Button>
          </div>
        </div>
        <div className='flex-1 overflow-hidden'>
          {viewMode === 'list' ? <ProjectKanban /> : <ProjectList />}
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
