import { useState } from 'react'
import { Plus, PencilSimple, Trash, Wine, Flame } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import RecipeBuilder from './RecipeBuilder'
import { drawRecipeThumbnail } from '../../lib/recipeThumbnail'
import { getIngredientIcon } from '../../lib/iconMap'

const defaultForm = { name: '', ingredients: [], extraAdditions: '', serveType: 'hot' }

const IcedIcon = getIngredientIcon('ice')

export default function RecipeList({ items }) {
  const { addRecipe, updateRecipe, deleteRecipe, language } = useApp()
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

  const iceLabel = (fraction) => {
    if (language === 'en') {
      return fraction >= 1 ? 'full cup' : fraction >= 0.9 ? '90%' : fraction >= 0.8 ? '80%' : '70%'
    }
    return fraction >= 1 ? '满杯' : fraction >= 0.9 ? '九分满' : fraction >= 0.8 ? '八分满' : '七分满'
  }

  const formatIngredientText = (i) => {
    if (i?.isIce) return `${i.name}${iceLabel(i.fraction ?? 0.7)}`
    return `${i.name}${i.ml}ml`
  }

  const save = () => {
    const detail = form.ingredients.length
      ? form.ingredients.map((i) => formatIngredientText(i)).join(' + ')
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
        .map((i) => formatIngredientText(i))
        .join(' + ')
    }
    return r.detail || (language === 'en' ? '-' : '—')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={openAdd} className="btn-secondary flex items-center gap-2">
          <Plus size={18} />
          {language === 'en' ? 'Add Recipe' : '添加配方'}
        </button>
      </div>

      {(isAdding || editingId) && !showBuilder && (
        <div className="card space-y-3">
          <div className="space-y-2">
            <input
              type="text"
              className="input-field"
              placeholder={language === 'en' ? 'Recipe name (e.g. Latte)' : '配方名称（如：拿铁、橙C美式）'}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <div>
              <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Drink type' : '饮品类型'}</label>
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
                  <Flame size={16} weight="duotone" /> {language === 'en' ? 'Hot' : '热饮'}
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
                  <IcedIcon size={16} weight="duotone" /> {language === 'en' ? 'Iced' : '冰饮'}
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Recipe detail (cup builder)' : '配方说明（用量杯调配）'}</label>
            <button
              type="button"
              onClick={() => setShowBuilder(true)}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-sage-400/60 bg-sage-300/20 text-coffee-700 font-medium hover:bg-sage-300/30 transition-colors"
            >
              <Wine size={22} />
              {language === 'en' ? 'Configure ingredients and amount' : '点击配置配料与用量'}
            </button>
            {form.ingredients.length > 0 && (
              <p className="text-sm text-stone-500 mt-2">
                {language === 'en' ? 'Added: ' : '已添加：'}
                {form.ingredients.map((i) => formatIngredientText(i)).join(' + ')}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Steps (optional)' : '制作流程（可选）'}</label>
            <textarea
              className="input-field min-h-[72px] resize-y"
              placeholder={language === 'en' ? 'e.g. 1) Add ice 2) Pour orange juice 3) Slowly pour coffee' : '例如：1) 杯中加冰块；2) 倒入橙汁；3) 缓慢倒入咖啡液...'}
              value={form.extraAdditions}
              onChange={(e) => setForm((f) => ({ ...f, extraAdditions: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={save} className="btn-primary flex-1">
              {language === 'en' ? 'Save' : '保存'}
            </button>
            <button type="button" onClick={cancel} className="btn-secondary flex-1">
              {language === 'en' ? 'Cancel' : '取消'}
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
          <p>{language === 'en' ? 'No recipes yet. Tap "Add Recipe" above.' : '还没有添加饮品配方，点击上方「添加配方」'}</p>
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
                    aria-label={language === 'en' ? 'Edit' : '编辑'}
                  >
                    <PencilSimple size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRecipe(r.id)}
                    className="p-2 rounded-xl text-red-600/80 hover:bg-cream-300"
                    aria-label={language === 'en' ? 'Delete' : '删除'}
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
