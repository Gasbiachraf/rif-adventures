import { useSearchParams } from 'react-router-dom'
import { activities, durationBucket, type ActivityType, type DurationBucket } from '../data/activities'
import { useI18n } from '../i18n'
import { ActivityCard } from '../components/ActivityCard'

const TYPES: Array<ActivityType | 'all'> = ['all', 'boat', 'diving', 'snorkeling', 'private']
const DURATIONS: Array<DurationBucket | 'all'> = ['all', 'short', 'half', 'full']

function FilterGroup<T extends string>({
  label,
  options,
  value,
  labels,
  onChange,
}: {
  label: string
  options: T[]
  value: T
  labels: Record<T, string>
  onChange: (value: T) => void
}) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-xs font-bold tracking-wide text-mist uppercase">{label}</legend>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={option === value}
            onClick={() => onChange(option)}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
              option === value
                ? 'bg-abyss text-white'
                : 'bg-white text-ink/80 ring-1 ring-ink/12 hover:ring-abyss/40'
            }`}
          >
            {labels[option]}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function Activities() {
  const { t } = useI18n()
  const [params, setParams] = useSearchParams()
  const type = (TYPES.find((v) => v === params.get('type')) ?? 'all') as ActivityType | 'all'
  const duration = (DURATIONS.find((v) => v === params.get('duration')) ?? 'all') as DurationBucket | 'all'

  const update = (key: 'type' | 'duration', value: string) => {
    const next = new URLSearchParams(params)
    if (value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  const results = activities.filter(
    (a) =>
      (type === 'all' || a.type === type) && (duration === 'all' || durationBucket(a.durationHours) === duration),
  )

  return (
    <>
      <section className="bg-foam pt-14 pb-10 sm:pt-20">
        <div className="container-x">
          <p className="eyebrow">{t.activitiesPage.eyebrow}</p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-tight text-abyss sm:text-6xl">
            {t.activitiesPage.title}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-mist">{t.activitiesPage.subtitle}</p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[auto_auto] lg:justify-start lg:gap-12">
            <FilterGroup
              label={t.activitiesPage.filterType}
              options={TYPES}
              value={type}
              labels={t.types}
              onChange={(v) => update('type', v)}
            />
            <FilterGroup
              label={t.activitiesPage.filterDuration}
              options={DURATIONS}
              value={duration}
              labels={t.durations}
              onChange={(v) => update('duration', v)}
            />
          </div>
        </div>
      </section>

      <section className="container-x py-12 sm:py-16">
        <p className="text-sm font-semibold text-mist" aria-live="polite">
          {t.activitiesPage.results(results.length)}
        </p>
        {results.length ? (
          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((activity, i) => (
              <li key={activity.slug}>
                <ActivityCard activity={activity} eager={i < 3} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-3xl border border-dashed border-ink/20 p-12 text-center">
            <p className="text-lg font-semibold text-abyss">{t.activitiesPage.empty}</p>
            <button type="button" onClick={() => setParams({}, { replace: true })} className="btn-coral mt-6">
              {t.activitiesPage.reset}
            </button>
          </div>
        )}
      </section>
    </>
  )
}
