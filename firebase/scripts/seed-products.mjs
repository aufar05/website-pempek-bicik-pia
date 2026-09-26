#!/usr/bin/env node
/**
 * Isi koleksi Firestore `products` dari data/seed-products.json (sekali saja, saat awal).
 *
 * Tidak butuh service account: script login sebagai ADMIN lewat Firebase Auth REST API,
 * jadi penulisannya tunduk pada firestore.rules yang sama dengan aplikasi admin.
 * Produk yang SUDAH ADA di Firestore dilewati (harga/stok yang sudah diubah admin aman).
 *
 * Pakai (dari folder root repo):
 *   node firebase/scripts/seed-products.mjs --email admin@contoh.com
 *   node firebase/scripts/seed-products.mjs --email admin@contoh.com --initial-stock 10
 *   node firebase/scripts/seed-products.mjs --email admin@contoh.com --use-website-stock
 *   node firebase/scripts/seed-products.mjs --dry-run
 *
 * Project ID & API key dibaca dari .env.local (FIREBASE_PROJECT_ID, FIREBASE_API_KEY)
 * atau dari --project / --api-key. Password dari env ADMIN_PASSWORD atau ditanyakan.
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import readline from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

function parseArgs(argv) {
  const args = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) args[key] = true
    else args[key] = next, i++
  }
  return args
}

function readEnvFile(file) {
  if (!fs.existsSync(file)) return {}
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n')
      .map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && l.includes('='))
      .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]),
  )
}

/** JS -> nilai Firestore REST */
function toValue(v) {
  if (typeof v === 'string') return { stringValue: v }
  if (typeof v === 'boolean') return { booleanValue: v }
  if (Number.isInteger(v)) return { integerValue: String(v) }
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } }
  throw new Error(`Tipe nilai tidak didukung: ${JSON.stringify(v)}`)
}
const toFields = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toValue(v)]))

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const env = { ...readEnvFile(path.join(root, '.env')), ...readEnvFile(path.join(root, '.env.local')), ...process.env }
  const projectId = args.project ?? env.FIREBASE_PROJECT_ID
  const apiKey = args['api-key'] ?? env.FIREBASE_API_KEY
  const seed = JSON.parse(fs.readFileSync(path.join(root, 'data', 'seed-products.json'), 'utf8'))

  const initialStockFor = (p) => {
    if (args['use-website-stock']) return p.legacyWebsiteStock ?? 0
    const n = args['initial-stock'] !== undefined ? Number(args['initial-stock']) : seed.defaultInitialStock ?? 0
    if (!Number.isInteger(n) || n < 0) throw new Error('--initial-stock harus bilangan bulat >= 0')
    return n
  }

  console.log(`Data awal: ${seed.products.length} produk`)
  for (const p of seed.products) {
    console.log(`  - ${p.id.padEnd(18)} ${p.name.padEnd(28)} Rp${p.price}  stok awal ${initialStockFor(p)}`)
  }
  if (args['dry-run']) return console.log('\n--dry-run: tidak ada yang ditulis.')

  if (!projectId || !apiKey) throw new Error('FIREBASE_PROJECT_ID / FIREBASE_API_KEY belum ada (isi .env.local atau pakai --project dan --api-key).')
  if (!args.email) throw new Error('Wajib --email <email admin>.')

  let password = env.ADMIN_PASSWORD
  if (!password) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    password = await rl.question(`Password untuk ${args.email}: `)
    rl.close()
  }

  // Mendukung Firebase Emulator untuk uji lokal
  const authBase = env.FIREBASE_AUTH_EMULATOR_HOST
    ? `http://${env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com`
    : 'https://identitytoolkit.googleapis.com'
  const firestoreBase = env.FIRESTORE_EMULATOR_HOST ? `http://${env.FIRESTORE_EMULATOR_HOST}` : 'https://firestore.googleapis.com'

  const auth = await fetch(`${authBase}/v1/accounts:signInWithPassword?key=${apiKey}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: args.email, password, returnSecureToken: true }),
  }).then((r) => r.json())
  if (!auth.idToken) throw new Error(`Login gagal: ${auth.error?.message ?? 'unknown'}`)
  const headers = { Authorization: `Bearer ${auth.idToken}`, 'Content-Type': 'application/json' }
  const docs = `projects/${projectId}/databases/(default)/documents`
  const api = `${firestoreBase}/v1/${docs}`

  let created = 0, skipped = 0
  for (const p of seed.products) {
    const exists = await fetch(`${api}/products/${p.id}`, { headers })
    if (exists.status === 200) { console.log(`= ${p.id}: sudah ada, dilewati`); skipped++; continue }
    if (exists.status !== 404) throw new Error(`Cek ${p.id} gagal (${exists.status}). Apakah akun ini sudah terdaftar di koleksi admins?`)

    const stock = initialStockFor(p)
    const product = {
      name: p.name, category: p.category, price: p.price, stock, unit: p.unit,
      minimumStock: p.minimumStock, aliases: p.aliases.map((a) => a.toLowerCase()),
      isActive: p.isActive, description: p.description,
    }
    const writes = [{
      update: { name: `${docs}/products/${p.id}`, fields: toFields(product) },
      updateTransforms: [
        { fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' },
        { fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' },
      ],
      currentDocument: { exists: false },
    }]
    if (stock > 0) {
      // Stok awal tetap tercatat di riwayat
      writes.push({
        update: {
          name: `${docs}/stock_logs/${crypto.randomBytes(10).toString('hex')}`,
          fields: toFields({
            productId: p.id, productName: p.name, action: 'INCREASE', commandType: 'SET_TARGET',
            quantity: stock, stockBefore: 0, stockAfter: stock, source: 'MANUAL',
            note: 'Stok awal (seed)', createdBy: auth.email ?? args.email.toLowerCase(),
          }),
        },
        updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }],
        currentDocument: { exists: false },
      })
    }
    const res = await fetch(`${api}:commit`, { method: 'POST', headers, body: JSON.stringify({ writes }) })
    if (!res.ok) throw new Error(`Gagal menulis ${p.id} (${res.status}): ${(await res.text()).slice(0, 300)}`)
    console.log(`+ ${p.id}: dibuat (stok ${stock})`)
    created++
  }
  console.log(`\nSelesai. Dibuat ${created}, dilewati ${skipped}.`)
}

main().catch((e) => { console.error(`\nError: ${e.message}`); process.exit(1) })
