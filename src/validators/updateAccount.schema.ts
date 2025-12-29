import { z } from "zod";

export const updateAccountSchema = z.object({
  assignmentDate: z.date().optional(),
  callBackDate: z.date().optional(),

  source: z.string().min(1, "Source is required"),
  distributorCode: z.string().min(1, "Distributor Code is required"),

  wabaInterested: z.boolean().optional(),

  accountStatus: z.string().min(1, "Account Status is required"),
  accountStage: z.string().min(1, "Account Stage is required"),
  businessStatus: z.string().min(1, "Business Status is required"),

  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),

  residentialOwnership: z.string().optional(),
  residentialLocation: z.string().optional(),
  noOfYears: z.string().optional(),

  mothersName: z.string().optional(),
  preferredLanguage: z.string().optional(),
  premiseLocation: z.string().optional(),
  premiseOwnership: z.string().optional(),

  street: z.string().optional(),
  state: z.string().optional(),
  code: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  ref1Name: z.string().optional(),
  ref1Phone: z.string().optional(),
  ref1Email: z.string().email("Invalid email").optional(),

  ref2Name: z.string().optional(),
  ref2Phone: z.string().optional(),
  ref2Email: z.string().email("Invalid email").optional(),

  businessRegistrationType: z.string().optional(),
  parentAccount: z.string().optional(),
  businessVintage: z.number().optional(),
  typeOfBusiness: z.string().optional(),
  suppliers: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  createdBy: z.string().optional(),
});

export type UpdateAccountFormValues = z.infer<typeof updateAccountSchema>;
