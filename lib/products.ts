import { Product } from './store'

export const products: Product[] = [
  // Pempek Palembang
  {
  id: 'pempek-kakap-10',
  name: 'Pempek Ikan Kakap Isi 10',
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
    name: 'Kerupuk Palembang',
    price: 15000,
    category: 'Kerupuk',
    description: 'Kerupuk ikan khas Palembang, renyah dan gurih. Teman makan nasi!',
    images: ['/products/kerupuk-palembang.png'],
    stock: 50,
    unit: 'bungkus',
  },
  {
    id: 'kerupuk-2',
    name: 'Kerupuk Udang',
    price: 20000,
    category: 'Kerupuk',
    description: 'Kerupuk udang premium, wangi dan renyah.',
    images: ['/products/kerupuk-udang.png'],
    stock: 35,
    unit: 'bungkus',
  },
  {
    id: 'kerupuk-3',
    name: 'Kerupuk Kemplang',
    price: 12000,
    category: 'Kerupuk',
    description: 'Kerupuk bakar khas, aroma asap yang menggugah selera.',
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

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
