/** Nomor WhatsApp warung (format internasional, tanpa +) */
export const WHATSAPP_NUMBER = '6281933669374'
export const WHATSAPP_DISPLAY = '0819-3366-9374'

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
