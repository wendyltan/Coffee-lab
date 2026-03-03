import { useState } from 'react'
import { Coffee } from '@phosphor-icons/react'
import { formatDateKey } from '../lib/utils'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export default function Calendar({ logsByDate, onSelectDate, selectedDate }) {
  const [viewDate, setViewDate] = useState(() => new Date())
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const prevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1))
  const nextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1))

  const todayKey = formatDateKey(new Date())
  const days = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-xl text-coffee-600 hover:bg-cream-300 transition-colors"
          aria-label="上月"
        >
          ‹
        </button>
        <span className="font-semibold text-coffee-800">
          {year}年{month + 1}月
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-xl text-coffee-600 hover:bg-cream-300 transition-colors"
          aria-label="下月"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-xs text-stone-500 py-1">
            {w}
          </div>
        ))}
        {days.map((day, idx) => {
          if (day === null) return <div key={`empty-${idx}`} />
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasLog = (logsByDate[dateKey] || []).length > 0
          const isToday = dateKey === todayKey
          const isSelected = selectedDate === dateKey
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => onSelectDate(dateKey)}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center text-sm
                transition-colors min-h-[2.5rem]
                ${isSelected ? 'bg-coffee-500 text-cream-100' : ''}
                ${!isSelected && isToday ? 'bg-sage-300/60 text-coffee-800' : ''}
                ${!isSelected && !isToday ? 'hover:bg-cream-300 text-coffee-700' : ''}
              `}
            >
              <span>{day}</span>
              {hasLog && (
                <Coffee
                  size={12}
                  className={isSelected ? 'text-cream-100' : 'text-coffee-500'}
                  strokeWidth={2.5}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
