import { z } from 'zod'

export const createContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  designation: z.string().optional(),
  accountId: z.string().min(1, 'Account is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  secondaryEmail: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  mobile: z
    .string()
    .regex(/^\+?[0-9\s-]{10,15}$/, 'Invalid mobile number')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .regex(/^\+?[0-9\s-]{10,15}$/, 'Invalid phone number')
    .optional()
    .or(z.literal('')),
  leadSource: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  pincode: z.string().optional(),
})

export type CreateContactFormValues = z.infer<typeof createContactSchema>
