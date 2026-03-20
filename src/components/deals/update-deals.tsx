import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBeforeUnload, useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'
import SelectField from '@/components/shared/select-field'
import DateField from '@/components/shared/date-field'
import NoteDialog from '@/components/shared/note-dialog'
import { Spinner } from '@/components/ui/spinner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ENV } from '@/conf'
import type { Deal } from '@/types'
import users from '@/utils/users.json'

import {
  updateDealSchema,
  type UpdateDealFormValues,
} from '@/validators/updateDeal.schema'
import { formatExactDate } from '@/utils/date-formatter'
import { formatAmount } from '@/utils/number-formatter'
import { format } from 'date-fns'

function mapDealToForm(apiData: any): UpdateDealFormValues {
  return {
    accountId: apiData.account_id ? String(apiData.account_id) : '',
    accountName: apiData.account_name || '',
    ticketId: apiData.ticket_id ? String(apiData.ticket_id) : '',
    ticketNumber: apiData.ticket_number ? String(apiData.ticket_number) : '',
    dealType: apiData.deal_type || '',
    loanType: apiData.loan_type || '',
    typeOfLogin: apiData.type_of_login || '',
    typeOfCaseLogin: apiData.type_of_case_login || '',
    ticketLogin: apiData.ticket_login || '',
    caseStage: apiData.case_stage || '',
    caseStatus: apiData.case_status || '',
    disbursedAmount:
      apiData.disbursed_amount !== null &&
      apiData.disbursed_amount !== undefined
        ? String(apiData.disbursed_amount)
        : '',
    sanctionAmount:
      apiData.sanction_amount !== null && apiData.sanction_amount !== undefined
        ? String(apiData.sanction_amount)
        : '',
    approvedAmount:
      apiData.approved_amount !== null && apiData.approved_amount !== undefined
        ? String(apiData.approved_amount)
        : '',
    amountRequired:
      apiData.amount_required !== null && apiData.amount_required !== undefined
        ? String(apiData.amount_required)
        : '',
    processingFees:
      apiData.processing_fees !== null && apiData.processing_fees !== undefined
        ? String(apiData.processing_fees)
        : '',
    mmCharges:
      apiData.mm_charges !== null && apiData.mm_charges !== undefined
        ? String(apiData.mm_charges)
        : '',
    insuranceAmount:
      apiData.insurance_amount !== null &&
      apiData.insurance_amount !== undefined
        ? String(apiData.insurance_amount)
        : '',
    pfPercentage:
      apiData.pf_percentage !== null && apiData.pf_percentage !== undefined
        ? String(apiData.pf_percentage)
        : '',
    rateOfInterest:
      apiData.rate_of_interest !== null &&
      apiData.rate_of_interest !== undefined
        ? String(apiData.rate_of_interest)
        : '',
    interestType: apiData.interest_type || '',
    dealCallBackDatetime: apiData.deal_call_back_datetime || '',
    disbursementDate: apiData.disbursement_date || '',
    lenderLoginDate: apiData.lender_login_date || '',
    loanStartDate: apiData.loan_start_date || '',
    loanEndDate: apiData.loan_end_date || '',
    targetedDisbursementDate: apiData.targeted_disbursement_date || '',
    tenure:
      apiData.tenure !== null && apiData.tenure !== undefined
        ? String(apiData.tenure)
        : '',
    lenderCode: apiData.lender_code || '',
    lenderName: apiData.lender_name || '',
    customerRejectionReason: apiData.customer_rejection_reason || '',
    customerRejectionStatusExplanation:
      apiData.customer_rejection_status_explanation || '',
    lenderRejectionReason: apiData.lender_rejection_reason || '',
    lenderRejectionStatusExplanation:
      apiData.lender_rejection_status_explanation || '',
    paymentReceipt: apiData.payment_receipt || '',
    potential: apiData.potential || '',
    product: apiData.product || '',
    createdBy: apiData.created_by || 'System Driven Field (User)',
    modifiedBy: apiData.modified_by || 'System Driven Field (User)',
  }
}

function mapFormToApi(
  formData: UpdateDealFormValues,
  dirtyFields: Partial<Record<keyof UpdateDealFormValues, boolean>>,
): any {
  const allFields = {
    account_id: {
      value: formData.accountId ? String(formData.accountId) : null,
      key: 'accountId',
    },
    account_name: { value: formData.accountName, key: 'accountName' },
    ticket_id: {
      value: formData.ticketId ? String(formData.ticketId) : null,
      key: 'ticketId',
    },
    ticket_number: {
      value: formData.ticketNumber ? String(formData.ticketNumber) : null,
      key: 'ticketNumber',
    },
    deal_type: { value: formData.dealType, key: 'dealType' },
    loan_type: { value: formData.loanType, key: 'loanType' },
    type_of_login: { value: formData.typeOfLogin, key: 'typeOfLogin' },
    type_of_case_login: {
      value: formData.typeOfCaseLogin,
      key: 'typeOfCaseLogin',
    },
    ticket_login: { value: formData.ticketLogin, key: 'ticketLogin' },
    case_stage: { value: formData.caseStage, key: 'caseStage' },
    case_status: { value: formData.caseStatus, key: 'caseStatus' },
    disbursed_amount: {
      value: formData.disbursedAmount,
      key: 'disbursedAmount',
    },
    sanction_amount: { value: formData.sanctionAmount, key: 'sanctionAmount' },
    approved_amount: { value: formData.approvedAmount, key: 'approvedAmount' },
    amount_required: { value: formData.amountRequired, key: 'amountRequired' },
    processing_fees: { value: formData.processingFees, key: 'processingFees' },
    mm_charges: { value: formData.mmCharges, key: 'mmCharges' },
    insurance_amount: {
      value: formData.insuranceAmount,
      key: 'insuranceAmount',
    },
    pf_percentage: { value: formData.pfPercentage, key: 'pfPercentage' },
    rate_of_interest: { value: formData.rateOfInterest, key: 'rateOfInterest' },
    interest_type: { value: formData.interestType, key: 'interestType' },
    deal_call_back_datetime: {
      value: formData.dealCallBackDatetime,
      key: 'dealCallBackDatetime',
    },
    disbursement_date: {
      value: formData.disbursementDate,
      key: 'disbursementDate',
    },
    lender_login_date: {
      value: formData.lenderLoginDate,
      key: 'lenderLoginDate',
    },
    loan_start_date: { value: formData.loanStartDate, key: 'loanStartDate' },
    loan_end_date: { value: formData.loanEndDate, key: 'loanEndDate' },
    targeted_disbursement_date: {
      value: formData.targetedDisbursementDate,
      key: 'targetedDisbursementDate',
    },
    tenure: {
      value: formData.tenure ? String(formData.tenure) : null,
      key: 'tenure',
    },
    lender_code: { value: formData.lenderCode, key: 'lenderCode' },
    lender_name: { value: formData.lenderName, key: 'lenderName' },
    customer_rejection_reason: {
      value: formData.customerRejectionReason,
      key: 'customerRejectionReason',
    },
    customer_rejection_status_explanation: {
      value: formData.customerRejectionStatusExplanation,
      key: 'customerRejectionStatusExplanation',
    },
    lender_rejection_reason: {
      value: formData.lenderRejectionReason,
      key: 'lenderRejectionReason',
    },
    lender_rejection_status_explanation: {
      value: formData.lenderRejectionStatusExplanation,
      key: 'lenderRejectionStatusExplanation',
    },
    payment_receipt: { value: formData.paymentReceipt, key: 'paymentReceipt' },
    potential: { value: formData.potential, key: 'potential' },
    product: { value: formData.product, key: 'product' },
  }

  const payload: any = {}

  Object.entries(allFields).forEach(([apiKey, { value, key }]) => {
    // @ts-ignore
    if (dirtyFields[key]) {
      payload[apiKey] = value
    }
  })

  return payload
}

export default function UpdateDeals() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [isEdit, setIsEdit] = useState(false)
  const [openAllNotes, setOpenAllNotes] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty, dirtyFields },
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

  const {
    data: dealResponse,
    isLoading,
    error,
  } = useQuery({
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

  const dealData: Deal = dealResponse?.data?.[0] || dealResponse?.data

  const notes = (dealData as any)?.notes || []

  const sortedNotes = [...notes].sort((a: any, b: any) => {
    return (
      new Date(b.Created_Time).getTime() - new Date(a.Created_Time).getTime()
    )
  })

  useEffect(() => {
    if (dealData) {
      reset(mapDealToForm(dealData))
    }
  }, [dealData, reset])

  const updateMutation = useMutation({
    mutationFn: async (values: UpdateDealFormValues) => {
      const payload = mapFormToApi(values, dirtyFields)
      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/deals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || 'Failed to update deal')
      }
      return res.json()
    },
    onSuccess: (data, variables) => {
      toast.success('Deal updated successfully')
      setIsEdit(false)
      reset(variables)
      queryClient.invalidateQueries({ queryKey: ['deal', id] })
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update deal')
    },
  })

  const formValues = watch()

  const onSave = (values: UpdateDealFormValues) => {
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
          note: note.description,
          module: 'Deals',
        }),
      })

      if (res.ok) {
        toast.success('Note added successfully')
        queryClient.invalidateQueries({ queryKey: ['deal', id] })
      } else {
        toast.error('Failed to add note')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Spinner className='h-8 w-8 text-primary' />
      </div>
    )
  }

  if (error || !dealData) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-muted-foreground'>Deal not found</p>
      </div>
    )
  }

  const MAX_NOTES_VISIBLE = 3
  const showViewMore = sortedNotes.length > MAX_NOTES_VISIBLE
  const visibleNotes = showViewMore
    ? sortedNotes.slice(0, MAX_NOTES_VISIBLE)
    : sortedNotes

  return (
    <div className='space-y-6 bg-background min-h-screen mb-10'>
      {/* HEADER */}
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <div>
          <h1 className='text-lg font-semibold'>
            Deal Name:{' '}
            <span className='text-primary font-bold '>
              {dealData.account_name || `#${dealData.id}`}
            </span>{' '}
            <span className='text-primary font-bold '>{`#${dealData.id}`}</span>
          </h1>
          <h1 className='text-lg font-semibold'>
            Deal Owner Name:{' '}
            <span className='text-primary font-bold '>
              {(users as Record<string, string>)[dealData.deal_owner_id] ||
                `#${dealData.id}`}
            </span>
          </h1>
        </div>
        <div className='flex items-center gap-2'>
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
          <Button
            variant='default'
            onClick={() => navigate(`/accounts/${dealData.account_id}`)}
            className='ml-2'
          >
            Go to Accounts
          </Button>
        </div>
      </div>

      <Card className='overflow-hidden space-y-1'>
        {/* ================= Loan Account Status ================= */}
        <SectionHeader title='Loan Account Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow label='Deal Type' error={errors.dealType?.message}>
              <SelectField
                isEdit={isEdit}
                options={[
                  'NTB',
                  'NTC',
                  'NTL',
                  'Adhoc',
                  'Renewal',
                  'Renewal & Enhancement',
                  'Existing',
                ]}
                value={formValues.dealType as string}
                onChange={(value) =>
                  setValue('dealType', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Deal Call Back Date/Time'
              error={errors.dealCallBackDatetime?.message}
            >
              {isEdit ? (
                <DateField
                  isEdit={isEdit}
                  showTime={true}
                  value={
                    formValues.dealCallBackDatetime
                      ? new Date(formValues.dealCallBackDatetime)
                      : undefined
                  }
                  onChange={(date) => {
                    setValue(
                      'dealCallBackDatetime',
                      date ? date.toISOString() : '',
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                  disablePast={true}
                />
              ) : (
                <span>
                  {formValues.dealCallBackDatetime
                    ? formatExactDate(
                        formValues.dealCallBackDatetime,
                        'dd MMM yyyy, hh:mm a',
                      )
                    : '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow label='Ticket Login' error={errors.ticketLogin?.message}>
              <SelectField
                isEdit={isEdit}
                options={['true', 'false']}
                value={formValues.ticketLogin as string}
                onChange={(value) =>
                  setValue('ticketLogin', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow label='Potential' error={errors.potential?.message}>
              {isEdit ? (
                <Input
                  {...register('potential')}
                  placeholder='Potential'
                  className='h-8'
                />
              ) : (
                <span>{formValues.potential || '—'}</span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Case Status' error={errors.caseStatus?.message}>
              <SelectField
                isEdit={isEdit}
                options={[
                  'Yet to Lender Login',
                  'Lender Review',
                  'In Credit',
                  'Approved',
                  'Disbursed',
                  'Rejected',
                  'Not Interested',
                ]}
                value={formValues.caseStatus as string}
                onChange={(value) =>
                  setValue('caseStatus', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow label='Case Stage' error={errors.caseStage?.message}>
              <SelectField
                isEdit={isEdit}
                options={[
                  'RM - Doc QC',
                  'CPI Analysis',
                  'Pendency Raised by Lender',
                  'Pendency Resolved',
                  'GST Finfort - Initiated',
                  'GST Finfort - Completed',
                  'Jr Credit Manager Review',
                  'PD Pending',
                  'PD Completed',
                  'Sr Credit Manager Review',
                  'NCM Review',
                  'Approval Pending',
                  'Commercial Shared with Cust',
                  'Cust Accepted Loan Offer',
                  'PF Paid',
                  'Sanctioned',
                  'SL Sign and PSD Initiated',
                  'SL Sign and PSD Completed',
                  'Disbursed',
                ]}
                value={formValues.caseStage as string}
                onChange={(value) =>
                  setValue('caseStage', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Targeted Disbursement date'
              error={errors.targetedDisbursementDate?.message}
            >
              {isEdit ? (
                <DateField
                  isEdit={isEdit}
                  value={
                    formValues.targetedDisbursementDate
                      ? new Date(formValues.targetedDisbursementDate)
                      : undefined
                  }
                  onChange={(date) => {
                    setValue(
                      'targetedDisbursementDate',
                      date ? format(date, 'yyyy-MM-dd') : '',
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                />
              ) : (
                <span>
                  {formValues.targetedDisbursementDate
                    ? formatExactDate(
                        formValues.targetedDisbursementDate,
                        'dd MMM yyyy',
                      )
                    : '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow
              label='Disbursement Date'
              error={errors.disbursementDate?.message}
            >
              {isEdit ? (
                <DateField
                  isEdit={isEdit}
                  value={
                    formValues.disbursementDate
                      ? new Date(formValues.disbursementDate)
                      : undefined
                  }
                  onChange={(date) => {
                    setValue(
                      'disbursementDate',
                      date ? format(date, 'yyyy-MM-dd') : '',
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                />
              ) : (
                <span>
                  {formValues.disbursementDate
                    ? formatExactDate(
                        formValues.disbursementDate,
                        'dd MMM yyyy',
                      )
                    : '—'}
                </span>
              )}
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Loan Liabilities Information ================= */}
        <SectionHeader title='Loan Liabilities Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow label='Deal Name'>
              <span>{dealData.account_name || '—'}</span>
            </FieldRow>
            <FieldRow
              label='Lender Login Date'
              error={errors.lenderLoginDate?.message}
            >
              {isEdit ? (
                <DateField
                  isEdit={isEdit}
                  value={
                    formValues.lenderLoginDate
                      ? new Date(formValues.lenderLoginDate)
                      : undefined
                  }
                  onChange={(date) => {
                    setValue(
                      'lenderLoginDate',
                      date ? format(date, 'yyyy-MM-dd') : '',
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                />
              ) : (
                <span>
                  {formValues.lenderLoginDate
                    ? formatExactDate(formValues.lenderLoginDate, 'dd MMM yyyy')
                    : '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow
              label='Type of case login'
              error={errors.typeOfCaseLogin?.message}
            >
              <SelectField
                isEdit={isEdit}
                options={['Fresh', 'Spillover']}
                value={formValues.typeOfCaseLogin as string}
                onChange={(value) =>
                  setValue('typeOfCaseLogin', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Amount Required'
              error={errors.amountRequired?.message}
            >
              {isEdit ? (
                <Input
                  {...register('amountRequired')}
                  placeholder='Amount Required'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>
                  {formatAmount(Number(formValues.amountRequired)) || '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow label='Created By'>
              <span>
                {(users as Record<string, string>)[
                  formValues.createdBy as string
                ] ||
                  formValues.createdBy ||
                  '—'}
              </span>
            </FieldRow>
            <FieldRow label='Modified By'>
              <span>
                {(users as Record<string, string>)[
                  formValues.modifiedBy as string
                ] ||
                  formValues.modifiedBy ||
                  '—'}
              </span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Account Name'>
              <span>{dealData.account_name || '—'}</span>
            </FieldRow>
            <FieldRow label='Lender Name' error={errors.lenderName?.message}>
              <SelectField
                isEdit={isEdit}
                options={[
                  'Kotak Mahindra Bank Ltd',
                  'Tyger Capital Private Ltd',
                  'Profectus Capital Private Ltd',
                  'Rupifi Private Ltd',
                  'Niyogin Fintech Ltd',
                  'Mintifi Finserve Private Limited',
                  'Aditya Birla Capital Limited',
                  'Muthoot Fincorp Limited',
                  'FlexiLoans Technologies Pvt Ltd',
                  'Hero Fincorp Ltd',
                ]}
                value={formValues.lenderName as string}
                onChange={(value) =>
                  setValue('lenderName', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow label='Lender Code' error={errors.lenderCode?.message}>
              {isEdit ? (
                <Input
                  {...register('lenderCode')}
                  placeholder='Lender Code'
                  className='h-8'
                />
              ) : (
                <span>{formValues.lenderCode || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Type of Loan' error={errors.loanType?.message}>
              <SelectField
                isEdit={isEdit}
                options={[
                  'SCF',
                  'SCF Renewal',
                  'SCF Enhancement',
                  'SCF (Renewal and Enhancement)',
                  'Open SCF',
                  'Open SCF Renewal',
                  'Open SCF Enhancement',
                  'Open SCF (Renewal and Enhancement)',
                  'BT-SCF',
                  'BT-Open SCF',
                  'Unsecured OD',
                  'Unsecured Term Loan',
                  'Secured Loan',
                  'Secured BT',
                  'Vehicle Loan',
                ]}
                value={formValues.loanType as string}
                onChange={(value) =>
                  setValue('loanType', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Interest Type'
              error={errors.interestType?.message}
            >
              <SelectField
                isEdit={isEdit}
                options={['Reducing', 'Fixed', 'Floating']}
                value={formValues.interestType as string}
                onChange={(value) =>
                  setValue('interestType', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Rate of Interest'
              error={errors.rateOfInterest?.message}
            >
              {isEdit ? (
                <Input
                  {...register('rateOfInterest')}
                  placeholder='Rate Of Interest'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>{formValues.rateOfInterest || '—'}</span>
              )}
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Funding & Commercials ================= */}
        <SectionHeader title='Funding & Commercials' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow
              label='Approved Amount'
              error={errors.approvedAmount?.message}
            >
              {isEdit ? (
                <Input
                  {...register('approvedAmount')}
                  placeholder='Approved Amount'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>
                  {formatAmount(Number(formValues.approvedAmount)) || '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow
              label='Processing Fees'
              error={errors.processingFees?.message}
            >
              {isEdit ? (
                <Input
                  {...register('processingFees')}
                  placeholder='Processing Fees'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>
                  {formatAmount(Number(formValues.processingFees)) || '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow
              label='PF percentage'
              error={errors.pfPercentage?.message}
            >
              {isEdit ? (
                <Input
                  {...register('pfPercentage')}
                  placeholder='PF Percentage'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>{formValues.pfPercentage || '—'}</span>
              )}
            </FieldRow>
            <FieldRow
              label='Insurance Amount'
              error={errors.insuranceAmount?.message}
            >
              {isEdit ? (
                <Input
                  {...register('insuranceAmount')}
                  placeholder='Insurance Amount'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>
                  {formatAmount(Number(formValues.insuranceAmount)) || '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow
              label='Loan Start Date'
              error={errors.loanStartDate?.message}
            >
              {isEdit ? (
                <DateField
                  isEdit={isEdit}
                  value={
                    formValues.loanStartDate
                      ? new Date(formValues.loanStartDate)
                      : undefined
                  }
                  onChange={(date) => {
                    setValue(
                      'loanStartDate',
                      date ? format(date, 'yyyy-MM-dd') : '',
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                />
              ) : (
                <span>
                  {formValues.loanStartDate
                    ? formatExactDate(formValues.loanStartDate, 'dd MMM yyyy')
                    : '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow label='Loan End Date' error={errors.loanEndDate?.message}>
              {isEdit ? (
                <DateField
                  isEdit={isEdit}
                  value={
                    formValues.loanEndDate
                      ? new Date(formValues.loanEndDate)
                      : undefined
                  }
                  onChange={(date) => {
                    setValue(
                      'loanEndDate',
                      date ? format(date, 'yyyy-MM-dd') : '',
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    )
                  }}
                />
              ) : (
                <span>
                  {formValues.loanEndDate
                    ? formatExactDate(formValues.loanEndDate, 'dd MMM yyyy')
                    : '—'}
                </span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow
              label='Sanction Amount'
              error={errors.sanctionAmount?.message}
            >
              {isEdit ? (
                <Input
                  {...register('sanctionAmount')}
                  placeholder='Sanction Amount'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>
                  {formatAmount(Number(formValues.sanctionAmount)) || '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow
              label='Disbursed Amount'
              error={errors.disbursedAmount?.message}
            >
              {isEdit ? (
                <Input
                  {...register('disbursedAmount')}
                  placeholder='Disbursed Amount'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>
                  {formatAmount(Number(formValues.disbursedAmount)) || '—'}
                </span>
              )}
            </FieldRow>
            <FieldRow label='Tenure' error={errors.tenure?.message}>
              {isEdit ? (
                <Input
                  {...register('tenure')}
                  placeholder='Tenure'
                  type='number'
                  className='h-8'
                />
              ) : (
                <span>{formValues.tenure || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='MM Charges' error={errors.mmCharges?.message}>
              {isEdit ? (
                <Input
                  {...register('mmCharges')}
                  placeholder='MM Charges'
                  type='number'
                  step='0.01'
                  className='h-8'
                />
              ) : (
                <span>{formatAmount(Number(formValues.mmCharges)) || '—'}</span>
              )}
            </FieldRow>
            <FieldRow label='Sanction Letter'>
              <span>{dealData.sanction_letter || '—'}</span>
            </FieldRow>
            <FieldRow
              label='Payment Receipt'
              error={errors.paymentReceipt?.message}
            >
              <span>—</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Rejection Status ================= */}
        <SectionHeader title='Rejection Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow
              label='Lender Rejection Reason'
              error={errors.lenderRejectionReason?.message}
            >
              <SelectField
                isEdit={isEdit}
                options={[
                  '-None-',
                  'Low Eligibility',
                  'Credit Issues',
                  'OGL',
                  'Vintage',
                ]}
                value={formValues.lenderRejectionReason as string}
                onChange={(value) =>
                  setValue('lenderRejectionReason', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Lender Rejection Status Explanation'
              error={errors.lenderRejectionStatusExplanation?.message}
            >
              {isEdit ? (
                <Input
                  {...register('lenderRejectionStatusExplanation')}
                  placeholder='Lender Rejection Explanation'
                  className='h-8'
                />
              ) : (
                <span>
                  {formValues.lenderRejectionStatusExplanation || '—'}
                </span>
              )}
            </FieldRow>
          </div>
          <div>
            <FieldRow
              label='Customer Rejection Reason'
              error={errors.customerRejectionReason?.message}
            >
              <SelectField
                isEdit={isEdit}
                options={['-None-', 'ROI', 'Limit', 'Charges', 'Other Terms']}
                value={formValues.customerRejectionReason as string}
                onChange={(value) =>
                  setValue('customerRejectionReason', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>
            <FieldRow
              label='Customer Rejection Status Explanation'
              error={errors.customerRejectionStatusExplanation?.message}
            >
              {isEdit ? (
                <Input
                  {...register('customerRejectionStatusExplanation')}
                  placeholder='Customer Rejection Explanation'
                  className='h-8'
                />
              ) : (
                <span>
                  {formValues.customerRejectionStatusExplanation || '—'}
                </span>
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
                          <div className='font-bold'>
                            Module : {note.module}
                          </div>
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
