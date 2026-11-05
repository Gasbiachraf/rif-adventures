import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Backpack, Check, Clock, Gauge, MapPin, Users, X } from 'lucide-react'
import { activities, findActivity } from '../data/activities'
import { useI18n } from '../i18n'
import { dateBounds, formatPrice } from '../lib/request'
import { ActivityCard } from '../components/ActivityCard'
import { Stepper } from '../components/Stepper'
import { NotFound } from './NotFound'

export function ActivityDetail() {
  const { slug } = useParams()
  const { t, l, lang, path } = useI18n()
  const navigate = useNavigate()
  const activity = findActivity(slug)
  const { min, max } = dateBounds()
  const [date, setDate] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  if (!activity) return <NotFound message={t.detail.notFound} />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams({ activity: activity.slug, adults: String(adults), children: String(children) })
    if (date) params.set('date', date)
    navigate(`${path('/request')}?${params}`)
  }

  const facts = [
    { icon: Clock, label: t.detail.duration, value: t.duration(activity.durationHours) },
    { icon: Gauge, label: t.detail.level, value: t.levels[activity.level] },
    { icon: Users, label: t.detail.group, value: t.detail.groupValue(activity.maxGroup) },
    { icon: Backpack, label: t.detail.minAge, value: t.detail.minAgeValue(activity.minAge) },
    { icon: MapPin, label: t.detail.meeting, value: t.detail.meetingValue },
  ]

  const others = activities.filter((a) => a.slug !== activity.slug).slice(0, 3)

  return (
    <>
      <section className="container-x pt-8 sm:pt-12">
        <Link to={path('/activities')} className="inline-flex items-center gap-2 text-sm font-semibold text-sea hover:text-abyss">
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
          {t.detail.back}
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-abyss px-3 py-1 text-xs font-bold text-white">{t.types[activity.type]}</span>
          <span className="rounded-full bg-sand px-3 py-1 text-xs font-bold text-abyss">{t.levels[activity.level]}</span>
        </div>
        <h1 className="font-display mt-4 max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-abyss sm:text-6xl">
          {l(activity.title)}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-mist">{l(activity.tagline)}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:grid-rows-2">
          <img
            src={activity.image}
            alt=""
            width={1200}
            height={800}
            className="aspect-[4/3] h-full w-full rounded-3xl object-cover sm:col-span-2 sm:row-span-2 sm:aspect-auto"
          />
          {activity.gallery.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              loading="lazy"
              className="hidden aspect-[4/3] h-full w-full rounded-3xl object-cover sm:block"
            />
          ))}
        </div>
      </section>

      <section className="container-x grid gap-12 py-12 lg:grid-cols-[1fr_380px] lg:py-16">
        <div className="space-y-12">
          <p className="text-lg leading-relaxed text-ink/85">{l(activity.description)}</p>

          <div>
            <h2 className="text-xl font-bold text-abyss">{t.detail.info}</h2>
            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 rounded-2xl bg-foam p-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-sea">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <dt className="text-xs font-semibold text-mist">{label}</dt>
                    <dd className="font-bold text-abyss">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-xl font-bold text-abyss">{t.detail.highlights}</h2>
            <ol className="mt-5 space-y-3">
              {activity.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-coral text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1 text-ink/85">{l(item)}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { title: t.detail.included, items: activity.included, icon: Check, color: 'text-sea' },
              { title: t.detail.notIncluded, items: activity.notIncluded, icon: X, color: 'text-mist' },
              { title: t.detail.bring, items: activity.bring, icon: Backpack, color: 'text-coral' },
            ].map(({ title, items, icon: Icon, color }) => (
              <div key={title}>
                <h2 className="text-base font-bold text-abyss">{title}</h2>
                <ul className="mt-3 space-y-2.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink/80">
                      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} aria-hidden="true" />
                      {l(item)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <form
            onSubmit={onSubmit}
            className="rounded-3xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(11,42,60,0.45)] ring-1 ring-ink/6 sm:p-7"
          >
            <p className="text-xs text-mist">{t.card.from}</p>
            <p className="text-3xl font-extrabold text-abyss">
              {formatPrice(activity.priceFrom, lang)}{' '}
              <span className="text-base font-semibold text-mist">
                {activity.priceUnit === 'boat' ? t.card.perBoat : t.card.perPerson}
              </span>
            </p>
            <p className="text-[11px] font-bold tracking-wide text-coral-dark uppercase">{t.card.indicative}</p>

            <h2 className="mt-6 text-lg font-bold text-abyss">{t.detail.requestTitle}</h2>
            <label htmlFor="quick-date" className="field-label mt-4">
              {t.form.date}
            </label>
            <input
              id="quick-date"
              type="date"
              min={min}
              max={max}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field"
            />
            <div className="mt-5 space-y-3">
              <Stepper id="quick-adults" label={t.form.adults} value={adults} min={1} max={activity.maxGroup - children} onChange={setAdults} />
              <Stepper id="quick-children" label={t.form.children} value={children} min={0} max={activity.maxGroup - adults} onChange={setChildren} />
            </div>
            <button type="submit" className="btn-coral mt-6 w-full">
              {t.detail.continue}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-mist">{t.detail.requestText}</p>
            <p className="mt-2 text-xs leading-relaxed text-mist">{t.detail.disclaimer}</p>
          </form>
        </aside>
      </section>

      <section className="bg-foam py-16 sm:py-20">
        <div className="container-x">
          <h2 className="font-display text-3xl font-semibold text-abyss sm:text-4xl">{t.detail.others}</h2>
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((a) => (
              <li key={a.slug}>
                <ActivityCard activity={a} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
