'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface RingTextProps {
  /** Teks yang dilingkarkan. Karakter ✦ digambar sebagai belah ketupat songket. */
  text: string
  /** Jari-jari baseline teks di viewBox 600x600 */
  radius?: number
  fontSize?: number
  className?: string
}

const SIZE = 600
const C = SIZE / 2
const DIAMOND = '✦'

/**
 * Teks melingkar penuh 360°. Tiap huruf diposisikan satu per satu berdasarkan
 * lebar hurufnya (diukur setelah font dimuat), jadi rapat di semua browser
 * tanpa bergantung pada dukungan textPath/textLength.
 */
export function RingText({ text, radius = 262, fontSize = 34, className }: RingTextProps) {
  const chars = useMemo(() => Array.from(text), [text])
  const uniform = useMemo(() => chars.map((_, i) => (i / chars.length) * 360), [chars])
  const [angles, setAngles] = useState<number[]>(uniform)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    setAngles(uniform)
    let cancelled = false

    const measure = () => {
      const svg = svgRef.current
      const ctx = document.createElement('canvas').getContext('2d')
      if (!svg || !ctx || cancelled) return
      ctx.font = `${fontSize}px ${getComputedStyle(svg).fontFamily}`
      const widths = chars.map((ch) =>
        ch === DIAMOND ? fontSize * 0.55 : ctx.measureText(ch).width,
      )
      const circumference = 2 * Math.PI * radius
      const total = widths.reduce((a, b) => a + b, 0)
      const gap = Math.max(0, (circumference - total) / chars.length)
      let acc = 0
      const next = widths.map((w) => {
        const center = acc + w / 2
        acc += w + gap
        return (center / circumference) * 360
      })
      setAngles(next)
    }

    const svg = svgRef.current
    const family = svg ? getComputedStyle(svg).fontFamily : ''
    if (document.fonts && family) {
      document.fonts.load(`${fontSize}px ${family}`).then(measure, measure)
    } else {
      measure()
    }
    return () => {
      cancelled = true
    }
  }, [chars, uniform, radius, fontSize])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={cn('font-display h-full w-full overflow-visible', className)}
      aria-hidden="true"
    >
      {chars.map((ch, i) => {
        const transform = `rotate(${angles[i] ?? 0} ${C} ${C})`
        if (ch === DIAMOND) {
          const s = fontSize * 0.2
          const y = C - radius - fontSize * 0.33
          return (
            <path
              key={i}
              d={`M${C} ${y - s * 1.4} L${C + s} ${y} L${C} ${y + s * 1.4} L${C - s} ${y} Z`}
              fill="currentColor"
              transform={transform}
            />
          )
        }
        return (
          <text
            key={i}
            x={C}
            y={C - radius}
            textAnchor="middle"
            fontSize={fontSize}
            fill="currentColor"
            transform={transform}
          >
            {ch}
          </text>
        )
      })}
    </svg>
  )
}
