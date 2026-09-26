import type { Product } from '@/lib/store'
import { getStockStatus, type StockLevel } from '@/lib/products'
import { cn } from '@/lib/utils'

const dot: Record<'light' | 'dark', Record<StockLevel, string>> = {
  light: { available: 'bg-daun', low: 'bg-emas', out: 'bg-destructive' },
  dark: { available: 'bg-[#7cc49a]', low: 'bg-emas', out: 'bg-[#f08a7e]' },
}

interface StockStatusProps {
  product: Pick<Product, 'stock' | 'minimumStock'>
  /** "dark" untuk latar gelap (hero, papan menu marun) */
  tone?: 'light' | 'dark'
  className?: string
}

/** Status stok dari Firestore: Tersedia / Stok terbatas / Habis */
export function StockStatus({ product, tone = 'light', className }: StockStatusProps) {
  const status = getStockStatus(product)
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span aria-hidden className={cn('size-2 shrink-0 rounded-full', dot[tone][status.level])} />
      {status.label}
    </span>
  )
}
