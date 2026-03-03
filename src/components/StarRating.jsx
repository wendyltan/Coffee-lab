import { Star } from '@phosphor-icons/react'

export default function StarRating({ value = 0, onChange }) {
  const max = 5
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 rounded-lg transition-transform active:scale-90"
          aria-label={`${star}星`}
        >
          <Star
            size={26}
            weight={star <= value ? 'fill' : 'regular'}
            className={
              star <= value
                ? 'text-peach-400'
                : 'text-cream-500'
            }
          />
        </button>
      ))}
    </div>
  )
}
