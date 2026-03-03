import { useState } from 'react'
import { Plus, PencilSimple, Trash, Wine, Flame } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import RecipeBuilder from './RecipeBuilder'
import { drawRecipeThumbnail } from '../../lib/recipeThumbnail'
import { getIngredientIcon } from '../../lib/iconMap'

const defaultForm = { name: '', ingredients: [], extraAdditions: '', serveType: 'hot' }

const IcedIcon = getIngredientIcon('ice')

export default function RecipeList({ items }) {
  const { addRecipe, updateRecipe, deleteRecipe } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [showBuilder, setShowBuilder] = useState(false)

  const openAdd = () => {
    setForm({ name: '', ingredients: [], extraAdditions: '', serveType: 'hot' })
    setIsAdding(true)
    setEditingId(null)
    setShowBuilder(false)
  }

  const openEdit = (r) => {
    setForm({
      name: r.name ?? '',
      ingredients: Array.isArray(r.ingredients) ? r.ingredients.map((i) => ({ ...i })) : [],
      extraAdditions: r.extraAdditions ?? '',
      serveType: r.serveType ?? 'hot',
    })
    setEditingId(r.id)
    setIsAdding(false)
    setShowBuilder(false)
  }

  const save = () => {
    const detail = form.ingredients.length
      ? form.ingredients.map((i) => `${i.name}${i.ml}ml`).join(' + ')
      : ''
    const thumbnail = form.ingredients.length > 0 ? drawRecipeThumbnail(form.ingredients) : null
    const payload = {
      name: form.name,
      ingredients: form.ingredients,
      detail,
      extraAdditions: form.extraAdditions,
      serveType: form.serveType,
      thumbnail,
    }
    if (editingId) {
      updateRecipe(editingId, payload)
      setEditingId(null)
    } else if (isAdding) {
      addRecipe(payload)
      setIsAdding(false)
    }
    setForm(defaultForm)
    setShowBuilder(false)
  }

  const cancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setForm(defaultForm)
    setShowBuilder(false)
  }

  const ingredientsSummary = (r) => {
    if (r.ingredients?.length) {
      return r.ingredients
        .map((i) => {
          if (i.isIce) {
            const frac = i.fraction ?? 0.7
            const label =
              frac >= 1 ? '满杯' : frac >= 0.9 ? '九分满' : frac >= 0.8 ? '八分满' : '七分满'
            return `${i.name}${label}`
          }
          return `${i.name}${i.ml}ml`
        })
        .join(' + ')
    }
    return r.detail || '—'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={openAdd} className="btn-secondary flex items-center gap-2">
          <Plus size={18} />
          添加配方
        </button>
      </div>

      {(isAdding || editingId) && !showBuilder && (
        <div className="card space-y-3">
          <div className="space-y-2">
            <input
              type="text"
              className="input-field"
              placeholder="配方名称（如：拿铁、橙C美式）"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div>
              <label className="block text-sm text-stone-500 mb-1">饮品类型</label>
              <div className="inline-flex rounded-2xl bg-cream-300 p-1">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, serveType: 'hot' }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    form.serveType === 'hot'
                      ? 'bg-cream-100 text-coffee-700 shadow-soft'
                      : 'text-stone-500'
                  }`}
                >
                  <Flame size={16} weight="duotone" /> 热饮
                </button>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, serveType: 'iced' }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    form.serveType === 'iced'
                      ? 'bg-cream-100 text-coffee-700 shadow-soft'
                      : 'text-stone-500'
                  }`}
                >
                  <IcedIcon size={16} weight="duotone" /> 冰饮
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">配方说明（用量杯调配）</label>
            <button
              type="button"
              onClick={() => setShowBuilder(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-sage-400/60 bg-sage-300/20 text-coffee-700 font-medium hover:bg-sage-300/30 transition-colors"
            >
              <Wine size={22} />
              点击配置配料与用量
            </button>
            {form.ingredients.length > 0 && (
              <p className="text-sm text-stone-500 mt-2">
                已添加：{form.ingredients.map((i) => `${i.name}${i.ml}ml`).join(' + ')}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">制作流程（可选）</label>
            <textarea
              className="input-field min-h-[72px] resize-y"
              placeholder="例如：1) 杯中加冰块；2) 倒入橙汁；3) 缓慢倒入咖啡液..."
              value={form.extraAdditions}
              onChange={(e) => setForm((f) => ({ ...f, extraAdditions: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="btn-primary flex-1">
              保存
            </button>
            <button type="button" onClick={cancel} className="btn-secondary flex-1">
              取消
            </button>
          </div>
        </div>
      )}

      {showBuilder && (
        <RecipeBuilder
          ingredients={form.ingredients}
          onChange={(ingredients) => setForm((f) => ({ ...f, ingredients }))}
          onClose={() => setShowBuilder(false)}
          onSave={save}
        />
      )}

      {items.length === 0 && !isAdding && (
        <div className="card text-center py-8 text-stone-500">
          <p>还没有添加饮品配方，点击上方「添加配方」</p>
        </div>
      )}

      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id} className="card flex items-center gap-3">
            {editingId === r.id ? null : (
              <>
                {r.thumbnail && (
                  <img
                    src={r.thumbnail}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-cream-400"
                  />
                )}
                {!r.thumbnail && (
                  <div className="w-14 h-14 rounded-xl bg-cream-300 flex items-center justify-center flex-shrink-0">
                    <Wine size={24} weight="duotone" className="text-coffee-500" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-coffee-800 flex items-center gap-1" title={r.name}>
                    {r.serveType === 'iced' ? (
                      <IcedIcon size={14} weight="duotone" className="flex-shrink-0" />
                    ) : (
                      <Flame size={14} weight="duotone" className="flex-shrink-0" />
                    )}
                    <span className="truncate">{r.name}</span>
                  </p>
                  <p className="text-sm text-stone-500 truncate" title={ingredientsSummary(r)}>
                    {ingredientsSummary(r)}
                  </p>
                  {r.extraAdditions && (
                    <p className="text-xs text-stone-400 truncate" title={r.extraAdditions}>
                      {r.extraAdditions}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="p-2 rounded-xl text-coffee-600 hover:bg-cream-300"
                    aria-label="编辑"
                  >
                    <PencilSimple size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecipe(r.id)}
                    className="p-2 rounded-xl text-red-600/80 hover:bg-cream-300"
                    aria-label="删除"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
