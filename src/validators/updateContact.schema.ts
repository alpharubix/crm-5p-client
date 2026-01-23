import { z } from 'zod'

export const updateContactSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),

  leadSource: z.string().optional(),
  designation: z.string().optional(),

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

  accountName: z.string().optional(),

  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  secondaryEmail: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),

  createdBy: z.string().optional(),
  modifiedBy: z.string().optional(),

  street: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
})

export type UpdateContactFormValues = z.infer<typeof updateContactSchema>
