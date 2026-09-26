# Warung Bicik Pia: Website + Firebase + Aplikasi Admin

```
                 FIRESTORE (satu-satunya sumber data)
                 products/{id}   stock_logs/{id}   admins/{uid}
                        │                    │
        baca (REST, tiap ≤60 dtk)      baca/tulis (transaksi)
                        │                    │
                        ▼                    ▼
            WEBSITE NEXT.JS (paket ini)  APLIKASI ADMIN ANDROID (paket terpisah)
            pelanggan lihat produk,     Dashboard, Produk, Stok,
            harga, status stok          Suara, Riwayat, Pengaturan
```

Sistem ini terdiri dari **dua paket terpisah** yang memakai Firestore yang sama:

| Paket | Isi |
|---|---|
| `webpempek-website` (paket ini) | Website Next.js yang sudah ada, plus `data/seed-products.json` (data awal hasil migrasi) dan `firebase/` (Security Rules, index, script isi data awal) |
| `bicik-pia-admin-android` | Aplikasi admin Flutter yang dibuild jadi APK dan dipasang di HP Android. Panduannya ada di `README.md` paket itu |

## Yang berubah di website (dan alasannya)

| File | Perubahan | Alasan |
|---|---|---|
| `lib/products.ts` | Daftar produk hardcoded dihapus; sekarang berisi logika katalog (urutan kategori, status stok, format harga) | Data produk harus dari Firestore; logika kategori di satu tempat |
| `lib/catalog-source.ts` (baru) | Membaca produk aktif dari Firestore | Satu pintu data produk untuk website |
| `lib/firestore-rest.ts` (baru) | Klien Firestore REST kecil berbasis `fetch` | Tanpa dependency baru; hanya perlu baca |
| `lib/product-visuals.ts` (baru) | Peta gambar per ID produk + `getProductImage()` | Gambar tetap di `public/`, tidak di Firebase |
| `app/page.tsx` | Server component + `revalidate = 60` | Harga/stok baru tampil ≤1 menit tanpa deploy; Firestore dibaca maks. 1×/menit |
| `lib/store.ts` | `minimumStock` + `syncCatalog()` | Keranjang lama di HP pelanggan ikut harga/stok terbaru |
| `components/stock-status.tsx` (baru) | Tersedia / Stok terbatas / Habis | Status stok dari Firestore, gaya mengikuti UI yang ada |
| `components/warung-scene.tsx`, `site-header.tsx` | Kategori & menu navigasi dibentuk dari data | Kategori baru dari admin otomatis muncul |
| `hero.tsx`, `shelf-item.tsx`, `product-modal.tsx` | Memakai status stok baru | Ambang "terbatas" dari `minimumStock`, bukan angka 5 tetap |

Tampilan, gambar, keranjang, dan alur pesan WhatsApp tidak berubah.

**Kalau Firebase belum diisi** (`FIREBASE_PROJECT_ID` kosong), website memakai `data/seed-products.json` supaya tetap jalan. Kalau Firebase sudah diisi tapi sedang gagal, website tetap menampilkan halaman terakhir yang berhasil (tidak pernah jatuh ke harga lama).

## Langkah setup (sekali saja)

### 1. Buat project Firebase
1. [console.firebase.google.com](https://console.firebase.google.com) → Add project.
2. **Firestore Database** → Create database → *Production mode* → lokasi `asia-southeast2 (Jakarta)`.
3. **Authentication** → Get started → aktifkan **Email/Password**.
4. Authentication → Users → **Add user** (email + password admin). Salin **User UID**-nya.
5. Disarankan: Authentication → Settings → User actions → matikan *Enable create (sign-up)*. (Rules sudah menolak non-admin, ini lapisan tambahan.)

### 2. Daftarkan admin
Firestore → Start collection `admins` → Document ID = **UID** dari langkah 1.4 → field `email` (string) = email admin.
Hanya akun yang punya dokumen di sini yang bisa mengubah data.

### 3. Pasang Security Rules & index
```bash
npm install -g firebase-tools
firebase login
cd firebase
firebase use --add            # pilih project tadi
firebase deploy --only firestore
cd ..
```

### 4. Hubungkan website
Project settings → General → Your apps → tambah **Web app** → catat `projectId` dan `apiKey`.
```bash
cp .env.example .env.local    # lalu isi FIREBASE_PROJECT_ID dan FIREBASE_API_KEY
```
Isi dua variabel yang sama di **Vercel → Settings → Environment Variables**, lalu redeploy sekali.
(API key Firebase memang boleh publik; keamanannya dari Security Rules.)

### 5. Isi data awal
```bash
node firebase/scripts/seed-products.mjs --dry-run                      # lihat dulu
node firebase/scripts/seed-products.mjs --email admin@contoh.com      # stok awal 0
```
Stok awal default **0** karena stok nyata belum diketahui. Pilihan lain:
`--initial-stock 10` (semua produk 10) atau `--use-website-stock` (angka stok lama dari website).
Produk yang sudah ada di Firestore selalu dilewati, jadi aman dijalankan ulang.

### 6. Pasang aplikasi admin di Android
Buka paket **`bicik-pia-admin-android`** dan ikuti `README.md`-nya: buat APK sekali di laptop, lalu pasang di HP admin.

## Perintah suara

| Ucapan | Arti |
|---|---|
| `pempek gabus tinggal 15` / `gabus sisa 15` | stok dijadikan 15 |
| `pempek gabus terjual 10` / `gabus berkurang 10` / `gabus rusak 2` | stok dikurangi |
| `pempek gabus masuk 10` / `gabus tambah 10` | stok ditambah |
| `gabus habis` | stok dijadikan 0 |
| `gabus tinggal 15 dan kakap tinggal 20` | beberapa perintah sekaligus (juga pakai koma, atau tanpa kata sambung) |

Angka boleh diucapkan sebagai kata ("lima belas", "dua puluh lima"). Nama produk dicocokkan dengan **aliases** di Firestore (bisa diedit di menu Produk). Alur: suara → teks → preview `18 → 15 (−3)` → **KONFIRMASI** → transaksi Firestore + riwayat. Tidak ada yang tersimpan sebelum tombol konfirmasi ditekan; stok tidak bisa negatif (dicek di aplikasi *dan* di Security Rules); kalau stok berubah di HP lain sejak preview, penyimpanan dibatalkan dan preview dibuat ulang.

Pengenal suara memakai plugin open-source `speech_to_text` di atas pengenal suara bawaan Android (gratis). Pemahaman perintah 100% lokal, tanpa AI/LLM berbayar. Aktifkan *Pengaturan → Proses suara di perangkat* bila paket bahasa Indonesia offline sudah terpasang di HP supaya suara tidak dikirim ke server.

## Riwayat stok (`stock_logs`)

`action` = arah perubahan yang terjadi (INCREASE/DECREASE, sesuai spesifikasi: "tinggal 15" dari 18 dicatat DECREASE 3). Niat aslinya disimpan di `commandType` (SET_TARGET untuk "tinggal"). Riwayat tidak bisa diubah atau dihapus (dikunci di Security Rules).

## Gambar produk

Gambar tetap di `public/`. Produk lama dipetakan di `lib/product-visuals.ts`. Produk baru dari aplikasi admin otomatis mencari `public/products/<id-produk-dengan-strip>.png`, mis. ID `tekwan_jumbo` → `public/products/tekwan-jumbo.png`. Selama file itu belum ada, website menampilkan ilustrasi kategori.

## Perkiraan biaya (free tier Spark: 50.000 baca & 20.000 tulis per hari)

- Website: 1 query per ≤60 detik saat ada pengunjung ≈ maks. ±11.500 baca/hari untuk 8 produk, berapa pun jumlah pengunjungnya.
- Aplikasi admin: 1 listener produk (8 baca saat dibuka, lalu hanya dokumen yang berubah), riwayat per 20 baris, hitungan aktivitas hari ini memakai query agregat.
- Tidak memakai Storage, Cloud Functions, atau layanan berbayar.

## Pengujian yang sudah dilakukan

- Website: build Next.js dan TypeScript lolos; diuji dengan server tiruan berformat Firestore: harga 35.000 → 38.000 dan stok 18 → 15 tampil ≤60 detik tanpa deploy; 11 kunjungan = 1 baca Firestore; produk nonaktif tersembunyi; keranjang lama ikut harga baru.
- Script seed: diuji terhadap tiruan Auth + Firestore (login gagal/berhasil, produk yang sudah ada dilewati, log stok awal).
- Logika aplikasi admin: 43 kasus uji (salinan 1:1 dari folder `test/` paket aplikasi admin) lolos.
- **Belum dijalankan**: `flutter test`, kompilasi Flutter, dan Security Rules di emulator (tidak tersedia di lingkungan pembuatan). Jalankan `flutter test` saat membuat APK; kalau ada error kompilasi, kirimkan pesannya.
