import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarDays } from "lucide-react"

type Props = {
  value?: Date
  isEdit: boolean
  onChange: (d?: Date) => void
}

export default function DateField({ value, isEdit, onChange }: Props) {
  if (!isEdit) return <span>{value?.toDateString() || "—"}</span>

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="outline">
          <CalendarDays className="w-4 h-4 mr-2" />
          {value?.toDateString() || "Pick Date"}
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
