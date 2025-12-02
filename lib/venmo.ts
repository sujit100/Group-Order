import QRCode from 'qrcode'

/**
 * Generate Venmo QR code from handle
 */
export async function generateVenmoQRCode(handle: string): Promise<string> {
  // Venmo payment URL format: venmo://paycharge?txn=pay&recipients=USERNAME&amount=AMOUNT
  // For QR code, we'll use a simpler format that opens Venmo app
  const venmoUrl = `venmo://paycharge?txn=pay&recipients=${handle.replace('@', '')}`
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(venmoUrl, {
      width: 300,
      margin: 2,
    })
    return qrCodeDataUrl
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Format Venmo handle (ensure it has @ prefix)
 */
export function formatVenmoHandle(handle: string): string {
  const trimmed = handle.trim()
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`
}
