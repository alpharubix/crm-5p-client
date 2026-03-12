import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'
import { ENV, PRIORITIES, PROJECT_TYPES, STATUSES } from '@/conf'
import type {
  Priority,
  Project,
  ProjectType,
  ProjectUser,
  Status,
} from '@/types/project-types'
import { FieldError } from '../ui/field'

interface EditProjectModalProps {
  open: boolean
  onClose: () => void
  project: Project | null
  onUpdated: (p: Project) => void
}

export default function EditProjectModal({
  open,
  onClose,
  project,
  onUpdated,
}: EditProjectModalProps) {
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '',
    description: '',
    priority: '' as Priority | '',
    status: '' as Status | '',
    assignees: [] as ProjectUser[],
    startDate: '',
    endDate: '',
    projectType: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (project) {
      setForm({
        name: project.name ?? '',
        description: project.description ?? '',
        priority: project.priority
          ? ((project.priority.charAt(0).toUpperCase() +
            project.priority.slice(1)) as Priority)
          : '',
        status: project.status
          ? ((project.status.charAt(0).toUpperCase() +
            project.status.replace('_', ' ').slice(1)) as Status)
          : '',
        assignees: ((project as any).actioner_ids ?? []).map((id: number) => ({
          id: String(id),
          name: String(id),
        })),
        startDate: (project as any).start_date ?? '',
        endDate: (project as any).end_date ?? '',
        projectType: (project as any).project_type ?? '',
      })
    }
  }, [project])

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/user/filter`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const users = usersData?.data ?? []

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  function toggleAssignee(user: any) {
    const mapped: any = { id: user.id, name: user.full_name }
    setForm((f) => {
      const exists = f.assignees.some((u) => u.id === mapped.id)
      return {
        ...f,
        assignees: exists
          ? f.assignees.filter((u) => u.id !== mapped.id)
          : [...f.assignees, mapped],
      }
    })
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.priority) e.priority = 'Required'
    if (!form.status) e.status = 'Required'
    if (!form.startDate) e.startDate = 'Required'
    if (!form.endDate) e.endDate = 'Required'
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      e.endDate = 'Must be after start date'
    return e
  }

  const mutation = useMutation({
    mutationFn: async (body: typeof form) => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${project?.id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: body.name,
            description: body.description,
            priority: body.priority.toLowerCase(),
            status: body.status.toLowerCase().replace(' ', '_'),
            start_date: body.startDate,
            end_date: body.endDate,
            actioner_ids: body.assignees.map((u) => u.id),
            // project_type: body.projectType.toLowerCase(),
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update project')
      return res.json()
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      onUpdated(updated)
      onClose()
    },
  })

  function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    mutation.mutate(form)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-base font-semibold'>
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-1 max-h-[65vh] overflow-y-auto pr-1'>
          {/* Name */}
          <div>
            <Label className='text-xs font-medium'>
              Project Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              className='mt-1 h-8 text-sm'
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
            />
            {errors.name && (
              <p className='text-xs text-red-500 mt-1'>{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className='text-xs font-medium'>Description</Label>
            <Textarea
              className='mt-1 text-sm resize-none'
              rows={2}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Priority + Status */}
          <div className='grid grid-cols-3 gap-3'>
            <div>
              <Label className='text-xs font-medium'>
                Priority <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={form.priority}
                onValueChange={(v) => set('priority', v as Priority)}
              >
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p} value={p} className='text-sm'>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className='text-xs text-red-500 mt-1'>{errors.priority}</p>
              )}
            </div>
            <div>
              <Label className='text-xs font-medium'>
                Status <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={form.status}
                onValueChange={(v) => set('status', v as Status)}
              >
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className='text-sm'>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className='text-xs text-red-500 mt-1'>{errors.status}</p>
              )}
            </div>

            <div>
              <Label className='text-xs font-medium'>
                Project Type <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={form.projectType}
                onValueChange={(v) => set('projectType', v as ProjectType)}
              >
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((s) => (
                    <SelectItem key={s} value={s} className='text-sm'>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Label className='text-xs font-medium'>
                Start Date <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='date'
                className='mt-1 h-8 text-sm'
                value={form.startDate}
                onChange={(e) => set('startDate', e.target.value)}
              />
              {errors.startDate && (
                <p className='text-xs text-red-500 mt-1'>{errors.startDate}</p>
              )}
            </div>
            <div>
              <Label className='text-xs font-medium'>
                End Date <span className='text-red-500'>*</span>
              </Label>
              <Input
                type='date'
                className='mt-1 h-8 text-sm'
                value={form.endDate}
                onChange={(e) => set('endDate', e.target.value)}
              />
              {errors.endDate && (
                <p className='text-xs text-red-500 mt-1'>{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Team */}
          <div>
            <Label className='text-xs font-medium'>Team Members</Label>
            <div className='mt-1 border border-zinc-200 rounded-md overflow-hidden divide-y divide-zinc-100 max-h-40 overflow-y-auto'>
              {users.map((user: { id: string; full_name: string }) => {
                const selected = form.assignees.some((u) => u.id === user.id)
                return (
                  <div
                    key={user.id}
                    onClick={() => toggleAssignee(user)}
                    className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer select-none transition-colors
                      ${selected ? 'bg-zinc-50' : 'hover:bg-zinc-50'}`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors
                      ${selected ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300'}`}
                    >
                      {selected && (
                        <svg
                          className='w-2.5 h-2.5 text-white'
                          fill='none'
                          viewBox='0 0 10 10'
                        >
                          <path
                            d='M1.5 5l2.5 2.5 4.5-4.5'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                    </div>
                    <div className='w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-xs font-semibold shrink-0'>
                      {user.full_name[0]}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm leading-none text-zinc-800'>
                        {user.full_name}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
            {form.assignees.length > 0 && (
              <div className='flex flex-wrap gap-1 mt-2'>
                {form.assignees.map((u) => (
                  <Badge
                    key={u.id}
                    variant='secondary'
                    className='text-xs gap-1 pl-2 pr-1'
                  >
                    {u.name}
                    <button
                      onClick={() =>
                        toggleAssignee({ id: u.id, full_name: u.name })
                      }
                      className='hover:text-red-500 transition-colors ml-0.5'
                    >
                      <X size={10} />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='gap-2 mt-2'>
          <Button variant='outline' size='sm' onClick={onClose}>
            Cancel
          </Button>
          <Button
            size='sm'
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
