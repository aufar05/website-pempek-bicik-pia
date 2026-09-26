import type { Product } from './store'

/*
 * Logika katalog di satu tempat. Datanya sendiri (nama, kategori, harga, stok,
 * satuan, stok minimum, status aktif) berasal dari Firestore; lihat lib/catalog-source.ts.
 */

/** Kategori yang produknya tampil sebagai kartu foto + hero di atas */
export const FEATURED_CATEGORY = 'Pempek'

/** Urutan tampil kategori yang sudah dikenal; kategori baru dari Firestore ikut di belakang (A-Z) */
const CATEGORY_ORDER = ['Pempek', 'Tekwan', 'Kerupuk']

/** Ilustrasi per kategori, juga dipakai sebagai cadangan kalau foto produk belum ada */
export const categoryIcon: Record<string, string> = {
  Pempek: '/icons/iconPempek.webp',
  Tekwan: '/icons/iconTekwan.webp',
  Kerupuk: '/icons/iconKerupuk.webp',
}

export function getCategoryIcon(category: string) {
  return categoryIcon[category] ?? '/placeholder.svg'
}

function categoryRank(category: string) {
  const i = CATEGORY_ORDER.indexOf(category)
  return i === -1 ? CATEGORY_ORDER.length : i
}

export function compareCategories(a: string, b: string) {
  return categoryRank(a) - categoryRank(b) || a.localeCompare(b, 'id')
}

/** Kategori yang benar-benar ada di data, dalam urutan tampil */
export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))].sort(compareCategories)
}

export function getProductsByCategory(products: Product[], category: string) {
  return products.filter((p) => p.category === category)
}

export type StockLevel = 'available' | 'low' | 'out'

export interface StockStatus {
  level: StockLevel
  label: string
}

/**
 * stock == 0               -> Habis
 * stock <= minimumStock    -> Stok terbatas
 * stock > 0                -> Tersedia
 */
export function getStockStatus(product: Pick<Product, 'stock' | 'minimumStock'>): StockStatus {
  if (product.stock <= 0) return { level: 'out', label: 'Habis' }
  if (product.stock <= product.minimumStock) {
    return { level: 'low', label: `Stok terbatas, sisa ${product.stock}` }
  }
  return { level: 'available', label: `Tersedia, stok ${product.stock}` }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
