import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ENV } from '@/conf'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

import SectionHeader from '@/components/shared/section-header'
import FieldRow from '@/components/shared/field-row'

import {
  createDealSchema,
  type CreateDealFormValues,
} from '@/validators/createDeal.schema'
import DateField from '../shared/date-field'
import SelectField from '../shared/select-field'
import LENDER_NAMES from '@/utils/lenders.json'

export default function CreateDeal() {
  const navigate = useNavigate()
  const location = useLocation()
  const prefilledData = location.state || {}

  const form = useForm<CreateDealFormValues>({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      accountId: prefilledData.accountId || '',
      accountName: prefilledData.accountName || '',
      ticketId: '',
      ticketNumber: '',
      dealType: '',
      loanType: '',
      typeOfLogin: '',
      typeOfCaseLogin: '',
      ticketLogin: '',
      caseStage: '',
      caseStatus: '',
      disbursedAmount: '',
      sanctionAmount: '',
      approvedAmount: '',
      amountRequired: '',
      processingFees: '',
      mmCharges: '',
      insuranceAmount: '',
      pfPercentage: '',
      rateOfInterest: '',
      interestType: '',
      dealCallBackDatetime: '',
      disbursementDate: '',
      lenderLoginDate: '',
      loanStartDate: '',
      loanEndDate: '',
      targetedDisbursementDate: '',
      tenure: '',
      lenderCode: '',
      lenderName: '',
      customerRejectionReason: '',
      customerRejectionStatusExplanation: '',
      lenderRejectionReason: '',
      lenderRejectionStatusExplanation: '',
      paymentReceipt: '',
      potential: '',
      product: '',
    },
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form

  const formValues = watch()
  const [lenderSearch, setLenderSearch] = useState('')
  const [lenderOpen, setLenderOpen] = useState(false)

  const filteredLenders =
    lenderSearch.length > 1
      ? LENDER_NAMES.filter((l: string) =>
          l.toLowerCase().includes(lenderSearch.toLowerCase()),
        ).slice(0, 50) // cap at 50 results
      : []

  const [searchTerm, setSearchTerm] = useState(prefilledData.accountName || '')
  const [debouncedSearch, setDebouncedSearch] = useState(
    prefilledData.accountName || '',
  )
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
    }, 1000)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: accountsData, isLoading: isLoadingAccounts } = useQuery({
    queryKey: [debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch) {
        const res = await fetch(
          `${ENV.VITE_BACKEND_BASE_URL}/accounts/lookup?account_name=${debouncedSearch}`,
          { credentials: 'include' },
        )
        if (!res.ok) throw new Error('Failed to fetch accounts')
        return res.json()
      }
      return { data: [] }
    },
  })

  const accounts = Array.isArray(accountsData?.data) ? accountsData.data : []

  const createMutation = useMutation({
    mutationFn: async (values: CreateDealFormValues) => {
      const payload: any = {
        account_id: values.accountId ? String(values.accountId) : undefined,
        account_name: values.accountName || undefined,
        ticket_id: values.ticketId ? String(values.ticketId) : undefined,
        ticket_number: values.ticketNumber
          ? String(values.ticketNumber)
          : undefined,
        deal_type: values.dealType || undefined,
        loan_type: values.loanType || undefined,
        type_of_login: values.typeOfLogin || undefined,
        type_of_case_login: values.typeOfCaseLogin || undefined,
        ticket_login: values.ticketLogin || undefined,
        case_stage: values.caseStage || undefined,
        case_status: values.caseStatus || undefined,
        disbursed_amount: values.disbursedAmount || undefined,
        sanction_amount: values.sanctionAmount || undefined,
        approved_amount: values.approvedAmount || undefined,
        amount_required: values.amountRequired || undefined,
        processing_fees: values.processingFees || undefined,
        mm_charges: values.mmCharges || undefined,
        insurance_amount: values.insuranceAmount || undefined,
        pf_percentage: values.pfPercentage || undefined,
        rate_of_interest: values.rateOfInterest || undefined,
        interest_type: values.interestType || undefined,
        deal_call_back_datetime: values.dealCallBackDatetime || undefined,
        disbursement_date: values.disbursementDate || undefined,
        lender_login_date: values.lenderLoginDate || undefined,
        loan_start_date: values.loanStartDate || undefined,
        loan_end_date: values.loanEndDate || undefined,
        targeted_disbursement_date:
          values.targetedDisbursementDate || undefined,
        tenure: values.tenure ? String(values.tenure) : undefined,
        lender_code: values.lenderCode || undefined,
        lender_name: values.lenderName || undefined,
        customer_rejection_reason: values.customerRejectionReason || undefined,
        customer_rejection_status_explanation:
          values.customerRejectionStatusExplanation || undefined,
        lender_rejection_reason: values.lenderRejectionReason || undefined,
        lender_rejection_status_explanation:
          values.lenderRejectionStatusExplanation || undefined,
        payment_receipt: values.paymentReceipt || undefined,
        potential: values.potential || undefined,
        product: values.product || undefined,
      }

      // remove undefined keys
      Object.keys(payload).forEach(
        (key) => payload[key] === undefined && delete payload[key],
      )

      const res = await fetch(`${ENV.VITE_BACKEND_BASE_URL}/deals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create deal')
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success('Deal created successfully')
      navigate('/deals')
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const onSubmit = (values: CreateDealFormValues) => {
    createMutation.mutate(values)
  }

  return (
    <div className='space-y-6 mb-10'>
      <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
        <h1 className='text-2xl font-bold'>Create Deal</h1>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            className='cursor-pointer'
            onClick={() => navigate('/deals')}
          >
            Cancel
          </Button>
          <Button
            className='cursor-pointer'
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Spinner className='mr-2 h-4 w-4' />
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </div>

      <Card>
        <SectionHeader title='Loan Account Status' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow label='Account Name' error={errors.accountId?.message}>
              <div className='relative'>
                <Input
                  placeholder='Search Account...'
                  className='h-8'
                  value={searchTerm}
                  disabled={!!prefilledData.accountId}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setIsOpen(true)
                    if (formValues.accountId) {
                      setValue('accountId', '', { shouldValidate: true })
                      setValue('accountName', '')
                    }
                  }}
                  onFocus={() => setIsOpen(true)}
                  onBlur={() => {
                    setTimeout(() => setIsOpen(false), 200)
                  }}
                />
                {isOpen && !prefilledData.accountId && (
                  <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto'>
                    {isLoadingAccounts ? (
                      <div className='p-2 flex justify-center'>
                        <Spinner className='h-4 w-4' />
                      </div>
                    ) : accounts.length > 0 ? (
                      accounts.map((acc: any, idx: number) => (
                        <div
                          key={idx}
                          className='p-2 hover:bg-muted cursor-pointer text-sm'
                          onMouseDown={() => {
                            setValue('accountId', String(acc.id), {
                              shouldValidate: true,
                            })
                            setValue('accountName', acc.account_name)
                            setSearchTerm(acc.account_name)
                            setIsOpen(false)
                          }}
                        >
                          {acc.account_name}
                        </div>
                      ))
                    ) : (
                      <div className='p-2 text-sm text-muted-foreground'>
                        No accounts found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </FieldRow>

            <FieldRow label='Deal Type' error={errors.dealType?.message}>
              <SelectField
                isEdit={true}
                options={[
                  'NTB',
                  'NTC',
                  'NTL',
                  'Adhoc',
                  'Renewal',
                  'Renewal & Enhancement',
                  'Existing',
                ]}
                value={formValues.dealType}
                onChange={(value) =>
                  setValue('dealType', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>

            <FieldRow
              label='Deal Call Back DateTime'
              error={errors.dealCallBackDatetime?.message}
            >
              <DateField
                isEdit={true}
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
            </FieldRow>

            <FieldRow label='Ticket Login' error={errors.ticketLogin?.message}>
              <SelectField
                isEdit={true}
                options={[
                  'Approved',
                  'Disapproved',
                  'L1 Pendency',
                  'L2 Pendency',
                  'L3 Pendency',
                  'Rejected',
                ]}
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
              <Input
                {...register('potential')}
                placeholder='Potential'
                className='h-8'
              />
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Case Status' error={errors.caseStatus?.message}>
              <SelectField
                isEdit={true}
                options={[
                  'Yet to Lender Login',
                  'Lender Review',
                  'In Credit',
                  'Approved',
                  'Disbursed',
                  'Rejected',
                  'Not Interested',
                ]}
                value={formValues.caseStatus}
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
                isEdit={true}
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
                value={formValues.caseStage}
                onChange={(value) =>
                  setValue('caseStage', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>

            <FieldRow
              label='Targeted Disbursement Date'
              error={errors.targetedDisbursementDate?.message}
            >
              <DateField
                isEdit={true}
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
            </FieldRow>

            <FieldRow
              label='Disbursement Date'
              error={errors.disbursementDate?.message}
            >
              <DateField
                isEdit={true}
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
            </FieldRow>
          </div>
        </CardContent>

        <SectionHeader title='Loan Liabilities Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow
              label='Lender Login Date'
              error={errors.lenderLoginDate?.message}
            >
              <DateField
                isEdit={true}
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
            </FieldRow>

            <FieldRow
              label='Type of case login'
              error={errors.typeOfCaseLogin?.message}
            >
              <SelectField
                isEdit={true}
                options={['Fresh', 'Spillover']}
                value={formValues.typeOfCaseLogin}
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
              <Input
                {...register('amountRequired')}
                placeholder='Amount Required'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow label='Lender Name' error={errors.lenderName?.message}>
              <div className='relative'>
                {/* Input must be present */}
                <Input
                  value={lenderSearch}
                  onChange={(e) => {
                    setLenderSearch(e.target.value)
                    setLenderOpen(true)
                  }}
                  onFocus={() => setLenderOpen(true)}
                  onBlur={() => setTimeout(() => setLenderOpen(false), 200)}
                  placeholder='Search Lender...'
                />

                {lenderOpen && filteredLenders.length > 0 && (
                  <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto'>
                    {filteredLenders.map((name: string) => (
                      <div
                        key={name}
                        className='p-2 hover:bg-muted cursor-pointer text-sm'
                        onMouseDown={() => {
                          setValue('lenderName', name, { shouldValidate: true })
                          setLenderSearch(name)
                          setLenderOpen(false)
                        }}
                      >
                        {name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Lender Code' error={errors.lenderCode?.message}>
              <Input
                {...register('lenderCode')}
                placeholder='Lender Code'
                className='h-8'
              />
            </FieldRow>

            <FieldRow label='Loan of Type' error={errors.loanType?.message}>
              <SelectField
                isEdit={true}
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
                value={formValues.loanType}
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
                isEdit={true}
                options={['Reducing', 'Fixed', 'Floating']}
                value={formValues.interestType}
                onChange={(value) =>
                  setValue('interestType', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              />
            </FieldRow>

            <FieldRow
              label='Rate Of Interest'
              error={errors.rateOfInterest?.message}
            >
              <Input
                {...register('rateOfInterest')}
                placeholder='Rate Of Interest'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            {/* <FieldRow label='Deal Call Back DateTime' error={errors.dealCallBackDatetime?.message}>
              <DateField
                isEdit={true}
                showTime={true}
                value={formValues.dealCallBackDatetime ? new Date(formValues.dealCallBackDatetime) : undefined}
                onChange={(date) => {
                  setValue('dealCallBackDatetime', date ? date.toISOString() : '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
                disablePast={true}
              />
            </FieldRow> */}
            {/* <FieldRow label='Disbursement Date' error={errors.disbursementDate?.message}>
              <DateField
                isEdit={true}
                value={formValues.disbursementDate ? new Date(formValues.disbursementDate) : undefined}
                onChange={(date) => {
                  setValue('disbursementDate', date ? format(date, 'yyyy-MM-dd') : '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />
            </FieldRow> */}
            {/* <FieldRow label='Lender Login Date' error={errors.lenderLoginDate?.message}>
              <DateField
                isEdit={true}
                value={formValues.lenderLoginDate ? new Date(formValues.lenderLoginDate) : undefined}
                onChange={(date) => {
                  setValue('lenderLoginDate', date ? format(date, 'yyyy-MM-dd') : '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />
            </FieldRow> */}
            {/* <FieldRow label='Targeted Disbursement Date' error={errors.targetedDisbursementDate?.message}>
              <DateField
                isEdit={true}
                value={formValues.targetedDisbursementDate ? new Date(formValues.targetedDisbursementDate) : undefined}
                onChange={(date) => {
                  setValue('targetedDisbursementDate', date ? format(date, 'yyyy-MM-dd') : '', {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }}
              />
            </FieldRow> */}
          </div>
        </CardContent>

        <SectionHeader title='Funding & Commercials' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2 border-b'>
          <div className='md:border-r'>
            <FieldRow
              label='Approved Amount'
              error={errors.approvedAmount?.message}
            >
              <Input
                {...register('approvedAmount')}
                placeholder='Approved Amount'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow
              label='Processing Fees'
              error={errors.processingFees?.message}
            >
              <Input
                {...register('processingFees')}
                placeholder='Processing Fees'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow
              label='PF Percentage'
              error={errors.pfPercentage?.message}
            >
              <Input
                {...register('pfPercentage')}
                placeholder='PF Percentage'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow
              label='Insurance Amount'
              error={errors.insuranceAmount?.message}
            >
              <Input
                {...register('insuranceAmount')}
                placeholder='Insurance Amount'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow
              label='Loan Start Date'
              error={errors.loanStartDate?.message}
            >
              <DateField
                isEdit={true}
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
            </FieldRow>

            <FieldRow label='Loan End Date' error={errors.loanEndDate?.message}>
              <DateField
                isEdit={true}
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
            </FieldRow>
          </div>
          <div>
            <FieldRow
              label='Sanction Amount'
              error={errors.sanctionAmount?.message}
            >
              <Input
                {...register('sanctionAmount')}
                placeholder='Sanction Amount'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow
              label='Disbursed Amount'
              error={errors.disbursedAmount?.message}
            >
              <Input
                {...register('disbursedAmount')}
                placeholder='Disbursed Amount'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow label='Tenure' error={errors.tenure?.message}>
              <Input
                {...register('tenure')}
                placeholder='Tenure'
                type='number'
                className='h-8'
              />
            </FieldRow>

            <FieldRow label='MM Charges' error={errors.mmCharges?.message}>
              <Input
                {...register('mmCharges')}
                placeholder='MM Charges'
                type='number'
                step='0.01'
                className='h-8'
              />
            </FieldRow>

            <FieldRow
              label='Payment Receipt'
              error={errors.paymentReceipt?.message}
            >
              -
            </FieldRow>
          </div>
        </CardContent>

        <SectionHeader title='Rejection Details' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow
              label='Lender Rejection Reason'
              error={errors.lenderRejectionReason?.message}
            >
              <SelectField
                isEdit={true}
                options={[
                  '-None-',
                  'Low Eligibility',
                  'Credit Issues',
                  'OGL',
                  'Vintage',
                ]}
                value={formValues.lenderRejectionReason}
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
              <Input
                {...register('lenderRejectionStatusExplanation')}
                placeholder='Lender Rejection Explanation'
                className='h-8'
              />
            </FieldRow>
          </div>
          <div>
            <FieldRow
              label='Customer Rejection Reason'
              error={errors.customerRejectionReason?.message}
            >
              <SelectField
                isEdit={true}
                options={['-None-', 'ROI', 'Limit', 'Charges', 'Other Terms']}
                value={formValues.customerRejectionReason}
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
              <Input
                {...register('customerRejectionStatusExplanation')}
                placeholder='Customer Rejection Explanation'
                className='h-8'
              />
            </FieldRow>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
