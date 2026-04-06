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
import { ENV, USERS_MAP } from '@/conf'
import { useAuth } from '@/context/auth-context'

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
  const { user } = useAuth()
  const [comment, setComment] = useState('')
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments') // UI Toggle

  // Fetch Comments
  const { data: commentsData, refetch: refetchComments } = useQuery({
    queryKey: ['comments', task?.id],
    queryFn: async () => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${projectId}/tasks/${task?.id}/comments`,
        { credentials: 'include' },
      )
      if (!res.ok) throw new Error('Failed')
      return res.json()
    },
    enabled: !!task?.id,
  })

  // Fetch Task Logs
  const { data: logsData, refetch: refetchLogs } = useQuery({
    queryKey: ['task-logs', task?.id],
    queryFn: async () => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${projectId}/tasks/${task?.id}/logs`,
        { credentials: 'include' },
      )
      if (!res.ok) throw new Error('Failed to fetch logs')
      return res.json()
    },
    enabled: !!task?.id,
  })

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/projects/${projectId}/tasks/${task?.id}/comments`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content }),
        },
      )
      if (!res.ok) throw new Error('Failed to post comment')
      return res.json()
    },
    onSuccess: () => {
      setComment('')
      refetchComments()
      refetchLogs() // Refresh logs too since commenting is an action
    },
  })

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
      setComment('')
      setActiveTab('comments')
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

  // Helper to format log messages
  // Helper to format rich log messages
  const renderLogDetails = (log: any) => {
    const changes = log.changes || {}
    const keys = Object.keys(changes)

    if (log.action === 'CREATED') {
      if (keys.length === 0)
        return <span className='text-zinc-600'>Created the task</span>

      return (
        <div className='text-zinc-600'>
          <span>Created the task with details:</span>
          <div className='mt-1 pl-1 border-l-2 border-zinc-200 ml-1 space-y-0.5'>
            {keys.map((key) => {
              let val = changes[key]
              let formattedKey = key.replace('_', ' ')

              // Skip empty values to keep the UI clean
              if (!val) return null

              if (key === 'status') {
                val = STATUS_LABELS[val] || val
              } else if (key === 'priority' || key === 'type') {
                val =
                  typeof val === 'string'
                    ? val.charAt(0).toUpperCase() + val.slice(1)
                    : val
              } else if (key === 'assignee_id') {
                val = USERS_MAP[String(val)] || 'Unassigned'
                formattedKey = 'assignee'
              }

              return (
                <div key={key} className='text-[11px] text-zinc-500'>
                  <span className='text-zinc-400'>↳</span> Set{' '}
                  <span className='font-medium text-zinc-700 capitalize'>
                    {formattedKey}
                  </span>{' '}
                  to <span className='font-medium text-zinc-700'>{val}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    if (log.action === 'COMMENTED') {
      return (
        <span className='text-zinc-600'>
          Added a comment:{' '}
          <span className='italic text-zinc-800'>"{log.changes?.content}"</span>
        </span>
      )
    }

    if (log.action === 'UPDATED') {
      if (keys.length === 0)
        return <span className='text-zinc-600'>Updated the task</span>

      return (
        <div className='text-zinc-600'>
          <span>Updated task details:</span>
          <div className='mt-1 pl-1 border-l-2 border-zinc-200 ml-1 space-y-0.5'>
            {keys.map((key) => {
              let val = changes[key]
              let formattedKey = key.replace('_', ' ')

              if (val === null || val === undefined) return null

              if (key === 'status') {
                val = STATUS_LABELS[val] || val
              } else if (key === 'priority' || key === 'type') {
                val =
                  typeof val === 'string'
                    ? val.charAt(0).toUpperCase() + val.slice(1)
                    : val
              } else if (key === 'assignee_id') {
                val = USERS_MAP[String(val)] || 'Unassigned'
                formattedKey = 'assignee'
              }

              return (
                <div key={key} className='text-[11px] text-zinc-500'>
                  <span className='text-zinc-400'>↳</span> Changed{' '}
                  <span className='font-medium text-zinc-700 capitalize'>
                    {formattedKey}
                  </span>{' '}
                  to <span className='font-medium text-zinc-700'>{val}</span>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    return <span className='text-zinc-600'>Performed an action</span>
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose()
      }}
    >
      <DialogContent className='max-w-lg max-h-[90vh] overflow-y-auto'>
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

          {/* Status + Assignee */}
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <Label className='text-xs font-medium'>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) => set('status', v)}
              >
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

          {/* --- Comments & History Section --- */}
          <div className='pt-2 border-t mt-4'>
            <div className='flex items-center gap-4 mb-3 border-b pb-2'>
              <button
                className={`text-xs font-semibold pb-1 ${activeTab === 'comments' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-zinc-500'}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments
              </button>
              <button
                className={`text-xs font-semibold pb-1 ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-zinc-500'}`}
                onClick={() => setActiveTab('history')}
              >
                Activity History
              </button>
            </div>

            {/* COMMENTS TAB */}
            {activeTab === 'comments' && (
              <div className='space-y-3'>
                <div className='space-y-3 max-h-40 overflow-y-auto pr-1'>
                  {(commentsData?.data ?? []).length === 0 && (
                    <p className='text-xs text-zinc-400'>No comments yet.</p>
                  )}
                  {Array.isArray(commentsData?.data) &&
                    commentsData.data.map((c: any) => (
                      <div key={c.id} className='flex gap-2 text-xs'>
                        <div className='w-6 h-6 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center shrink-0 font-medium uppercase text-[10px]'>
                          {c.user_name?.charAt(0) ?? '?'}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-baseline gap-1.5'>
                            <span className='font-medium text-zinc-700'>
                              {c.user_name}
                            </span>
                            <span className='text-zinc-400 text-[10px]'>
                              {c.created_at}
                            </span>
                          </div>
                          <p className='text-zinc-600 mt-0.5 leading-snug'>
                            {c.content}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <div className='flex gap-2 pt-2'>
                  <Textarea
                    className='text-sm resize-none flex-1'
                    rows={2}
                    placeholder='Add a comment...'
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Button
                    size='sm'
                    className='self-end'
                    disabled={!comment.trim() || commentMutation.isPending}
                    onClick={() => commentMutation.mutate(comment.trim())}
                  >
                    {commentMutation.isPending ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className='space-y-4 max-h-52 overflow-y-auto pr-1'>
                {(logsData?.data ?? []).length === 0 && (
                  <p className='text-xs text-zinc-400'>
                    No activity recorded yet.
                  </p>
                )}
                {Array.isArray(logsData?.data) &&
                  logsData.data.map((log: any) => (
                    <div key={log.id} className='flex gap-2 text-xs'>
                      <div className='w-2 h-2 rounded-full bg-zinc-300 mt-1 shrink-0'></div>
                      <div className='flex-1'>
                        <div className='mb-0.5'>
                          <span className='font-medium text-zinc-800'>
                            {USERS_MAP[String(log.user_id)] || 'Unknown User'}
                          </span>{' '}
                        </div>
                        {/* Render the rich text here */}
                        {renderLogDetails(log)}

                        <div className='text-[10px] text-zinc-400 mt-1'>
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className='gap-2 mt-4'>
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
