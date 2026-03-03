import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, ChartBar, ArrowsLeftRight } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { BREW_METHODS, ROAST_LEVELS } from '../lib/constants'
import { formatDateKey } from '../lib/utils'
import { getRoastIcon, getBrewMethodIcon, DEFAULT_ICON_SIZE } from '../lib/iconMap'

function getMethodLabel(v) {
  return BREW_METHODS.find((m) => m.value === v)?.label ?? v
}

function getRoastLabel(v) {
  return ROAST_LEVELS.find((r) => r.value === v)?.label ?? v
}

export default function StatsPage() {
  const navigate = useNavigate()
  const { logs } = useApp()
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

  return (
    <div className="p-4 pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
          <ChartBar size={28} weight="duotone" />
          统计
        </h1>
        <p className="text-stone-500 text-sm mt-1">总览与记录对比</p>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card">
          <p className="text-sm text-stone-500">总记录数</p>
          <p className="text-2xl font-bold text-coffee-700 flex items-center gap-1">
            <Coffee size={24} weight="fill" />
            {total}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-stone-500">本周</p>
          <p className="text-2xl font-bold text-sage-500">{thisWeek}</p>
        </div>
      </div>

      <div className="card mb-6">
        <h3 className="font-semibold text-coffee-800 mb-2">制作方式分布</h3>
        <div className="space-y-2">
          {BREW_METHODS.map((m) => {
            const count = byMethod[m.value] || 0
            const pct = total ? ((count / total) * 100).toFixed(0) : 0
            const MethodIcon = getBrewMethodIcon(m.value)
            return (
              <div key={m.value} className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-coffee-700 w-20">
                  <MethodIcon size={DEFAULT_ICON_SIZE} weight="duotone" />
                  {m.label}
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
        <h3 className="font-semibold text-coffee-800 mb-2">烘焙度分布</h3>
        <div className="flex flex-wrap gap-2">
          {ROAST_LEVELS.map((r) => {
            const Icon = getRoastIcon(r.value)
            return (
              <span
                key={r.value}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-300 text-coffee-700 text-sm"
              >
                <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
                {getRoastLabel(r.value)}: {byRoast[r.value] || 0}
              </span>
            )
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-coffee-800 mb-2 flex items-center gap-2">
          <ArrowsLeftRight size={18} weight="bold" />
          选择两条记录进行对比
        </h3>
        <p className="text-sm text-stone-500 mb-3">勾选两条记录后点击「开始对比」</p>
        {selectedIds.length === 2 && (
          <button
            type="button"
            onClick={startCompare}
            className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
          >
            <ArrowsLeftRight size={18} weight="bold" />
            开始对比
          </button>
        )}
        {logs.length === 0 ? (
          <p className="text-stone-500 text-center py-4">暂无记录</p>
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
                    <p className="font-medium text-coffee-800 truncate">
                      {log.beanName || '未命名'}
                    </p>
                    <p className="text-xs text-stone-500">
                      {log.date} · {getMethodLabel(log.brewMethod)} · {log.doseG}g / {log.yieldMl}ml
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
