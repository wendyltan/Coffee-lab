import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, ChartBar, ArrowsLeftRight, Star } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { BREW_METHODS, ROAST_LEVELS } from '../lib/constants'
import { formatDateKey } from '../lib/utils'
import { getRoastIcon, getBrewMethodIcon, DEFAULT_ICON_SIZE } from '../lib/iconMap'

function getMethodLabel(v, t) {
  const map = {
    moka: t('brew.moka', '摩卡壶'),
    espresso: t('brew.espresso', '咖啡机'),
    pour_over: t('brew.pour_over', '手冲'),
  }
  return map[v] ?? v
}

function getRoastLabel(v, t) {
  const map = {
    light: t('roast.light', '浅烘'),
    medium: t('roast.medium', '中烘'),
    dark: t('roast.dark', '深烘'),
  }
  return map[v] ?? v
}

export default function StatsPage() {
  const navigate = useNavigate()
  const { logs, t } = useApp()
  const [selectedIds, setSelectedIds] = useState([])

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 2) return [prev[1], id]
      return [...prev, id]
    })
  }

  const startCompare = () => {
    if (selectedIds.length !== 2) return
    navigate('/compare', { state: { leftId: selectedIds[0], rightId: selectedIds[1] } })
  }

  const total = logs.length
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const thisWeek = logs.filter((l) => l.date >= formatDateKey(weekAgo)).length

  const byMethod = {}
  const byRoast = {}
  logs.forEach((l) => {
    byMethod[l.brewMethod] = (byMethod[l.brewMethod] || 0) + 1
    byRoast[l.roast] = (byRoast[l.roast] || 0) + 1
  })

  const getDisplayTitle = (log) => {
    const name = (log.recipeName || '').trim()
    return name || t('daylist.defaultDrink', '默认饮品')
  }

  const getBeanText = (log) => {
    return (log.beanName || log.bean?.name || t('daylist.unnamedBean', '未命名豆子')).trim()
  }

  const getScoreText = (rating) => {
    const n = Number(rating)
    const safe = Number.isFinite(n) ? Math.max(0, Math.min(5, Math.round(n))) : 0
    return `${safe}/5`
  }

  const getScoreTone = (rating) => {
    const n = Number(rating)
    const safe = Number.isFinite(n) ? Math.max(0, Math.min(5, Math.round(n))) : 0
    if (safe >= 4) return 'bg-sage-300/40 text-sage-500 border border-sage-400/40'
    if (safe === 3) return 'bg-peach-300/35 text-peach-500 border border-peach-400/40'
    if (safe >= 1) return 'bg-red-100 text-red-600 border border-red-200'
    return 'bg-cream-300/70 text-stone-500 border border-cream-400/60'
  }

  return (
    <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0px)+7rem)]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
          <ChartBar size={28} weight="duotone" />
          {t('page.statsTitle', '统计')}
        </h1>
        <p className="text-stone-500 text-sm mt-1">{t('page.statsDesc', '总览与记录对比')}</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card">
          <p className="text-sm text-stone-500">{t('page.totalLogs', '总记录数')}</p>
          <p className="text-2xl font-bold text-coffee-700 flex items-center gap-1">
            <Coffee size={24} weight="fill" />
            {total}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-stone-500">{t('page.thisWeek', '本周')}</p>
          <p className="text-2xl font-bold text-sage-500">{thisWeek}</p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-coffee-800 mb-2">{t('page.methodDist', '制作方式分布')}</h3>
        <div className="space-y-2">
          {BREW_METHODS.map((m) => {
            const count = byMethod[m.value] || 0
            const pct = total ? ((count / total) * 100).toFixed(0) : 0
            const MethodIcon = getBrewMethodIcon(m.value)
            return (
              <div key={m.value} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-coffee-700 w-20">
                  <MethodIcon size={DEFAULT_ICON_SIZE} weight="duotone" />
                  {getMethodLabel(m.value, t)}
                </span>
                <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-coffee-400 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-sm text-stone-500 w-8">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-coffee-800 mb-2">{t('page.roastDist', '烘焙度分布')}</h3>
        <div className="flex flex-wrap gap-2">
          {ROAST_LEVELS.map((r) => {
            const Icon = getRoastIcon(r.value)
            return (
              <span
                key={r.value}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-300 text-coffee-700 text-sm"
              >
                <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
                {getRoastLabel(r.value, t)}: {byRoast[r.value] || 0}
              </span>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-coffee-800 mb-2 flex items-center gap-2">
          <ArrowsLeftRight size={18} weight="bold" />
          {t('page.comparePick', '选择两条记录进行对比')}
        </h3>
        <p className="text-sm text-stone-500 mb-3">{t('page.compareHint', '勾选两条记录后点击「开始对比」')}</p>
        {selectedIds.length === 2 && (
          <button
            type="button"
            onClick={startCompare}
            className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
          >
            <ArrowsLeftRight size={18} weight="bold" />
            {t('page.startCompare', '开始对比')}
          </button>
        )}
        {logs.length === 0 ? (
          <p className="text-stone-500 text-center py-4">{t('page.noLogs', '暂无记录')}</p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {logs.slice(0, 50).map((log) => {
              const checked = selectedIds.includes(log.id)
              return (
                <label
                  key={log.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-colors ${
                    checked ? 'bg-sage-300/40 border-2 border-sage-400' : 'bg-cream-200/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(log.id)}
                    className="w-5 h-5 rounded border-coffee-400 text-sage-500"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-coffee-800 truncate flex items-center justify-between gap-2">
                      <span className="truncate">{getDisplayTitle(log)}</span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold flex-shrink-0 px-2 py-0.5 rounded-full ${getScoreTone(log.rating)}`}
                        title={`${t('daylist.score', '评分')}: ${getScoreText(log.rating)}`}
                      >
                        <Star size={12} weight="fill" className="opacity-90" />
                        {getScoreText(log.rating)}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      {log.date} · {getBeanText(log)} · {getRoastLabel(log.roast, t)} · {getMethodLabel(log.brewMethod, t)} · {log.doseG}g / {log.yieldMl}ml
                    </p>
                  </div>
                </label>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
