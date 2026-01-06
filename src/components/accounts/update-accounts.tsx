import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
import AddContactDialog from './add-contact-dialog'

import {
  updateAccountSchema,
  type UpdateAccountFormValues,
} from '@/validators/updateAccount.schema'
import { ENV } from '@/conf'

// Map API response to form values
function mapAccountToForm(apiData: any): UpdateAccountFormValues {
  return {
    assignmentDate: apiData.assignment_date || undefined,
    source: apiData.source || 'NA',
    distributorCode: apiData.distributor_code || '',
    wabaInterested: apiData.waba_interested || false,
    callBackDate: apiData.call_back_date_time || undefined,
    accountStatus: apiData.account_status || 'Awareness',
    accountStage: apiData.account_stage || 'Initial Pitch',
    businessStatus: apiData.business_status || 'Active',
    firstName: apiData.first_name || '',
    lastName: apiData.last_name || '',
    residentialOwnership: apiData.residential_ownership || undefined,
    residentialLocation: apiData.residential_location || '',
    noOfYears: apiData.no_of_years || '',
    createdBy: apiData.created_by?.full_name || 'System User',
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
  }
}

// Map form values to API payload
function mapFormToApi(formData: UpdateAccountFormValues): any {
  return {
    assignment_date: formData.assignmentDate,
    source: formData.source,
    distributor_code: formData.distributorCode,
    waba_interested: formData.wabaInterested,
    call_back_date_time: formData.callBackDate,
    account_status: formData.accountStatus,
    account_stage: formData.accountStage,
    business_status: formData.businessStatus,
    first_name: formData.firstName,
    last_name: formData.lastName,
    residential_ownership: formData.residentialOwnership,
    residential_location: formData.residentialLocation,
    no_of_years: formData.noOfYears,
    mothers_name: formData.mothersName,
    preferred_language: formData.preferredLanguage,
    premise_location: formData.premiseLocation,
    premise_ownership: formData.premiseOwnership,
    business_registration_type: formData.businessRegistrationType,
    business_vintage: formData.businessVintage,
    suppliers: formData.suppliers,
    description: formData.description,
    parent_account: formData.parentAccount,
    type_of_business: formData.typeOfBusiness,
    industry: formData.industry,
    street: formData.street,
    state: formData.state,
    pincode: formData.code,
    city: formData.city,
    country: formData.country,
    ref1_name: formData.ref1Name,
    ref1_phone: formData.ref1Phone,
    ref1_email: formData.ref1Email,
    ref2_name: formData.ref2Name,
    ref2_phone: formData.ref2Phone,
    ref2_email: formData.ref2Email,
  }
}

export default function UpdateAccounts() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [isEdit, setIsEdit] = useState(false)

  const form = useForm<UpdateAccountFormValues>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      source: 'Himalaya',
      accountStatus: 'Awareness',
      accountStage: 'Initial Pitch',
      businessStatus: 'Active',
      country: 'India',
      createdBy: 'System User',
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
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
  console.log('contacts', contacts)

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
      const payload = mapFormToApi(values)
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/accounts?account_id=${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      )
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
    return <div className='p-4'>Loading account...</div>
  }

  if (error || !accountData) {
    return <div className='p-4'>Account not found</div>
  }

  return (
    <div className='space-y-6 bg-background min-h-screen'>
      {/* HEADER */}
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <h1 className='text-lg font-semibold'>
          Account Owner:{' '}
          <span className='text-primary font-bold'>{ownerName}</span>
        </h1>

        {/* {!isEdit ? (
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
              {updateMutation.isPending ? 'Saving...' : 'Save'}
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
        )} */}
      </div>

      <Card className='overflow-hidden space-y-1'>
        {/* ================= Account Status ================= */}
        <SectionHeader title='Account Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Assignment Date'>
              <DateField
                value={data.assignmentDate}
                isEdit={isEdit}
                onChange={(d) =>
                  setValue('assignmentDate', d, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Source' error={errors.source?.message}>
              <SelectField
                value={data.source}
                isEdit={isEdit}
                options={['Himalaya', 'Website']}
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
              {isEdit ? (
                <Checkbox
                  checked={data.wabaInterested}
                  onCheckedChange={(v) =>
                    setValue('wabaInterested', Boolean(v), {
                      shouldDirty: true,
                    })
                  }
                />
              ) : (
                <span>{data.wabaInterested ? 'Yes' : 'No'}</span>
              )}
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
                options={['Awareness', 'Interested']}
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
                options={['Initial Pitch']}
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
              <SelectField
                value={data.residentialOwnership}
                isEdit={isEdit}
                options={['Owned', 'Rented']}
                onChange={(v) =>
                  setValue('residentialOwnership', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Residential Location'>
              {isEdit ? (
                <Input {...register('residentialLocation')} className='h-8' />
              ) : (
                <span>{data.residentialLocation || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='No of Years...'>
              {isEdit ? (
                <Input {...register('noOfYears')} className='h-8' />
              ) : (
                <span>{data.noOfYears || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Created By'>
              <span>{data.createdBy}</span>
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
              {isEdit ? (
                <Input {...register('mothersName')} className='h-8' />
              ) : (
                <span>{data.mothersName || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Preferred Language'>
              {isEdit ? (
                <Input {...register('preferredLanguage')} className='h-8' />
              ) : (
                <span>{data.preferredLanguage || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Premise Location'>
              {isEdit ? (
                <Input {...register('premiseLocation')} className='h-8' />
              ) : (
                <span>{data.premiseLocation || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Premise Ownership'>
              <SelectField
                value={data.premiseOwnership}
                isEdit={isEdit}
                options={['Owned', 'Rented']}
                onChange={(v) =>
                  setValue('premiseOwnership', v, { shouldDirty: true })
                }
              />
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Customer Business Details ================= */}
        <SectionHeader title='Customer Business Details' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Business Registration Type'>
              <SelectField
                value={data.businessRegistrationType}
                isEdit={isEdit}
                options={[
                  'Proprietorship',
                  'Partnership',
                  'Private Limited',
                  'Public Limited',
                ]}
                onChange={(v) =>
                  setValue('businessRegistrationType', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Business Vintage (No of Years)'>
              {isEdit ? (
                <Input
                  type='number'
                  {...register('businessVintage', { valueAsNumber: true })}
                  className='h-8'
                />
              ) : (
                <span>{data.businessVintage ?? '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Suppliers'>
              {isEdit ? (
                <Input {...register('suppliers')} className='h-8' />
              ) : (
                <span>{data.suppliers || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Description'>
              {isEdit ? (
                <Textarea {...register('description')} className='min-h-20' />
              ) : (
                <span>{data.description || '—'}</span>
              )}
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Parent Account'>
              {isEdit ? (
                <Input
                  {...register('parentAccount')}
                  className='h-8'
                  placeholder='Lookup'
                />
              ) : (
                <span>{data.parentAccount || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Type of Business'>
              <SelectField
                value={data.typeOfBusiness}
                isEdit={isEdit}
                options={['Manufacturing', 'Trading', 'Services']}
                onChange={(v) =>
                  setValue('typeOfBusiness', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Industry'>
              <SelectField
                value={data.industry}
                isEdit={isEdit}
                options={['Finance', 'Retail', 'Healthcare', 'IT', 'Pharma']}
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
              {isEdit ? (
                <Input {...register('country')} className='h-8' />
              ) : (
                <span>{data.country || '—'}</span>
              )}
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
                <span>{data.ref1Name || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Phone of Person 1'>
              {isEdit ? (
                <Input {...register('ref1Phone')} className='h-8' />
              ) : (
                <span>{data.ref1Phone || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Email ID Person 1'>
              {isEdit ? (
                <Input {...register('ref1Email')} className='h-8' />
              ) : (
                <span>{data.ref1Email || '—'}</span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Name of Person 2'>
              {isEdit ? (
                <Input {...register('ref2Name')} className='h-8' />
              ) : (
                <span>{data.ref2Name || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Phone of Person 2'>
              {isEdit ? (
                <Input {...register('ref2Phone')} className='h-8' />
              ) : (
                <span>{data.ref2Phone || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Email ID Person 2'>
              {isEdit ? (
                <Input {...register('ref2Email')} className='h-8' />
              ) : (
                <span>{data.ref2Email || '—'}</span>
              )}
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

        {/* ================= Contacts ================= */}
        <div className='mx-3'>
          <h3 className='font-semibold text-lg mt-8 mb-4'>Contacts</h3>
          <div className='border rounded-md mb-3 overflow-hidden'>
            <Table>
              <TableHeader className='bg-muted'>
                <TableRow>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
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
                    <TableRow key={contact.id}>
                      <TableCell>{contact.last_name || '—'}</TableCell>
                      <TableCell>{contact.mobile || '—'}</TableCell>
                      <TableCell>{contact.email || '—'}</TableCell>
                      <TableCell>
                        <Button variant='ghost' size='sm'>
                          View
                        </Button>
                      </TableCell>
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
      </Card>
    </div>
  )
}
