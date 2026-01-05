import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'

import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'
import SelectField from '@/components/shared/select-field'
import DateField from '@/components/shared/date-field'
import NoteDialog from '@/components/shared/note-dialog'
import AddContactDialog from './add-contact-dialog'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  updateAccountSchema,
  type UpdateAccountFormValues,
} from '@/validators/updateAccount.schema'

export default function UpdateAccounts() {
  const [isEdit, setIsEdit] = useState(false)
  const [notes, setNotes] = useState<
    { title: string; description: string; date: string }[]
  >([
    { title: 'Initial Note', description: 'Called client', date: '19-12-2025' },
  ])

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

  const onSave = (values: UpdateAccountFormValues) => {
    console.log('SAVE DATA', values)
    setIsEdit(false)
    // In a real app, reset form to new values here so isDirty becomes false
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
          Account Owner: <span className='text-primary font-bold'>User</span>
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
          {/* LEFT COLUMN */}
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

          {/* RIGHT COLUMN */}
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
                options={['Finance', 'Retail', 'Healthcare', 'IT']}
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
                    Account
                  </Badge>
                </span>
                <span>Created: {note.date}</span>
                <span>Owner: System User</span>
              </div>
            </div>
          ))}
          <NoteDialog onAddNote={handleAddNote} />
        </CardContent>

        <div className='mx-3'>
          <h3 className='font-semibold text-lg mt-8 mb-4'>Contacts</h3>
          <div className='border rounded-md mb-3 overflow-hidden'>
            <Table>
              <TableHeader className='bg-muted'>
                <TableRow>
                  <TableHead>Contact Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Placeholder rows */}
                <TableRow>
                  <TableCell>John Doe</TableCell>
                  <TableCell>Manager</TableCell>
                  <TableCell>9876543210</TableCell>
                  <TableCell>1234567890</TableCell>
                  <TableCell>john@example.com</TableCell>
                  <TableCell>New York</TableCell>
                  <TableCell>NY</TableCell>
                </TableRow>
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
