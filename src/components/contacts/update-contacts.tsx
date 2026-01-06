import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload } from 'react-router-dom'

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

export default function UpdateContacts() {
  const [isEdit, setIsEdit] = useState(false)
  const [notes, setNotes] = useState<
    { title: string; description: string; date: string }[]
  >([
    {
      title: 'Initial Note',
      description: 'Called contact',
      date: '19-12-2025',
    },
  ])

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

  const handleAddNote = (note: { title: string; description: string }) => {
    setNotes((prev) => [
      ...prev,
      { ...note, date: new Date().toLocaleDateString() },
    ])
  }

  return (
    <div className='space-y-6 bg-background min-h-screen'>
      {/* HEADER */}
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <h1 className='text-lg font-semibold'>
          Contact Owner: <span className='text-primary font-bold'>User</span>
        </h1>

        {!isEdit ? (
          <Button size='sm' onClick={() => setIsEdit(true)}>
            Update
          </Button>
        ) : (
          <div className='flex gap-2'>
            <Button
              size='sm'
              disabled={!isDirty}
              onClick={handleSubmit(onSave)}
            >
              Save
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
        {/* ================= Contact Information ================= */}
        <SectionHeader title='Contact Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          {/* ... existing fields ... */}
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

        {/* ================= Notes ================= */}
        <SectionHeader title='Notes' />
        <CardContent className='p-4 space-y-3'>
          {notes.map((note, i) => (
            <div key={i} className='bg-muted/30 p-3 rounded-lg border'>
              <p className='text-sm font-semibold'>{note.title}</p>
              <p className='text-sm'>{note.description}</p>
              <div className='flex gap-3 text-[11px] text-muted-foreground uppercase mt-2'>
                <span>
                  Module:{' '}
                  <Badge variant='outline' className='text-[10px] h-4'>
                    Contact
                  </Badge>
                </span>
                <span>Created: {note.date}</span>
                <span>Owner: System User</span>
              </div>
            </div>
          ))}
          {/* @ts-ignore */}
          <NoteDialog onAddNote={handleAddNote} />
        </CardContent>
      </Card>
    </div>
  )
}
