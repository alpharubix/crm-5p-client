import { useState } from 'react'
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
import { ENV } from '@/conf'

interface CreateTaskModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  onCreated: (task: any) => void
}

const TYPES = ['feature', 'bug', 'enhancement', 'research']
const PRIORITIES = ['low', 'medium', 'high', 'critical']

const emptyForm = () => ({
  title: '',
  description: '',
  type: '',
  priority: '',
  assignee_id: '',
})

export default function CreateTaskModal({
  open,
  onClose,
  projectId,
  onCreated,
}: CreateTaskModalProps) {
  const [form, setForm] = useState(emptyForm())
  const [errors, setErrors] = useState<Record<string, string>>({})
  const queryClient = useQueryClient()

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

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: '' }))
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.type) e.type = 'Required'
    if (!form.priority) e.priority = 'Required'
    return e
  }

  const mutation = useMutation({
    mutationFn: async (body: typeof form) => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${projectId}/tasks`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: body.title,
            description: body.description,
            type: body.type,
            priority: body.priority,
            assignee_id: body.assignee_id ? body.assignee_id : null,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to create task')
      return res.json()
    },
    onSuccess: (newTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      onCreated(newTask)
      setForm(emptyForm())
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
            New Task
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4 py-1'>
          {/* Title */}
          <div>
            <Label className='text-xs font-medium'>
              Title <span className='text-red-500'>*</span>
            </Label>
            <Input
              className='mt-1 h-8 text-sm'
              placeholder='Task title'
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
            {errors.title && (
              <p className='text-xs text-red-500 mt-1'>{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label className='text-xs font-medium'>Description</Label>
            <Textarea
              className='mt-1 text-sm resize-none'
              rows={2}
              placeholder='Optional'
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>

          {/* Type + Priority */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Label className='text-xs font-medium'>
                Type <span className='text-red-500'>*</span>
              </Label>
              <Select value={form.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className='text-sm capitalize'
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className='text-xs text-red-500 mt-1'>{errors.type}</p>
              )}
            </div>

            <div>
              <Label className='text-xs font-medium'>
                Priority <span className='text-red-500'>*</span>
              </Label>
              <Select
                value={form.priority}
                onValueChange={(v) => set('priority', v)}
              >
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue placeholder='Select' />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem
                      key={p}
                      value={p}
                      className='text-sm capitalize'
                    >
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className='text-xs text-red-500 mt-1'>{errors.priority}</p>
              )}
            </div>
          </div>

          {/* Assignee */}
          <div>
            <Label className='text-xs font-medium'>Assignee</Label>
            <Select
              value={form.assignee_id}
              onValueChange={(v) => set('assignee_id', v)}
            >
              <SelectTrigger className='mt-1 h-8 text-sm'>
                <SelectValue placeholder='Select user' />
              </SelectTrigger>
              <SelectContent>
                {users.map((u: { id: string; full_name: string }) => (
                  <SelectItem
                    key={u.id}
                    value={String(u.id)}
                    className='text-sm'
                  >
                    {u.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            {mutation.isPending ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
