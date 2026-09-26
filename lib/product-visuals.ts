/**
 * Aset visual produk. Dikelola di frontend (folder public/), TIDAK di Firestore.
 * Kunci = product ID di Firestore.
 *
 * Produk yang tidak ada di sini otomatis memakai konvensi nama file:
 *   ID "tekwan_jumbo"  ->  /products/tekwan-jumbo.png
 * Kalau file itu belum ada, website menampilkan ilustrasi kategori.
 */
export interface ProductVisual {
  images: string[]
  /** Nama pendek untuk tampilan besar di hero, mis. "Kakap" */
  shortName?: string
  /** Foto piring bundar transparan; produk yang punya ini tampil di hero */
  plate?: string
}

export const productVisuals: Record<string, ProductVisual> = {
  pempek_kakap: {
    images: ['/products/KakapFix.png', '/products/kakap/Kakap1.jpeg', '/products/kakap/Kakap2.jpeg'],
    shortName: 'Kakap',
    plate: '/products/plate/kakap.webp',
  },
  pempek_gabus: {
    images: ['/products/GabusFix.png', '/products/gabus/Gabus1.jpeg', '/products/gabus/Gabus2.jpeg'],
    shortName: 'Gabus',
    plate: '/products/plate/gabus.webp',
  },
  pempek_tenggiri: {
    images: ['/products/TenggiriFix.png', '/products/tenggiri/Tenggiri1.jpeg', '/products/tenggiri/Tenggiri2.jpeg'],
    shortName: 'Tenggiri',
    plate: '/products/plate/tenggiri.webp',
  },
}

/** "pempek_gabus" -> "pempek-gabus" */
export function productSlug(id: string) {
  return id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Semua gambar produk, dengan konvensi nama file sebagai cadangan */
export function getProductImages(productId: string): string[] {
  return productVisuals[productId]?.images ?? [`/products/${productSlug(productId)}.png`]
}

/** Gambar utama produk */
export function getProductImage(product: { id: string }): string {
  return getProductImages(product.id)[0]
}
