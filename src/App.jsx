import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { House, Heart, SquaresFour, ChartBar } from '@phosphor-icons/react'
import HomePage from './pages/HomePage'
import DayPage from './pages/DayPage'
import LogPage from './pages/LogPage'
import FavoritesPage from './pages/FavoritesPage'
import TemplatesPage from './pages/TemplatesPage'
import StatsPage from './pages/StatsPage'
import ComparePage from './pages/ComparePage'
import Layout from './components/Layout'

const navItems = [
  { path: '/', icon: House, label: '首页' },
  { path: '/favorites', icon: Heart, label: '精选冲煮' },
  { path: '/templates', icon: SquaresFour, label: '模板' },
  { path: '/stats', icon: ChartBar, label: '统计' },
]

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCompare = location.pathname === '/compare'

  return (
    <div className="min-h-screen bg-cream-200 pb-safe">
      <Layout showNav={!isCompare}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/day/:date" element={<DayPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/log/:id" element={<LogPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/compare" element={<ComparePage />} />
        </Routes>
      </Layout>

      {!isCompare && (
        <nav className="fixed bottom-0 left-0 right-0 bg-cream-100/95 border-t border-cream-400/50 shadow-soft pb-safe z-50">
          <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const active = location.pathname === path
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors ${
                    active ? 'text-coffee-600' : 'text-stone-400'
                  }`}
                  aria-label={label}
                >
                  <Icon size={24} weight={active ? 'fill' : 'regular'} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
