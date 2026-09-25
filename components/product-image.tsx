'use client'

import { useEffect, useRef, useState } from 'react'
import { Product } from '@/lib/store'
import { categoryIcon } from '@/lib/products'
import { cn } from '@/lib/utils'

interface ProductImageProps {
  product: Product
  src?: string
  className?: string
  /** Kelas tambahan saat gambar cadangan (ilustrasi) yang tampil */
  fallbackClassName?: string
  loading?: 'lazy' | 'eager'
  alt?: string
}

/**
 * Gambar produk dengan cadangan ilustrasi kategori.
 * Foto tekwan & kerupuk belum ada di /public, jadi otomatis pakai ilustrasi.
 * Begitu fotonya ditambahkan ke path yang sama, foto asli langsung tampil.
 */
export function ProductImage({
  product,
  src,
  className,
  fallbackClassName,
  loading = 'lazy',
  alt,
}: ProductImageProps) {
  const primary = src ?? product.images[0]
  const fallback = categoryIcon[product.category] ?? '/placeholder.svg'
  const [failed, setFailed] = useState(!primary)
  const ref = useRef<HTMLImageElement>(null)

  useEffect(() => {
    setFailed(!primary)
  }, [primary])

  // Gambar yang gagal dimuat sebelum React hydrate tidak memicu onError,
  // jadi cek ulang setelah mount.
  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) setFailed(true)
  }, [primary])

  return (
    <img
      ref={ref}
      src={failed ? fallback : primary}
      alt={alt ?? product.name}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn(className, failed && fallbackClassName)}
    />
  )
}
