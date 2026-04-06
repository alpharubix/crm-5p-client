import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import SectionHeader from '@/components/shared/section-header'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import SelectField from '../shared/select-field'
import { Input } from '../ui/input'

const STATUS_OPTIONS = ['Completed', 'Pending', 'In Progress', 'On Hold']
const MODULE_OPTIONS = [
  'Banking',
  'GST',
  'KYC',
  'ITR',
  'Ledger',
  'Credit Bureau',
  'Others',
]

type DocRow = {
  module: string
  description: string
  from: string
  to: string
  status: string
  link: string
  createdDate: string
  modifiedDate: string
  createdBy: string
  modifiedBy: string
}

const DUMMY_ROWS: DocRow[] = [
  {
    module: 'Banking',
    description: 'OD 50L bank statement',
    from: '01-Apr-25',
    to: '31-Mar-26',
    status: 'Completed',
    link: 'https://workdrive.zoho.in/file/2kue1',
    createdDate: '01-Apr-26',
    modifiedDate: '12-Apr-26',
    createdBy: 'Subhasini T S',
    modifiedBy: 'Sandip Kumar Jena',
  },
  {
    module: 'GST',
    description: 'GST 3B',
    from: '01-Apr-25',
    to: '31-Mar-26',
    status: 'Pending',
    link: 'https://workdrive.zoho.in/file/2kue1',
    createdDate: '01-Apr-26',
    modifiedDate: '',
    createdBy: 'Sutapa Roy',
    modifiedBy: '',
  },
  {
    module: 'KYC',
    description: 'Aadhar and PAN - Applicant',
    from: '',
    to: '',
    status: 'Completed',
    link: 'https://workdrive.zoho.in/file/2kue1',
    createdDate: '03-Apr-26',
    modifiedDate: '',
    createdBy: '',
    modifiedBy: '',
  },
  {
    module: 'KYC',
    description: 'Aadhar and PAN - Co Applicant',
    from: '',
    to: '',
    status: 'Completed',
    link: 'https://workdrive.zoho.in/file/2kue1',
    createdDate: '03-Apr-26',
    modifiedDate: '',
    createdBy: '',
    modifiedBy: '',
  },
  {
    module: 'ITR',
    description: 'FY24-26',
    from: '',
    to: '',
    status: 'Pending',
    link: '',
    createdDate: '',
    modifiedDate: '',
    createdBy: '',
    modifiedBy: '',
  },
  {
    module: 'Ledger',
    description: 'Himalaya one year',
    from: '',
    to: '',
    status: 'Pending',
    link: '',
    createdDate: '',
    modifiedDate: '',
    createdBy: '',
    modifiedBy: '',
  },
  {
    module: 'Credit Bureau',
    description: '',
    from: '',
    to: '',
    status: 'Pending',
    link: '',
    createdDate: '',
    modifiedDate: '',
    createdBy: '',
    modifiedBy: '',
  },
  {
    module: 'Others',
    description: '',
    from: '',
    to: '',
    status: 'Pending',
    link: '',
    createdDate: '',
    modifiedDate: '',
    createdBy: '',
    modifiedBy: '',
  },
]

export default function DocumentationSection() {
  const [rows, setRows] = useState<DocRow[]>(DUMMY_ROWS)

  const updateCell = (ri: number, key: keyof DocRow, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => (i === ri ? { ...row, [key]: value } : row)),
    )
  }

  const [isEdit, setIsEdit] = useState(false)

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        module: 'Banking',
        description: '',
        from: '',
        to: '',
        status: 'Pending',
        link: '',
        createdDate: '',
        modifiedDate: '',
        createdBy: '',
        modifiedBy: '',
      },
    ])
  }

  const deleteRow = (ri: number) => {
    setRows((prev) => prev.filter((_, i) => i !== ri))
  }

  return (
    <>
      <SectionHeader title='Documentation' />
      <CardContent className='p-0'>
        <div className='flex justify-end p-3 border-b gap-2'>
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
                onClick={() => setIsEdit(false)}
              >
                Save
              </Button>
              <Button
                size='sm'
                className='cursor-pointer'
                variant='outline'
                onClick={() => {
                  setIsEdit(false)
                }}
              >
                Cancel
              </Button>
            </div>
          )}
          <Button size='sm' onClick={addRow}>
            + Add Row
          </Button>
        </div>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-muted/50 text-xs text-muted-foreground uppercase tracking-wide'>
              <TableRow>
                <TableHead className='px-3 py-2 text-left font-medium border-b'>
                  Module
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b'>
                  Description
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b whitespace-nowrap'>
                  From (dd-mmm-yy)
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b whitespace-nowrap'>
                  To (dd-mmm-yy)
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b'>
                  Status
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b'>
                  Link
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b whitespace-nowrap'>
                  Created Date
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b whitespace-nowrap'>
                  Modified Date
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b whitespace-nowrap'>
                  Created By
                </TableHead>
                <TableHead className='px-3 py-2 text-left font-medium border-b whitespace-nowrap'>
                  Modified By
                </TableHead>
                <TableHead className='px-3 py-2 border-b w-16' />
              </TableRow>
            </TableHeader>
          </Table>
          <TableBody>
            {rows.map((row, ri) => (
              <TableRow
                key={ri}
                className='border-b last:border-0 hover:bg-muted/30 group'
              >
                <TableCell className='px-3 py-2'>
                  <SelectField
                    isEdit={isEdit}
                    options={MODULE_OPTIONS}
                    value={row.module}
                    onChange={(e: string) => updateCell(ri, 'module', e)}
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  {isEdit ? (
                    <Input
                      value={row.description}
                      onChange={(e) =>
                        updateCell(ri, 'description', e.target.value)
                      }
                      className='bg-transparent border-none outline-none w-full min-w-[120px] text-sm'
                      placeholder='—'
                    />
                  ) : (
                    <span>{row.description || '—'}</span>
                  )}
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <input
                    value={row.from}
                    onChange={(e) => updateCell(ri, 'from', e.target.value)}
                    className='bg-transparent border-none outline-none w-full min-w-[90px] text-sm'
                    placeholder='—'
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <input
                    value={row.to}
                    onChange={(e) => updateCell(ri, 'to', e.target.value)}
                    className='bg-transparent border-none outline-none w-full min-w-[90px] text-sm'
                    placeholder='—'
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <SelectField
                    isEdit={isEdit}
                    options={STATUS_OPTIONS}
                    value={row.status}
                    onChange={(e: string) => updateCell(ri, 'status', e)}
                  />
                </TableCell>
                <TableCell className='px-3 py-2 max-w-[140px]'>
                  {row.link ? (
                    <a
                      href={row.link}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-primary text-xs truncate block hover:underline'
                      title={row.link}
                    >
                      {row.link.replace('https://', '')}
                    </a>
                  ) : (
                    <input
                      value={row.link}
                      onChange={(e) => updateCell(ri, 'link', e.target.value)}
                      className='bg-transparent border-none outline-none w-full text-sm'
                      placeholder='—'
                    />
                  )}
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <input
                    value={row.createdDate}
                    onChange={(e) =>
                      updateCell(ri, 'createdDate', e.target.value)
                    }
                    className='bg-transparent border-none outline-none w-full min-w-20 text-sm'
                    placeholder='—'
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <input
                    value={row.modifiedDate}
                    onChange={(e) =>
                      updateCell(ri, 'modifiedDate', e.target.value)
                    }
                    className='bg-transparent border-none outline-none w-full min-w-20 text-sm'
                    placeholder='—'
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <input
                    value={row.createdBy}
                    onChange={(e) =>
                      updateCell(ri, 'createdBy', e.target.value)
                    }
                    className='bg-transparent border-none outline-none w-full min-w-[100px] text-sm'
                    placeholder='—'
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <input
                    value={row.modifiedBy}
                    onChange={(e) =>
                      updateCell(ri, 'modifiedBy', e.target.value)
                    }
                    className='bg-transparent border-none outline-none w-full min-w-[100px] text-sm'
                    placeholder='—'
                  />
                </TableCell>
                <TableCell className='px-3 py-2'>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive text-xs h-6 px-2'
                    onClick={() => deleteRow(ri)}
                  >
                    Remove
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </div>
      </CardContent>
    </>
  )
}
