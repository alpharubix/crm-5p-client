import { format, isValid } from 'date-fns'

export const formatExactDate = (
  dateString: string,
  formatString: string = 'dd/MM/yyyy'
) => {
  const date = new Date(dateString)
  if (!isValid(date)) return '-'
  return format(date, formatString)
}
