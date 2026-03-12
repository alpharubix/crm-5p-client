import type { FormErrors, ProjectFormData } from "@/types/project-types"

export const emptyForm = (): ProjectFormData => ({
  name: '',
  description: '',
  priority: '',
  status: '',
  assignees: [],
  startDate: '',
  endDate: '',
  projectType: '',
})

export function validate(form: ProjectFormData): FormErrors {
  const e: FormErrors = {}
  if (!form.name.trim()) e.name = 'Required'
  if (!form.priority) e.priority = 'Required'
  if (!form.status) e.status = 'Required'
  if (form.assignees.length === 0) e.assignees = 'Select at least one member'
  if (!form.startDate) e.startDate = 'Required'
  if (!form.endDate) e.endDate = 'Required'
  if (form.startDate && form.endDate && form.endDate < form.startDate)
    e.endDate = 'Must be after start date'
  return e
}

export function genId(): string {
  return `PRJ-${String(Date.now()).slice(-5)}`
}

