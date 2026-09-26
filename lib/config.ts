/** Nomor WhatsApp warung (format internasional, tanpa +) */
export const WHATSAPP_NUMBER = '6285893837877'
export const WHATSAPP_DISPLAY = '0858-9383-77877'

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
