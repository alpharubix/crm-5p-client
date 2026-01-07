export type Lead = {
  // --- System Fields ---
  id: number
  created_at: string // ISO String from Backend
  updated_at: string

  // --- Core Identity (The Big 5) ---
  full_name: string
  email: string
  phone_number: string
  pan: string
  gstin: string

  // --- Business Details (Nullable/Optional) ---
  company?: string | null
  annual_revenue?: number | null // Backend sends Numeric/Decimal
  business_status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Converted'

  // --- Address & Extra ---
  address?: string | null
  city?: string | null
  state?: string | null
  country?: string | null
  industry?: string | null
  description?: string | null
  distributor_code?: string | null
  designation?: string | null
}

export type Deal = {
  id: number
  account_name: string
  stage: string
  amount: string
  lender: string
  closing_date: string
  deal_owner: string
  last_activity_time: string
  deal_type?: string
}

export type UpdateAccountFormValues = {
  assignmentDate?: Date
  source: string
  distributorCode: string
  wabaInterested: boolean
  callBackDate?: Date
  accountStatus: string
  accountStage: string
  businessStatus: string

  firstName: string
  residentialOwnership: string
  residentialLocation: string
  noOfYears: string
  createdBy: string

  lastName: string
  mothersName: string
  preferredLanguage: string
  premiseLocation: string
  premiseOwnership: string

  street: string
  state: string
  code: string
  city: string
  country: string

  ref1Name: string
  ref1Phone: string
  ref1Email: string
  ref2Name: string
  ref2Phone: string
  ref2Email: string

  businessRegistrationType?: string
  parentAccount?: string
  businessVintage?: number
  typeOfBusiness?: string
  suppliers?: string
  industry?: string
  description?: string
}

export type Contact = {
  id: string
  first_name: string | null
  last_name: string | null
  designation: string | null
  email: string | null
  mobile: string | null
  phone: string | null
  city: string | null
  state: string | null
  created_time: string
  modified_time: string
}
