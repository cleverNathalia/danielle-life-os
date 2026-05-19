interface GlowNumberProps {
  value: string | number
  colorStart?: string
  colorEnd?: string
  className?: string
}

export default function GlowNumber({
  value,
  colorStart = '#00e5ff',
  colorEnd = '#9d4edd',
  className = '',
}: GlowNumberProps) {
  return (
    <span
      className={`font-orbitron font-black leading-none ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {value}
    </span>
  )
}
