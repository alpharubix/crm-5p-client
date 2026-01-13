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

import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'
import SelectField from '@/components/shared/select-field'
import DateField from '@/components/shared/date-field'
import NoteDialog from '@/components/shared/note-dialog'
import { Spinner } from '@/components/ui/spinner'
import AddContactDialog from './add-contact-dialog'

import {
  updateAccountSchema,
  type UpdateAccountFormValues,
} from '@/validators/updateAccount.schema'
import { ENV } from '@/conf'

// Map API response to form values
function mapAccountToForm(apiData: any): UpdateAccountFormValues {
  return {
    assignmentDate: apiData.assignment_date
      ? new Date(apiData.assignment_date)
      : undefined,
    source: apiData.source || 'NA',
    distributorCode: apiData.distributor_code || '',
    wabaInterested: apiData.waba_interested || false,
    callBackDate: apiData.call_back_date_time
      ? new Date(apiData.call_back_date_time)
      : undefined,
    accountStatus: apiData.account_status || 'Awareness',
    accountStage: apiData.account_stage || 'Initial Pitch',
    businessStatus: apiData.business_status || 'Active',
    firstName: apiData.first_name || '',
    lastName: apiData.last_name || '',
    phone: apiData.phone || '',
    email: apiData.email || '',
    residentialOwnership: apiData.residential_ownership || undefined,
    residentialLocation: apiData.residential_location || '',
    noOfYears: apiData.no_of_years || '',
    createdBy: apiData.created_by?.full_name || 'NA',
    mothersName: apiData.mothers_name || '',
    preferredLanguage: apiData.preferred_language || '',
    premiseLocation: apiData.premise_location || '',
    premiseOwnership: apiData.premise_ownership || undefined,
    businessRegistrationType: apiData.business_registration_type || undefined,
    businessVintage: apiData.business_vintage || undefined,
    suppliers: apiData.suppliers || '',
    description: apiData.description || '',
    parentAccount: apiData.parent_account || '',
    typeOfBusiness: apiData.type_of_business || undefined,
    industry: apiData.industry || undefined,
    street: apiData.street || '',
    state: apiData.state || '',
    code: apiData.pincode || '',
    city: apiData.city || '',
    country: apiData.country || 'India',
    ref1Name: apiData.ref1_name || '',
    ref1Phone: apiData.ref1_phone || '',
    ref1Email: apiData.ref1_email || '',
    ref2Name: apiData.ref2_name || '',
    ref2Phone: apiData.ref2_phone || '',
    ref2Email: apiData.ref2_email || '',
  }
}

// Map form values to API payload
function mapFormToApi(
  formData: UpdateAccountFormValues,
  dirtyFields: Partial<Record<keyof UpdateAccountFormValues, boolean>>
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
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch account')
      return res.json()
    },
    enabled: !!id,
  })

  // Extract account data and related entities
  const accountData = apiResponse?.data?.[0]

  const contacts = accountData?.account_linked_contact || []
  // console.log('contacts', contacts)

  const notes = accountData?.notes || []
  const ownerName = accountData?.owner?.full_name || 'User'

  // Populate form when data loads
  useEffect(() => {
    if (accountData) {
      const formValues = mapAccountToForm(accountData)
      reset(formValues)
    }
  }, [accountData, reset])

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (values: UpdateAccountFormValues) => {
      const payload = mapFormToApi(values, dirtyFields)
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

  // Warn on browser close/refresh if dirty
  useBeforeUnload(
    useCallback(
      (e) => {
        if (isDirty) {
          e.preventDefault()
          e.returnValue = ''
        }
      },
      [isDirty]
    )
  )

  const data = watch()
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
          <Button size='sm' onClick={() => setIsEdit(true)}>
            Update
          </Button>
        ) : (
          <div className='flex gap-2'>
            <Button
              size='sm'
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
                options={['Himalaya', 'CavinKare']}
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
                value={data.wabaInterested ? 'Yes' : 'No'}
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
          <div className='flex justify-center items-center'>
            <AddContactDialog />
          </div>
        </div>

        {/* ================= Customer Basic Details ================= */}
        <SectionHeader title='Customer Basic Details' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='First Name' error={errors.firstName?.message}>
              {isEdit ? (
                <Input {...register('firstName')} className='h-8' />
              ) : (
                <span>{data.firstName || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Residential Ownership'>
              <span>{data.residentialOwnership || '—'}</span>
            </FieldRow>

            <FieldRow label='Residential Location'>
              <span>{data.residentialLocation || '—'}</span>
            </FieldRow>

            <FieldRow label='No of Years...'>
              <span>{data.noOfYears || '—'}</span>
            </FieldRow>

            <FieldRow label='Created By'>
              <span>{data.createdBy}</span>
            </FieldRow>

            <FieldRow label='Phone No'>
              {isEdit ? (
                <Input {...register('phone')} className='h-8' />
              ) : (
                <span>{data.phone}</span>
              )}
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Last Name' error={errors.lastName?.message}>
              {isEdit ? (
                <Input {...register('lastName')} className='h-8' />
              ) : (
                <span>{data.lastName || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Mothers Name'>
              <span>{data.mothersName || '—'}</span>
            </FieldRow>

            <FieldRow label='Preferred Language'>
              <span>{data.preferredLanguage || '—'}</span>
            </FieldRow>

            <FieldRow label='Premise Location'>
              <span>{data.premiseLocation || '—'}</span>
            </FieldRow>

            <FieldRow label='Premise Ownership'>
              <span>{data.premiseOwnership || '—'}</span>
            </FieldRow>

            <FieldRow label='Email'>
              {isEdit ? (
                <Input {...register('email')} className='h-8' />
              ) : (
                <span>{data.email || '—'}</span>
              )}
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Customer Business Details ================= */}
        <SectionHeader title='Customer Business Details' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Business Registration Type'>
              <span>{data.businessRegistrationType || '—'}</span>
            </FieldRow>

            <FieldRow label='Business Vintage (No of Years)'>
              <span>{data.businessVintage ?? '—'}</span>
            </FieldRow>

            <FieldRow label='Suppliers'>
              <span>{data.suppliers || '—'}</span>
            </FieldRow>

            <FieldRow label='Description'>
              <span>{data.description || '—'}</span>
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Parent Account'>
              <span>{data.parentAccount || '—'}</span>
            </FieldRow>

            <FieldRow label='Type of Business'>
              <SelectField
                value={data.typeOfBusiness}
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
                value={data.industry}
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
                <span>{data.street || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='State'>
              {isEdit ? (
                <Input {...register('state')} className='h-8' />
              ) : (
                <span>{data.state || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Code'>
              {isEdit ? (
                <Input {...register('code')} className='h-8' />
              ) : (
                <span>{data.code || '—'}</span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow label='City'>
              {isEdit ? (
                <Input {...register('city')} className='h-8' />
              ) : (
                <span>{data.city || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Country'>
              <span>{data.country || '—'}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= References ================= */}
        <SectionHeader title='References from Customer' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow label='Name of Person 1'>
              <span>{data.ref1Name || '—'}</span>
            </FieldRow>
            <FieldRow label='Phone of Person 1'>
              <span>{data.ref1Phone || '—'}</span>
            </FieldRow>
            <FieldRow label='Email ID Person 1'>
              <span>{data.ref1Email || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Name of Person 2'>
              <span>{data.ref2Name || '—'}</span>
            </FieldRow>
            <FieldRow label='Phone of Person 2'>
              <span>{data.ref2Phone || '—'}</span>
            </FieldRow>
            <FieldRow label='Email ID Person 2'>
              <span>{data.ref2Email || '—'}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Notes ================= */}
        <SectionHeader title='Notes' />
        <CardContent className='p-4 space-y-3'>
          {notes.length === 0 ? (
            <p className='text-sm text-muted-foreground'>No notes available</p>
          ) : (
            notes.map((note: any, i: number) => (
              <div
                key={note.parent_id || i}
                className='bg-muted/30 p-3 rounded-lg border'
              >
                <p className='text-sm'>{note.note}</p>
                <div className='flex gap-3 text-[11px] text-muted-foreground uppercase mt-2'>
                  <span>
                    Module:{' '}
                    <Badge variant='outline' className='text-[10px] h-4'>
                      Account
                    </Badge>
                  </span>
                  <span>
                    Created: {new Date(note.created_time).toLocaleDateString()}
                  </span>
                  <span>
                    Modified:{' '}
                    {new Date(note.modified_time).toLocaleDateString()}
                  </span>
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
