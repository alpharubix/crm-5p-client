import { useState } from 'react'
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import type {
  FormErrors,
  Priority,
  Project,
  ProjectFormData,
  ProjectType,
  ProjectUser,
  Status,
} from '@/types/project-types'
import { emptyForm, validate } from '@/utils/project-utils'
import { ENV, PRIORITIES, PROJECT_TYPES, STATUSES, USERS } from '@/conf'
import { X } from 'lucide-react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import tech_team_users from '@/utils/tech_team_users.json'

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <p className='text-xs text-red-500 mt-1'>{msg}</p>
}

export default function CreateProjectForm({
  onCreated,
  onCancel,
}: {
  onCreated: (p: Project) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<ProjectFormData>({
    ...emptyForm(),
    approver_id: '', // Add this
  })
  const [errors, setErrors] = useState<FormErrors>({})

  function set<K extends keyof ProjectFormData>(
    key: K,
    value: ProjectFormData[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const users = tech_team_users
  function toggleAssignee(user: any) {
    setForm((f) => {
      const exists = f.assignees.some((u) => u.id === user.id)
      return {
        ...f,
        assignees: exists
          ? f.assignees.filter((u) => u.id !== user.id)
          : [...f.assignees, user],
      }
    })
    setErrors((e) => ({ ...e, assignees: undefined }))
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async (body: ProjectFormData) => {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/projects`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: body.name,
          description: body.description,
          priority: body.priority.toLowerCase(),
          start_date: body.startDate,
          end_date: body.endDate,
          actioner_ids: body.assignees.map((u) => u.id),
          project_type: body.projectType.toLowerCase(),
          approver_id: body.approver_id, // NEW
        }),
      })
      if (!res.ok) throw new Error('Failed to create project')
      return res.json()
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      onCreated(newProject)
    },
  })

  function handleSubmit() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    mutation.mutate(form)
  }

  return (
    <DialogContent className='max-w-md'>
      <DialogHeader>
        <DialogTitle className='text-base font-semibold'>
          New Project
        </DialogTitle>
      </DialogHeader>

      <div className='space-y-4 py-1'>
        {/* Name */}
        <div>
          <Label className='text-xs font-medium'>
            Project Name <span className='text-red-500'>*</span>
          </Label>
          <Input
            className='mt-1 h-8 text-sm'
            placeholder='e.g. CRM Dashboard Revamp'
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <FieldError msg={errors.name} />
        </div>

        {/* Description */}
        <div>
          <Label className='text-xs font-medium'>Description</Label>
          <Textarea
            className='mt-1 text-sm resize-none'
            rows={2}
            placeholder='Brief description (optional)'
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {/* Priority + Status + Project Type */}
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
            <FieldError msg={errors.priority} />
          </div>

          {/* <div>
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
            <FieldError msg={errors.status} />
          </div> */}

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
            <FieldError msg={errors.projectType} />
          </div>
          <div>
            <Label className='text-xs font-medium'>
              Approver <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={form.approver_id}
              onValueChange={(v) => set('approver_id', v as ProjectType)}
            >
              <SelectTrigger className='mt-1 h-8 text-sm'>
                <SelectValue placeholder='Select' />
              </SelectTrigger>
              <SelectContent>
                {users.map((s) => (
                  <SelectItem key={s.id} value={s.id} className='text-sm'>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError msg={errors.approver_id} />
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
            <FieldError msg={errors.startDate} />
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
            <FieldError msg={errors.endDate} />
          </div>
        </div>

        {/* Team */}
        <div>
          <Label className='text-xs font-medium'>
            Team Members <span className='text-red-500'>*</span>
          </Label>
          <div className='mt-1 border border-zinc-200 rounded-md overflow-hidden divide-y divide-zinc-100 max-h-40 overflow-y-auto'>
            {users.map((user: { id: string; name: string }) => {
              const selected = form.assignees.some((u) => u.id === user.id)
              return (
                <div
                  key={user.id}
                  onClick={() =>
                    toggleAssignee({ id: user.id, name: user.name })
                  }
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
                    {user.name[0]}
                  </div>
                  <div className='min-w-0'>
                    <p className='text-sm leading-none text-zinc-800'>
                      {user.name}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Selected badges */}
          {/* {form.assignees.length > 0 && (
            <div className='flex flex-wrap gap-1 mt-2'>
              {form.assignees.map((u) => (
                <Badge
                  key={u.id}
                  variant='secondary'
                  className='text-xs gap-1 pl-2 pr-1'
                >
                  {u.name}
                  <button
                    onClick={() => toggleAssignee(u)}
                    className='hover:text-red-500 transition-colors ml-0.5'
                  >
                    <X size={10} />
                  </button>
                </Badge>
              ))}
            </div>
          )} */}
          <FieldError msg={errors.assignees} />
        </div>
      </div>

      <DialogFooter className='gap-2 mt-2'>
        <Button variant='outline' size='sm' onClick={onCancel}>
          Cancel
        </Button>
        <Button size='sm' onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create Project'}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
