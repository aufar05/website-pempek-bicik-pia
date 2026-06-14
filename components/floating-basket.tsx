'use client'

import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import { ShoppingBasket, X, Plus, Minus, MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

export function FloatingBasket() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, getTotalItems, getTotalPrice, updateQuantity, removeItem, clearCart } = useCartStore()
  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  const [hydrated, setHydrated] = useState(false)

useEffect(() => {
  useCartStore.persist.rehydrate()
  setHydrated(true)
}, [])

 if (!hydrated) return null

  const handleWhatsAppOrder = () => {
    const phoneNumber = '6281933669374' // Replace with actual number
    const orderLines = items.map(
      (item) => `- ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`
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
  'Mohon dibantu informasi total biaya beserta ongkir ke alamat saya ya Kak.'
].join('\n')
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    clearCart()
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating basket button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform animate-bounce-gentle"
      >
        <ShoppingBasket className="w-7 h-7" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-destructive text-primary-foreground text-sm font-bold flex items-center justify-center animate-pop">
            {totalItems}
          </span>
        )}
      </button>

      {/* Basket drawer */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-foreground/40"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-cream rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-dashed border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBasket className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">Keranjang Belanja</h2>
                  <p className="text-sm text-muted-foreground">{totalItems} item</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4"></div>
                  <p className="text-muted-foreground">Keranjang masih kosong</p>
                  <p className="text-sm text-muted-foreground/70">Yuk pilih makanan enak!</p>
                </div>
              ) : (
                items.map((item) => (
                  <div 
                    key={item.product.id}
                    className="flex items-center gap-3 bg-card rounded-2xl p-3 shadow-sm"
                  >
                    {/* Product emoji */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">{item.product.name}</h3>
                      <p className="text-primary font-bold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-destructive/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/20 transition-colors"
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 bg-card border-t-2 border-dashed border-border space-y-3">
                {/* Total */}
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Subtotal Belanja:
                  </span>

                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                <div className="rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
                  📦 Ongkir dihitung berdasarkan alamat tujuan dan akan dikonfirmasi melalui WhatsApp.
                </div>
              </div>

                {/* Order button */}
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-4 rounded-2xl bg-leaf text-primary-foreground font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-98 transition-all shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  Konfirmasi Pesanan via WhatsApp
                </button>

                {/* Clear cart */}
                <button
                  onClick={clearCart}
                  className="w-full py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
