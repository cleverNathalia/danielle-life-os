interface ProgressBarProps {
  pct: number
  colorStart: string
  colorEnd: string
  height?: number
}

export default function ProgressBar({ pct, colorStart, colorEnd, height = 6 }: ProgressBarProps) {
  return (
    <div className="w-full rounded-full overflow-hidden bg-white/5" style={{ height }}>
      <div
        className="h-full rounded-full transition-all duration-1000"
        style={{
          width: `${Math.min(100, pct)}%`,
          background: `linear-gradient(90deg, ${colorStart}, ${colorEnd})`,
          boxShadow: `0 0 8px ${colorEnd}`,
        }}
      />
    </div>
  )
}
