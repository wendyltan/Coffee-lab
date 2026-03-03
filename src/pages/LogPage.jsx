import { Link } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import LoggerForm from '../components/LoggerForm'

export default function LogPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-cream-200/90 backdrop-blur border-b border-cream-400/50 px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="p-2 rounded-xl hover:bg-cream-300 transition-colors text-coffee-700"
          aria-label="返回"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-lg font-semibold text-coffee-800">冲煮记录</h1>
      </header>
      <LoggerForm />
    </div>
  )
}
