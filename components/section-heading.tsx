interface SectionHeadingProps {
  id?: string
  title: string
  subtitle?: string
}

export function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-6 print:mb-3">
      <h2 id={id} className="text-2xl font-bold mb-2 print:text-lg text-slate-800 relative">
        <span className="relative z-10">{title}</span>
        <div className="absolute -bottom-1 left-0 w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
      </h2>
      {subtitle && (
        <p className="text-slate-600 text-sm print:hidden">{subtitle}</p>
      )}
    </div>
  )
}
