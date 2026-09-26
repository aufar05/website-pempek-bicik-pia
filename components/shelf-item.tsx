'use client'

import { Plus, ShoppingBasket } from 'lucide-react'
import { Product } from '@/lib/store'
import { formatPrice, getStockStatus } from '@/lib/products'
import { ProductImage } from './product-image'
import { StockStatus } from './stock-status'

interface ItemProps {
  product: Product
  onOpen: () => void
  onAdd: () => void
}

/** Kartu produk berfoto (dipakai untuk pempek) */
export function ShelfItem({ product, onOpen, onAdd }: ItemProps) {
  const status = getStockStatus(product)
  const soldOut = status.level === 'out'

  return (
    <article className="group flex w-[78%] shrink-0 snap-start flex-col sm:w-[46%] md:w-auto">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Lihat detail ${product.name}`}
        className="relative block aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-sagu ring-1 ring-songket/10"
      >
        <ProductImage
          product={product}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          fallbackClassName="object-contain p-10"
        />
        {status.level !== 'available' && (
          <span className="absolute left-4 top-4 rounded-full bg-songket px-3 py-1 text-xs font-semibold text-sagu">
            {soldOut ? 'Habis' : 'Stok terbatas'}
          </span>
        )}
      </button>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-display text-[2rem] leading-none text-songket">
          {product.shortName ?? product.name}
        </h3>
        <p className="whitespace-nowrap font-display text-xl text-cuko">{formatPrice(product.price)}</p>
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">
        {product.name}, per {product.unit}
      </p>
      <StockStatus product={product} className="mt-2 text-sm text-foreground/80" />

      <button
        type="button"
        onClick={onAdd}
        disabled={soldOut}
        className="mt-4 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-songket px-5 text-sm font-semibold text-sagu transition-colors hover:bg-songket-deep disabled:cursor-not-allowed disabled:opacity-45"
      >
        <ShoppingBasket className="size-4" aria-hidden />
        {soldOut ? 'Stok habis' : 'Masukkan ke keranjang'}
      </button>
    </article>
  )
}

/** Baris papan menu warung (dipakai untuk tekwan & kerupuk) */
export function MenuRow({ product, onOpen, onAdd }: ItemProps) {
  const soldOut = product.stock === 0

  return (
    <li className="flex items-start gap-3 border-b border-kemplang/10 py-5 last:border-b-0">
      <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-left">
        {/* HP: nama lalu harga di bawahnya. Tablet ke atas: nama ...... harga */}
        <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
          <span className="font-display text-xl leading-tight text-sagu md:text-2xl">{product.name}</span>
          <span aria-hidden className="menu-leader hidden text-emas sm:block" />
          <span className="mt-1 whitespace-nowrap font-display text-lg text-emas sm:mt-0 md:text-xl">
            {formatPrice(product.price)}
          </span>
        </span>
        <span className="mt-1.5 block pr-2 text-sm/relaxed text-kemplang/70">
          {product.description}
        </span>
        <StockStatus product={product} tone="dark" className="mt-2 flex text-sm text-kemplang/85" />
      </button>
      <button
        type="button"
        onClick={onAdd}
        disabled={soldOut}
        aria-label={`Masukkan ${product.name} ke keranjang`}
        className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-full border border-emas/50 text-emas transition-colors hover:bg-emas hover:text-cuko disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="size-5" aria-hidden />
      </button>
    </li>
  )
}
