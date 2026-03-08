import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import CompareView from '../components/CompareView'

export default function ComparePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logs, t } = useApp()
  const state = location.state || {}
  const leftId = state.leftId
  const rightId = state.rightId

  const left = leftId ? logs.find((l) => l.id === leftId) : null
  const right = rightId ? logs.find((l) => l.id === rightId) : null

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="sticky top-safe z-10 bg-cream-200/95 backdrop-blur border-b border-cream-400/50 px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/stats')}
          className="p-2 rounded-xl hover:bg-cream-300 text-coffee-700"
          aria-label={t('page.back', '返回')}
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold text-coffee-800">{t('page.compareTitle', 'PK 对比')}</h1>
        <div className="w-10" />
      </header>

      {left && right ? (
        <CompareView left={left} right={right} />
      ) : (
        <div className="p-6 text-center text-stone-500">
          <p>{t('page.compareMissing', '请从统计页选择两条记录后再进入对比')}</p>
          <button
            type="button"
            onClick={() => navigate('/stats')}
            className="btn-primary mt-4"
          >
            {t('page.goStats', '去统计页选择')}
          </button>
        </div>
      )}
    </div>
  )
}
