import { ENV, PRIORITY_STYLES, STATUS_STYLES } from '@/conf'
import type { Priority, Project, Status } from '@/types/project-types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EditProjectModal from './edit-project'

export default function ProjectList() {
  const [editProject, setEditProject] = useState<Project | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/projects`, {
        credentials: 'include',
      })
      if (res.status === 403) {
        return { forbidden: true }
      }

      if (!res.ok) throw new Error('Failed')

      return res.json()
    },
  })

  return (
    <>
      <div className='border border-zinc-200 rounded-md overflow-hidden'>
        <div className='grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-zinc-50 border-b border-zinc-200 px-4 py-2.5'>
          {['Project Name', 'Status', 'Priority', 'Dates', 'Edit'].map((h) => (
            <p
              key={h}
              className='text-xs font-medium text-zinc-500 uppercase tracking-wide'
            >
              {h}
            </p>
          ))}
        </div>
        {projects?.data?.map((p: any, i: number) => (
          <div
            key={p.id}
            onClick={() => navigate(`/projects/${p.id}`)}
            className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 py-3 cursor-pointer hover:bg-zinc-50 transition-colors items-center ${i !== projects.length - 1 ? 'border-b border-zinc-100' : ''}`}
          >
            <div className=''>
              <p className='text-sm font-medium text-zinc-800 leading-none'>
                {p.name}
              </p>
              <p className='text-xs text-zinc-400 mt-0.5 font-mono'>{p.id}</p>
            </div>
            <div>
              {p.status && (
                <span
                  className={`text-xs px-2 py-0.5 rounded border font-medium ${STATUS_STYLES[p.status as Status]}`}
                >
                  {p.status.charAt(0).toUpperCase() +
                    p.status.replace('_', ' ').slice(1)}
                </span>
              )}
            </div>
            <div>
              {p.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded border font-medium ${PRIORITY_STYLES[p.priority as Priority]}`}
                >
                  {p.priority.charAt(0).toUpperCase() + p.priority.slice(1)}
                </span>
              )}
            </div>
            <div>
              <p className='text-xs text-zinc-500'>{p.startDate}</p>
              <p className='text-xs text-zinc-400'>→ {p.endDate}</p>
            </div>
            <div className='flex -space-x-1.5'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditProject(p)
                }}
                className='text-xs text-zinc-400 hover:text-zinc-600 transition-colors'
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
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
