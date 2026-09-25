'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Check, MessageCircle } from 'lucide-react'
import { categoryIcon, getProductsByCategory } from '@/lib/products'
import { Product, useCartStore } from '@/lib/store'
import { WHATSAPP_DISPLAY, whatsappLink } from '@/lib/config'
import { SiteHeader } from './site-header'
import { Hero } from './hero'
import { MenuRow, ShelfItem } from './shelf-item'
import { ProductModal } from './product-modal'
import { FloatingBasket } from './floating-basket'

const steps = [
  {
    title: 'Pilih menu',
    body: 'Tap “Masukkan ke keranjang” di menu yang kamu mau. Jumlahnya bisa diatur nanti.',
  },
  {
    title: 'Buka keranjang',
    body: 'Cek pesananmu, lalu tap “Kirim pesanan via WhatsApp”.',
  },
  {
    title: 'Kirim chat',
    body: 'Daftar pesanan sudah tersusun di WhatsApp. Kirim, lalu sertakan alamatmu.',
  },
  {
    title: 'Konfirmasi ongkir',
    body: 'Bicik Pia membalas dengan total dan ongkir ke alamatmu.',
  },
]

export function WarungScene() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [basketOpen, setBasketOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const addItem = useCartStore((s) => s.addItem)
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))

  // Keranjang disimpan di localStorage (skipHydration), muat setelah mount
  useEffect(() => {
    useCartStore.persist.rehydrate()
    setHydrated(true)
  }, [])

  const handleAdd = useCallback(
    (product: Product, quantity = 1) => {
      for (let i = 0; i < quantity; i++) addItem(product)
      clearTimeout(toastTimer.current)
      setToast({
        id: Date.now(),
        text: `${quantity > 1 ? `${quantity} × ` : ''}${product.name} masuk keranjang`,
      })
      toastTimer.current = setTimeout(() => setToast(null), 2400)
    },
    [addItem],
  )

  const closeModal = useCallback(() => setSelectedProduct(null), [])

  const pempek = getProductsByCategory('Pempek')

  return (
    <div className="min-h-screen bg-kemplang">
      <SiteHeader totalItems={hydrated ? totalItems : 0} onOpenBasket={() => setBasketOpen(true)} />

      <main>
        <Hero pempek={pempek} onAdd={handleAdd} onOpen={setSelectedProduct} />

        {/* Pempek */}
        <section id="pempek" className="relative bg-kemplang pb-20 pt-10 md:pb-28 md:pt-16">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
              <h2 className="font-display text-[2.75rem] leading-none text-songket md:text-7xl">Pempek frozen</h2>
              <p className="max-w-md text-base/relaxed text-foreground/75 md:text-right">
                Satu paket isi 10: kapal selam mini, lenjer, adaan, dan kulit. Disajikan dengan cuko khas
                Palembang yang gurih, manis, dan pedas.
              </p>
            </div>

            <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-14 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
              {pempek.map((product) => (
                <ShelfItem
                  key={product.id}
                  product={product}
                  onOpen={() => setSelectedProduct(product)}
                  onAdd={() => handleAdd(product)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Tekwan & kerupuk: papan menu di atas kain songket */}
        <section id="tekwan-kerupuk" className="relative bg-songket text-kemplang">
          <div aria-hidden className="pucuk-rebung" />
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 md:pb-28 md:pt-20">
            <h2 className="font-display text-[2.75rem] leading-none text-sagu md:text-7xl">Tekwan dan kerupuk</h2>
            <p className="mt-4 max-w-md text-base/relaxed text-kemplang/75">
              Kuah hangat dan yang renyah, teman makan pempek.
            </p>

            <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-2 lg:gap-16">
              {['Tekwan', 'Kerupuk'].map((category) => (
                <div key={category}>
                  <div className="flex items-center gap-4">
                    <img
                      src={categoryIcon[category]}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      className="size-20 rounded-full ring-2 ring-emas/40 md:size-24"
                    />
                    <h3 className="font-display text-4xl text-emas">{category}</h3>
                  </div>
                  <ul className="mt-4">
                    {getProductsByCategory(category).map((product) => (
                      <MenuRow
                        key={product.id}
                        product={product}
                        onOpen={() => setSelectedProduct(product)}
                        onAdd={() => handleAdd(product)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cara pesan */}
        <section id="cara-pesan" className="relative isolate overflow-hidden bg-cuko text-kemplang">
          <div
            aria-hidden
            className="songket-weave absolute inset-0 -z-10 opacity-[0.05] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          />
          <div className="mx-auto max-w-6xl px-5 py-20 md:py-28">
            <h2 className="font-display text-[2.75rem] leading-none text-sagu md:text-7xl">Cara pesan</h2>
            <p className="mt-4 max-w-md text-base/relaxed text-kemplang/75">
              Semua pesanan lewat WhatsApp. Ongkir dihitung sesuai alamat tujuan.
            </p>

            <ol className="mt-10 grid gap-7 sm:grid-cols-2 sm:gap-10 md:mt-16 lg:grid-cols-4 lg:gap-8">
              {steps.map((step, i) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[3rem_1fr] gap-x-4 border-t border-emas/30 pt-6 sm:block"
                >
                  <span className="row-span-2 font-display text-5xl leading-none text-emas sm:text-6xl">{i + 1}</span>
                  <h3 className="text-lg font-semibold text-sagu sm:mt-4">{step.title}</h3>
                  <p className="mt-1.5 text-sm/relaxed text-kemplang/70 sm:mt-2">{step.body}</p>
                </li>
              ))}
            </ol>

            <a
              href={whatsappLink('Halo Bicik Pia, saya mau tanya soal pesanan.')}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-14 inline-flex h-14 items-center gap-2 rounded-full border border-emas/60 px-7 text-base font-semibold text-emas transition-colors hover:bg-emas hover:text-cuko"
            >
              <MessageCircle className="size-5" aria-hidden />
              Tanya dulu lewat WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-cuko-deep text-kemplang/65">
        <div aria-hidden className="pucuk-rebung opacity-50" />
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 pb-28 pt-10 md:flex-row md:items-end md:justify-between md:pb-12">
          <div>
            <p className="font-display text-3xl text-sagu">Warung Bicik Pia</p>
            <p className="mt-1 text-sm">Cita rasa khas wong kito.</p>
          </div>
          <div className="space-y-1 text-sm md:text-right">
            <a
              href={whatsappLink('Halo Bicik Pia!')}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-kemplang/85 underline-offset-4 hover:underline"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <p>© {new Date().getFullYear()} Warung Bicik Pia</p>
          </div>
        </div>
      </footer>

      {/* Notifikasi kecil setelah menambah ke keranjang */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-[calc(var(--header-h)+0.75rem)] z-50 flex justify-center px-4">
        {toast && (
          <p
            key={toast.id}
            className="flex items-center gap-2 rounded-full bg-cuko px-4 py-2.5 text-sm text-kemplang shadow-[0_12px_30px_-10px_rgba(35,19,16,0.7)] ring-1 ring-emas/30 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <Check className="size-4 text-emas" aria-hidden />
            {toast.text}
          </p>
        )}
      </div>

      <FloatingBasket open={basketOpen} onOpenChange={setBasketOpen} hydrated={hydrated} />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} onAdd={handleAdd} />
      )}
    </div>
  )
}
