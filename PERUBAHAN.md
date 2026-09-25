# Redesain "Songket & Cuko"

Jalankan seperti biasa: `npm install` lalu `npm run dev`. Tidak ada dependency baru.

## File baru
- `components/hero.tsx` : hero dengan piring berputar, teks emas melingkar, pilihan ikan, stempel harga
- `components/ring-text.tsx` : teks melingkar 360° (diukur per huruf, rapat di semua browser)
- `components/site-header.tsx` : header transparan di atas hero, krem setelah di-scroll
- `components/product-image.tsx` : gambar produk dengan cadangan ilustrasi kategori
- `lib/config.ts` : nomor WhatsApp (ganti di sini saja)
- `lib/use-dismiss.ts` : kunci scroll + tutup dengan Escape untuk modal/keranjang
- `public/products/plate/*.webp` : foto piring bundar tampak atas (dari Kakap1/Gabus1/Tenggiri1)
- `public/icons/*.webp` : versi ringan ikon kategori (±20 KB, aslinya ±1 MB)

## File yang diubah
- `app/layout.tsx` : font Gloock + Plus Jakarta Sans; pinch-zoom di HP diizinkan lagi
- `app/globals.css` : palet songket/cuko, motif pucuk rebung, animasi (menghormati "reduce motion")
- `components/warung-scene.tsx` : susunan halaman baru (hero, pempek, tekwan & kerupuk, cara pesan, footer)
- `components/shelf-item.tsx` : `ShelfItem` (kartu pempek) + `MenuRow` (papan menu tekwan/kerupuk)
- `components/floating-basket.tsx` : bar bawah di HP + panel keranjang; alur pesan WhatsApp tidak berubah
- `components/product-modal.tsx` : tampilan baru (bottom sheet di HP)
- `lib/store.ts` : field opsional `shortName` dan `plate` di `Product`
- `lib/products.ts` : isi `shortName`/`plate` untuk pempek, `categoryIcon`, `getProductsByCategory`

## Menambah foto tekwan & kerupuk
Foto di `products.ts` (mis. `/products/tekwan.png`) belum ada, jadi yang tampil ilustrasi kategori.
Taruh fotonya di `public/products/` dengan nama yang sama, nanti otomatis dipakai.

## Menambah ikan baru di hero
Isi `shortName` dan `plate` di produk pempek. `plate` sebaiknya foto bundar tampak atas
dengan latar transparan (WebP/PNG, ±900×900).
