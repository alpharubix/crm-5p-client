import { z } from "zod";

export const updateDealSchema = z.object({
  dealType: z.string().min(1),
  dealCallbackDate: z.date().optional(),
  dealApprovalStatus: z.string().optional(),
  dealStatus: z.string().optional(),
  stage: z.string().optional(),
  closingDate: z.date().optional(),
  disbursementDate: z.date().optional(),

  dealName: z.string().min(1),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  amount: z.string().optional(),
  createdBy: z.string(),
  modifiedBy: z.string(),

  accountName: z.string().optional(),
  lenderName: z.string().optional(),
  loanType: z.string().optional(),
  loanProduct: z.string().optional(),
  interestType: z.string().optional(),
  rateOfInterest: z.string().optional(),

  sanctionAmount: z.string().optional(),
  processingFees: z.string().optional(),
  insuranceAmount: z.string().optional(),
  disbursedAmount: z.string().optional(),
  mmCharges: z.string().optional(),

  lenderRejectionReason: z.string().optional(),
  lenderRejectionExplanation: z.string().optional(),
  customerRejectionReason: z.string().optional(),
  customerRejectionExplanation: z.string().optional(),
});

export type UpdateDealFormValues = z.infer<typeof updateDealSchema>;
