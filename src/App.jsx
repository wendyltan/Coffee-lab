import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { House, Heart, SquaresFour, ChartBar, GearSix } from '@phosphor-icons/react'
import HomePage from './pages/HomePage'
import DayPage from './pages/DayPage'
import LogPage from './pages/LogPage'
import FavoritesPage from './pages/FavoritesPage'
import TemplatesPage from './pages/TemplatesPage'
import StatsPage from './pages/StatsPage'
import ComparePage from './pages/ComparePage'
import SettingsPage from './pages/SettingsPage'
import SubscriptionPage from './pages/SubscriptionPage'
import Layout from './components/Layout'
import { useApp } from './context/AppContext'
import { triggerHaptic } from './lib/haptics'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t, language } = useApp()
  const [keyboardOpenByFocus, setKeyboardOpenByFocus] = useState(false)
  const [keyboardOpenByViewport, setKeyboardOpenByViewport] = useState(false)
  const isCompare = location.pathname === '/compare'
  const isKeyboardOpen = keyboardOpenByFocus || keyboardOpenByViewport
  const navItems = [
    { path: '/', icon: House, label: t('nav.home', '首页') },
    { path: '/favorites', icon: Heart, label: t('nav.favorites', '精选冲煮') },
    { path: '/templates', icon: SquaresFour, label: t('nav.templates', '模板') },
    { path: '/stats', icon: ChartBar, label: t('nav.stats', '统计') },
    { path: '/settings', icon: GearSix, label: t('nav.settings', '设置') },
  ]
  const activeIndex = (() => {
    const exact = navItems.findIndex((item) => item.path === location.pathname)
    if (exact >= 0) return exact
    if (location.pathname.startsWith('/day/') || location.pathname.startsWith('/log')) return 0
    return 0
  })()

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN'
    document.title = language === 'en' ? 'CoffeeLab Brew Log' : 'CoffeeLab ☕ 冲煮记录'
  }, [language])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const { StatusBar, Style } = await import('@capacitor/status-bar')
        if (!mounted) return
        await StatusBar.setOverlaysWebView({ overlay: false })
        await StatusBar.setBackgroundColor({ color: '#F5F0E8' })
        await StatusBar.setStyle({ style: Style.Dark })
      } catch {
        // Web or unsupported runtime: ignore.
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const isEditable = (el) => {
      if (!el || !(el instanceof HTMLElement)) return false
      if (el.isContentEditable) return true
      const tag = el.tagName
      if (tag === 'TEXTAREA') return true
      if (tag !== 'INPUT') return false
      const type = (el.getAttribute('type') || 'text').toLowerCase()
      return !['button', 'checkbox', 'radio', 'range', 'submit', 'reset', 'file', 'color'].includes(type)
    }

    const onFocusIn = (e) => {
      if (isEditable(e.target)) setKeyboardOpenByFocus(true)
    }
    const onFocusOut = () => {
      setTimeout(() => {
        setKeyboardOpenByFocus(isEditable(document.activeElement))
      }, 0)
    }

    const vv = window.visualViewport
    const onViewportResize = () => {
      if (!vv) return
      // iOS keyboard typically shrinks visual viewport significantly.
      setKeyboardOpenByViewport(vv.height < window.innerHeight * 0.82)
    }

    window.addEventListener('focusin', onFocusIn)
    window.addEventListener('focusout', onFocusOut)
    vv?.addEventListener('resize', onViewportResize)
    onViewportResize()

    return () => {
      window.removeEventListener('focusin', onFocusIn)
      window.removeEventListener('focusout', onFocusOut)
      vv?.removeEventListener('resize', onViewportResize)
    }
  }, [])

  return (
    <div className="h-[100dvh] bg-cream-200 overflow-hidden flex flex-col">
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
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
        </Routes>
      </Layout>

      {!isCompare && !isKeyboardOpen && (
        <nav className="relative z-40 shrink-0">
          <div className="max-w-lg mx-auto px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.5rem)]">
            <div className="liquid-nav relative h-14 rounded-3xl border border-white/55 bg-cream-100/55 backdrop-blur-xl shadow-soft overflow-hidden">
              <span
                className="absolute top-1 bottom-1 rounded-2xl liquid-nav-indicator transition-transform duration-300 ease-out"
                style={{
                  left: '0.25rem',
                  width: `calc((100% - 0.5rem) / ${navItems.length})`,
                  transform: `translateX(${activeIndex * 100}%)`,
                }}
              />
              <div className="relative z-10 flex justify-around items-center h-14">
                {navItems.map(({ path, icon: Icon, label }, idx) => {
                  const active = idx === activeIndex
                  return (
                    <button
                      key={path}
                      onClick={() => {
                        if (!active) triggerHaptic('light')
                        navigate(path)
                      }}
                      className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors relative ${
                        active ? 'text-coffee-700' : 'text-stone-500'
                      }`}
                      aria-label={label}
                    >
                      <Icon size={24} weight={active ? 'fill' : 'regular'} />
                      <span className="text-xs font-medium">{label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
