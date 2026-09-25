'use client'

import { useCallback, useEffect, useRef } from 'react'
import { MessageCircle, Minus, Plus, ShoppingBasket, Trash2, X } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import { whatsappLink } from '@/lib/config'
import { useDismiss } from '@/lib/use-dismiss'
import { ProductImage } from './product-image'

interface FloatingBasketProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hydrated: boolean
}

export function FloatingBasket({ open, onOpenChange, hydrated }: FloatingBasketProps) {
  const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem, clearCart } = useCartStore()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => onOpenChange(false), [onOpenChange])
  useDismiss(open, close)

  useEffect(() => {
    if (open) closeRef.current?.focus()
  }, [open])

  if (!hydrated) return null

  const handleWhatsAppOrder = () => {
    const orderLines = items.map(
      (item) => `- ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`,
    )
    const message = [
      'Halo Kak! Saya mau pesan:',
      '',
      ...orderLines,
      '',
      `*Subtotal: ${formatPrice(totalPrice)}*`,
      '',
      '*Belum termasuk ongkir*',
      '',
      'Mohon dibantu informasi total biaya beserta ongkir ke alamat saya ya Kak.',
    ].join('\n')
    window.open(whatsappLink(message), '_blank')
    clearCart()
    close()
  }

  const goToMenu = () => {
    close()
    document.getElementById('pempek')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Bar bawah (mobile) muncul begitu ada isi keranjang */}
      {totalItems > 0 && !open && (
        <button
          type="button"
          onClick={() => onOpenChange(true)}
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex h-16 items-center justify-between rounded-full bg-cuko pl-5 pr-2 text-kemplang shadow-[0_18px_40px_-12px_rgba(35,19,16,0.75)] ring-1 ring-emas/30 animate-in fade-in slide-in-from-bottom-6 duration-300 md:hidden"
        >
          <span className="flex items-baseline gap-3">
            <span className="text-sm text-kemplang/70">{totalItems} item</span>
            <span className="font-display text-xl text-sagu">{formatPrice(totalPrice)}</span>
          </span>
          <span className="inline-flex h-12 items-center gap-2 rounded-full bg-emas px-5 text-sm font-semibold text-cuko">
            <ShoppingBasket className="size-4" aria-hidden />
            Lihat keranjang
          </span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-cuko/60 backdrop-blur-[2px] animate-in fade-in duration-200" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="keranjang-title"
            onClick={(e) => e.stopPropagation()}
            className="sheet-in absolute inset-x-0 bottom-0 flex max-h-[88svh] flex-col overflow-hidden rounded-t-[2rem] bg-sagu shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[27rem] md:rounded-l-[2rem] md:rounded-tr-none"
          >
            <div aria-hidden className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-songket/15 md:hidden" />

            <div className="flex items-center justify-between px-6 pb-4 pt-4 md:pt-7">
              <div>
                <h2 id="keranjang-title" className="font-display text-3xl leading-none text-songket">
                  Keranjang
                </h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{totalItems} item</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Tutup keranjang"
                className="grid size-11 place-items-center rounded-full bg-kemplang transition-colors hover:bg-secondary"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="py-14 text-center">
                  <p className="font-display text-2xl text-songket">Keranjang masih kosong</p>
                  <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
                    Pilih pempek, tekwan, atau kerupuk dulu, nanti muncul di sini.
                  </p>
                  <button
                    type="button"
                    onClick={goToMenu}
                    className="mt-6 h-12 rounded-full bg-songket px-6 text-sm font-semibold text-sagu hover:bg-songket-deep"
                  >
                    Lihat menu
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {items.map((item) => (
                    <li key={item.product.id} className="flex gap-4 py-4">
                      <div className="size-20 shrink-0 overflow-hidden rounded-2xl bg-kemplang">
                        <ProductImage
                          product={item.product}
                          alt=""
                          className="h-full w-full object-cover"
                          fallbackClassName="object-contain p-2"
                        />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold leading-snug text-foreground">{item.product.name}</h3>
                          <button
                            type="button"
                            onClick={() => removeItem(item.product.id)}
                            aria-label={`Hapus ${item.product.name}`}
                            className="-mr-2 -mt-1 grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" aria-hidden />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                          <div className="inline-flex items-center rounded-full border border-border bg-card">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Kurangi"
                              className="grid size-9 place-items-center rounded-full hover:bg-muted"
                            >
                              <Minus className="size-4" aria-hidden />
                            </button>
                            <span className="w-7 text-center text-sm font-bold tabular-nums">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              aria-label="Tambah"
                              className="grid size-9 place-items-center rounded-full hover:bg-muted disabled:opacity-40"
                            >
                              <Plus className="size-4" aria-hidden />
                            </button>
                          </div>
                          <span className="font-display text-lg text-cuko">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-3 border-t border-border bg-kemplang/60 px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-3xl text-songket">{formatPrice(totalPrice)}</span>
                </div>
                <p className="text-xs/relaxed text-muted-foreground">
                  Ongkir dihitung sesuai alamat tujuan dan dikonfirmasi lewat WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-daun text-base font-semibold text-sagu transition-opacity hover:opacity-90"
                >
                  <MessageCircle className="size-5" aria-hidden />
                  Kirim pesanan via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-1.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
                >
                  Kosongkan keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
