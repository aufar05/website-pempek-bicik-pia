import { WarungScene } from '@/components/warung-scene'
import { getCatalog } from '@/lib/catalog-source'

/**
 * ISR: halaman disimpan sebagai halaman statis dan dibangun ulang paling
 * cepat setiap 60 detik saat ada pengunjung. Jadi perubahan harga/stok dari
 * aplikasi admin muncul di website dalam ±1 menit tanpa deploy ulang, dan
 * Firestore dibaca paling banyak sekali per menit (bukan per pengunjung).
 */
export const revalidate = 60

export default async function Home() {
  const { products } = await getCatalog()
  return <WarungScene products={products} />
}
