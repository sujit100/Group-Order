import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

export function getFromEmail(): string {
  const fromEmail = process.env.EMAIL_FROM_ADDRESS
  if (!fromEmail) {
    throw new Error('EMAIL_FROM_ADDRESS environment variable is not set')
  }
  return fromEmail
}
