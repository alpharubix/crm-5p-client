import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface SearchableSelectProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState(value || '')
  const [isOpen, setIsOpen] = useState(false)

  // Sync internal search state if the value is updated externally (e.g., form reset)
  useEffect(() => {
    setSearchTerm(value || '')
  }, [value])

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className={`relative ${className}`}>
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value)
          setIsOpen(true)
          onChange('') // Clear the actual value until a valid option is selected
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className='absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto'>
          {filteredOptions.map((option) => (
            <div
              key={option}
              className='p-2 hover:bg-muted cursor-pointer text-sm'
              onMouseDown={(e) => {
                e.preventDefault() // Prevent blur from firing before click
                onChange(option)
                setSearchTerm(option)
                setIsOpen(false)
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
