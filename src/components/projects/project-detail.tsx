import type { Priority, Project, Status } from '@/types/project-types'
import { Button } from '../ui/button'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { PRIORITY_STYLES, STATUS_STYLES } from '@/conf'

export default function ProjectDetail({
  project,
  onClose,
}: {
  project: Project
  onClose: () => void
}) {
  const p = project.priority as Priority
  const s = project.status as Status

  return (
    <DialogContent className='max-w-md'>
      <DialogHeader>
        <p className='text-[11px] font-mono text-zinc-400 mb-0.5'>
          {project.id}
        </p>
        <DialogTitle className='text-base font-semibold leading-tight'>
          {project.name}
        </DialogTitle>
      </DialogHeader>

      <div className='space-y-4 py-1'>
        {/* Badges */}
        <div className='flex gap-2'>
          {p && (
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium ${PRIORITY_STYLES[p]}`}
            >
              {p}
            </span>
          )}
          {s && (
            <span
              className={`text-xs px-2 py-0.5 rounded border font-medium ${STATUS_STYLES[s]}`}
            >
              {s}
            </span>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className='text-sm text-zinc-500 leading-relaxed'>
            {project.description}
          </p>
        )}

        {/* Dates */}
        <div className='grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100'>
          <div>
            <p className='text-[11px] text-zinc-400 mb-0.5'>Start Date</p>
            <p className='text-sm font-medium'>{project.startDate}</p>
          </div>
          <div>
            <p className='text-[11px] text-zinc-400 mb-0.5'>End Date</p>
            <p className='text-sm font-medium'>{project.endDate}</p>
          </div>
        </div>

        {/* Team */}
        <div className='pt-2 border-t border-zinc-100'>
          <p className='text-[11px] text-zinc-400 mb-2'>Team</p>
          <div className='space-y-2'>
            {project.assignees.map((u) => (
              <div key={u.id} className='flex items-center gap-2'>
                <div className='w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs font-semibold shrink-0'>
                  {u.name[0]}
                </div>
                <div>
                  <p className='text-sm leading-none'>{u.name}</p>
                  <p className='text-xs text-zinc-400 mt-0.5'>{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant='outline' size='sm' onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
