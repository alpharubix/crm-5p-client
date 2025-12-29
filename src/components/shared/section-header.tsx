export default function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-muted/50 py-2 px-4 border-y font-bold text-center text-xs uppercase tracking-widest">
      {title}
    </div>
  )
}
