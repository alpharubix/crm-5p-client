export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export type Status =
  | 'Planning'
  | 'Active'
  | 'On Hold'
  | 'Completed'
  | 'Cancelled'

export interface ProjectUser {
  id: string
  name: string
  email: string
}

export interface ProjectFormData {
  name: string
  description: string
  priority: Priority | ''
  status: Status | ''
  assignees: ProjectUser[]
  startDate: string
  endDate: string
}

export interface Project extends ProjectFormData {
  id: string
  createdAt: string
}

export type FormErrors = Partial<Record<keyof ProjectFormData, string>>
