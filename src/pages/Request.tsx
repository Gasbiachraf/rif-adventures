import { useRef, useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AlertCircle, CalendarDays, CheckCircle2, Info, Pencil, ShieldCheck } from 'lucide-react'
import { activities, findActivity } from '../data/activities'
import { useI18n } from '../i18n'
import {
  MESSAGE_MAX,
  buildMessage,
  dateBounds,
  emptyRequest,
  estimateTotal,
  formatDate,
  formatPrice,
  needsDivingLevel,
  validateRequest,
  type DivingLevel,
  type Errors,
  type TripRequest,
} from '../lib/request'
import { whatsappLink } from '../lib/whatsapp'
import { Stepper } from '../components/Stepper'
import { WhatsAppIcon } from '../components/ui'

const FIELD_ORDER: Array<keyof TripRequest> = ['activity', 'date', 'adults', 'divingLevel', 'name', 'phone', 'message']
const DIVING_LEVELS: DivingLevel[] = ['none', 'beginner', 'certified', 'advanced']

function initialRequest(params: URLSearchParams): TripRequest {
  const activity = findActivity(params.get('activity'))
  const int = (key: string, fallback: number) => {
    const n = Number.parseInt(params.get(key) ?? '', 10)
    return Number.isFinite(n) && n >= 0 ? n : fallback
  }
  return {
    ...emptyRequest,
    activity: activity?.slug ?? '',
    date: params.get('date') ?? '',
    adults: Math.max(1, int('adults', emptyRequest.adults)),
    children: int('children', 0),
  }
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string
  label: string
  hint?: string
  error?: string
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-mist">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

export function RequestPage() {
  const { t, l, lang } = useI18n()
  const [params] = useSearchParams()
  const [req, setReq] = useState<TripRequest>(() => initialRequest(params))
  const [errors, setErrors] = useState<Errors>({})
  const [ready, setReady] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const activity = findActivity(req.activity)
  const { min, max } = dateBounds()
  const groupMax = activity?.maxGroup ?? 12
  const showDiving = needsDivingLevel(activity)

  const set = <K extends keyof TripRequest>(key: K, value: TripRequest[K]) => {
    setReq((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'activity' && !needsDivingLevel(findActivity(value as string))) next.divingLevel = ''
      return next
    })
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const err = (key: keyof TripRequest) => (errors[key] ? t.form.errors[errors[key]!] : undefined)
  const aria = (key: keyof TripRequest, withHint = false) => ({
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${key}-error` : withHint ? `${key}-hint` : undefined,
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const found = validateRequest(req)
    setErrors(found)
    const first = FIELD_ORDER.find((key) => found[key])
    if (first) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${first}"], [data-field="${first}"] button:not(:disabled)`)
        ?.focus()
      return
    }
    setReady(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  const hasErrors = Object.values(errors).some(Boolean)
  const message = ready ? buildMessage(req, t, lang) : ''

  return (
    <section className="bg-foam pb-20">
      <div className="container-x pt-12 sm:pt-16">
        <p className="eyebrow">{t.form.eyebrow}</p>
        <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-abyss sm:text-6xl">
          {ready ? t.form.summaryTitle : t.form.title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-mist">{ready ? t.form.summaryText : t.form.subtitle}</p>
      </div>

      <div className="container-x mt-10 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {ready && activity ? (
          <div className="rounded-3xl bg-white p-6 shadow-[0_18px_40px_-28px_rgba(11,42,60,0.4)] sm:p-10">
            <div className="flex items-center gap-3 text-sea">
              <CheckCircle2 className="size-7" aria-hidden="true" />
              <p className="text-lg font-bold text-abyss">{l(activity.title)}</p>
            </div>
            <dl className="mt-6 divide-y divide-ink/8 rounded-2xl bg-foam px-5">
              {[
                [t.wa.date, formatDate(req.date, lang)],
                [t.wa.participants, t.form.participants(req.adults, req.children)],
                ...(req.divingLevel ? [[t.wa.level, t.form.divingLevels[req.divingLevel]]] : []),
                [t.wa.name, req.name.trim()],
                [t.wa.phone, req.phone.trim()],
                ...(req.message.trim() ? [[t.wa.message, req.message.trim()]] : []),
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-1 py-3.5 sm:flex-row sm:gap-6">
                  <dt className="w-40 shrink-0 text-sm font-semibold text-mist">{label}</dt>
                  <dd className="font-semibold break-words text-abyss">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex gap-3 rounded-2xl border border-sea/20 bg-sea/5 p-4 text-sm text-ink/80">
              <Info className="mt-0.5 size-5 shrink-0 text-sea" aria-hidden="true" />
              {t.form.summaryNote}
            </div>

            <details className="mt-6 text-sm">
              <summary className="cursor-pointer font-semibold text-sea">{t.form.preview}</summary>
              <pre className="mt-3 rounded-2xl bg-abyss p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-white/90">
                {message}
              </pre>
            </details>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn-wa px-8">
                <WhatsAppIcon />
                {t.form.openWhatsApp}
              </a>
              <button type="button" onClick={() => setReady(false)} className="btn-ghost text-abyss">
                <Pencil className="size-4" aria-hidden="true" />
                {t.form.edit}
              </button>
            </div>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate
            className="space-y-8 rounded-3xl bg-white p-6 shadow-[0_18px_40px_-28px_rgba(11,42,60,0.4)] sm:p-10"
          >
            {hasErrors && (
              <div role="alert" className="flex items-center gap-3 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral-dark">
                <AlertCircle className="size-5 shrink-0" aria-hidden="true" />
                {t.form.errors.summary}
              </div>
            )}

            <fieldset className="space-y-5">
              <legend className="mb-5 flex items-center gap-3 text-lg font-bold text-abyss">
                <span className="grid size-8 place-items-center rounded-full bg-abyss text-sm text-white">1</span>
                {t.form.stepTrip}
              </legend>

              <Field id="activity" label={t.form.activity} error={err('activity')}>
                <select
                  id="activity"
                  name="activity"
                  value={req.activity}
                  onChange={(e) => set('activity', e.target.value)}
                  className="field"
                  {...aria('activity')}
                >
                  <option value="">{t.form.activityPlaceholder}</option>
                  {activities.map((a) => (
                    <option key={a.slug} value={a.slug}>
                      {l(a.title)} — {t.types[a.type]}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="date" label={t.form.date} hint={t.form.dateHint} error={err('date')}>
                <input
                  id="date"
                  name="date"
                  type="date"
                  min={min}
                  max={max}
                  value={req.date}
                  onChange={(e) => set('date', e.target.value)}
                  className="field"
                  {...aria('date', true)}
                />
              </Field>

              <div data-field="adults" className="space-y-3 rounded-2xl border border-ink/10 p-4">
                <Stepper
                  id="adults-label"
                  label={t.form.adults}
                  value={req.adults}
                  min={1}
                  max={Math.max(1, groupMax - req.children)}
                  onChange={(n) => set('adults', n)}
                />
                <Stepper
                  id="children-label"
                  label={t.form.children}
                  value={req.children}
                  min={0}
                  max={Math.max(0, groupMax - req.adults)}
                  onChange={(n) => set('children', n)}
                />
                {activity && (
                  <p className="flex gap-2 border-t border-ink/8 pt-3 text-xs text-mist">
                    <Info className="size-4 shrink-0 text-sea" aria-hidden="true" />
                    <span>
                      {t.form.groupNote(activity.maxGroup)}
                      {activity.minAge > 0 && ` ${t.form.minAgeNote(activity.minAge)}`}
                    </span>
                  </p>
                )}
                {err('adults') && <p className="field-error">{err('adults')}</p>}
              </div>

              {showDiving && (
                <Field id="divingLevel" label={t.form.divingLevel} error={err('divingLevel')}>
                  <select
                    id="divingLevel"
                    name="divingLevel"
                    value={req.divingLevel}
                    onChange={(e) => set('divingLevel', e.target.value as DivingLevel)}
                    className="field"
                    {...aria('divingLevel')}
                  >
                    <option value="">—</option>
                    {DIVING_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {t.form.divingLevels[level]}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </fieldset>

            <fieldset className="space-y-5">
              <legend className="mb-5 flex items-center gap-3 text-lg font-bold text-abyss">
                <span className="grid size-8 place-items-center rounded-full bg-abyss text-sm text-white">2</span>
                {t.form.stepYou}
              </legend>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label={t.form.name} error={err('name')}>
                  <input
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={req.name}
                    onChange={(e) => set('name', e.target.value)}
                    className="field"
                    {...aria('name')}
                  />
                </Field>
                <Field id="phone" label={t.form.phone} hint={t.form.phoneHint} error={err('phone')}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    value={req.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="field rtl:text-end"
                    {...aria('phone', true)}
                  />
                </Field>
              </div>

              <Field id="message" label={t.form.message} error={err('message')}>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  maxLength={MESSAGE_MAX + 50}
                  placeholder={t.form.messagePlaceholder}
                  value={req.message}
                  onChange={(e) => set('message', e.target.value)}
                  className="field resize-y"
                  {...aria('message')}
                />
                <p className="mt-1 text-end text-xs text-mist" aria-hidden="true">
                  {req.message.length}/{MESSAGE_MAX}
                </p>
              </Field>
            </fieldset>

            <div>
              <button type="submit" className="btn-coral w-full sm:w-auto sm:px-10">
                <CalendarDays className="size-5" aria-hidden="true" />
                {t.form.submit}
              </button>
              <p className="mt-4 flex gap-2 text-xs leading-relaxed text-mist">
                <ShieldCheck className="size-4 shrink-0 text-sea" aria-hidden="true" />
                {t.form.privacy}
              </p>
            </div>
          </form>
        )}

        <aside className="overflow-hidden rounded-3xl bg-abyss text-white lg:sticky lg:top-24">
          {activity ? (
            <>
              <img src={activity.image} alt="" width={1200} height={800} className="aspect-[16/10] w-full object-cover" />
              <div className="p-6">
                <p className="text-xs font-bold tracking-wide text-lagoon uppercase">{t.types[activity.type]}</p>
                <p className="font-display mt-1 text-2xl font-semibold">{l(activity.title)}</p>
                <p className="mt-1 text-sm text-white/70">
                  {t.duration(activity.durationHours)} · {t.levels[activity.level]}
                </p>
                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-xs text-white/60">{t.form.estimate}</p>
                  <p className="text-2xl font-extrabold">
                    {formatPrice(estimateTotal(activity, req.adults, req.children), lang)}
                  </p>
                  <p className="text-xs text-white/60">
                    {activity.priceUnit === 'boat'
                      ? `${t.card.from} ${formatPrice(activity.priceFrom, lang)} ${t.card.perBoat}`
                      : `${t.form.participants(req.adults, req.children)} × ${formatPrice(activity.priceFrom, lang)}`}
                    {' · '}
                    {t.form.estimateNote}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8">
              <CalendarDays className="size-8 text-lagoon" aria-hidden="true" />
              <p className="mt-4 text-lg font-bold">{t.form.title}</p>
              <p className="mt-2 text-sm text-white/70">{t.detail.requestText}</p>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}
