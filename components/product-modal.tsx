'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, Minus, Plus, ShoppingBasket, X } from 'lucide-react'
import { Product } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import { useDismiss } from '@/lib/use-dismiss'
import { cn } from '@/lib/utils'
import { ProductImage } from './product-image'
import { StockStatus } from './stock-status'

interface ProductModalProps {
  product: Product
  onClose: () => void
  onAdd: (product: Product, quantity: number) => void
}

export function ProductModal({ product, onClose, onAdd }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const images = product.images
  const [selectedImage, setSelectedImage] = useState(images[0])
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => onClose(), [onClose])
  useDismiss(true, close)

  useEffect(() => {
    closeRef.current?.focus()
  }, [])

  const soldOut = product.stock === 0

  const handleAddToCart = () => {
    setIsAdding(true)
    onAdd(product, quantity)
    setTimeout(() => {
      setIsAdding(false)
      onClose()
    }, 600)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-cuko/65 backdrop-blur-[2px] animate-in fade-in duration-200 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="produk-title"
        onClick={(e) => e.stopPropagation()}
        className="modal-in relative max-h-[92svh] w-full overflow-y-auto rounded-t-[2rem] bg-sagu shadow-2xl md:max-w-4xl md:rounded-[2rem]"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Tutup"
          className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-sagu/90 shadow-md backdrop-blur transition-colors hover:bg-sagu"
        >
          <X className="size-5" aria-hidden />
        </button>

        <div className="grid md:grid-cols-[1fr_1.1fr]">
          {/* Galeri */}
          <div className="bg-kemplang p-4 md:p-6">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-sagu md:aspect-[3/4]">
              <ProductImage
                key={selectedImage}
                product={product}
                src={selectedImage}
                loading="eager"
                className="h-full w-full object-cover animate-in fade-in duration-300"
                fallbackClassName="object-contain p-10"
              />
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    aria-label={`Foto ${i + 1}`}
                    aria-pressed={selectedImage === img}
                    className={cn(
                      'size-16 overflow-hidden rounded-xl ring-2 transition md:size-20',
                      selectedImage === img ? 'ring-songket' : 'ring-transparent opacity-70 hover:opacity-100',
                    )}
                  >
                    <ProductImage product={product} src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-10">
            <p className="text-sm font-medium text-songket/70">{product.category}</p>
            <h2 id="produk-title" className="mt-1 pr-10 font-display text-[2.1rem] leading-[1.05] text-songket md:text-[2.6rem]">
              {product.name}
            </h2>
            <p className="mt-4 text-[0.95rem]/relaxed text-foreground/75">{product.description}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-4xl text-cuko">{formatPrice(product.price)}</span>
              <span className="text-muted-foreground">/ {product.unit}</span>
            </div>

            <StockStatus product={product} className="mt-2 flex text-sm text-muted-foreground" />

            <div className="mt-8 flex items-center justify-between gap-4 border-y border-border py-4">
              <div className="inline-flex items-center rounded-full border border-border bg-card">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Kurangi jumlah"
                  className="grid size-11 place-items-center rounded-full hover:bg-muted"
                >
                  <Minus className="size-4" aria-hidden />
                </button>
                <span className="w-10 text-center text-lg font-bold tabular-nums" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Tambah jumlah"
                  className="grid size-11 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
                >
                  <Plus className="size-4" aria-hidden />
                </button>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-display text-2xl text-songket">{formatPrice(product.price * quantity)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={soldOut || isAdding}
              className={cn(
                'mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-full text-base font-semibold transition-colors disabled:cursor-not-allowed',
                isAdding ? 'bg-daun text-sagu' : 'bg-songket text-sagu hover:bg-songket-deep disabled:opacity-45',
              )}
            >
              {isAdding ? (
                <>
                  <Check className="size-5" aria-hidden /> Masuk keranjang
                </>
              ) : (
                <>
                  <ShoppingBasket className="size-5" aria-hidden />
                  {soldOut ? 'Stok habis' : 'Masukkan ke keranjang'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
