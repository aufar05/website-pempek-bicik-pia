'use client'

import { useEffect, useState } from 'react'
import { ShoppingBasket } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SiteHeaderProps {
  /** Tautan navigasi, dibentuk dari kategori yang ada di data */
  links: { href: string; label: string }[]
  totalItems: number
  onOpenBasket: () => void
}

export function SiteHeader({ links, totalItems, onOpenBasket }: SiteHeaderProps) {
  // Transparan di atas hero gelap, jadi krem solid setelah hero lewat
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('beranda')
    if (!hero) {
      setSolid(true)
      return
    }
    // Margin memperhitungkan lengkungan krem di dasar hero (± 110px),
    // supaya header sudah solid sebelum teksnya berada di atas latar krem.
    const io = new IntersectionObserver(([entry]) => setSolid(!entry.isIntersecting), {
      rootMargin: '-180px 0px 0px 0px',
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,color,box-shadow] duration-300',
        solid
          ? 'bg-kemplang/95 text-songket shadow-[0_1px_0_rgba(94,19,32,0.14)] backdrop-blur-md'
          : 'bg-transparent text-sagu',
      )}
    >
      <div className="mx-auto flex h-[var(--header-h)] max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#beranda" className="font-display text-[1.6rem] leading-none tracking-tight">
          Warung Bicik Pia
        </a>

        <nav aria-label="Menu utama" className="hidden md:block">
          <ul className="flex items-center gap-8 text-sm font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="opacity-75 transition-opacity hover:opacity-100">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={onOpenBasket}
          aria-label={`Buka keranjang, ${totalItems} item`}
          className={cn(
            'relative inline-flex h-11 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors md:px-4',
            solid ? 'border-songket/25 hover:bg-songket/5' : 'border-sagu/30 hover:bg-sagu/10',
          )}
        >
          <ShoppingBasket className="size-5" aria-hidden />
          <span className="hidden md:inline">Keranjang</span>
          {totalItems > 0 && (
            <span
              key={totalItems}
              className="anim-bump grid h-6 min-w-6 place-items-center rounded-full bg-emas px-1.5 text-xs font-bold text-cuko"
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
