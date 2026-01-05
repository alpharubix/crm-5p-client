import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface NoteDialogProps {
  onAddNote: (note: { description: string }) => void
}

export default function NoteDialog({ onAddNote }: NoteDialogProps) {
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description) return
    onAddNote({ description })
    setOpen(false)
    setDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='ghost' size='sm' className='w-full'>
          <PlusCircle className='w-4 h-4 mr-2' /> Add Note
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          <DialogDescription>Add a new note to this record.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Textarea
              id='description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Note description'
              required
            />
          </div>
          <DialogFooter>
            <Button type='submit'>Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
