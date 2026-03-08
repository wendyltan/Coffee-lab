import { useState } from 'react'
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { ROAST_LEVELS } from '../../lib/constants'
import { getRoastIcon, DEFAULT_ICON_SIZE } from '../../lib/iconMap'
import { getProductionAgeText, getBeanAgeSnapshot, getBestWindowDaysForRoast } from '../../lib/utils'

export default function BeanList({ items }) {
  const { addBean, updateBean, deleteBean, language, beanFreshnessSettings } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState({ name: '', origin: '', roast: 'medium', productionDate: '' })

  const openAdd = () => {
    setForm({ name: '', origin: '', roast: 'medium', productionDate: '' })
    setIsAdding(true)
    setEditingId(null)
  }

  const openEdit = (bean) => {
    setForm({
      name: bean.name ?? '',
      origin: bean.origin ?? '',
      roast: bean.roast ?? 'medium',
      productionDate: bean.productionDate ?? '',
    })
    setEditingId(bean.id)
    setIsAdding(false)
  }

  const save = () => {
    if (editingId) {
      updateBean(editingId, form)
      setEditingId(null)
    } else if (isAdding) {
      addBean(form)
      setIsAdding(false)
    }
    setForm({ name: '', origin: '', roast: 'medium', productionDate: '' })
  }

  const cancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setForm({ name: '', origin: '', roast: 'medium', productionDate: '' })
  }
  const roastLabel = (value) => {
    const map = {
      light: language === 'en' ? 'Light' : '浅烘',
      medium: language === 'en' ? 'Medium' : '中烘',
      dark: language === 'en' ? 'Dark' : '深烘',
    }
    return map[value] ?? value
  }

  const freshnessMeta = (bean) => {
    const bestWindowDays = getBestWindowDaysForRoast(bean.roast, beanFreshnessSettings)
    const snapshot = getBeanAgeSnapshot(bean.productionDate, new Date(), bestWindowDays)
    if (!snapshot) return null
    const remain = bestWindowDays - snapshot.days
    if (remain >= 0) {
      return {
        text:
          language === 'en'
            ? `${remain}d to best-window limit`
            : `距最佳赏味期上限还有 ${remain} 天`,
        tone: 'bg-sage-300/30 text-sage-500 border border-sage-400/40',
      }
    }
    return {
      text:
        language === 'en'
          ? `Over by ${Math.abs(remain)}d`
          : `已超过最佳赏味期 ${Math.abs(remain)} 天`,
      tone: 'bg-peach-300/30 text-peach-500 border border-peach-400/40',
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={openAdd} className="btn-secondary flex items-center gap-2">
          <Plus size={18} weight="bold" />
          {language === 'en' ? 'Add Bean' : '添加豆子'}
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="card space-y-3">
          <input
            type="text"
            className="input-field"
            placeholder={language === 'en' ? 'Bean name' : '豆子名称'}
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            type="text"
            className="input-field"
            placeholder={language === 'en' ? 'Origin' : '产地'}
            value={form.origin}
            onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
          />
          <div>
            <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Production date (optional)' : '生产日期（可选）'}</label>
            <input
              type="date"
              className="input-field"
              value={form.productionDate}
              onChange={(e) => setForm((f) => ({ ...f, productionDate: e.target.value }))}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ROAST_LEVELS.map((r) => {
              const Icon = getRoastIcon(r.value)
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, roast: r.value }))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm ${
                    form.roast === r.value ? 'bg-coffee-500 text-cream-100' : 'bg-cream-300 text-coffee-700'
                  }`}
                >
                  <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
                  {roastLabel(r.value)}
                </button>
              )
            })}
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

      {items.length === 0 && !isAdding && (
        <div className="card text-center py-8 text-stone-500">
          <p>{language === 'en' ? 'No beans yet. Tap "Add Bean" above.' : '还没有添加豆子，点击上方「添加豆子」'}</p>
        </div>
      )}

      <ul className="space-y-2">
        {items.map((bean) => {
          const freshness = freshnessMeta(bean)
          return (
          <li key={bean.id} className="card flex items-center justify-between gap-3">
            {editingId === bean.id ? null : (
              <>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-coffee-800">{bean.name}</p>
                  <p className="text-sm text-stone-500">
                    {bean.origin} · {roastLabel(bean.roast)}
                  </p>
                  {getProductionAgeText(bean.productionDate) && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'en' ? `Age ${getProductionAgeText(bean.productionDate)}` : `已生产${getProductionAgeText(bean.productionDate)}`}
                    </p>
                  )}
                  {freshness && (
                    <span className={`inline-flex mt-1 text-[11px] px-2 py-0.5 rounded-full ${freshness.tone}`}>
                      {freshness.text}
                    </span>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(bean)}
                    className="p-2 rounded-xl text-coffee-600 hover:bg-cream-300"
                    aria-label={language === 'en' ? 'Edit' : '编辑'}
                  >
                    <PencilSimple size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteBean(bean.id)}
                    className="p-2 rounded-xl text-red-600/80 hover:bg-cream-300"
                    aria-label={language === 'en' ? 'Delete' : '删除'}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </>
            )}
          </li>
        )})}
      </ul>
    </div>
  )
}
