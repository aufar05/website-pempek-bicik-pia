import type { Product } from './store'
import { compareCategories } from './products'
import { getProductImages, productVisuals } from './product-visuals'
import { queryWhereTrue, type FirestoreDocument } from './firestore-rest'
import seed from '../data/seed-products.json'

/**
 * SUMBER DATA PRODUK WEBSITE (dipanggil di server, lihat app/page.tsx).
 *
 * - Firebase sudah dikonfigurasi (FIREBASE_PROJECT_ID ada): baca Firestore.
 *   Kalau Firestore gagal, error dilempar supaya Next.js tetap menyajikan
 *   halaman terakhir yang berhasil (tidak pernah menampilkan harga cadangan
 *   yang bisa jadi sudah basi).
 * - Firebase BELUM dikonfigurasi: pakai data/seed-products.json supaya
 *   website tetap jalan selama masa transisi.
 */

export type CatalogSource = 'firestore' | 'seed'

export interface Catalog {
  products: Product[]
  source: CatalogSource
}

function toInt(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? Math.trunc(value) : null
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() !== '' ? value : null
}

/** Ubah data mentah (Firestore/seed) jadi Product untuk UI; null kalau datanya tidak valid */
function toProduct(id: string, d: Record<string, unknown>, stockOverride?: number): Product | null {
  const name = str(d.name)
  const category = str(d.category)
  const price = toInt(d.price)
  const stock = stockOverride ?? toInt(d.stock)
  if (!name || !category || price === null || price < 0 || stock === null) {
    console.warn(`[katalog] Produk "${id}" dilewati: field wajib tidak lengkap/tidak valid.`)
    return null
  }
  const visual = productVisuals[id]
  return {
    id,
    name,
    category,
    price,
    stock: Math.max(0, stock),
    minimumStock: Math.max(0, toInt(d.minimumStock) ?? 0),
    unit: str(d.unit) ?? 'pcs',
    description: str(d.description) ?? '',
    images: getProductImages(id),
    shortName: visual?.shortName,
    plate: visual?.plate,
  }
}

function sortProducts(products: Product[]) {
  return products.sort(
    (a, b) => compareCategories(a.category, b.category) || a.price - b.price || a.name.localeCompare(b.name, 'id'),
  )
}

export async function getCatalog(): Promise<Catalog> {
  const projectId = process.env.FIREBASE_PROJECT_ID

  if (!projectId) {
    console.warn(
      '[katalog] FIREBASE_PROJECT_ID belum diisi: memakai data/seed-products.json (data awal, bukan data live).',
    )
    const products = seed.products
      .map((p) => toProduct(p.id, p as Record<string, unknown>, p.legacyWebsiteStock))
      .filter((p): p is Product => p !== null)
    return { products: sortProducts(products), source: 'seed' }
  }

  const docs: FirestoreDocument[] = await queryWhereTrue(
    {
      projectId,
      apiKey: process.env.FIREBASE_API_KEY,
      emulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
    },
    'products',
    'isActive',
  )

  const products = docs
    .map((doc) => toProduct(doc.id, doc.data))
    .filter((p): p is Product => p !== null)

  return { products: sortProducts(products), source: 'firestore' }
}
