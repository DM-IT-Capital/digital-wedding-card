export const CUSTOM_DESIGN_BUCKET = 'wedding-designs'

export function isCustomDesignValue(value: string | null | undefined) {
  if (!value) return false

  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/') ||
    value.startsWith('data:')
  )
}
