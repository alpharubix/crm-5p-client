import { z } from 'zod'

export const updateAccountSchema = z.object({
  assignmentDate: z.date().optional(),
  callBackDate: z.date().optional(),

  source: z.string().optional(),
  distributorCode: z.string().optional(),

  wabaInterested: z.boolean().optional(),

  accountStatus: z.string().optional(),
  accountStage: z.string().optional(),
  businessStatus: z.string().optional(),

  firstName: z.string().optional(),
  lastName: z.string().optional(),

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
  ref1Email: z.string().optional(),

  ref2Name: z.string().optional(),
  ref2Phone: z.string().optional(),
  ref2Email: z.string().optional(),

  businessRegistrationType: z.string().optional(),
  parentAccount: z.string().optional(),
  businessVintage: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z.number().optional()
  ),
  typeOfBusiness: z.string().optional(),
  suppliers: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  createdBy: z.string().optional(),
})

export type UpdateAccountFormValues = z.infer<typeof updateAccountSchema>
