import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Coffee, CaretRight, Trash, Heart } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { BREW_METHODS, ROAST_LEVELS } from '../lib/constants'

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
  const { deleteLog, toggleFavoriteLog } = useApp()
  const [swipedId, setSwipedId] = useState(null)
  const startXRef = useRef(null)
  const movedRef = useRef(false)
  const activePointerIdRef = useRef(null)

  const handlePointerDown = (id, e) => {
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    movedRef.current = false
    setSwipedId(null)
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
    } else if (deltaX > 40 && swipedId === id) {
      movedRef.current = true
      setSwipedId(null)
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

  if (!logs || logs.length === 0) {
    return (
      <div className="card text-center py-8 text-stone-500">
        <Coffee className="mx-auto mb-2 text-cream-500" size={32} />
        <p>{emptyMessage ?? '这一天还没有记录哦'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-stone-500 px-1">{dateLabel}</h3>
      {logs.map((log) => (
        <div key={log.id} className="relative overflow-hidden rounded-3xl">
          {/* 删除条：左滑后最右侧露出 */}
          <button
            type="button"
            onClick={() => deleteLog(log.id)}
            className="absolute inset-y-0 right-0 w-[72px] flex items-center justify-center bg-red-500 text-white rounded-r-3xl z-0"
            aria-label="删除"
          >
            <Trash size={22} weight="bold" />
          </button>

          {/* 精选条：紧贴删除条左侧，心形图标，颜色与删除区分 */}
          <button
            type="button"
            onClick={() => toggleFavoriteLog(log.id)}
            className="absolute inset-y-0 right-[72px] w-[72px] flex items-center justify-center bg-coffee-500/90 text-cream-100 z-0"
            aria-label={log.isFavorite ? '取消精选' : '精选'}
          >
            <Heart size={22} weight={log.isFavorite ? 'fill' : 'regular'} />
          </button>

          {/* 卡片：左滑时露出精选与删除 */}
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
            style={{ touchAction: 'pan-y', transform: swipedId === log.id ? `translateX(-${SWIPE_REVEAL_WIDTH}px)` : 'translateX(0)' }}
            className="relative z-10 w-full text-left flex items-center gap-3 py-3 px-4 bg-cream-100 border border-cream-400/50 shadow-card active:scale-[0.99] transition-transform duration-200 ease-out rounded-3xl"
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
              <p className="font-medium text-coffee-800 truncate">
                {log.beanName || log.bean?.name || '未命名豆子'}
              </p>
              <p className="text-sm text-stone-500">
                {getRoastLabel(log.roast)} · {getMethodLabel(log.brewMethod)} ·{' '}
                {log.doseG}g / {log.yieldMl}ml
              </p>
            </div>
            <CaretRight className="text-stone-400 flex-shrink-0" size={18} weight="bold" />
          </button>
        </div>
      ))}
    </div>
  )
}
