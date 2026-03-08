import { useState, useRef, useEffect } from 'react'
import { X, Plus } from '@phosphor-icons/react'
import { RECIPE_INGREDIENT_PRESETS } from '../../lib/constants'
import { getIngredientIcon, DEFAULT_ICON_SIZE } from '../../lib/iconMap'
import { useApp } from '../../context/AppContext'

const CUP_HEIGHT_PX = 160

function getIngredientColor(name, customColor) {
  if (customColor) return customColor
  const preset = RECIPE_INGREDIENT_PRESETS.find((p) => p.name === name)
  return preset?.color ?? '#A89F94'
}

export default function RecipeBuilder({ ingredients = [], onChange, onClose, onSave }) {
  const { language } = useApp()
  const [list, setList] = useState(() => ingredients.map((i) => ({ ...i })))
  const [modal, setModal] = useState(null)
  const [customName, setCustomName] = useState('')
  const [customMl, setCustomMl] = useState('')
  const [customColor, setCustomColor] = useState('#A89F94')
  const [mlInput, setMlInput] = useState('')
  const [foamCm, setFoamCm] = useState('')
  const [lastAddedIndex, setLastAddedIndex] = useState(null)
  const cupRef = useRef(null)

  useEffect(() => {
    if (lastAddedIndex == null) return
    const t = setTimeout(() => setLastAddedIndex(null), 450)
    return () => clearTimeout(t)
  }, [lastAddedIndex])

  const totalMl = list.reduce((s, i) => s + (Number(i.ml) || 0), 0)
  const iceLayer = list.find((ing) => ing.isIce)
  const iceLabelText = (fraction) => {
    if (language === 'en') {
      return fraction >= 1 ? 'full cup' : fraction >= 0.9 ? '90%' : fraction >= 0.8 ? '80%' : '70%'
    }
    return fraction >= 1 ? '满杯' : fraction >= 0.9 ? '九分满' : fraction >= 0.8 ? '八分满' : '七分满'
  }
  const iceFraction = iceLayer?.fraction ?? null
  const iceLabel =
    iceFraction == null
      ? null
      : iceLabelText(iceFraction)
  const ingredientName = (item) => {
    const preset = RECIPE_INGREDIENT_PRESETS.find((p) => p.name === item.name)
    if (language !== 'en') return item.name
    const map = {
      milk: 'Milk',
      espresso: 'Espresso',
      orange: 'Orange Juice',
      oat_milk: 'Oat Milk',
      ice: 'Ice',
    }
    if (preset?.id && map[preset.id]) return map[preset.id]
    return item.name
  }

  const addPreset = (preset) => {
    setMlInput('')
    setFoamCm('')
    if (preset.id === 'ice') {
      setModal({ type: 'ice', preset })
    } else {
      setModal({ type: 'ml', preset })
    }
  }

  const addCustom = () => {
    setModal({ type: 'custom' })
  }

  const confirmMl = (mlVal) => {
    const num = Number(mlVal) || 0
    if (num <= 0 || !modal) return
    const baseItem = modal.preset
      ? { name: modal.preset.name, ml: num, color: modal.preset.color }
      : { name: customName || (language === 'en' ? 'Other' : '其他'), ml: num, color: customColor }

    const item =
      modal.preset && modal.preset.id === 'milk'
        ? {
            ...baseItem,
            foamCm: foamCm ? Number(foamCm) || 0 : undefined,
          }
        : baseItem

    setModal(null)
    setCustomName('')
    setCustomMl('')
    setMlInput('')
    setFoamCm('')

    setList((prev) => {
      const next = [...prev, item]
      setLastAddedIndex(next.length - 1)
      return next
    })
  }

  const confirmIce = (fraction) => {
    if (!modal?.preset) return
    const item = {
      name: modal.preset.name,
      color: modal.preset.color,
      isIce: true,
      fraction,
    }
    setModal(null)
    setList((prev) => {
      const next = [...prev, item]
      setLastAddedIndex(next.length - 1)
      return next
    })
  }

  const undoLast = () => {
    setList((prev) => prev.slice(0, -1))
  }

  const removeAt = (index) => {
    setList((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    onChange(list)
  }, [list])

  return (
    <div className="fixed inset-0 z-[200] isolate flex flex-col bg-cream-200 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 pt-[calc(env(safe-area-inset-top,0px)+0.5rem)] border-b border-cream-400/50">
        <span className="font-semibold text-coffee-800">{language === 'en' ? 'Recipe Builder' : '配方说明 · 用量杯调配'}</span>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-cream-300 text-coffee-700"
          aria-label={language === 'en' ? 'Close' : '关闭'}
        >
          <X size={22} />
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 pb-24">
        <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
          {/* 出品杯 + 配方：同一竖列，杯在配方正上方 */}
          <div className="w-full flex flex-col items-center flex-shrink-0" ref={cupRef}>
            <div
              className="w-28 h-40 sm:w-32 sm:h-48 rounded-b-3xl border-4 border-coffee-500/60 bg-cream-100 overflow-hidden flex flex-col-reverse relative shadow-[0_4px_20px_rgba(139,115,85,0.12)] mx-auto"
              style={{ minHeight: CUP_HEIGHT_PX }}
            >
            {(() => {
              const usedPct = 80 // 只填满 8 分高度，留出杯口空间
              const liquidList = list.filter((ing) => !ing.isIce)
              const totalLiquidMl = liquidList.reduce(
                (s, i) => s + (Number(i.ml) || 0),
                0,
              )
              const fraction = iceLayer?.fraction ?? 0.7
              const beveragePct = usedPct * fraction

              const ordered = [...liquidList]
              const liquidListIndices = list
                .map((item, idx) => (item.isIce ? null : idx))
                .filter((x) => x != null)

              let acc = 0
              const segments = ordered
                .map((ing) => {
                  if (totalLiquidMl <= 0) return null
                  const pct = (Number(ing.ml) / totalLiquidMl) * beveragePct
                  if (pct <= 0) return null
                  const start = acc
                  acc += pct
                  return { ing, pct, start, mid: start + pct / 2 }
                })
                .filter(Boolean)

              return segments.map(({ ing, pct }, i) => {
                if (totalLiquidMl <= 0) return null
                if (pct <= 0) return null
                const isNew = liquidListIndices[i] === lastAddedIndex
                const isBottom = i === 0
                return (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-full transition-all duration-300 ease-out ${
                      isNew ? 'animate-recipe-layer-in' : ''
                    } ${isBottom ? 'rounded-b-3xl' : ''}`}
                    style={{
                      height: `${pct}%`,
                      minHeight: pct > 0 ? '14px' : 0,
                      background: getIngredientColor(ing.name, ing.color),
                    }}
                  />
                )
              })
            })()}
          </div>
            <p className="text-center text-sm text-stone-500 mt-2">{language === 'en' ? 'Serving Cup' : '出品杯'}</p>

            {/* 本杯配方：悬停可看全文 */}
            <div className="w-full text-center min-h-[2.5rem]">
              {list.length === 0 ? (
                <p className="text-sm text-stone-400">{language === 'en' ? 'Tap ingredients below to add' : '点击下方配料添加'}</p>
              ) : (
                (() => {
                  const formulaText = list
                    .filter((i) => !i.isIce)
                    .map((i) => `${ingredientName(i)} ${i.ml}ml${i.foamCm ? ` · ${language === 'en' ? 'foam' : '奶泡'}${i.foamCm}cm` : ''}`)
                    .join(' · ') + (iceLabel != null ? (list.some((x) => !x.isIce) ? ' · ' : '') + `${language === 'en' ? 'Ice' : '冰块'} ${iceLabel}` : '')
                  return (
                    <p className="text-sm text-coffee-700 leading-relaxed" title={formulaText}>
                      {list.filter((i) => !i.isIce).map((i) => `${ingredientName(i)} ${i.ml}ml${i.foamCm ? ` · ${language === 'en' ? 'foam' : '奶泡'}${i.foamCm}cm` : ''}`).join(' · ')}
                      {iceLabel != null && (
                        <>
                          {list.some((x) => !x.isIce) ? ' · ' : ''}
                          <span className="inline-flex items-center gap-1">
                            {(() => {
                              const Icon = getIngredientIcon('ice')
                              return <Icon size={14} weight="duotone" className="inline" />
                            })()}
                            {language === 'en' ? 'Ice' : '冰块'} {iceLabel}
                          </span>
                        </>
                      )}
                    </p>
                  )
                })()
              )}
            </div>
          </div>

          {/* 添加配料 */}
          <div className="w-full">
            <p className="text-sm text-stone-500 mb-2 text-center">{language === 'en' ? 'Add Ingredient' : '添加配料'}</p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {RECIPE_INGREDIENT_PRESETS.map((p) => {
            const Icon = getIngredientIcon(p.id)
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => addPreset(p)}
                className="card flex flex-col items-center justify-center gap-1 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-card"
                style={{ backgroundColor: p.color + '40' }}
              >
                <Icon size={28} weight="duotone" className="text-coffee-700" />
                <span className="text-xs font-medium text-coffee-800">{ingredientName(p)}</span>
              </button>
            )
          })}
          <button
            type="button"
            onClick={addCustom}
            className="card flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl hover:scale-105 active:scale-95 transition-transform border-2 border-dashed border-coffee-400/50 text-stone-500"
          >
            <Plus size={24} />
            <span className="text-xs font-medium">{language === 'en' ? 'Custom' : '自定义'}</span>
          </button>
            </div>
          </div>
        </div>
      </div>

      {/* 已加配料列表 */}
      {list.length > 0 && (
        <div className="p-4 border-t border-cream-400/50">
          <p className="text-sm text-stone-500 mb-2">{language === 'en' ? 'Added:' : '已添加：'}</p>
          <div className="flex flex-wrap gap-2">
            {list.map((ing, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-coffee-800"
                style={{ backgroundColor: getIngredientColor(ing.name, ing.color) + '80' }}
              >
                {ing.isIce
                  ? `${ingredientName(ing)} ${iceLabelText(ing.fraction ?? 0.7)}`
                  : `${ingredientName(ing)} ${ing.ml}ml${ing.foamCm ? ` · ${language === 'en' ? 'foam' : '奶泡'} ${ing.foamCm}cm` : ''}`}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-black/10"
                  aria-label={language === 'en' ? 'Remove' : '移除'}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 弹窗：输入 ml */}
      {modal?.type === 'ml' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
          <div className="card max-w-xs w-full space-y-3">
            <p className="font-medium text-coffee-800 flex items-center gap-1.5">
              {(() => {
                const Icon = getIngredientIcon(modal.preset.id)
                return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
              })()}
              {ingredientName(modal.preset)} {language === 'en' ? '- how many ml?' : '— 多少 ml？'}
            </p>
            <input
              type="number"
              min="1"
              max="999"
              className="input-field"
              placeholder={language === 'en' ? 'Enter ml' : '输入毫升数'}
              value={mlInput}
              onChange={(e) => setMlInput(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmMl(mlInput)
              }}
            />
            {modal.preset.id === 'milk' && (
              <div className="space-y-1">
                <label className="block text-sm text-stone-500">{language === 'en' ? 'Foam thickness (cm, optional)' : '奶泡厚度（cm，可选）'}</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  className="input-field"
                  placeholder={language === 'en' ? 'e.g. 1.5' : '如：1.5'}
                  value={foamCm}
                  onChange={(e) => setFoamCm(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {[30, 50, 100, 200].map((ml) => (
                <button
                  key={ml}
                  type="button"
                  onClick={() => setMlInput(String(ml))}
                  className="btn-secondary flex-1 min-w-[60px] py-2 text-sm"
                >
                  {ml}ml
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => confirmMl(mlInput)}
                className="btn-primary flex-1"
              >
                {language === 'en' ? 'Confirm' : '确定'}
              </button>
              <button type="button" onClick={() => { setModal(null); setMlInput('') }} className="btn-secondary flex-1">
                {language === 'en' ? 'Cancel' : '取消'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗：自定义配料 */}
      {modal?.type === 'custom' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
          <div className="card max-w-xs w-full space-y-3">
            <p className="font-medium text-coffee-800">{language === 'en' ? 'Custom Ingredient' : '自定义配料'}</p>
            <input
              type="text"
              className="input-field"
              placeholder={language === 'en' ? 'Name (e.g. syrup, soda water)' : '名称（如：糖浆、气泡水）'}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
            />
            <input
              type="number"
              min="1"
              max="999"
              className="input-field"
              placeholder={language === 'en' ? 'ml' : '毫升数'}
              value={customMl}
              onChange={(e) => setCustomMl(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-stone-500">{language === 'en' ? 'Color' : '颜色'}</span>
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-cream-400 cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => confirmMl(customMl)}
                className="btn-primary flex-1"
              >
                {language === 'en' ? 'Confirm' : '确定'}
              </button>
              <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">
                {language === 'en' ? 'Cancel' : '取消'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗：冰块分数 */}
      {modal?.type === 'ice' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
          <div className="card max-w-xs w-full space-y-4">
            <p className="font-medium text-coffee-800 flex items-center gap-1.5">
              {(() => {
                const Icon = getIngredientIcon(modal.preset.id)
                return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
              })()}
              {ingredientName(modal.preset)} {language === 'en' ? '- cup level?' : '— 出品杯几分满？'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: language === 'en' ? '70%' : '七分满', value: 0.7 },
                { label: language === 'en' ? '80%' : '八分满', value: 0.8 },
                { label: language === 'en' ? '90%' : '九分满', value: 0.9 },
                { label: language === 'en' ? 'Full cup' : '满杯', value: 1 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => confirmIce(opt.value)}
                  className="btn-secondary py-2 text-sm"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setModal(null)}
              className="btn-secondary w-full"
            >
              {language === 'en' ? 'Cancel' : '取消'}
            </button>
          </div>
        </div>
      )}

      <div className="px-4 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+7rem)] border-t border-cream-400/60 bg-cream-200 flex gap-3 justify-end shrink-0">
        <button
          type="button"
          onClick={undoLast}
          disabled={list.length === 0}
          className="btn-secondary disabled:opacity-40"
        >
          {language === 'en' ? 'Undo' : '撤回一步'}
        </button>
        <button type="button" onClick={onClose} className="btn-secondary">
          {language === 'en' ? 'Back' : '返回'}
        </button>
        {onSave && (
          <button type="button" onClick={onSave} className="btn-primary">
            {language === 'en' ? 'Save Recipe' : '保存配方'}
          </button>
        )}
      </div>
    </div>
  )
}
