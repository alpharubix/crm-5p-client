import { useState, useEffect } from 'react'
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

const USERS_MAP: Record<string, string> = {
  '3899927000000615348': 'Ashok M',
  '3899927000000964875': 'Suraj Gupta',
  '3899927000000882594': 'Myisa Beiucy',
  '3899927000000723465': 'Kaveri Metri',
  '3899927000000201013': 'Anslem Prathap',
  '3899927000005965002': 'Subhasini TS',
}

interface Task {
  id: string
  title: string
  description?: string
  type: string
  priority: string
  status: string
  assignee_id?: string
  assignee_name?: string
  projectId: string
}

interface EditTaskModalProps {
  open: boolean
  onClose: () => void
  task: Task | null
  projectId: string
  onUpdated: (task: any) => void
}

const TYPES = ['feature', 'bug', 'enhancement', 'research']
const PRIORITIES = ['low', 'medium', 'high', 'critical']
const STATUSES = ['todo', 'in_progress', 'review', 'done']
const STATUS_LABELS: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
}
const REVERSE_STATUS: Record<string, string> = {
  'To Do': 'todo',
  'In Progress': 'in_progress',
  Review: 'review',
  Done: 'done',
}

export default function EditTaskModal({
  open,
  onClose,
  task,
  projectId,
  onUpdated,
}: EditTaskModalProps) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: '',
    priority: '',
    status: '',
    assignee_id: '',
  })

  const queryClient = useQueryClient()

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title ?? '',
        description: task.description ?? '',
        type: task.type.toLowerCase(),
        priority: task.priority.toLowerCase(),
        status: REVERSE_STATUS[task.status] ?? task.status.toLowerCase(),
        assignee_id: task.assignee_id ?? '',
      })
    }
  }, [task])

  const { data: projectData } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${projectId}`,
        {
          credentials: 'include',
        },
      )
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
  })

  const users = (projectData?.actioner_ids ?? []).map((id: string) => ({
    id: String(id),
    name: USERS_MAP[String(id)] ?? id,
  }))

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const mutation = useMutation({
    mutationFn: async (body: typeof form) => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${projectId}/tasks/${task?.id}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: body.title,
            description: body.description,
            type: body.type,
            priority: body.priority,
            status: body.status,
            assignee_id: body.assignee_id ? body.assignee_id : null,
          }),
        },
      )
      if (!res.ok) throw new Error('Failed to update task')
      return res.json()
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      onUpdated(updated)
      onClose()
    },
  })

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
            Edit Task
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
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
            />
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

          {/* Type + Priority */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Label className='text-xs font-medium'>Type</Label>
              <Select value={form.type} onValueChange={(v) => set('type', v)}>
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue />
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
            </div>
            <div>
              <Label className='text-xs font-medium'>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => set('priority', v)}
              >
                <SelectTrigger className='mt-1 h-8 text-sm'>
                  <SelectValue />
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
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className='text-xs font-medium'>Status</Label>
            <Select value={form.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger className='mt-1 h-8 text-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s} className='text-sm'>
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                {users.map((u: { id: string; name: string }) => (
                  <SelectItem
                    key={u.id}
                    value={String(u.id)}
                    className='text-sm'
                  >
                    {u.name}
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
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
