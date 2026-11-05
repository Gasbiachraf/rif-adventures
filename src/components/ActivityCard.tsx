import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Users } from 'lucide-react'
import type { Activity } from '../data/activities'
import { useI18n } from '../i18n'
import { formatPrice } from '../lib/request'

export function ActivityCard({ activity, eager = false }: { activity: Activity; eager?: boolean }) {
  const { t, l, lang, path } = useI18n()
  const detail = path(`/activities/${activity.slug}`)

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_0_rgba(19,33,43,0.06),0_18px_40px_-24px_rgba(11,42,60,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(11,42,60,0.5)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={activity.image}
          alt=""
          width={1200}
          height={800}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex justify-between gap-2 p-4">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-abyss backdrop-blur">
            {t.types[activity.type]}
          </span>
          <span className="rounded-full bg-abyss/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {t.levels[activity.level]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl leading-snug font-semibold text-abyss">
          <Link to={detail} className="after:absolute after:inset-0 focus-visible:outline-none">
            {l(activity.title)}
          </Link>
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-mist">{l(activity.tagline)}</p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm font-medium text-ink/80">
          <li className="flex items-center gap-1.5">
            <Clock className="size-4 text-sea" aria-hidden="true" />
            {t.duration(activity.durationHours)}
          </li>
          <li className="flex items-center gap-1.5">
            <Users className="size-4 text-sea" aria-hidden="true" />
            {t.card.max(activity.maxGroup)}
          </li>
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-ink/8 pt-5">
          <div>
            <p className="text-xs text-mist">{t.card.from}</p>
            <p className="text-lg font-extrabold text-abyss">
              {formatPrice(activity.priceFrom, lang)}{' '}
              <span className="text-sm font-semibold text-mist">
                {activity.priceUnit === 'boat' ? t.card.perBoat : t.card.perPerson}
              </span>
            </p>
            <p className="text-[11px] font-semibold tracking-wide text-coral-dark uppercase">{t.card.indicative}</p>
          </div>
          <span
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-foam text-abyss transition group-hover:bg-coral group-hover:text-white"
          >
            <ArrowRight className="size-5 rtl:rotate-180" />
          </span>
        </div>
      </div>
    </article>
  )
}
