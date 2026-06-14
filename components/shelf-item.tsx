'use client'

import { Product } from '@/lib/store'
import { formatPrice } from '@/lib/products'

interface ShelfItemProps {
  product: Product
  onClick: () => void
  variant?: 'jar' | 'plate' | 'bowl' | 'package'
}

export function ShelfItem({ product, onClick, variant = 'plate' }: ShelfItemProps) {
  const categoryEmoji: Record<string, string> = {
    'Pempek': '',
    'Tekwan': '',
    'Kerupuk': '',
    'Cuko': '',
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'jar':
        return 'rounded-t-3xl rounded-b-xl bg-cream/80 jar-glass border-2 border-wood/20'
      case 'bowl':
        return 'rounded-full bg-card border-4 border-primary/20'
      case 'package':
        return 'rounded-xl bg-accent/20 border-2 border-accent/30'
      default:
        return 'rounded-2xl bg-card border-2 border-wood/10'
    }
  }

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 product-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-2xl p-1"
    >
      {/* Product container */}
      <div  className={`relative w-24 h-32 overflow-hidden shadow-md ${getVariantStyles()}`}  >
        {/* Emoji placeholder for product */}
       <img
    src={product.images[0]}
    alt={product.name}
    className="w-full h-full object-contain"
  />
        
        {/* Low stock indicator */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-chart-4 animate-pulse" />
        )}
        
        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 rounded-2xl bg-foreground/40 flex items-center justify-center">
            <span className="text-xs font-bold text-cream bg-destructive px-2 py-0.5 rounded-full">Habis</span>
          </div>
        )}
      </div>

      {/* Price tag */}
      <div className="price-tag px-2 py-1 rounded-md">
        <span className="handwritten text-sm font-bold text-wood-dark">
          {formatPrice(product.price).replace('Rp', 'Rp ')}
        </span>
      </div>

      {/* Product name */}
      <span className="text-xs text-center text-foreground font-medium leading-tight max-w-20 sm:max-w-24">
        {product.name}
      </span>
    </button>
  )
}
