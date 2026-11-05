import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, ChevronDown, Clock, MapPin, MessageCircle, Plus, Sailboat } from 'lucide-react'
import { activities, GALLERY } from '../data/activities'
import { useI18n } from '../i18n'
import { whatsappLink, formatPhone } from '../lib/whatsapp'
import { ActivityCard } from '../components/ActivityCard'
import { Reveal, SectionHeading, WhatsAppIcon } from '../components/ui'

const FEATURED = ['criques-parc-national', 'bapteme-plongee', 'coucher-de-soleil']

function Hero() {
  const { t, path } = useI18n()
  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-abyss text-white">
      <picture>
        <source media="(min-width: 768px)" srcSet="/images/hero-sail.webp" />
        <img
          src="/images/hero-sail-sm.webp"
          alt=""
          width={800}
          height={1200}
          fetchPriority="high"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
      </picture>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-abyss via-abyss/45 to-abyss/30" />

      <div className="container-x pt-36 pb-28 md:pb-24">
        <p className="eyebrow animate-rise text-lagoon">{t.hero.eyebrow}</p>
        <h1 className="font-display animate-rise mt-4 max-w-4xl text-5xl leading-[1.02] font-semibold tracking-tight text-balance [animation-delay:120ms] sm:text-7xl lg:text-8xl">
          {t.hero.title}
        </h1>
        <p className="animate-rise mt-6 max-w-xl text-base leading-relaxed text-white/85 [animation-delay:240ms] sm:text-lg">
          {t.hero.subtitle}
        </p>
        <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:360ms]">
          <Link to={path('/request')} className="btn-coral px-7">
            <CalendarDays className="size-5" aria-hidden="true" />
            {t.hero.primary}
          </Link>
          <Link to={path('/activities')} className="btn-ghost px-7 text-white">
            {t.hero.secondary}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>
        <ul className="animate-rise mt-10 flex flex-wrap gap-2 [animation-delay:480ms]">
          {t.hero.chips.map((chip) => (
            <li
              key={chip}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-md sm:text-sm"
            >
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#featured"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold text-white/70 hover:text-white md:flex"
      >
        {t.hero.scroll}
        <ChevronDown className="size-5 animate-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}

function Featured() {
  const { t, path } = useI18n()
  const featured = FEATURED.map((slug) => activities.find((a) => a.slug === slug)!)
  return (
    <section id="featured" className="container-x py-20 sm:py-28">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading eyebrow={t.featured.eyebrow} title={t.featured.title} className="max-w-2xl" />
        <Link to={path('/activities')} className="btn-ghost text-abyss">
          {t.featured.all}
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden="true" />
        </Link>
      </div>
      <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featured.map((activity, i) => (
          <Reveal as="li" key={activity.slug} delay={i * 100}>
            <ActivityCard activity={activity} />
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function HowItWorks() {
  const { t, path } = useI18n()
  const icons = [Sailboat, CalendarDays, MessageCircle]
  return (
    <section id="how" className="bg-foam py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading eyebrow={t.how.eyebrow} title={t.how.title} className="max-w-2xl" />
        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {t.how.steps.map((step, i) => {
            const Icon = icons[i]
            return (
              <Reveal as="li" key={step.title} delay={i * 120} className="relative rounded-3xl bg-white p-8">
                <span className="font-display absolute end-7 top-5 text-6xl font-semibold text-sand" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="grid size-12 place-items-center rounded-2xl bg-abyss text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-xl font-bold text-abyss">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-mist">{step.text}</p>
              </Reveal>
            )
          })}
        </ol>
        <div className="mt-10 text-center">
          <Link to={path('/request')} className="btn-coral px-8">
            {t.nav.cta}
          </Link>
        </div>
      </div>
    </section>
  )
}

function Coast() {
  const { t } = useI18n()
  return (
    <section id="coast" className="relative isolate overflow-hidden bg-abyss py-20 text-white sm:py-28">
      <img
        src="/images/swell.webp"
        alt=""
        loading="lazy"
        width={1600}
        height={900}
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-abyss via-abyss/80 to-abyss" />
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <SectionHeading eyebrow={t.coast.eyebrow} title={t.coast.title} light>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">{t.coast.text}</p>
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2">
          {t.coast.places.map((place, i) => (
            <Reveal
              as="li"
              key={place.name}
              delay={i * 90}
              className="rounded-3xl border border-white/12 bg-white/6 p-6 backdrop-blur-sm"
            >
              <MapPin className="size-5 text-coral" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold">{place.name}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{place.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

function Gallery() {
  const { t } = useI18n()
  return (
    <section className="container-x py-20 sm:py-28">
      <SectionHeading eyebrow={t.gallery.eyebrow} title={t.gallery.title} className="max-w-2xl" />
      <div className="mt-12 grid grid-flow-dense auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[240px] sm:gap-4 lg:grid-cols-4">
        {GALLERY.map((img, i) => (
          <Reveal
            key={img.src}
            delay={(i % 4) * 80}
            className={`overflow-hidden rounded-2xl sm:rounded-3xl ${img.shape === 'tall' ? 'row-span-2' : ''} ${
              img.shape === 'wide' ? 'col-span-2' : ''
            }`}
          >
            <img
              src={img.src}
              alt=""
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          </Reveal>
        ))}
      </div>
      <p className="mt-4 text-xs text-mist">{t.gallery.note}</p>
    </section>
  )
}

function Faq() {
  const { t } = useI18n()
  return (
    <section id="faq" className="bg-foam py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <div className="divide-y divide-ink/10 rounded-3xl bg-white px-6 sm:px-8">
          {t.faq.items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-start text-base font-bold text-abyss [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus className="size-5 shrink-0 text-sea transition group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-3 leading-relaxed text-mist">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cta() {
  const { t, path } = useI18n()
  return (
    <section className="container-x py-20 sm:py-24">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-sea px-6 py-14 text-center text-white sm:px-12 sm:py-20">
        <img
          src="/images/aerial.webp"
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35 mix-blend-luminosity"
        />
        <h2 className="font-display mx-auto max-w-2xl text-4xl font-semibold text-balance sm:text-5xl">{t.cta.title}</h2>
        <p className="mx-auto mt-4 max-w-lg text-lg text-white/85">{t.cta.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to={path('/request')} className="btn-coral px-8">
            {t.cta.button}
          </Link>
          <a href={whatsappLink(t.contact.hello)} target="_blank" rel="noopener noreferrer" className="btn-light px-7">
            <WhatsAppIcon className="size-5 text-[#1a8f49]" />
            {t.cta.whatsapp}
          </a>
        </div>
      </Reveal>
    </section>
  )
}

function Contact() {
  const { t } = useI18n()
  return (
    <section id="contact" className="container-x pb-24">
      <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_40px_-28px_rgba(11,42,60,0.4)] lg:grid-cols-2">
        <div className="p-8 sm:p-12">
          <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} />
          <dl className="mt-8 space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />
              <div>
                <dt className="text-sm font-bold text-abyss">{t.contact.meeting}</dt>
                <dd className="text-mist">{t.contact.meetingValue}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-coral" aria-hidden="true" />
              <div>
                <dt className="text-sm font-bold text-abyss">{t.contact.hours}</dt>
                <dd className="text-mist">{t.contact.hoursValue}</dd>
              </div>
            </div>
            <div className="flex gap-4">
              <WhatsAppIcon className="mt-0.5 size-5 shrink-0 text-coral" />
              <div>
                <dt className="text-sm font-bold text-abyss">{t.contact.whatsapp}</dt>
                <dd className="text-mist" dir="ltr">
                  {formatPhone()}
                </dd>
              </div>
            </div>
          </dl>
          <a
            href={whatsappLink(t.contact.hello)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa mt-8 px-7"
          >
            <WhatsAppIcon />
            {t.contact.whatsappCta}
          </a>
        </div>
        <iframe
          title={t.contact.mapTitle}
          src="https://www.openstreetmap.org/export/embed.html?bbox=-3.9420%2C35.2380%2C-3.9080%2C35.2580&layer=mapnik&marker=35.2470%2C-3.9250"
          loading="lazy"
          className="min-h-80 w-full border-0 lg:min-h-full"
        />
      </div>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <HowItWorks />
      <Coast />
      <Gallery />
      <Faq />
      <Cta />
      <Contact />
    </>
  )
}
