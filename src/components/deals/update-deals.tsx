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
import DateField from '@/components/shared/date-field'
import SelectField from '@/components/shared/select-field'
import NoteDialog from '@/components/shared/note-dialog'

import {
  updateDealSchema,
  type UpdateDealFormValues,
} from '@/validators/updateDeal.schema'

export default function UpdateDeals() {
  const [isEdit, setIsEdit] = useState(false)
  const [notes, setNotes] = useState<
    { title: string; description: string; date: string }[]
  >([
    {
      title: 'Initial Note',
      description: 'Called deal contact',
      date: '19-12-2025',
    },
  ])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm<UpdateDealFormValues>({
    resolver: zodResolver(updateDealSchema),
    defaultValues: {
      createdBy: 'System Driven Field (User)',
      modifiedBy: 'System Driven Field (User)',
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

  const onSave = (values: UpdateDealFormValues) => {
    console.log('SAVE DEAL', values)
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
          Deals Owner: <span className='text-primary font-bold'>User</span>
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
        {/* ================= Loan Account Status ================= */}
        <SectionHeader title='Loan Account Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Deal Type'>
              <SelectField
                value={data.dealType}
                isEdit={isEdit}
                options={['New', 'Renewal']}
                onChange={(v) => setValue('dealType', v, { shouldDirty: true })}
              />
            </FieldRow>

            <FieldRow label='Deal Call Back Date/Time'>
              <DateField
                value={data.dealCallbackDate}
                isEdit={isEdit}
                onChange={(d) =>
                  setValue('dealCallbackDate', d, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Deal Approval Status'>
              <SelectField
                value={data.dealApprovalStatus}
                isEdit={isEdit}
                options={['Approved', 'Pending']}
                onChange={(v) =>
                  setValue('dealApprovalStatus', v, { shouldDirty: true })
                }
              />
            </FieldRow>
          </div>

          <div>
            <FieldRow label='Deal Status'>
              <SelectField
                value={data.dealStatus}
                isEdit={isEdit}
                options={['Open', 'Closed']}
                onChange={(v) =>
                  setValue('dealStatus', v, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Stage'>
              <SelectField
                value={data.stage}
                isEdit={isEdit}
                options={['Initial', 'Final']}
                onChange={(v) => setValue('stage', v, { shouldDirty: true })}
              />
            </FieldRow>

            <FieldRow label='Closing Date'>
              <DateField
                value={data.closingDate}
                isEdit={isEdit}
                onChange={(d) =>
                  setValue('closingDate', d, { shouldDirty: true })
                }
              />
            </FieldRow>

            <FieldRow label='Disbursement Date'>
              <DateField
                value={data.disbursementDate}
                isEdit={isEdit}
                onChange={(d) =>
                  setValue('disbursementDate', d, { shouldDirty: true })
                }
              />
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Loan Liabilities Information ================= */}
        <SectionHeader title='Loan Liabilities Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Deal Name'>
              {isEdit ? (
                <Input {...register('dealName')} className='h-8' />
              ) : (
                <span>{data.dealName || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Start Date'>
              <DateField
                value={data.startDate}
                isEdit={isEdit}
                onChange={(d) =>
                  setValue('startDate', d, { shouldDirty: true })
                }
              />
            </FieldRow>
            <FieldRow label='End Date'>
              <DateField
                value={data.endDate}
                isEdit={isEdit}
                onChange={(d) => setValue('endDate', d, { shouldDirty: true })}
              />
            </FieldRow>
            <FieldRow label='Amount'>
              {isEdit ? (
                <Input {...register('amount')} className='h-8' />
              ) : (
                <span>{data.amount || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Created By'>
              <span>{data.createdBy}</span>
            </FieldRow>
            <FieldRow label='Modified By'>
              <span>{data.modifiedBy}</span>
            </FieldRow>
          </div>

          <div>
            {[
              ['Account Name', 'accountName'],
              ['Lender Name', 'lenderName'],
              ['Loan Type', 'loanType'],
              ['Loan Product', 'loanProduct'],
              ['Interest Type', 'interestType'],
              ['Rate of Interest', 'rateOfInterest'],
            ].map(([label, key]) => (
              <FieldRow key={key} label={label}>
                {isEdit ? (
                  <Input
                    {...register(key as keyof UpdateDealFormValues)}
                    className='h-8'
                  />
                ) : (
                  <span>{(data as any)[key] || '—'}</span>
                )}
              </FieldRow>
            ))}
          </div>
        </CardContent>

        {/* ================= Funding & Commercials ================= */}
        <SectionHeader title='Funding & Commercials' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            {['sanctionAmount', 'processingFees', 'insuranceAmount'].map(
              (k) => (
                <FieldRow key={k} label={k.replace(/([A-Z])/g, ' $1')}>
                  {isEdit ? (
                    <Input {...register(k as any)} className='h-8' />
                  ) : (
                    <span>{(data as any)[k] || '—'}</span>
                  )}
                </FieldRow>
              )
            )}
          </div>
          <div>
            {['disbursedAmount', 'mmCharges'].map((k) => (
              <FieldRow key={k} label={k.replace(/([A-Z])/g, ' $1')}>
                {isEdit ? (
                  <Input {...register(k as any)} className='h-8' />
                ) : (
                  <span>{(data as any)[k] || '—'}</span>
                )}
              </FieldRow>
            ))}
          </div>
        </CardContent>

        {/* ================= Rejection Status ================= */}
        <SectionHeader title='Rejection Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Lender Rejection Reason'>
              {isEdit ? (
                <Input {...register('lenderRejectionReason')} className='h-8' />
              ) : (
                <span>{data.lenderRejectionReason || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Lender Rejection Status Explanation'>
              {isEdit ? (
                <Input
                  {...register('lenderRejectionExplanation')}
                  className='h-8'
                />
              ) : (
                <span>{data.lenderRejectionExplanation || '—'}</span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Customer Rejection Reason'>
              {isEdit ? (
                <Input
                  {...register('customerRejectionReason')}
                  className='h-8'
                />
              ) : (
                <span>{data.customerRejectionReason || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Customer Rejection Status Explanation'>
              {isEdit ? (
                <Input
                  {...register('customerRejectionExplanation')}
                  className='h-8'
                />
              ) : (
                <span>{data.customerRejectionExplanation || '—'}</span>
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
                    Deal
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
