import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'
import DateField from '@/components/shared/date-field'
import SelectField from '@/components/shared/select-field'
import NoteDialog from '@/components/shared/note-dialog'
import { Spinner } from '@/components/ui/spinner'
import { ENV } from '@/conf'
import type { Deal } from '@/types'
import users from '@/utils/users.json'

import {
  updateDealSchema,
  type UpdateDealFormValues,
} from '@/validators/updateDeal.schema'
import { formatExactDate } from '@/utils/date-formatter'

export default function UpdateDeals() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [isEdit, setIsEdit] = useState(false)

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

  useBeforeUnload(
    React.useCallback(
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

  const { data: dealResponse, isLoading } = useQuery({
    queryKey: ['deal', id],
    queryFn: async () => {
      const res = await fetch(
        `${ENV.VITE_BACKEND_BASE_URL}/deals?deal_id=${id}`,
        { credentials: 'include' },
      )
      if (!res.ok) throw new Error('Failed to fetch deal')
      return res.json()
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner className='h-8 w-8 text-primary' />
      </div>
    )
  }

  const dealData: Deal = dealResponse?.data?.[0] || dealResponse?.data

  if (!dealData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-muted-foreground'>Deal not found</p>
      </div>
    )
  }
  console.log({ dealResponse })
  return (
    <div className='space-y-6 bg-background min-h-screen'>
      {/* HEADER */}
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <h1 className='text-lg font-semibold'>
          Deal:{' '}
          <span className='text-primary font-bold'>
            {dealData.account_name || `#${dealData.id}`}
          </span>
        </h1>
      </div>

      <Card className='overflow-hidden space-y-1'>
        {/* ================= Loan Account Status ================= */}
        <SectionHeader title='Loan Account Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Deal Type'>
              <span>{dealData.deal_type || '—'}</span>
            </FieldRow>
            <FieldRow label='Deal Call Back Date/Time'>
              <span>
                {dealData.deal_call_back_datetime
                  ? formatExactDate(
                      dealData.deal_call_back_datetime,
                      'dd MMM yyyy, hh:mm a',
                    )
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Deal Approval Status'>
              <span>{dealData.case_status || '—'}</span>
            </FieldRow>
            <FieldRow label='Stage'>
              <span>{dealData.type_of_login || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Disbursement Date'>
              <span>
                {dealData.disbursement_date
                  ? new Date(dealData.disbursement_date).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Closing Date'>
              <span>{dealData.type_of_case_login || '—'}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Loan Liabilities Information ================= */}
        <SectionHeader title='Loan Liabilities Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Deal Name'>
              <span>{dealData.account_name || '—'}</span>
            </FieldRow>
            <FieldRow label='Start Date'>
              <span>
                {dealData.loan_start_date
                  ? formatExactDate(
                      dealData.loan_start_date,
                      'dd MMM yyyy, hh:mm a',
                    )
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='End Date'>
              <span>
                {dealData.loan_end_date
                  ? formatExactDate(
                      dealData.loan_end_date,
                      'dd MMM yyyy, hh:mm a',
                    )
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Amount'>
              <span>{dealData.amount_required || '—'}</span>
            </FieldRow>
            <FieldRow label='Created By'>
              <span>
                {(users as Record<string, string>)[dealData.created_by] ||
                  dealData.created_by ||
                  '—'}
              </span>
            </FieldRow>
            <FieldRow label='Modified By'>
              <span>
                {(users as Record<string, string>)[dealData.modified_by] ||
                  dealData.modified_by ||
                  '—'}
              </span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Account Name'>
              <span>{dealData.account_name || '—'}</span>
            </FieldRow>
            <FieldRow label='Lender Name'>
              <span>{dealData.lender_name || '—'}</span>
            </FieldRow>
            <FieldRow label='Loan Type'>
              <span>{dealData.loan_type || '—'}</span>
            </FieldRow>
            <FieldRow label='Loan Product'>
              <span>{dealData.product || '—'}</span>
            </FieldRow>
            <FieldRow label='Interest Type'>
              <span>{dealData.interest_type || '—'}</span>
            </FieldRow>
            <FieldRow label='Rate of Interest'>
              <span>{dealData.rate_of_interest || '—'}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Funding & Commercials ================= */}
        <SectionHeader title='Funding & Commercials' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Sanction Amount'>
              <span>{dealData.sanction_amount || '—'}</span>
            </FieldRow>
            <FieldRow label='Processing Fees'>
              <span>{dealData.processing_fees || '—'}</span>
            </FieldRow>
            <FieldRow label='Insurance Amount'>
              <span>{dealData.insurance_amount || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Disbursed Amount'>
              <span>{dealData.disbursed_amount || '—'}</span>
            </FieldRow>
            <FieldRow label='MM Charges'>
              <span>{dealData.mm_charges || '—'}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Rejection Status ================= */}
        <SectionHeader title='Rejection Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Lender Rejection Reason'>
              <span>{dealData.lender_rejection_reason || '—'}</span>
            </FieldRow>
            <FieldRow label='Lender Rejection Status Explanation'>
              <span>{dealData.lender_rejection_status_explanation || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Customer Rejection Reason'>
              <span>{dealData.customer_rejection_reason || '—'}</span>
            </FieldRow>
            <FieldRow label='Customer Rejection Status Explanation'>
              <span>
                {dealData.customer_rejection_status_explanation || '—'}
              </span>
            </FieldRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
