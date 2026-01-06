import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarDays } from "lucide-react"

type Props = {
  value?: Date
  isEdit: boolean
  onChange: (d?: Date) => void
}

export default function DateField({ value, isEdit, onChange }: Props) {
  if (!value) return <span>—</span>
  if (!isEdit) return <span>{format(new Date(value), "EEEE, dd MMM, yyyy")
    || "—"}</span>

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <CalendarDays className="w-4 h-4 mr-2" />
          {new Date(value)?.toDateString() || "Pick Date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
        />
      </PopoverContent>
    </Popover>
  )
}
