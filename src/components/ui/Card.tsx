import type { ReactNode } from 'react'

type AccentColor = 'cyan' | 'pink' | 'green' | 'orange' | 'purple' | 'default'

interface CardProps {
  children: ReactNode
  accent?: AccentColor
  className?: string
  span?: number
}

const accentMap: Record<AccentColor, string> = {
  cyan:    '#00e5ff',
  pink:    '#ff2d78',
  green:   '#00ff9d',
  orange:  '#ff9100',
  purple:  '#9d4edd',
  default: '#9d4edd',
}

export default function Card({ children, accent = 'default', className = '', span }: CardProps) {
  return (
    <div
      className={`relative rounded-2xl border border-purple-900/25 bg-[#0f0f2a] p-5 overflow-hidden ${className}`}
      style={{ gridColumn: span ? `span ${span}` : undefined }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${accentMap[accent]}, transparent)` }}
      />
      {children}
    </div>
  )
}
