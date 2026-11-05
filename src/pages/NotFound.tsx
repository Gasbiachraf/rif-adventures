import { Link } from 'react-router-dom'
import { Anchor } from 'lucide-react'
import { useI18n } from '../i18n'

export function NotFound({ message }: { message?: string }) {
  const { t, path } = useI18n()
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <Anchor className="mx-auto size-12 text-sea" aria-hidden="true" />
        <h1 className="font-display mt-6 text-4xl font-semibold text-abyss">{t.notFound.title}</h1>
        <p className="mx-auto mt-3 max-w-md text-mist">{message ?? t.notFound.text}</p>
        <Link to={path()} className="btn-coral mt-8">
          {t.notFound.home}
        </Link>
      </div>
    </section>
  )
}
