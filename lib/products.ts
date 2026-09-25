import { Product } from './store'

export const products: Product[] = [
  // Pempek Palembang
  {
  id: 'pempek-kakap-10',
  name: 'Pempek Ikan Kakap Isi 10',
  shortName: 'Kakap',
  plate: '/products/plate/kakap.webp',
  price: 25000,
  category: 'Pempek',
  description: 'Paket pempek ikan kakap  isi 10 pcs terdiri dari kapal selam mini, lenjer, adaan, dan kulit. Cocok untuk camilan keluarga atau stok di rumah. Disajikan dengan cuko khas Palembang yang gurih, manis, dan pedas.',
  images: [
    '/products/KakapFix.png',
    '/products/kakap/Kakap1.jpeg',
    '/products/kakap/Kakap2.jpeg',
  ],
  stock: 20,
  unit: 'plastik',
},
  {
    id: 'pempek-gabus-10',
    name: 'Pempek Ikan Gabus isi 10',
    shortName: 'Gabus',
    plate: '/products/plate/gabus.webp',
    price: 35000,
    category: 'Pempek',
    description: 'Paket pempek ikan gabus  isi 10 pcs terdiri dari kapal selam mini, lenjer, adaan, dan kulit. Cocok untuk camilan keluarga atau stok di rumah. Disajikan dengan cuko khas Palembang yang gurih, manis, dan pedas.',
    images: [
    '/products/GabusFix.png',
    '/products/gabus/Gabus1.jpeg',
    '/products/gabus/Gabus2.jpeg',
  ],
    stock: 30,
    unit: 'plastik',
  },
  {
  id: 'pempek-tenggiri-10',
  name: 'Pempek Ikan Tenggiri Isi 10',
  shortName: 'Tenggiri',
  plate: '/products/plate/tenggiri.webp',
  price: 45000,
  category: 'Pempek',
  description: 'Paket pempek ikan tenggiri  isi 10 pcs terdiri dari kapal selam mini, lenjer, adaan, dan kulit. Cocok untuk camilan keluarga atau stok di rumah. Disajikan dengan cuko khas Palembang yang gurih, manis, dan pedas.',
  images: [
    '/products/TenggiriFix.png',
    '/products/tenggiri/Tenggiri1.jpeg',
    '/products/tenggiri/Tenggiri2.jpeg',
  ],
  stock: 20,
  unit: 'plastik',
  },
  // Tekwan
  {
    id: 'tekwan-1',
    name: 'Tekwan Original isi 10',
    price: 10000,
    category: 'Tekwan',
    description: 'Sup kaldu udang dengan bakso ikan, jamur kuping, dan bengkoang. Hangat nikmat!',
    images: ['/products/tekwan.png'],
    stock: 15,
    unit: 'porsi',
  },
  {
    id: 'tekwan-2',
    name: 'Tekwan Jumbo',
    price: 20000,
    category: 'Tekwan',
    description: 'Porsi besar dengan ekstra bumbu dan topping lengkap.',
    images: ['/products/tekwan-jumbo.png'],
    stock: 10,
    unit: 'porsi',
  },
  // Kerupuk
{
  id: 'kerupuk-1',
  name: 'Kerupuk Kemplang',
  price: 20000,
  category: 'Kerupuk',
  description: 'Kerupuk ikan khas Palembang dengan cita rasa gurih dan tekstur renyah. Cocok sebagai camilan atau teman makan nasi!',
  images: ['/products/kerupuk-palembang.png'],
  stock: 50,
  unit: 'bungkus',
},

{
  id: 'kerupuk-2',
  name: 'Kerupuk Kriting',
  price: 20000,
  category: 'Kerupuk',
  description: 'Kerupuk berbentuk kriting dengan tekstur renyah dan rasa gurih. Cocok dinikmati sebagai camilan atau pelengkap makanan.',
  images: ['/products/kerupuk-udang.png'],
  stock: 35,
  unit: 'bungkus',
},

{
  id: 'kerupuk-3',
  name: 'Kerupuk Koin',
  price: 20000,
  category: 'Kerupuk',
  description: 'Kerupuk berbentuk koin dengan tekstur renyah dan rasa gurih. Nikmat sebagai camilan maupun pelengkap saat makan.',
  images: ['/products/kemplang.png'],
  stock: 45,
  unit: 'bungkus',
},

]

export const categories = [
  'Semua',
  'Pempek',
  'Tekwan',
  'Kerupuk',
]

/** Ilustrasi per kategori, juga dipakai sebagai cadangan kalau foto produk belum ada */
export const categoryIcon: Record<string, string> = {
  Pempek: '/icons/iconPempek.webp',
  Tekwan: '/icons/iconTekwan.webp',
  Kerupuk: '/icons/iconKerupuk.webp',
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
