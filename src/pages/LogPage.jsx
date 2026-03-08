import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import LoggerForm from '../components/LoggerForm'
import { useApp } from '../context/AppContext'

export default function LogPage() {
  const { t } = useApp()
  return (
    <div>
      <header className="bg-cream-200/90 backdrop-blur border-b border-cream-400/50 px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-xl hover:bg-cream-300 transition-colors text-coffee-700"
          aria-label={t('page.back', '返回')}
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-coffee-800">{t('page.logTitle', '冲煮记录')}</h1>
      </header>
      <LoggerForm />
    </div>
  )
}
