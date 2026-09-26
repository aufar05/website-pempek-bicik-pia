/**
 * Pembaca Firestore minimal lewat REST API (tanpa SDK, hanya fetch).
 * Dipakai di server Next.js. Akses publik dibatasi oleh firestore.rules:
 * tanpa login hanya produk dengan isActive == true yang boleh dibaca.
 */

type FirestoreValue = {
  nullValue?: null
  booleanValue?: boolean
  integerValue?: string
  doubleValue?: number
  stringValue?: string
  timestampValue?: string
  arrayValue?: { values?: FirestoreValue[] }
  mapValue?: { fields?: Record<string, FirestoreValue> }
}

export interface FirestoreDocument {
  id: string
  data: Record<string, unknown>
}

function decodeValue(v: FirestoreValue): unknown {
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('booleanValue' in v) return v.booleanValue
  if ('timestampValue' in v) return v.timestampValue
  if ('arrayValue' in v) return (v.arrayValue?.values ?? []).map(decodeValue)
  if ('mapValue' in v) return decodeFields(v.mapValue?.fields ?? {})
  return null
}

function decodeFields(fields: Record<string, FirestoreValue>) {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]))
}

export interface FirestoreConfig {
  projectId: string
  apiKey?: string
  /** host:port emulator lokal, mis. "localhost:8080" */
  emulatorHost?: string
}

/**
 * Ambil dokumen `collection` dengan satu filter kesetaraan (field == true).
 * Satu query = satu request; biaya baca = jumlah dokumen yang cocok.
 */
export async function queryWhereTrue(
  config: FirestoreConfig,
  collection: string,
  field: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<FirestoreDocument[]> {
  const base = config.emulatorHost
    ? `http://${config.emulatorHost}`
    : 'https://firestore.googleapis.com'
  const url = new URL(
    `${base}/v1/projects/${config.projectId}/databases/(default)/documents:runQuery`,
  )
  if (config.apiKey && !config.emulatorHost) url.searchParams.set('key', config.apiKey)

  const res = await fetch(url, {
    ...init,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: collection }],
        where: {
          fieldFilter: { field: { fieldPath: field }, op: 'EQUAL', value: { booleanValue: true } },
        },
      },
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Firestore runQuery gagal (${res.status}): ${body.slice(0, 300)}`)
  }

  const rows = (await res.json()) as Array<{
    document?: { name: string; fields?: Record<string, FirestoreValue> }
  }>

  return rows
    .filter((r) => r.document)
    .map((r) => ({
      id: r.document!.name.split('/').pop()!,
      data: decodeFields(r.document!.fields ?? {}),
    }))
}
