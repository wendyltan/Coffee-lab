import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Plus } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import DayLogList from '../components/DayLogList'

function formatDisplayDate(dateKey) {
  if (!dateKey) return ''
  const [y, m, d] = dateKey.split('-')
  return `${y}年${Number(m)}月${Number(d)}日`
}

export default function DayPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const { logsByDate } = useApp()
  const dayLogs = logsByDate[date] || []

  return (
    <div className="p-4 pb-6">
      <header className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-cream-300 text-coffee-700"
          aria-label="返回"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold text-coffee-800">
          {formatDisplayDate(date)}
        </h1>
        <div className="w-10" />
      </header>

      <div className="flex justify-end mb-4">
        <Link
          to="/log"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          添加记录
        </Link>
      </div>

      <DayLogList logs={dayLogs} dateLabel={formatDisplayDate(date)} />
    </div>
  )
}
