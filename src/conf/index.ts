import type {
  Priority,
  Project,
  ProjectUser,
  Status,
} from '@/types/project-types'

export const ENV = {
  VITE_BACKEND_BASE_URL: import.meta.env.VITE_BACKEND_BASE_URL,
}

export const USERS: ProjectUser[] = [
  { id: '1', name: 'Anslem Prathap', email: 'anslem@r1xchange.com' },
  { id: '2', name: 'Namrata Srivastava', email: 'namrata@r1xchange.com' },
  { id: '3', name: 'Ravi Kumar', email: 'ravi@r1xchange.com' },
  { id: '4', name: 'Priya Sharma', email: 'priya@r1xchange.com' },
]

export const PRIORITIES: Priority[] = ['Low', 'Medium', 'High', 'Critical']

export const STATUSES: Status[] = [
  'Planning',
  'Active',
  'On Hold',
  'Completed',
  'Cancelled',
]

export const PRIORITY_STYLES: Record<Priority, string> = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Critical: 'bg-red-50 text-red-700 border-red-200',
}

export const STATUS_STYLES: Record<Status, string> = {
  Planning: 'bg-violet-50 text-violet-700 border-violet-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'On Hold': 'bg-amber-50 text-amber-700 border-amber-200',
  Completed: 'bg-sky-50 text-sky-700 border-sky-200',
  Cancelled: 'bg-zinc-100 text-zinc-500 border-zinc-200',
}

export const DUMMY_PROJECTS: Project[] = [
  {
    id: 'PRJ-00001',
    createdAt: '2024-01-10T00:00:00Z',
    name: 'CRM Dashboard Revamp',
    description: 'Redesign the main CRM dashboard with new analytics widgets.',
    priority: 'High',
    status: 'Active',
    assignees: [USERS[0], USERS[1]],
    startDate: '2024-01-10',
    endDate: '2024-03-30',
  },
  {
    id: 'PRJ-00002',
    createdAt: '2024-02-01T00:00:00Z',
    name: 'Lead Scoring Module',
    description: 'Build automated lead scoring based on CRM activity.',
    priority: 'Critical',
    status: 'Planning',
    assignees: [USERS[1], USERS[2]],
    startDate: '2024-02-01',
    endDate: '2024-04-15',
  },
  {
    id: 'PRJ-00003',
    createdAt: '2024-02-20T00:00:00Z',
    name: 'Email Campaign Integration',
    description: 'Integrate third-party email tool with contact module.',
    priority: 'Medium',
    status: 'On Hold',
    assignees: [USERS[0], USERS[3]],
    startDate: '2024-03-01',
    endDate: '2024-05-01',
  },
  {
    id: 'PRJ-00004',
    createdAt: '2024-03-05T00:00:00Z',
    name: 'Contact Import Tool',
    description: 'Bulk CSV import for contacts with field mapping UI.',
    priority: 'Low',
    status: 'Completed',
    assignees: [USERS[2]],
    startDate: '2024-01-15',
    endDate: '2024-02-28',
  },
  {
    id: 'PRJ-00005',
    createdAt: '2024-03-10T00:00:00Z',
    name: 'Deal Pipeline Notifications',
    description: 'Real-time notifications for deal stage changes.',
    priority: 'High',
    status: 'Active',
    assignees: [USERS[0], USERS[1], USERS[2]],
    startDate: '2024-03-10',
    endDate: '2024-04-30',
  },
]
