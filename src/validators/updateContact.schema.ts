import { z } from "zod";

export const updateContactSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),

  leadSource: z.string().min(1, "Lead Source is required"),
  designation: z.string().optional(),

  mobile: z.string().min(10, "Mobile must be at least 10 digits").optional(),

  phone: z.string().optional(),

  accountName: z.string().optional(),

  email: z.string().email("Invalid email").optional(),
  secondaryEmail: z.string().email("Invalid email").optional(),

  createdBy: z.string(),
  modifiedBy: z.string(),

  street: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateContactFormValues = z.infer<typeof updateContactSchema>;
