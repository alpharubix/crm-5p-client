import React from 'react'

interface HighlightedTextProps {
  text: string | null | undefined
  highlight: string | null | undefined
  className?: string
}

export default function HighlightedText({
  text,
  highlight,
  className = 'bg-yellow-200 text-black rounded-sm px-0.5',
}: HighlightedTextProps) {
  if (!text) return <span className='text-muted-foreground'>—</span>
  if (!highlight || highlight.trim() === '') return <span>{text}</span>

  const regex = new RegExp(
    `(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  )
  const parts = text.split(regex)

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className={className}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </span>
  )
}
