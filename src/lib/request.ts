import { findActivity, type Activity } from '../data/activities'
import type { Dict } from '../i18n/fr'
import type { Lang } from '../i18n'

export type DivingLevel = 'none' | 'beginner' | 'certified' | 'advanced'

export interface TripRequest {
  activity: string
  date: string // yyyy-mm-dd
  adults: number
  children: number
  divingLevel: DivingLevel | ''
  name: string
  phone: string
  message: string
}

export type ErrorKey = keyof Dict['form']['errors']
export type Errors = Partial<Record<keyof TripRequest, ErrorKey>>

export const emptyRequest: TripRequest = {
  activity: '',
  date: '',
  adults: 2,
  children: 0,
  divingLevel: '',
  name: '',
  phone: '',
  message: '',
}

export const MESSAGE_MAX = 500

export function toISODate(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function dateBounds(today = new Date()) {
  const min = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const max = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
  return { min: toISODate(min), max: toISODate(max) }
}

export function needsDivingLevel(activity: Activity | undefined) {
  return activity?.type === 'diving'
}

export function validateRequest(req: TripRequest, today = new Date()): Errors {
  const errors: Errors = {}
  const activity = findActivity(req.activity)
  const { min, max } = dateBounds(today)

  if (!activity) errors.activity = 'activity'

  if (!req.date) errors.date = 'date'
  else if (req.date < min) errors.date = 'datePast'
  else if (req.date > max) errors.date = 'dateFar'

  if (!Number.isInteger(req.adults) || req.adults < 1) errors.adults = 'adults'
  else if (activity && req.adults + req.children > activity.maxGroup) errors.adults = 'group'

  if (needsDivingLevel(activity)) {
    if (!req.divingLevel) errors.divingLevel = 'divingLevel'
    else if (
      activity?.level === 'certified' &&
      req.divingLevel !== 'certified' &&
      req.divingLevel !== 'advanced'
    )
      errors.divingLevel = 'certifiedOnly'
  }

  if (req.name.trim().length < 2) errors.name = 'name'
  if (!/^\+?[\d\s().-]+$/.test(req.phone.trim()) || req.phone.replace(/\D/g, '').length < 8)
    errors.phone = 'phone'
  if (req.message.length > MESSAGE_MAX) errors.message = 'message'

  return errors
}

export function formatDate(iso: string, lang: Lang) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-MA' : lang, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d))
}

export function formatPrice(amount: number, lang: Lang) {
  return `${new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : lang).format(amount)} ${lang === 'ar' ? 'درهم' : 'MAD'}`
}

export function estimateTotal(activity: Activity, adults: number, children: number) {
  return activity.priceUnit === 'boat' ? activity.priceFrom : activity.priceFrom * (adults + children)
}

/** Builds the plain-text WhatsApp message sent to the operator. */
export function buildMessage(req: TripRequest, t: Dict, lang: Lang) {
  const activity = findActivity(req.activity)
  const row = (label: string, value: string) => `• ${label}${lang === 'fr' ? ' : ' : ': '}${value}`
  const lines = [
    t.wa.greeting,
    t.wa.intro,
    '',
    row(t.wa.activity, activity ? activity.title[lang] : req.activity),
    row(t.wa.date, formatDate(req.date, lang)),
    row(t.wa.participants, t.form.participants(req.adults, req.children)),
  ]
  if (req.divingLevel) lines.push(row(t.wa.level, t.form.divingLevels[req.divingLevel]))
  lines.push(row(t.wa.name, req.name.trim()), row(t.wa.phone, req.phone.trim()))
  if (req.message.trim()) lines.push(row(t.wa.message, req.message.trim()))
  lines.push('', t.wa.outro)
  return lines.join('\n')
}
