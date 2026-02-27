import { z } from 'zod'

export const createContactSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().min(3, 'Last name is required'),
  designation: z.string().optional(),
  accountId: z.string().min(1, 'Account is required'),
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  secondaryEmail: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  mobile: z
    .string()
    .regex(/^\+?[0-9\s-]{10,15}$/, 'Invalid mobile number')
    .min(10, 'Mobile number is required'),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{10,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  leadSource: z.string().min(1, 'Lead source is required'),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
})

export type CreateContactFormValues = z.infer<typeof createContactSchema>
