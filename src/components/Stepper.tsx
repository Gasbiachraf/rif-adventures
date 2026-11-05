import { Minus, Plus } from 'lucide-react'
import { useI18n } from '../i18n'

export function Stepper({
  id,
  label,
  value,
  min,
  max,
  onChange,
}: {
  id: string
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  const { t } = useI18n()
  return (
    <div className="flex items-center justify-between gap-3" role="group" aria-labelledby={id}>
      <span id={id} className="text-sm font-semibold">
        {label}
      </span>
      <div className="flex items-center gap-1 rounded-full bg-foam p-1">
        <button
          type="button"
          aria-label={`${t.form.decrease} — ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="grid size-10 place-items-center rounded-full bg-white text-abyss transition hover:bg-sand disabled:opacity-40"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <output className="w-8 text-center font-bold" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          aria-label={`${t.form.increase} — ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="grid size-10 place-items-center rounded-full bg-white text-abyss transition hover:bg-sand disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
