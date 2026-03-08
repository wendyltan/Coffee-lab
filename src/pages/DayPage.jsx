import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import DayLogList from '../components/DayLogList'

function formatDisplayDate(dateKey) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

function formatDisplayDateEn(dateKey) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-')
  if (!y || !m || !d) return dateKey
  const dt = new Date(Number(y), Number(m) - 1, Number(d))
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DayPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const { logsByDate, t, language } = useApp()
  const dayLogs = logsByDate[date] || []
  const dateText = language === 'en' ? formatDisplayDateEn(date) : formatDisplayDate(date)

  return (
    <div className="p-4 pb-6">
      <header className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-cream-300 text-coffee-700"
          aria-label={t('page.back', '返回')}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold text-coffee-800">
          {dateText}
        </h1>
        <div className="w-10" />
      </header>

      <div className="flex justify-end mb-4">
        <Link
          to="/log"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          {t('page.addLog', '添加记录')}
        </Link>
      </div>

      <DayLogList logs={dayLogs} dateLabel={dateText} />
    </div>
  )
}
