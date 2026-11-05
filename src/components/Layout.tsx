import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Globe, Menu, X } from 'lucide-react'
import { LANGS, LANG_LABELS, useI18n, type Lang } from '../i18n'
import { whatsappLink } from '../lib/whatsapp'
import { WhatsAppIcon } from './ui'

function Logo({ light }: { light: boolean }) {
  const { t, path } = useI18n()
  return (
    <Link to={path()} aria-label={t.nav.home} className="flex items-center gap-2.5">
      <svg viewBox="0 0 64 64" className="size-9 shrink-0" aria-hidden="true">
        <rect width="64" height="64" rx="16" fill={light ? '#fff' : '#0b2a3c'} />
        <path
          d="M12 40c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4"
          fill="none"
          stroke={light ? '#0b2a3c' : '#f6f1e7'}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M12 49c5 0 5-4 10-4s5 4 10 4 5-4 10-4 5 4 10 4"
          fill="none"
          stroke="#e4603f"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M32 12v20l11-3z" fill={light ? '#0b2a3c' : '#f6f1e7'} />
      </svg>
      <span className={`font-display text-xl font-semibold tracking-tight ${light ? 'text-white' : 'text-abyss'}`} dir="ltr">
        Rif Adventures
      </span>
    </Link>
  )
}

function LangSwitcher({ light, onPick }: { light: boolean; onPick?: () => void }) {
  const { lang, t } = useI18n()
  const { pathname, search, hash } = useLocation()
  const swap = (to: Lang) => pathname.replace(/^\/(fr|ar|en)(?=\/|$)/, `/${to}`) + search + hash

  return (
    <nav aria-label={t.nav.language} className="flex items-center gap-1">
      <Globe className={`size-4 ${light ? 'text-white/70' : 'text-mist'}`} aria-hidden="true" />
      {LANGS.map((code) => (
        <Link
          key={code}
          to={swap(code)}
          onClick={onPick}
          lang={code}
          hrefLang={code}
          aria-current={code === lang ? 'true' : undefined}
          title={LANG_LABELS[code].name}
          className={`grid min-h-9 min-w-9 place-items-center rounded-full px-2 text-xs font-bold transition ${
            code === lang
              ? light
                ? 'bg-white text-abyss'
                : 'bg-abyss text-white'
              : light
                ? 'text-white/85 hover:bg-white/15'
                : 'text-ink/70 hover:bg-abyss/8'
          }`}
        >
          {LANG_LABELS[code].short}
        </Link>
      ))}
    </nav>
  )
}

function Header() {
  const { t, path } = useI18n()
  const { pathname } = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const isHome = /^\/(fr|ar|en)\/?$/.test(pathname)
  const light = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  const links = [
    { to: path('/activities'), label: t.nav.activities },
    { to: path('/#how'), label: t.nav.how },
    { to: path('/#coast'), label: t.nav.coast },
    { to: path('/#faq'), label: t.nav.faq },
    { to: path('/#contact'), label: t.nav.contact },
  ]

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        light ? 'bg-transparent' : 'bg-shell/90 shadow-[0_1px_0_rgba(19,33,43,0.08)] backdrop-blur-lg'
      } ${isHome ? '-mb-[4.5rem]' : ''}`}
    >
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Logo light={light} />

        <nav aria-label="Navigation" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                light ? 'text-white/90 hover:bg-white/15' : 'text-ink/80 hover:bg-abyss/6 hover:text-abyss'
              }`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LangSwitcher light={light} />
          <Link to={path('/request')} className="btn-coral min-h-11 px-5">
            {t.nav.cta}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? t.nav.close : t.nav.menu}
          className={`grid size-11 place-items-center rounded-full lg:hidden ${light ? 'text-white' : 'text-abyss'}`}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-ink/8 bg-shell lg:hidden">
          <nav aria-label="Navigation" className="container-x flex flex-col py-3">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3.5 text-base font-semibold text-abyss hover:bg-foam"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-ink/8 px-1 pt-4 pb-2">
              <LangSwitcher light={false} onPick={() => setOpen(false)} />
              <Link to={path('/request')} className="btn-coral min-h-11 px-5">
                {t.nav.cta}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function MobileBar() {
  const { t, path } = useI18n()
  const { pathname } = useLocation()
  if (pathname.endsWith('/request')) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-shell/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
      <div className="flex gap-2">
        <Link to={path('/request')} className="btn-coral flex-1">
          {t.nav.cta}
        </Link>
        <a
          href={whatsappLink(t.contact.hello)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.contact.whatsappCta}
          className="btn-wa aspect-square px-0"
        >
          <WhatsAppIcon className="size-6" />
        </a>
      </div>
    </div>
  )
}

function Footer() {
  const { t, path } = useI18n()
  return (
    <footer className="bg-abyss pt-16 pb-28 text-white/75 md:pb-12">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">{t.footer.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-white">{t.footer.explore}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to={path('/activities')} className="hover:text-white">
                {t.nav.activities}
              </Link>
            </li>
            <li>
              <Link to={path('/#how')} className="hover:text-white">
                {t.nav.how}
              </Link>
            </li>
            <li>
              <Link to={path('/#faq')} className="hover:text-white">
                {t.nav.faq}
              </Link>
            </li>
            <li>
              <Link to={path('/request')} className="hover:text-white">
                {t.nav.cta}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-white">{t.contact.whatsapp}</p>
          <a
            href={whatsappLink(t.contact.hello)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm hover:text-white"
          >
            <WhatsAppIcon className="size-4" />
            {t.contact.whatsappCta}
          </a>
          <p className="mt-2 text-sm">{t.contact.meetingValue}</p>
        </div>
      </div>

      <div className="container-x mt-12 border-t border-white/10 pt-6 text-xs leading-relaxed">
        <p className="max-w-3xl">{t.footer.concept}</p>
        <p className="mt-2">{t.footer.safety}</p>
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-white/55">
          <p>
            © {new Date().getFullYear()} Rif Adventures — Concept Demo · {t.footer.photos}
          </p>
          <p>
            {t.footer.madeBy}{' '}
            <a href="https://innovatechs.vercel.app/" className="font-semibold text-white hover:text-lagoon">
              Innovatechs
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

/** Scrolls to the hash target, or to the top when the page changes. */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

export function Layout({ children }: { children?: ReactNode }) {
  const { t } = useI18n()
  return (
    <>
      <ScrollManager />
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-abyss px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <div className="relative z-50 bg-abyss px-4 py-2 text-center text-xs font-medium text-white/85">{t.banner}</div>
      <Header />
      <main id="main">
        {children ?? <Outlet />}
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
