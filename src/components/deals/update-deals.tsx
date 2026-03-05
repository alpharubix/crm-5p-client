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
  // const [notes, setNotes] = useState<
  //   { title: string; description: string; date: string }[]
  // >([
  //   {
  //     title: 'Initial Note',
  //     description: 'Called deal contact',
  //     date: '19-12-2025',
  //   },
  // ])

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
      [isDirty],
    ),
  )

  const data = watch()

  // const onSave = (values: UpdateDealFormValues) => {
  //   // console.log('SAVE DEAL', values)
  //   setIsEdit(false)
  //   reset(values)
  // }

  // const handleAddNote = (note: { title: string; description: string }) => {
  //   setNotes((prev) => [
  //     ...prev,
  //     { ...note, date: new Date().toLocaleDateString() },
  //   ])
  // }
  const dealData = {
    loan_type: "Testing",
    approved_amount: null,
    deal_call_back_datetime: null,
    lender_code: null,
    product: null,
    updated_at: '2026-03-04T09:27:55.672116',
    type_of_login: null,
    amount_required: null,
    disbursement_date: null,
    lender_name: null,
    assignee_id: null,
    deal_owner_id: "3899927000000201013",
    type_of_case_login: null,
    processing_fees: null,
    lender_login_date: null,
    customer_rejection_reason: null,
    created_by: "3899927000000201013",
    ticket_login: null,
    mm_charges: null,
    loan_start_date: null,
    customer_rejection_status_explanation: null,
    modified_by: "3899927000000201013",
    ticket_id: null,
    case_stage: null,
    insurance_amount: null,
    loan_end_date: null,
    lender_rejection_reason: null,
    account_id: "3899927000001328163",
    id: 1439,
    case_status: null,
    pf_percentage: null,
    lender_rejection_status_explanation: null,
    payment_receipt: null,
    account_name: 'TERRAGO LOGISTICS',
    ticket_number: null,
    disbursed_amount: null,
    rate_of_interest: null,
    targeted_disbursement_date: null,
    sanction_letter: null,
    created_at: '2026-03-04T09:27:55.672116',
    deal_type: null,
    sanction_amount: null,
    interest_type: null,
    tenure: null,
    potential: null,
  }
  // function SectionHeader({ title }) {
  //   return (
  //     <div className='bg-muted/50 px-4 py-2 border-y'>
  //       <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
  //         {title}
  //       </p>
  //     </div>
  //   )
  // }

  // function FieldRow({ label, children }) {
  //   return (
  //     <div className='flex items-center justify-between gap-4 px-4 py-2 border-b last:border-b-0 text-sm'>
  //       <span className='text-muted-foreground shrink-0 w-48'>{label}</span>
  //       <div className='flex-1 text-right'>{children}</div>
  //     </div>
  //   )
  // }

  // function SelectField({ value, isEdit, options, onChange }) {
  //   if (!isEdit) return <span>{value || '—'}</span>
  //   return (
  //     <select
  //       value={value ?? ''}
  //       onChange={(e) => onChange(e.target.value)}
  //       className='h-8 w-full rounded-md border border-input bg-background px-2 text-sm'
  //     >
  //       <option value=''>—</option>
  //       {options.map((o) => (
  //         <option key={o} value={o}>
  //           {o}
  //         </option>
  //       ))}
  //     </select>
  //   )
  // }

  // function DateField({ value, isEdit, onChange }) {
  //   if (!isEdit)
  //     return <span>{value ? new Date(value).toLocaleDateString() : '—'}</span>
  //   return (
  //     <input
  //       type='datetime-local'
  //       defaultValue={value ? value.slice(0, 16) : ''}
  //       onChange={(e) => onChange(e.target.value)}
  //       className='h-8 w-full rounded-md border border-input bg-background px-2 text-sm'
  //     />
  //   )
  // }
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
                  ? new Date(dealData.deal_call_back_datetime).toLocaleString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Case Status'>
              <span>{dealData.case_status || '—'}</span>
            </FieldRow>
            <FieldRow label='Type of Login'>
              <span>{dealData.type_of_login || '—'}</span>
            </FieldRow>
            <FieldRow label='Type of Case Login'>
              <span>{dealData.type_of_case_login || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Case Stage'>
              <span>{dealData.case_stage || '—'}</span>
            </FieldRow>
            <FieldRow label='Targeted Disbursement Date'>
              <span>
                {dealData.targeted_disbursement_date
                  ? new Date(
                      dealData.targeted_disbursement_date,
                    ).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Disbursement Date'>
              <span>
                {dealData.disbursement_date
                  ? new Date(dealData.disbursement_date).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Lender Login Date'>
              <span>
                {dealData.lender_login_date
                  ? new Date(dealData.lender_login_date).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Potential'>
              <span>{dealData.potential || '—'}</span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Loan Liabilities Information ================= */}
        <SectionHeader title='Loan Liabilities Information' />
        <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
          <div className='md:border-r'>
            <FieldRow label='Account Name'>
              <span>{dealData.account_name || '—'}</span>
            </FieldRow>
            <FieldRow label='Loan Start Date'>
              <span>
                {dealData.loan_start_date
                  ? new Date(dealData.loan_start_date).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Loan End Date'>
              <span>
                {dealData.loan_end_date
                  ? new Date(dealData.loan_end_date).toLocaleDateString()
                  : '—'}
              </span>
            </FieldRow>
            <FieldRow label='Amount Required'>
              <span>{dealData.amount_required || '—'}</span>
            </FieldRow>
            <FieldRow label='Tenure'>
              <span>{dealData.tenure || '—'}</span>
            </FieldRow>
            <FieldRow label='Created By'>
              <span>{dealData.created_by || '—'}</span>
            </FieldRow>
            <FieldRow label='Modified By'>
              <span>{dealData.modified_by || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Lender Name'>
              <span>{dealData.lender_name || '—'}</span>
            </FieldRow>
            <FieldRow label='Lender Code'>
              <span>{dealData.lender_code || '—'}</span>
            </FieldRow>
            <FieldRow label='Loan Type'>
              <span>{dealData.loan_type || '—'}</span>
            </FieldRow>
            <FieldRow label='Product'>
              <span>{dealData.product || '—'}</span>
            </FieldRow>
            <FieldRow label='Interest Type'>
              <span>{dealData.interest_type || '—'}</span>
            </FieldRow>
            <FieldRow label='Rate of Interest'>
              <span>{dealData.rate_of_interest || '—'}</span>
            </FieldRow>
            <FieldRow label='Ticket Number'>
              <span>{dealData.ticket_number || '—'}</span>
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
            <FieldRow label='Approved Amount'>
              <span>{dealData.approved_amount || '—'}</span>
            </FieldRow>
            <FieldRow label='Processing Fees'>
              <span>{dealData.processing_fees || '—'}</span>
            </FieldRow>
            <FieldRow label='PF Percentage'>
              <span>{dealData.pf_percentage || '—'}</span>
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
            <FieldRow label='Lender Rejection Explanation'>
              <span>{dealData.lender_rejection_status_explanation || '—'}</span>
            </FieldRow>
          </div>
          <div>
            <FieldRow label='Customer Rejection Reason'>
              <span>{dealData.customer_rejection_reason || '—'}</span>
            </FieldRow>
            <FieldRow label='Customer Rejection Explanation'>
              <span>
                {dealData.customer_rejection_status_explanation || '—'}
              </span>
            </FieldRow>
          </div>
        </CardContent>

        {/* ================= Notes ================= */}
        {/* <SectionHeader title='Notes' />
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
          <NoteDialog onAddNote={handleAddNote} />
        </CardContent> */}
      </Card>
    </div>
  )
  // return (
  //   <div className='space-y-6 bg-background min-h-screen'>
  //     {/* HEADER */}
  //     <div className='flex justify-between items-center border p-4 rounded-xl bg-card'>
  //       <h1 className='text-lg font-semibold'>
  //         Deals Owner: <span className='text-primary font-bold'>User</span>
  //       </h1>

  //       {!isEdit ? (
  //         <Button size='sm' onClick={() => setIsEdit(true)}>
  //           Update
  //         </Button>
  //       ) : (
  //         <div className='flex gap-2'>
  //           <Button
  //             size='sm'
  //             disabled={!isDirty}
  //             onClick={handleSubmit(onSave)}
  //           >
  //             Save
  //           </Button>
  //           <Button
  //             size='sm'
  //             variant='outline'
  //             onClick={() => {
  //               reset()
  //               setIsEdit(false)
  //             }}
  //           >
  //             Cancel
  //           </Button>
  //         </div>
  //       )}
  //     </div>

  //     <Card className='overflow-hidden space-y-1'>
  //       {/* ================= Loan Account Status ================= */}
  //       <SectionHeader title='Loan Account Status' />
  //       <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
  //         <div className='md:border-r'>
  //           <FieldRow label='Deal Type'>
  //             <SelectField
  //               value={data.dealType}
  //               isEdit={isEdit}
  //               options={['New', 'Renewal']}
  //               onChange={(v) => setValue('dealType', v, { shouldDirty: true })}
  //             />
  //           </FieldRow>

  //           <FieldRow label='Deal Call Back Date/Time'>
  //             <DateField
  //               value={data.dealCallbackDate}
  //               isEdit={isEdit}
  //               onChange={(d) =>
  //                 setValue('dealCallbackDate', d, { shouldDirty: true })
  //               }
  //             />
  //           </FieldRow>

  //           <FieldRow label='Deal Approval Status'>
  //             <SelectField
  //               value={data.dealApprovalStatus}
  //               isEdit={isEdit}
  //               options={['Approved', 'Pending']}
  //               onChange={(v) =>
  //                 setValue('dealApprovalStatus', v, { shouldDirty: true })
  //               }
  //             />
  //           </FieldRow>
  //         </div>

  //         <div>
  //           <FieldRow label='Deal Status'>
  //             <SelectField
  //               value={data.dealStatus}
  //               isEdit={isEdit}
  //               options={['Open', 'Closed']}
  //               onChange={(v) =>
  //                 setValue('dealStatus', v, { shouldDirty: true })
  //               }
  //             />
  //           </FieldRow>

  //           <FieldRow label='Stage'>
  //             <SelectField
  //               value={data.stage}
  //               isEdit={isEdit}
  //               options={['Initial', 'Final']}
  //               onChange={(v) => setValue('stage', v, { shouldDirty: true })}
  //             />
  //           </FieldRow>

  //           <FieldRow label='Closing Date'>
  //             <DateField
  //               value={data.closingDate}
  //               isEdit={isEdit}
  //               onChange={(d) =>
  //                 setValue('closingDate', d, { shouldDirty: true })
  //               }
  //             />
  //           </FieldRow>

  //           <FieldRow label='Disbursement Date'>
  //             <DateField
  //               value={data.disbursementDate}
  //               isEdit={isEdit}
  //               onChange={(d) =>
  //                 setValue('disbursementDate', d, { shouldDirty: true })
  //               }
  //             />
  //           </FieldRow>
  //         </div>
  //       </CardContent>

  //       {/* ================= Loan Liabilities Information ================= */}
  //       <SectionHeader title='Loan Liabilities Information' />
  //       <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
  //         <div className='md:border-r'>
  //           <FieldRow label='Deal Name'>
  //             {isEdit ? (
  //               <Input {...register('dealName')} className='h-8' />
  //             ) : (
  //               <span>{data.dealName || '—'}</span>
  //             )}
  //           </FieldRow>
  //           <FieldRow label='Start Date'>
  //             <DateField
  //               value={data.startDate}
  //               isEdit={isEdit}
  //               onChange={(d) =>
  //                 setValue('startDate', d, { shouldDirty: true })
  //               }
  //             />
  //           </FieldRow>
  //           <FieldRow label='End Date'>
  //             <DateField
  //               value={data.endDate}
  //               isEdit={isEdit}
  //               onChange={(d) => setValue('endDate', d, { shouldDirty: true })}
  //             />
  //           </FieldRow>
  //           <FieldRow label='Amount'>
  //             {isEdit ? (
  //               <Input {...register('amount')} className='h-8' />
  //             ) : (
  //               <span>{data.amount || '—'}</span>
  //             )}
  //           </FieldRow>
  //           <FieldRow label='Created By'>
  //             <span>{data.createdBy}</span>
  //           </FieldRow>
  //           <FieldRow label='Modified By'>
  //             <span>{data.modifiedBy}</span>
  //           </FieldRow>
  //         </div>

  //         <div>
  //           {[
  //             ['Account Name', 'accountName'],
  //             ['Lender Name', 'lenderName'],
  //             ['Loan Type', 'loanType'],
  //             ['Loan Product', 'loanProduct'],
  //             ['Interest Type', 'interestType'],
  //             ['Rate of Interest', 'rateOfInterest'],
  //           ].map(([label, key]) => (
  //             <FieldRow key={key} label={label}>
  //               {isEdit ? (
  //                 <Input
  //                   {...register(key as keyof UpdateDealFormValues)}
  //                   className='h-8'
  //                 />
  //               ) : (
  //                 <span>{(data as any)[key] || '—'}</span>
  //               )}
  //             </FieldRow>
  //           ))}
  //         </div>
  //       </CardContent>

  //       {/* ================= Funding & Commercials ================= */}
  //       <SectionHeader title='Funding & Commercials' />
  //       <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
  //         <div className='md:border-r'>
  //           {['sanctionAmount', 'processingFees', 'insuranceAmount'].map(
  //             (k) => (
  //               <FieldRow key={k} label={k.replace(/([A-Z])/g, ' $1')}>
  //                 {isEdit ? (
  //                   <Input {...register(k as any)} className='h-8' />
  //                 ) : (
  //                   <span>{(data as any)[k] || '—'}</span>
  //                 )}
  //               </FieldRow>
  //             ),
  //           )}
  //         </div>
  //         <div>
  //           {['disbursedAmount', 'mmCharges'].map((k) => (
  //             <FieldRow key={k} label={k.replace(/([A-Z])/g, ' $1')}>
  //               {isEdit ? (
  //                 <Input {...register(k as any)} className='h-8' />
  //               ) : (
  //                 <span>{(data as any)[k] || '—'}</span>
  //               )}
  //             </FieldRow>
  //           ))}
  //         </div>
  //       </CardContent>

  //       {/* ================= Rejection Status ================= */}
  //       <SectionHeader title='Rejection Status' />
  //       <CardContent className='p-0 grid grid-cols-1 md:grid-cols-2'>
  //         <div className='md:border-r'>
  //           <FieldRow label='Lender Rejection Reason'>
  //             {isEdit ? (
  //               <Input {...register('lenderRejectionReason')} className='h-8' />
  //             ) : (
  //               <span>{data.lenderRejectionReason || '—'}</span>
  //             )}
  //           </FieldRow>
  //           <FieldRow label='Lender Rejection Status Explanation'>
  //             {isEdit ? (
  //               <Input
  //                 {...register('lenderRejectionExplanation')}
  //                 className='h-8'
  //               />
  //             ) : (
  //               <span>{data.lenderRejectionExplanation || '—'}</span>
  //             )}
  //           </FieldRow>
  //         </div>
  //         <div>
  //           <FieldRow label='Customer Rejection Reason'>
  //             {isEdit ? (
  //               <Input
  //                 {...register('customerRejectionReason')}
  //                 className='h-8'
  //               />
  //             ) : (
  //               <span>{data.customerRejectionReason || '—'}</span>
  //             )}
  //           </FieldRow>
  //           <FieldRow label='Customer Rejection Status Explanation'>
  //             {isEdit ? (
  //               <Input
  //                 {...register('customerRejectionExplanation')}
  //                 className='h-8'
  //               />
  //             ) : (
  //               <span>{data.customerRejectionExplanation || '—'}</span>
  //             )}
  //           </FieldRow>
  //         </div>
  //       </CardContent>

  //       {/* ================= Notes ================= */}
  //       <SectionHeader title='Notes' />
  //       <CardContent className='p-4 space-y-3'>
  //         {notes.map((note, i) => (
  //           <div key={i} className='bg-muted/30 p-3 rounded-lg border'>
  //             <p className='text-sm font-semibold'>{note.title}</p>
  //             <p className='text-sm'>{note.description}</p>
  //             <div className='flex gap-3 text-[11px] text-muted-foreground uppercase mt-2'>
  //               <span>
  //                 Module:{' '}
  //                 <Badge variant='outline' className='text-[10px] h-4'>
  //                   Deal
  //                 </Badge>
  //               </span>
  //               <span>Created: {note.date}</span>
  //               <span>Owner: System User</span>
  //             </div>
  //           </div>
  //         ))}
  //         {/* @ts-ignore */}
  //         <NoteDialog onAddNote={handleAddNote} />
  //       </CardContent>
  //     </Card>
  //   </div>
  // )
}
