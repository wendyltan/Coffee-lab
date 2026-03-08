import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, CaretRight, Trash, Heart, Star } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { BREW_METHODS, ROAST_LEVELS } from '../lib/constants'
import { triggerHaptic } from '../lib/haptics'

function getMethodLabel(value) {
  return BREW_METHODS.find((m) => m.value === value)?.label || value
}

function getRoastLabel(value) {
  return ROAST_LEVELS.find((r) => r.value === value)?.label || value
}

const STRIP_WIDTH = 72
const SWIPE_REVEAL_WIDTH = STRIP_WIDTH * 2

export default function DayLogList({ logs, dateLabel, emptyMessage }) {
  const navigate = useNavigate()
  const { deleteLog, toggleFavoriteLog, t } = useApp()
  const getMethodText = (value) => {
    const map = {
      moka: t('brew.moka', '摩卡壶'),
      espresso: t('brew.espresso', '咖啡机'),
      pour_over: t('brew.pour_over', '手冲'),
    }
    return map[value] || getMethodLabel(value)
  }
  const getRoastText = (value) => {
    const map = {
      light: t('roast.light', '浅烘'),
      medium: t('roast.medium', '中烘'),
      dark: t('roast.dark', '深烘'),
    }
    return map[value] || getRoastLabel(value)
  }
  const [swipedId, setSwipedId] = useState(null)
  const startXRef = useRef(null)
  const movedRef = useRef(false)
  const activePointerIdRef = useRef(null)
  const swipedStateRef = useRef(false)

  const handlePointerDown = (id, e) => {
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    movedRef.current = false
    setSwipedId(null)
    swipedStateRef.current = false
    // 让后续 move 在指针离开元素后仍能被捕获（移动端/触控板更稳）
    if (typeof e.pointerId === 'number' && e.currentTarget?.setPointerCapture) {
      activePointerIdRef.current = e.pointerId
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        // ignore
      }
    }
  }

  const handlePointerMove = (id, e) => {
    if (startXRef.current == null) return
    const currentX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const deltaX = currentX - startXRef.current
    if (deltaX < -40) {
      movedRef.current = true
      setSwipedId(id)
      if (!swipedStateRef.current) {
        swipedStateRef.current = true
        triggerHaptic('light')
      }
    } else if (deltaX > 40 && swipedId === id) {
      movedRef.current = true
      setSwipedId(null)
      if (swipedStateRef.current) {
        swipedStateRef.current = false
        triggerHaptic('light')
      }
    }
  }

  const handlePointerEnd = (e) => {
    startXRef.current = null
    if (
      typeof activePointerIdRef.current === 'number' &&
      e?.currentTarget?.releasePointerCapture
    ) {
      try {
        e.currentTarget.releasePointerCapture(activePointerIdRef.current)
      } catch {
        // ignore
      }
    }
    activePointerIdRef.current = null
  }

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

  if (!logs || logs.length === 0) {
    return (
      <div className="card text-center py-8 text-stone-500">
        <Coffee className="mx-auto mb-2 text-cream-500" size={32} />
        <p>{emptyMessage ?? t('daylist.empty', '这一天还没有记录哦')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-stone-500 px-1">{dateLabel}</h3>
      {logs.map((log) => {
        const isSwiped = swipedId === log.id
        return (
        <div key={log.id} className="relative overflow-hidden rounded-3xl bg-cream-100">
          {/* 删除条：左滑后最右侧露出 */}
          <button
            type="button"
            onClick={() => deleteLog(log.id)}
            onPointerDown={() => triggerHaptic('medium')}
            className={`absolute inset-y-0 right-0 w-[72px] flex items-center justify-center bg-red-500 text-white rounded-r-3xl z-0 transition-opacity duration-150 ${
              isSwiped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-label={t('daylist.delete', '删除')}
          >
            <Trash size={22} weight="bold" />
          </button>

          {/* 精选条：紧贴删除条左侧，点击后自动收回 */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleFavoriteLog(log.id)
              setSwipedId(null)
              swipedStateRef.current = false
              triggerHaptic('medium')
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className={`absolute inset-y-0 right-[72px] w-[72px] flex items-center justify-center bg-coffee-500/90 text-cream-100 z-0 transition-opacity duration-150 ${
              isSwiped ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            aria-label={log.isFavorite ? t('daylist.unfavorite', '取消精选') : t('daylist.favorite', '精选')}
          >
            <Heart size={22} weight={log.isFavorite ? 'fill' : 'regular'} />
          </button>

          {/* 卡片：左滑后无间隙贴精选条 */}
          <button
            type="button"
            onClick={() => {
              if (movedRef.current) {
                movedRef.current = false
                return
              }
              navigate(`/log/${log.id}`)
            }}
            onPointerDown={(e) => handlePointerDown(log.id, e)}
            onPointerMove={(e) => handlePointerMove(log.id, e)}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            style={{
              touchAction: 'pan-y',
              transform: isSwiped ? `translateX(-${SWIPE_REVEAL_WIDTH}px)` : 'translateX(0)',
              boxShadow: '0 4px 20px rgba(92, 83, 70, 0.06)',
            }}
            className="relative z-10 w-full text-left flex items-center gap-3 py-3 px-4 bg-cream-100 border border-cream-400/50 active:scale-[0.99] transition-transform duration-200 ease-out rounded-3xl"
          >
            <div className="relative w-10 h-10 rounded-2xl bg-coffee-500/15 flex items-center justify-center flex-shrink-0 overflow-visible">
              <Coffee className="text-coffee-600" size={20} weight="fill" />
              {log.isFavorite && (
                <Heart
                  size={12}
                  weight="fill"
                  className="absolute -bottom-0.5 -right-0.5 text-coffee-500"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-coffee-800 truncate">
                  {getDisplayTitle(log)}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold flex-shrink-0 px-2 py-0.5 rounded-full ${getScoreTone(log.rating)}`}
                  title={`${t('daylist.score', '评分')}: ${getScoreText(log.rating)}`}
                >
                  <Star size={12} weight="fill" className="opacity-90" />
                  {getScoreText(log.rating)}
                </span>
              </div>
              <p className="text-sm text-stone-500">
                {getBeanText(log)} · {getRoastText(log.roast)} · {getMethodText(log.brewMethod)} ·{' '}
                {log.doseG}g / {log.yieldMl}ml
              </p>
            </div>
            <CaretRight className="text-stone-400 flex-shrink-0" size={18} weight="bold" />
          </button>
        </div>
      )})}
    </div>
  )
}
