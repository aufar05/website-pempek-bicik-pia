'use client'

import { useEffect, useState } from 'react'
import { ShoppingBasket } from 'lucide-react'
import { Product } from '@/lib/store'
import { formatPrice } from '@/lib/products'
import { cn } from '@/lib/utils'
import { RingText } from './ring-text'
import { StockStatus } from './stock-status'

interface HeroProps {
  pempek: Product[]
  onAdd: (product: Product, quantity?: number) => void
  onOpen: (product: Product) => void
}

export function Hero({ pempek, onAdd, onOpen }: HeroProps) {
  // Mulai dari tenggiri: piringnya paling berwarna (ada adaan goreng)
  const [activeId, setActiveId] = useState(pempek[pempek.length - 1]?.id)
  const [hasSwapped, setHasSwapped] = useState(false)
  const active = pempek.find((p) => p.id === activeId) ?? pempek[0]

  // Panaskan cache foto piring supaya pergantian ikan tidak berkedip
  useEffect(() => {
    pempek.forEach((p) => {
      if (p.plate) {
        const img = new Image()
        img.src = p.plate
      }
    })
  }, [pempek])

  if (!active) return null

  const fish = (active.shortName ?? active.name).toUpperCase()
  const ring = `PEMPEK IKAN ${fish} ✦ ISI 10 PCS ✦ RASO ASLI PALEMBANG ✦ `
  const [rp, amount] = splitPrice(active.price)
  const soldOut = active.stock === 0

  const choose = (id: string) => {
    if (id === activeId) return
    setHasSwapped(true)
    setActiveId(id)
  }

  return (
    <section
      id="beranda"
      aria-label="Pempek pilihan"
      className="relative isolate overflow-hidden bg-cuko text-kemplang"
    >
      {/* Anyaman songket, memudar ke arah piring */}
      <div
        aria-hidden
        className="songket-weave absolute inset-0 -z-10 opacity-[0.09] [mask-image:radial-gradient(120%_90%_at_70%_45%,transparent_28%,black_75%)]"
      />

      <div
        className={cn(
          'mx-auto grid max-w-6xl items-center gap-x-10 px-5 pb-28 pt-[calc(var(--header-h)+1.75rem)]',
          "[grid-template-areas:'title'_'plate'_'controls']",
          "sm:pb-36 lg:min-h-[min(100svh,58rem)] lg:grid-cols-[1fr_1.08fr] lg:pb-40 lg:pt-[calc(var(--header-h)+2rem)] lg:[grid-template-areas:'title_plate'_'controls_plate']",
        )}
      >
        <h1 className="anim-rise text-balance font-display text-[2.55rem] leading-[1.02] text-sagu [grid-area:title] sm:text-6xl lg:self-end lg:text-[4rem] xl:text-[4.4rem]">
          Raso asli Palembang, tinggal goreng di rumah.
        </h1>

        {/* Piring + teks melingkar */}
        <div className="relative mx-auto my-5 aspect-square w-[min(88vw,24rem)] [grid-area:plate] sm:my-10 sm:w-[min(78vw,32rem)] lg:my-0 lg:w-full lg:max-w-[36rem]">
          <div
            aria-hidden
            className="absolute inset-[6%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(200,160,79,0.28),rgba(200,160,79,0)_68%)] blur-2xl"
          />

          <div className="anim-ring-enter absolute inset-0 text-emas">
            <div className="anim-ring-spin h-full w-full">
              <RingText text={ring} />
            </div>
          </div>

          {/* Garis orbit tipis di dalam cincin */}
          <div aria-hidden className="absolute inset-[9.5%] rounded-full border border-emas/25" />

          <div className="absolute inset-[12%] drop-shadow-[0_28px_40px_rgba(0,0,0,0.6)]">
            {active.plate && (
              <img
                key={active.id}
                src={active.plate}
                alt={`Piring berisi ${active.name}: lenjer, adaan, dan kulit`}
                width={900}
                height={900}
                fetchPriority="high"
                className={cn(
                  'h-full w-full select-none rounded-full',
                  hasSwapped ? 'anim-plate-swap' : 'anim-plate-enter',
                )}
                draggable={false}
              />
            )}
          </div>

          {/* Stempel harga */}
          <div
            key={`stamp-${active.id}`}
            className={cn(
              'anim-stamp absolute bottom-[3%] right-[-1%] grid aspect-square w-[27%] min-w-[5.5rem] max-w-[8.5rem] -rotate-12 place-items-center rounded-full bg-emas text-cuko shadow-[0_14px_30px_-10px_rgba(0,0,0,0.7)]',
              !hasSwapped && 'anim-stamp-first',
            )}
          >
            <div className="absolute inset-[6%] rounded-full border border-dashed border-cuko/35" />
            <p className="text-center leading-none">
              <span className="block text-[0.7rem] font-semibold md:text-xs">{rp}</span>
              <span className="mt-0.5 block font-display text-[1.35rem] md:text-[1.9rem]">{amount}</span>
              <span className="mt-1 block text-[0.65rem] font-medium md:text-[0.7rem]">isi 10 pcs</span>
            </p>
          </div>
        </div>

        <div className="anim-rise flex flex-col [animation-delay:0.2s] [grid-area:controls] lg:self-start">
          <p className="order-last mt-6 max-w-md text-base/relaxed text-kemplang/75 sm:text-lg/relaxed lg:order-none lg:mt-6">
            Pempek ikan kakap, gabus, dan tenggiri. Simpan di freezer, goreng saat mau makan.
          </p>

          <fieldset className="lg:mt-7">
            <legend className="mb-3 text-sm text-kemplang/65">Pilih ikannya</legend>
            <div className="flex gap-2">
              {pempek.map((p) => {
                const selected = p.id === active.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(p.id)}
                    className={cn(
                      'h-12 flex-1 rounded-full border px-3 font-display text-lg transition-colors md:flex-none md:px-6',
                      selected
                        ? 'border-emas bg-emas text-cuko'
                        : 'border-kemplang/25 text-kemplang hover:border-emas/70 hover:text-sagu',
                    )}
                  >
                    {p.shortName ?? p.name}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <StockStatus
            key={`status-${active.id}`}
            product={active}
            tone="dark"
            className="mt-4 text-sm text-kemplang/80"
          />

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onAdd(active)}
              disabled={soldOut}
              className="inline-flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-emas px-6 text-base font-semibold text-cuko transition-colors hover:bg-emas-soft disabled:cursor-not-allowed disabled:opacity-50 md:flex-none md:px-8"
            >
              <ShoppingBasket className="size-5" aria-hidden />
              {soldOut ? 'Stok habis' : 'Masukkan ke keranjang'}
            </button>
            <button
              type="button"
              onClick={() => onOpen(active)}
              className="h-14 rounded-full border border-kemplang/25 px-5 text-base font-medium text-kemplang transition-colors hover:border-kemplang/70"
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Tepi bawah melengkung, dengan satu benang emas */}
      <svg
        aria-hidden
        className="absolute inset-x-0 bottom-[-1px] h-[64px] w-full md:h-[110px]"
        viewBox="0 0 1440 110"
        preserveAspectRatio="none"
      >
        <path
          d="M0 64 C 260 6, 520 4, 780 50 S 1240 104, 1440 28"
          fill="none"
          stroke="#C8A04F"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          transform="translate(0 -10)"
        />
        <path
          d="M0 64 C 260 6, 520 4, 780 50 S 1240 104, 1440 28 L1440 110 L0 110 Z"
          fill="#F2E6CC"
        />
      </svg>
    </section>
  )
}

/** "Rp 25.000" → ["Rp", "25.000"] */
function splitPrice(price: number): [string, string] {
  const formatted = formatPrice(price).replace(/\u00a0/g, ' ')
  const [rp, ...rest] = formatted.split(' ')
  return [rp, rest.join(' ')]
}
