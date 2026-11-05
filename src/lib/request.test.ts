import { describe, expect, it } from 'vitest'
import { fr } from '../i18n/fr'
import { en } from '../i18n/en'
import { ar } from '../i18n/ar'
import { activities } from '../data/activities'
import { buildMessage, dateBounds, emptyRequest, estimateTotal, validateRequest, type TripRequest } from './request'
import { formatPhone, whatsappLink } from './whatsapp'

const today = new Date(2026, 10, 5) // 5 Nov 2026

const valid: TripRequest = {
  ...emptyRequest,
  activity: 'criques-parc-national',
  date: '2026-11-20',
  adults: 2,
  children: 1,
  name: 'Sara B.',
  phone: '+212 600 000 000',
}

describe('validateRequest', () => {
  it('accepts a complete boat request', () => {
    expect(validateRequest(valid, today)).toEqual({})
  })

  it('requires every mandatory field', () => {
    const errors = validateRequest({ ...emptyRequest, adults: 0 }, today)
    expect(errors).toMatchObject({ activity: 'activity', date: 'date', adults: 'adults', name: 'name', phone: 'phone' })
  })

  it('rejects today, past and far-future dates', () => {
    expect(validateRequest({ ...valid, date: '2026-11-05' }, today).date).toBe('datePast')
    expect(validateRequest({ ...valid, date: '2025-01-01' }, today).date).toBe('datePast')
    expect(validateRequest({ ...valid, date: '2027-11-06' }, today).date).toBe('dateFar')
    expect(validateRequest({ ...valid, date: dateBounds(today).min }, today).date).toBeUndefined()
  })

  it('enforces the group limit of the activity', () => {
    // try-dive allows 4 people
    const req = { ...valid, activity: 'bapteme-plongee', divingLevel: 'none' as const, adults: 3, children: 2 }
    expect(validateRequest(req, today).adults).toBe('group')
  })

  it('asks for a diving level only on diving trips', () => {
    expect(validateRequest({ ...valid, activity: 'bapteme-plongee' }, today).divingLevel).toBe('divingLevel')
    expect(validateRequest(valid, today).divingLevel).toBeUndefined()
  })

  it('keeps the guided dive for certified divers', () => {
    const req = { ...valid, activity: 'plongee-exploration', children: 0 }
    expect(validateRequest({ ...req, divingLevel: 'beginner' }, today).divingLevel).toBe('certifiedOnly')
    expect(validateRequest({ ...req, divingLevel: 'advanced' }, today)).toEqual({})
  })

  it('rejects malformed phone numbers', () => {
    expect(validateRequest({ ...valid, phone: '12345' }, today).phone).toBe('phone')
    expect(validateRequest({ ...valid, phone: 'call me' }, today).phone).toBe('phone')
  })
})

describe('buildMessage', () => {
  it('summarises the request in French', () => {
    const text = buildMessage({ ...valid, message: 'Anniversaire !' }, fr, 'fr')
    expect(text).toContain('Bonjour Rif Adventures,')
    expect(text).toContain('• Activité : Criques du Parc National')
    expect(text).toContain('• Date souhaitée : vendredi 20 novembre 2026')
    expect(text).toContain('• Participants : 2 adultes, 1 enfant')
    expect(text).toContain('• Message : Anniversaire !')
    expect(text).not.toContain('Niveau plongée')
  })

  it('includes the diving level and localises labels', () => {
    const req = { ...valid, activity: 'bapteme-plongee', divingLevel: 'none' as const }
    expect(buildMessage(req, en, 'en')).toContain('• Diving level: Never dived')
    expect(buildMessage(req, ar, 'ar')).toContain('الغوص التجريبي')
  })
})

describe('whatsapp helpers', () => {
  it('builds an encoded wa.me link', () => {
    expect(whatsappLink('Bonjour & merci', '212699312362')).toBe(
      'https://wa.me/212699312362?text=Bonjour%20%26%20merci',
    )
  })

  it('formats the number for display', () => {
    expect(formatPhone('212699312362')).toBe('+212 699 312 362')
  })
})

describe('data', () => {
  it('has unique slugs and translated titles', () => {
    expect(new Set(activities.map((a) => a.slug)).size).toBe(activities.length)
    for (const a of activities) expect(a.title.fr && a.title.ar && a.title.en).toBeTruthy()
  })

  it('estimates per person or per boat', () => {
    const boat = activities.find((a) => a.priceUnit === 'boat')!
    const person = activities.find((a) => a.priceUnit === 'person')!
    expect(estimateTotal(boat, 4, 2)).toBe(boat.priceFrom)
    expect(estimateTotal(person, 2, 1)).toBe(person.priceFrom * 3)
  })
})
