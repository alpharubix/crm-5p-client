export type TaskType = 'Call' | 'Update Record' | 'Email' | 'Move Status'

export type TaskStatus =
  | 'Unassigned'
  | 'Assigned'
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Verified'
  | 'Overdue'

export type CallBackDateStatus =
  | 'Blank'
  | 'Overdue'
  | 'Due Today'
  | 'Due Tomorrow'
  | 'Due This Week'
  | 'Due Next Week'
  | 'Due Dates'

export interface Note {
  id: string
  parent_id: string
  module_name: string
  note_content: string
  note_title?: string
  created_by_id?: number
  created_by_name?: string
  created_at: string
}

export interface AccountTask {
  id: number
  module_name: string
  account_id: number
  account_name?: string
  account_owner?: string
  account_owner_id?: number
  account_status?: string
  account_stage?: string
  call_back_date_status?: CallBackDateStatus
  task_type: TaskType
  task_description?: string
  task_assigned_date_time?: string
  task_due_date_time?: string
  task_status: TaskStatus
  assigned_to_id?: number
  assigned_to_name?: string
  created_by_id?: number
  modified_by_id?: number
  created_at: string
  updated_at: string
  notes?: Note[]
}

export interface CreateAccountTaskPayload {
  module_name?: string
  account_id: number
  task_type: TaskType
  task_description?: string
  task_assigned_date_time?: string
  task_due_date_time?: string
  task_status?: TaskStatus
  assigned_to_id?: number
}

export interface BulkCreateAccountTaskPayload {
  account_ids: number[]
  task_status?: TaskStatus
  task_assigned_date_time?: string
  task_due_date_time?: string
  task_description?: string
}

export interface UpdateAccountTaskPayload {
  task_type?: TaskType
  task_description?: string
  task_assigned_date_time?: string
  task_due_date_time?: string
  task_status?: TaskStatus
  assigned_to_id?: number
  account_id?: number
}
