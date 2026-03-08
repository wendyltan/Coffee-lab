import { useState } from 'react'
import { Plus, PencilSimple, Trash } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { EQUIPMENT_TYPES } from '../../lib/constants'
import { getEquipmentIcon, DEFAULT_ICON_SIZE } from '../../lib/iconMap'

const defaultForm = { type: 'grinder', brand: '', model: '' }

export default function EquipmentList({ items }) {
  const { addEquipment, updateEquipment, deleteEquipment, language } = useApp()
  const [editingId, setEditingId] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState(defaultForm)

  const openAdd = () => {
    setForm(defaultForm)
    setIsAdding(true)
    setEditingId(null)
  }

  const openEdit = (eq) => {
    setForm({
      type: eq.type ?? 'grinder',
      brand: eq.brand ?? '',
      model: eq.model ?? '',
    })
    setEditingId(eq.id)
    setIsAdding(false)
  }

  const save = () => {
    if (editingId) {
      updateEquipment(editingId, form)
      setEditingId(null)
    } else if (isAdding) {
      addEquipment(form)
      setIsAdding(false)
    }
    setForm(defaultForm)
  }

  const cancel = () => {
    setEditingId(null)
    setIsAdding(false)
    setForm(defaultForm)
  }

  const getTypeLabel = (type) => {
    const map = {
      espresso_machine: language === 'en' ? 'Espresso Machine' : '咖啡机',
      moka_pot: language === 'en' ? 'Moka Pot' : '摩卡壶',
      grinder: language === 'en' ? 'Grinder' : '磨豆机',
      tamper: language === 'en' ? 'Tamper' : '压粉器',
      pour_over_kettle: language === 'en' ? 'Pour-over Kettle' : '手冲壶',
      other: language === 'en' ? 'Other' : '其他',
    }
    return map[type ?? 'other'] ?? type ?? (language === 'en' ? 'Other' : '其他')
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={openAdd} className="btn-secondary flex items-center gap-2">
          <Plus size={18} weight="bold" />
          {language === 'en' ? 'Add Equipment' : '添加设备'}
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="card space-y-3">
          <div>
            <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Type' : '设备类型'}</label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_TYPES.map((t) => {
                const Icon = getEquipmentIcon(t.value)
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t.value }))}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      form.type === t.value ? 'bg-coffee-500 text-cream-100' : 'bg-cream-300 text-coffee-700'
                    }`}
                  >
                    <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
                    {getTypeLabel(t.value)}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Brand' : '品牌'}</label>
              <input
                type="text"
                className="input-field"
                placeholder={language === 'en' ? 'e.g. Baratza, Bialetti' : '如：Baratza、Bialetti'}
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm text-stone-500 mb-1">{language === 'en' ? 'Model' : '型号'}</label>
              <input
                type="text"
                className="input-field"
                placeholder={language === 'en' ? 'e.g. Encore, Venus' : '如：Encore、Venus'}
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              />
            </div>
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
          <p>{language === 'en' ? 'No equipment yet. Tap "Add Equipment" above.' : '还没有添加设备，点击上方「添加设备」'}</p>
        </div>
      )}

      <ul className="space-y-2">
        {items.map((eq) => (
          <li key={eq.id} className="card flex items-center justify-between gap-3">
            {editingId === eq.id ? null : (
              <>
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  {(() => {
                    const Icon = getEquipmentIcon(eq.type)
                    return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" className="flex-shrink-0 text-coffee-600" />
                  })()}
                  <p className="font-medium text-coffee-800 truncate">
                    {getTypeLabel(eq.type)} · {eq.brand ?? ''} {eq.model ?? ''}
                  </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(eq)}
                    className="p-2 rounded-xl text-coffee-600 hover:bg-cream-300"
                    aria-label={language === 'en' ? 'Edit' : '编辑'}
                  >
                    <PencilSimple size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteEquipment(eq.id)}
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
