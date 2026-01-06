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
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@/components/ui/label'

const noteSchema = z.object({
  description: z
    .string()
    .trim()
    .min(6, 'Description must be at least 6 characters'),
})

type NoteFormValues = z.infer<typeof noteSchema>

interface NoteDialogProps {
  onAddNote: (note: NoteFormValues) => void
}

export default function NoteDialog({ onAddNote }: NoteDialogProps) {
  const [open, setOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      description: '',
    },
  })

  // Reset form when dialog opens/closes
  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      reset()
    }
  }

  const onSubmit = (data: NoteFormValues) => {
    onAddNote(data)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='description'>Description</Label>
            <Textarea
              id='description'
              placeholder='Note description'
              className={errors.description ? 'border-red-500' : ''}
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button type='submit'>Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
