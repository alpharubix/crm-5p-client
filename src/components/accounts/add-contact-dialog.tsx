import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

// Schema
const addContactSchema = z.object({
  contactName: z.string().min(1, 'Contact Name is required'),
  phone: z.string().min(10, 'Phone Number is required'),
  designation: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  city: z.string().optional(),
  state: z.string().optional(),
})

type AddContactFormValues = z.infer<typeof addContactSchema>

export default function AddContactDialog() {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddContactFormValues>({
    resolver: zodResolver(addContactSchema),
    defaultValues: {
      contactName: '',
      phone: '',
      designation: '',
      mobile: '',
      email: '',
      city: '',
      state: '',
    },
  })

  const onSubmit = async (data: AddContactFormValues) => {
    setSubmitting(true)
    // console.log('Submitting Contact Data:', data)

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setOpen(false)
      toast.success('Contact added successfully')
      reset()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button size='sm' variant='ghost' className='gap-2 w-full'>
          <User className='w-4 h-4' /> Add Contact
        </Button> */}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Add Contact</DialogTitle>
          <DialogDescription>
            Add a new contact to this account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4 py-2'>
          <div className='grid grid-cols-2 gap-4'>
            {/* Required Fields */}
            <div className='space-y-2'>
              <Label>
                Contact Name <span className='text-red-500'>*</span>
              </Label>
              <Input placeholder='John Doe' {...register('contactName')} />
              {errors.contactName && (
                <p className='text-xs text-red-500'>
                  {errors.contactName.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label>
                Phone <span className='text-red-500'>*</span>
              </Label>
              <Input placeholder='1234567890' {...register('phone')} />
              {errors.phone && (
                <p className='text-xs text-red-500'>{errors.phone.message}</p>
              )}
            </div>

            {/* Optional Fields */}
            <div className='space-y-2'>
              <Label>Designation</Label>
              <Input placeholder='Manager' {...register('designation')} />
            </div>

            <div className='space-y-2'>
              <Label>Mobile</Label>
              <Input placeholder='9876543210' {...register('mobile')} />
            </div>

            <div className='space-y-2'>
              <Label>Email</Label>
              <Input placeholder='john@example.com' {...register('email')} />
              {errors.email && (
                <p className='text-xs text-red-500'>{errors.email.message}</p>
              )}
            </div>

            <div className='space-y-2'>
              <Label>City</Label>
              <Input placeholder='New York' {...register('city')} />
            </div>

            <div className='space-y-2'>
              <Label>State</Label>
              <Input placeholder='NY' {...register('state')} />
            </div>
          </div>

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type='submit' disabled={submitting}>
              {submitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
