import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload, useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'
import SelectField from '@/components/shared/select-field'
import DateField from '@/components/shared/date-field'
import NoteDialog from '@/components/shared/note-dialog'
import { Spinner } from '@/components/ui/spinner'

import {
  updateAccountSchema,
  type UpdateAccountFormValues,
} from '@/validators/updateAccount.schema'
import { ENV } from '@/conf'
import { formatExactDate } from '@/utils/date-formatter'
import { Plus } from 'lucide-react'

// Shows "—" only for empty values
function display(v: any) {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'string' && v.trim() === '') return '—'
  return v
}

// Map API response to form values
function mapAccountToForm(apiData: any): UpdateAccountFormValues {
  return {
    assignmentDate: apiData.assignment_date
      ? new Date(apiData.assignment_date)
      : undefined,

    source: apiData.source ?? '',
    distributorCode: apiData.distributor_code ?? '',
    firstName: apiData.first_name ?? '',
    lastName: apiData.last_name ?? '',
    phone: apiData.phone ?? '',
    email: apiData.email ?? '',
    residentialLocation: apiData.custom_fields?.residential_location ?? '',
    noOfYears: apiData.custom_fields?.no_of_years ?? '',
    mothersName: apiData.custom_fields?.mothers_name ?? '',
    preferredLanguage: apiData.custom_fields?.preferred_language ?? '',
    premiseLocation: apiData.custom_fields?.premise_location ?? '',
    suppliers: apiData.custom_fields?.suppliers ?? '',
    description: apiData.custom_fields?.description ?? '',
    parentAccount: apiData.parent_account ?? '',
    street: apiData.custom_fields?.street ?? '',
    state: apiData.state ?? '',
    code: apiData.pincode ?? '',
    city: apiData.city ?? '',
    country: apiData.country ?? 'India',
    ref1Name: apiData.custom_fields?.ref1_name ?? '',
    ref1Phone: apiData.custom_fields?.ref1_phone ?? '',
    ref1Email: apiData.custom_fields?.ref1_email ?? '',
    ref2Name: apiData.custom_fields?.ref2_name ?? '',
    ref2Phone: apiData.custom_fields?.ref2_phone ?? '',
    ref2Email: apiData.custom_fields?.ref2_email ?? '',

    wabaInterested: apiData.waba_interested ?? false,

    callBackDate: apiData.call_back_date_time
      ? new Date(apiData.call_back_date_time)
      : undefined,

    accountStatus: apiData.account_status ?? '',
    accountStage: apiData.account_stage ?? '',
    businessStatus: apiData.business_status ?? '',

    residentialOwnership: apiData.custom_fields?.residential_ownership ?? '',
    premiseOwnership: apiData.custom_fields?.premise_ownership ?? '',
    businessRegistrationType:
      apiData.custom_fields?.business_registration_type ?? '',
    businessVintage: apiData.custom_fields?.business_vintage ?? '',
    typeOfBusiness: apiData.type_of_business ?? '',
    industry: apiData.industry ?? '',

    createdBy: apiData.created_by?.full_name ?? '',
  }
}

// Map form values to API payload
function mapFormToApi(
  formData: UpdateAccountFormValues,
  dirtyFields: Partial<Record<keyof UpdateAccountFormValues, boolean>>,
): any {
  const allFields = {
    assignment_date: { value: formData.assignmentDate, key: 'assignmentDate' },
    source: { value: formData.source, key: 'source' },
    distributor_code: {
      value: formData.distributorCode,
      key: 'distributorCode',
    },
    waba_interested: { value: formData.wabaInterested, key: 'wabaInterested' },
    call_back_date_time: { value: formData.callBackDate, key: 'callBackDate' },
    account_status: { value: formData.accountStatus, key: 'accountStatus' },
    account_stage: { value: formData.accountStage, key: 'accountStage' },
    business_status: { value: formData.businessStatus, key: 'businessStatus' },
    first_name: { value: formData.firstName, key: 'firstName' },
    last_name: { value: formData.lastName, key: 'lastName' },
    phone: { value: formData.phone, key: 'phone' },
    email: { value: formData.email, key: 'email' },
    residential_ownership: {
      value: formData.residentialOwnership,
      key: 'residentialOwnership',
    },
    residential_location: {
      value: formData.residentialLocation,
      key: 'residentialLocation',
    },
    no_of_years: { value: formData.noOfYears, key: 'noOfYears' },
    mothers_name: { value: formData.mothersName, key: 'mothersName' },
    preferred_language: {
      value: formData.preferredLanguage,
      key: 'preferredLanguage',
    },
    premise_location: {
      value: formData.premiseLocation,
      key: 'premiseLocation',
    },
    premise_ownership: {
      value: formData.premiseOwnership,
      key: 'premiseOwnership',
    },
    business_registration_type: {
      value: formData.businessRegistrationType,
      key: 'businessRegistrationType',
    },
    business_vintage: {
      value: formData.businessVintage,
      key: 'businessVintage',
    },
    suppliers: { value: formData.suppliers, key: 'suppliers' },
    description: { value: formData.description, key: 'description' },
    parent_account: { value: formData.parentAccount, key: 'parentAccount' },
    type_of_business: { value: formData.typeOfBusiness, key: 'typeOfBusiness' },
    industry: { value: formData.industry, key: 'industry' },
    street: { value: formData.street, key: 'street' },
    state: { value: formData.state, key: 'state' },
    pincode: { value: formData.code, key: 'code' },
    city: { value: formData.city, key: 'city' },
    country: { value: formData.country, key: 'country' },
    ref1_name: { value: formData.ref1Name, key: 'ref1Name' },
    ref1_phone: { value: formData.ref1Phone, key: 'ref1Phone' },
    ref1_email: { value: formData.ref1Email, key: 'ref1Email' },
    ref2_name: { value: formData.ref2Name, key: 'ref2Name' },
    ref2_phone: { value: formData.ref2Phone, key: 'ref2Phone' },
    ref2_email: { value: formData.ref2Email, key: 'ref2Email' },
  }

  const payload: any = {}

  Object.entries(allFields).forEach(([apiKey, { value, key }]) => {
    // @ts-ignore
    if (dirtyFields[key]) {
      payload[apiKey] = value
    }
  })

  // Always include ID if needed, but for updates usually ID is in URL.
  // The user only wants updated fields.

  return payload
}

export default function UpdateAccounts() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [isEdit, setIsEdit] = useState(false)
  const [openAllNotes, setOpenAllNotes] = useState(false)

  const navigate = useNavigate()

  const form = useForm<UpdateAccountFormValues>({
    // @ts-ignore
    resolver: zodResolver(updateAccountSchema),
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, dirtyFields },
  } = form

  // Fetch account data
  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['account', id],
    queryFn: async () => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/accounts?account_id=${id}`,
        { credentials: 'include' },
      )
      if (!res.ok) throw new Error('Failed to fetch account')
      return res.json()
    },
    enabled: !!id,
  })

  // Extract account data and related entities
  const accountData = apiResponse?.data?.[0]
  // console.log('accountData', accountData)

  const contacts = accountData?.account_linked_contact || []
  // console.log('contacts', contacts)

  const notes = accountData?.notes || []

  const sortedNotes = [...notes].sort((a: any, b: any) => {
    return (
      new Date(b.Created_Time).getTime() - new Date(a.Created_Time).getTime()
    )
  })

  const ownerName = accountData?.owner?.full_name || 'User'

  // Populate form when data loads
  useEffect(() => {
    if (accountData) {
      const formValues = mapAccountToForm(accountData)
      reset(formValues)
    }
  }, [accountData, reset])

  // console.log('dirtyFields', dirtyFields)
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: UpdateAccountFormValues) => {
      // console.log('values', values)
      // console.log('dirtyFields', dirtyFields)

      const payload = mapFormToApi(values, dirtyFields)
      // console.log('payload', payload)

      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/accounts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to update account')
      return res.json()
    },
    onSuccess: (data, variables) => {
      toast.success('Account updated successfully')
      setIsEdit(false)
      reset(variables) // Reset with submitted values to clear dirty state
      queryClient.invalidateQueries({ queryKey: ['account', id] })
    },
    onError: () => {
      toast.error('Failed to update account')
    },
  })

  // console.log('updateMutation', updateMutation)

  // Warn on browser close/refresh if dirty
  useBeforeUnload(
    useCallback(
      (e) => {
        if (isDirty) {
          e.preventDefault()
          e.returnValue = ''
        }
      },
      [isDirty],
    ),
  )

  const data = watch()
  // console.log(data)

  // console.log('data', data)

  const onSave = (values: UpdateAccountFormValues) => {
    updateMutation.mutate(values)
  }

  const handleAddNote = async (note: { description: string }) => {
    try {
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: id,
          note: note.description, // Using description as the note content
        }),
      })

      if (res.ok) {
        toast.success('Note added successfully')
        queryClient.invalidateQueries({ queryKey: ['account', id] })
      } else {
        toast.error('Failed to add note')
      }
    } catch (error) {
      toast.error('Network error')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <Spinner className='h-8 w-8 text-muted-foreground' />
      </div>
    )
  }

  if (error || !accountData) {
    return <div className='p-4'>Account not found</div>
  }

  const MAX_NOTES_VISIBLE = 3
  const showViewMore = sortedNotes.length > MAX_NOTES_VISIBLE
  const visibleNotes = showViewMore
    ? sortedNotes.slice(0, MAX_NOTES_VISIBLE)
    : sortedNotes

  return (
    <div className='space-y-6 bg-background min-h-screen'>
      {/* HEADER */}
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <div>
          <h1 className='text-lg font-semibold'>
            Account Name: {accountData?.account_name}
          </h1>
          <h1 className='text-base font-medium'>
            Account Owner:{' '}
            <span className='text-base font-bold'>{ownerName}</span>
          </h1>
        </div>

        {!isEdit ? (
          <Button
            size='sm'
            className='cursor-pointer'
            onClick={() => setIsEdit(true)}
          >
            Update
          </Button>
        ) : (
          <div className='flex gap-2'>
            <Button
              size='sm'
              className='cursor-pointer'
              disabled={!isDirty || updateMutation.isPending}
              onClick={handleSubmit(onSave)}
            >
              {updateMutation.isPending ? (
                <Spinner className='mr-2 h-4 w-4' />
              ) : (
                'Save'
              )}
            </Button>
            <Button
              size='sm'
              className='cursor-pointer'
              variant='outline'
              onClick={() => {
                reset()
                setIsEdit(false)
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      <Card className='overflow-hidden space-y-1'>
        {/* ================= Account Status ================= */}
        <SectionHeader title='Account Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Assignment Date'>
              <span>
                {data.assignmentDate
                  ? new Date(data.assignmentDate).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>

            <FieldRow label='Source' error={errors.source?.message}>
              <SelectField
                value={data.source}
                isEdit={isEdit}
                options={[
                  'Himalaya',
                  'CavinKare',
                  'ALL INDIA CHEMISTS AND DRUGGISTS ASSOCIATION OF INDIA',
                  'All India Hardware Association (Based in Mumbai Charni Road)',
                  'Alpharubix',
                  'Condor Footwear',
                  'DVG Dist Petroleum',
                  'Federation of Hotel and Restaurant Association of India (Based in New Delhi)',
                  'Havells',
                  'Liberty',
                  'Marico',
                  'Reference',
                  'Retail Association of India',
                  'SME CHAMBER',
                  'Swastik',
                  'Unicharm',
                  'Vibhava Marketing',
                ]}
                onChange={(v) => setValue('source', v, { shouldDirty: true })}
              />
            </FieldRow>

            <FieldRow
              label='Distributor Code'
              error={errors.distributorCode?.message}
            >
              {isEdit ? (
                <Input {...register('distributorCode')} className='h-8' />
              ) : (
                <span>{data.distributorCode || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='WABA Interested'>
              <SelectField
                value={
                  data.wabaInterested === null ||
                  data.wabaInterested === undefined
                    ? '—'
                    : data.wabaInterested
                      ? 'Yes'
                      : 'No'
                }
                isEdit={isEdit}
                options={['Yes', 'No']}
                onChange={(v) =>
                  setValue('wabaInterested', v === 'Yes', { shouldDirty: true })
                }
              />
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Call Back Date/ Time'>
              <DateField
                value={data.callBackDate}
                isEdit={isEdit}
                showTime={true}
                disablePast={true}
                onChange={(d) =>
                  setValue('callBackDate', d, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow
              label='Account Status'
              error={errors.accountStatus?.message}
            >
              <SelectField
                value={data.accountStatus}
                isEdit={isEdit}
                options={[
                  'Awareness',
                  'Attention',
                  'Assessment',
                  'Not Interested',
                  'Location Unserviceable',
                  'Lender Review',
                  'Yet to be dialed',
                  'Contact Established',
                  'Contact Not Established',
                  'Wrong Number',
                  'Yet to be dialed',
                  'Contact Established',
                  'Contact Not Established',
                ]}
                onChange={(v) =>
                  setValue('accountStatus', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow
              label='Account Stage'
              error={errors.accountStage?.message}
            >
              <SelectField
                value={data.accountStage}
                isEdit={isEdit}
                options={[
                  'Initial Pitch',
                  'Product Offering',
                  'Doc List Shared to Cust',
                  'Partial Docs Rec',
                  'Yet To Review',
                  'Under Internal Review',
                  'In Review with Lender',
                  'Interested',
                  'Commercial NI',
                  'Location not doable',
                  'No Requirement',
                ]}
                onChange={(v) =>
                  setValue('accountStage', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow
              label='Business Status'
              error={errors.businessStatus?.message}
            >
              <SelectField
                value={data.businessStatus}
                isEdit={isEdit}
                options={['Active', 'Inactive']}
                onChange={(v) =>
                  setValue('businessStatus', v, { shouldDirty: true })
                }
              />
            </FieldRow>
          </div>
        </CardContent>

        <div className='mx-3'>
          <h3 className='mb-4 font-bold text-center text-xs uppercase tracking-widest'>
            CONTACTS
          </h3>
          <div>
            <div className='border rounded-md mb-3 overflow-hidden'>
              <Table>
                <TableHeader className='bg-muted'>
                  <TableRow>
                    <TableHead>Contact Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className='text-center text-muted-foreground'
                      >
                        No contacts available
                      </TableCell>
                    </TableRow>
                  ) : (
                    contacts.map((contact: any) => (
                      <TableRow
                        key={contact.id}
                        onClick={() => navigate(`/contacts/${contact.id}`)}
                        className='cursor-pointer'
                      >
                        <TableCell>{contact.last_name || '—'}</TableCell>
                        <TableCell>{contact.phone || '—'}</TableCell>
                        <TableCell>{contact.mobile || '—'}</TableCell>
                        <TableCell>{contact.email || '—'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className='w-[150px] mx-auto flex justify-center'>
              <Button
                variant='outline'
                onClick={() =>
                  navigate(`/contacts-create`, {
                    state: {
                      accountId: id,
                      accountName: accountData?.account_name,
                      leadSource: data.source,
                    },
                  })
                }
                className='w-full'
              >
                <Plus className='h-4 w-4' />
                Add Contact
              </Button>
            </div>
          </div>
        </div>

        {/* ================= Customer Basic Details ================= */}
        <SectionHeader title='Customer Basic Details' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='First Name'>
              {isEdit ? (
                <Input {...register('firstName')} className='h-8' />
              ) : (
                <span>{display(data.firstName)}</span>
              )}
            </FieldRow>

            <FieldRow
              label='Residential Ownership'
              error={errors.residentialOwnership?.message}
            >
              <SelectField
                value={display(data.residentialOwnership)}
                isEdit={isEdit}
                options={[
                  'Self Owned',
                  'Rented',
                  'Parent Owned',
                  'Leased',
                  'Children Owned',
                  'Spouse Owned',
                  'Relative Owned',
                ]}
                onChange={(v) =>
                  setValue('residentialOwnership', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Residential Location'>
              {isEdit ? (
                <Input {...register('residentialLocation')} className='h-8' />
              ) : (
                <span>{display(data.residentialLocation)}</span>
              )}
            </FieldRow>

            <FieldRow
              label='No of Years residing in current residence'
              error={errors.noOfYears?.message}
            >
              {isEdit ? (
                <Input {...register('noOfYears')} className='h-8' />
              ) : (
                <span>{display(data.noOfYears)}</span>
              )}
            </FieldRow>

            <FieldRow label='Created By'>
              <span>{display(data.createdBy)}</span>
            </FieldRow>

            <FieldRow label='Phone No' error={errors.phone?.message}>
              {isEdit ? (
                <Input {...register('phone')} className='h-8' />
              ) : (
                <span>{display(data.phone)}</span>
              )}
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Last Name' error={errors.lastName?.message}>
              {isEdit ? (
                <Input {...register('lastName')} className='h-8' />
              ) : (
                <span>{display(data.lastName)}</span>
              )}
            </FieldRow>

            <FieldRow label='Mothers Name'>
              {isEdit ? (
                <Input {...register('mothersName')} className='h-8' />
              ) : (
                <span>{display(data.mothersName)}</span>
              )}
            </FieldRow>

            <FieldRow label='Preferred Language'>
              {isEdit ? (
                <Input {...register('preferredLanguage')} className='h-8' />
              ) : (
                <span>{display(data.preferredLanguage)}</span>
              )}
            </FieldRow>

            <FieldRow label='Business Premise Location'>
              {isEdit ? (
                <Input {...register('premiseLocation')} className='h-8' />
              ) : (
                <span>{display(data.premiseLocation)}</span>
              )}
            </FieldRow>

            <FieldRow
              label='Business Premise Ownership'
              error={errors.premiseOwnership?.message}
            >
              <SelectField
                value={display(data.premiseOwnership)}
                isEdit={isEdit}
                options={[
                  'Self Owned',
                  'Rented',
                  'Parent Owned',
                  'Leased',
                  'Children Owned',
                  'Spouse Owned',
                  'Relative Owned',
                ]}
                onChange={(v) =>
                  setValue('premiseOwnership', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Email' error={errors.email?.message}>
              {isEdit ? (
                <Input {...register('email')} className='h-8' />
              ) : (
                <span>{display(data.email)}</span>
              )}
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Customer Business Details ================= */}
        <SectionHeader title='Customer Business Details' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Business Registration Type'>
              {isEdit ? (
                <Input
                  {...register('businessRegistrationType')}
                  className='h-8'
                />
              ) : (
                <span>{display(data.businessRegistrationType)}</span>
              )}
            </FieldRow>

            <FieldRow
              label='Business Vintage (No of Years)'
              error={errors.businessVintage?.message}
            >
              {isEdit ? (
                <Input {...register('businessVintage')} className='h-8' />
              ) : (
                <span>{display(data.businessVintage)}</span>
              )}
            </FieldRow>

            <FieldRow label='Suppliers'>
              {isEdit ? (
                <Input {...register('suppliers')} className='h-8' />
              ) : (
                <span>{display(data.suppliers)}</span>
              )}
            </FieldRow>

            <FieldRow label='Description'>
              {isEdit ? (
                <Input {...register('description')} className='h-8' />
              ) : (
                <span>{display(data.description)}</span>
              )}
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Parent Account'>
              <span>{display(data.parentAccount)}</span>
            </FieldRow>

            <FieldRow label='Type of Business'>
              <SelectField
                value={display(data.typeOfBusiness)}
                isEdit={isEdit}
                options={[
                  'Manufacturer',
                  'Distributor',
                  'Franchise/FOFO',
                  'Wholesale Trader',
                  'Retailer',
                  'Super Stockist',
                  'Sub Distributor',
                  'Inst Customers',
                  'Govt Institutions',
                  'Co Operative Society',
                ]}
                onChange={(v) =>
                  setValue('typeOfBusiness', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Industry'>
              <SelectField
                value={display(data.industry)}
                isEdit={isEdit}
                options={[
                  'Pharma',
                  'AHP',
                  'CPD',
                  'FMCG',
                  'OTX',
                  'Footwear',
                  'OTC',
                  'RAAGA',
                  'Hardware',
                  'Electronics',
                  'DVG Dist Petroleum',
                ]}
                onChange={(v) => setValue('industry', v, { shouldDirty: true })}
              />
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Address Information ================= */}
        <SectionHeader title='Address Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow label='Street'>
              {isEdit ? (
                <Input {...register('street')} className='h-8' />
              ) : (
                <span>{display(data.street)}</span>
              )}
            </FieldRow>
            <FieldRow label='State'>
              {isEdit ? (
                <Input {...register('state')} className='h-8' />
              ) : (
                <span>{display(data.state)}</span>
              )}
            </FieldRow>
            <FieldRow label='Code'>
              {isEdit ? (
                <Input {...register('code')} className='h-8' />
              ) : (
                <span>{display(data.code)}</span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow label='City'>
              {isEdit ? (
                <Input {...register('city')} className='h-8' />
              ) : (
                <span>{display(data.city)}</span>
              )}
            </FieldRow>
            <FieldRow label='Country'>
              <span>{display(data.country)}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= References ================= */}
        <SectionHeader title='References from Customer' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow label='Name of Person 1'>
              {isEdit ? (
                <Input {...register('ref1Name')} className='h-8' />
              ) : (
                <span>{display(data.ref1Name)}</span>
              )}
            </FieldRow>
            <FieldRow
              label='Phone of Person 1'
              error={errors.ref1Phone?.message}
            >
              {isEdit ? (
                <Input {...register('ref1Phone')} className='h-8' />
              ) : (
                <span>{display(data.ref1Phone)}</span>
              )}
            </FieldRow>
            <FieldRow
              label='Email ID Person 1'
              error={errors.ref1Email?.message}
            >
              {isEdit ? (
                <Input {...register('ref1Email')} className='h-8' />
              ) : (
                <span>{display(data.ref1Email)}</span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Name of Person 2'>
              {isEdit ? (
                <Input {...register('ref2Name')} className='h-8' />
              ) : (
                <span>{display(data.ref2Name)}</span>
              )}
            </FieldRow>
            <FieldRow
              label='Phone of Person 2'
              error={errors.ref2Phone?.message}
            >
              {isEdit ? (
                <Input {...register('ref2Phone')} className='h-8' />
              ) : (
                <span>{display(data.ref2Phone)}</span>
              )}
            </FieldRow>
            <FieldRow
              label='Email ID Person 2'
              error={errors.ref2Email?.message}
            >
              {isEdit ? (
                <Input {...register('ref2Email')} className='h-8' />
              ) : (
                <span>{display(data.ref2Email)}</span>
              )}
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Notes ================= */}
        <SectionHeader title='Notes' />

        <CardContent className='p-4 space-y-3'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-muted-foreground'>
              Total Notes:{' '}
              <span className='font-semibold'>{sortedNotes.length}</span>
            </p>

            {showViewMore && (
              <Dialog open={openAllNotes} onOpenChange={setOpenAllNotes}>
                <DialogTrigger asChild>
                  <Button
                    size='sm'
                    className='cursor-pointer'
                    variant='outline'
                  >
                    View More
                  </Button>
                </DialogTrigger>

                <DialogContent className='min-w-4xl'>
                  <DialogHeader>
                    <DialogTitle>All Notes ({sortedNotes.length})</DialogTitle>
                  </DialogHeader>

                  <div className='max-h-[70vh] overflow-y-auto space-y-3 pr-2'>
                    {sortedNotes.map((note: any, i: number) => (
                      <div
                        key={note.parent_id || i}
                        className='bg-muted/30 p-3 rounded-lg border'
                      >
                        <p className='text-sm'>{note.Note_Content}</p>

                        <div className='flex flex-wrap gap-3 text-[11px] text-muted-foreground uppercase mt-2'>
                          <span>
                            Created By: {note.Created_By?.name || '—'}
                          </span>
                          <span>
                            Created Date:{' '}
                            {formatExactDate(
                              note.Created_Time,
                              'dd MMM yyyy, hh:mm a',
                            ) || '—'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {notes.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No notes available</p>
          ) : (
            visibleNotes.map((note: any, i: number) => (
              <div
                key={note.parent_id || i}
                className='bg-muted/30 p-3 rounded-lg border'
              >
                <p className='text-sm'>{note.Note_Content}</p>

                <div className='flex flex-wrap gap-3 text-[11px] text-muted-foreground uppercase mt-2'>
                  <span>Created By: {note.Created_By?.name || '—'}</span>
                  <span>
                    Created Date:{' '}
                    {formatExactDate(
                      note.Created_Time,
                      'dd MMM yyyy, hh:mm a',
                    ) || '—'}
                  </span>
                  <div className='font-bold'>Module : {note.module}</div>
                </div>
              </div>
            ))
          )}

          <NoteDialog onAddNote={handleAddNote} />
        </CardContent>
      </Card>
    </div>
  )
}
