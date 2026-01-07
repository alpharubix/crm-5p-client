import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'
import SelectField from '@/components/shared/select-field'
import NoteDialog from '@/components/shared/note-dialog'

import {
  updateContactSchema,
  type UpdateContactFormValues,
} from '@/validators/updateContact.schema'
import { ENV } from '@/conf'

function mapContactToForm(apiData: any): UpdateContactFormValues {
  return {
    firstName: apiData.first_name || '',
    lastName: apiData.last_name || '',
    leadSource: apiData.lead_source || 'Website',
    designation: apiData.designation || '',
    mobile: apiData.mobile || '',
    phone: apiData.phone || '',
    accountName: apiData.parent_account?.account_name || '',
    email: apiData.email || '',
    secondaryEmail: apiData.secondary_email || '',
    createdBy: apiData.created_by?.full_name || 'System Driven Field (User)',
    modifiedBy: apiData.modified_by?.full_name || 'System Driven Field (User)',
    street: apiData.street || '',
    state: apiData.state || '',
    pincode: apiData.pincode || '',
    city: apiData.city || '',
    country: apiData.country || 'India',
  }
}

export default function UpdateContacts() {
  const { id } = useParams()
  const [isEdit, setIsEdit] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateContactFormValues>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: {
      leadSource: 'Website',
      createdBy: 'System Driven Field (User)',
      modifiedBy: 'System Driven Field (User)',
      country: 'India',
    },
  })

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['contact', id],
    queryFn: async () => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/contacts?contact_id=${id}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch contact')
      return res.json()
    },
    enabled: !!id,
  })

  const contactData = apiResponse?.data?.[0]

  useEffect(() => {
    if (contactData) {
      reset(mapContactToForm(contactData))
    }
  }, [contactData, reset])

  // Warn on browser close/refresh if dirty
  useBeforeUnload(
    React.useCallback(
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

  const onSave = (values: UpdateContactFormValues) => {
    console.log('SAVE CONTACT', values)
    setIsEdit(false)
    reset(values)
  }

  if (isLoading) {
    return <div className='p-4'>Loading contact...</div>
  }

  if (error || (apiResponse && !contactData)) {
    return <div className='p-4'>Contact not found</div>
  }

  return (
    <div className='space-y-6 bg-background min-h-screen'>
      {/* HEADER */}
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <h1 className='text-lg font-semibold'>
          Contact Owner: <span className='text-primary font-bold'>User</span>
        </h1>
      </div>

      <Card className='overflow-hidden space-y-1'>
        {/* ================= Contact Information ================= */}
        <SectionHeader title='Contact Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='First Name' error={errors.firstName?.message}>
              {isEdit ? (
                <Input {...register('firstName')} className='h-8' />
              ) : (
                <span>{data.firstName || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Lead Source' error={errors.leadSource?.message}>
              <SelectField
                value={data.leadSource}
                isEdit={isEdit}
                options={['Website', 'Referral']}
                onChange={(v) =>
                  setValue('leadSource', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Mobile'>
              {isEdit ? (
                <Input {...register('mobile')} className='h-8' />
              ) : (
                <span>{data.mobile || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Phone'>
              {isEdit ? (
                <Input {...register('phone')} className='h-8' />
              ) : (
                <span>{data.phone || '—'}</span>
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

            <FieldRow label='Designation'>
              {isEdit ? (
                <Input {...register('designation')} className='h-8' />
              ) : (
                <span>{data.designation || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Account Name'>
              {isEdit ? (
                <Input {...register('accountName')} className='h-8' />
              ) : (
                <span>{data.accountName || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Email' error={errors.email?.message}>
              {isEdit ? (
                <Input {...register('email')} className='h-8' />
              ) : (
                <span>{data.email || '—'}</span>
              )}
            </FieldRow>

            <FieldRow
              label='Secondary Email'
              error={errors.secondaryEmail?.message}
            >
              {isEdit ? (
                <Input {...register('secondaryEmail')} className='h-8' />
              ) : (
                <span>{data.secondaryEmail || '—'}</span>
              )}
            </FieldRow>

            <FieldRow label='Modified By'>
              <span>{data.modifiedBy}</span>
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
            <FieldRow label='Pincode'>
              {isEdit ? (
                <Input {...register('pincode')} className='h-8' />
              ) : (
                <span>{data.pincode || '—'}</span>
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
      </Card>
    </div>
  )
}
