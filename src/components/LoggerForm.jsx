import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FloppyDisk } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { ROAST_LEVELS, EQUIPMENT_TYPES } from '../lib/constants'
import { getRoastIcon, getSectionIcon, DEFAULT_ICON_SIZE } from '../lib/iconMap'
import { getProductionAgeText } from '../lib/utils'
import { calcRatio, getTodayKey } from '../lib/utils'
import StarRating from './StarRating'

function EquipmentCombobox({
  label,
  value,
  onChange,
  placeholder,
  equipment,
  filterType,
  allowedTypes,
  onSelect,
}) {
  const [open, setOpen] = useState(false)
  const blurTimerRef = useRef(null)

  const listBase = filterType
    ? equipment.filter((e) => (e.type ?? '') === filterType)
    : equipment
  const list = allowedTypes?.length
    ? listBase.filter((e) => allowedTypes.includes(e.type ?? 'other'))
    : listBase
  const q = (value || '').trim().toLowerCase()
  const filtered =
    q.length > 0
      ? list.filter(
          (e) =>
            [e.brand, e.model].some((s) => (s || '').toLowerCase().includes(q)),
        )
      : list

  const handleSelect = (eq) => {
    const display =
      filterType === 'grinder'
        ? eq.brand ?? ''
        : [eq.brand, eq.model].filter(Boolean).join(' ')
    onChange(display)
    onSelect(eq)
    setOpen(false)
  }

  const handleBlur = () => {
    blurTimerRef.current = setTimeout(() => setOpen(false), 180)
  }

  const handleFocus = () => {
    if (blurTimerRef.current) clearTimeout(blurTimerRef.current)
    setOpen(true)
  }

  return (
    <div className="relative">
      <label className="block text-sm text-stone-500 mb-1">{label}</label>
      <input
        type="text"
        className="input-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-2xl border border-cream-400 bg-cream-100 shadow-card py-1">
          {filtered.map((eq) => {
            const typeLabel =
              EQUIPMENT_TYPES.find((t) => t.value === (eq.type ?? 'other'))?.label ?? ''
            const display =
              filterType === 'grinder'
                ? eq.brand ?? ''
                : [eq.brand, eq.model].filter(Boolean).join(' ')
            return (
              <li key={eq.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(eq)}
                  className="w-full text-left px-4 py-2 text-sm text-coffee-800 hover:bg-cream-300 transition-colors"
                >
                  {filterType ? display : `${typeLabel} · ${display}`}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

const defaultForm = {
  beanName: '',
  beanOrigin: '',
  roast: 'medium',
  beanProductionDate: '',
  equipmentDisplay: '',
  grinderBrand: '',
  grindSetting: '',
  tamperInfo: '',
  doseG: '',
  yieldMl: '',
  brewMethod: 'espresso',
  extraAdditions: '',
  recipeName: '',
  recipeDetail: '',
  rating: 0,
  note: '',
}

export default function LoggerForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addLog, updateLog, logs, beans, equipment, recipes } = useApp()
  const [form, setForm] = useState(defaultForm)

  const isEdit = Boolean(id)
  const existingLog = isEdit ? logs.find((l) => l.id === id) : null

  useEffect(() => {
    if (existingLog) {
      setForm({
        beanName: existingLog.beanName ?? '',
        beanOrigin: existingLog.beanOrigin ?? '',
        roast: existingLog.roast ?? 'medium',
        beanProductionDate: existingLog.beanProductionDate ?? '',
        equipmentDisplay: existingLog.equipmentDisplay ?? '',
        grinderBrand: existingLog.grinderBrand ?? '',
        grindSetting: existingLog.grindSetting ?? '',
        tamperInfo: existingLog.tamperInfo ?? '',
        doseG: existingLog.doseG ?? '',
        yieldMl: existingLog.yieldMl ?? '',
        brewMethod: existingLog.brewMethod ?? 'espresso',
        extraAdditions: existingLog.extraAdditions ?? '',
        recipeName: existingLog.recipeName ?? '',
        recipeDetail: existingLog.recipeDetail ?? '',
        rating: existingLog.rating ?? 0,
        note: existingLog.note ?? '',
      })
    }
  }, [existingLog, id])

  const ratio = calcRatio(form.doseG, form.yieldMl)

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const fillFromBean = (bean) => {
    if (!bean) return
    update('beanName', bean.name ?? '')
    update('beanOrigin', bean.origin ?? '')
    update('roast', bean.roast ?? 'medium')
    update('beanProductionDate', bean.productionDate ?? '')
  }

  const fillDeviceFromEquipment = (eq) => {
    if (!eq) return
    const display = [eq.brand, eq.model].filter(Boolean).join(' ')
    update('equipmentDisplay', display)
    // 自动推断制作方式（UI不再展示制作方式选择）
    if (eq.type === 'espresso_machine') update('brewMethod', 'espresso')
    if (eq.type === 'moka_pot') update('brewMethod', 'moka')
    if (eq.type === 'pour_over_kettle') update('brewMethod', 'pour_over')
  }

  const fillGrinderFromEquipment = (eq) => {
    if (!eq) return
    update('grinderBrand', eq.brand ?? '')
  }

  const fillTamperFromEquipment = (eq) => {
    if (!eq) return
    const info = [eq.brand, eq.model].filter(Boolean).join(' ')
    update('tamperInfo', info)
  }

  const fillFromRecipe = (recipe) => {
    if (!recipe) return
    update('recipeName', recipe.name ?? '')
    const detail = recipe.ingredients?.length
      ? recipe.ingredients
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
      : recipe.detail ?? ''
    update('recipeDetail', detail)
    update('extraAdditions', recipe.extraAdditions ?? '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      beanName: form.beanName,
      beanOrigin: form.beanOrigin,
      roast: form.roast,
      beanProductionDate: form.beanProductionDate || undefined,
      equipmentDisplay: form.equipmentDisplay,
      grinderBrand: form.grinderBrand,
      grindSetting: form.grindSetting,
      tamperInfo: form.tamperInfo,
      doseG: form.doseG,
      yieldMl: form.yieldMl,
      brewMethod: form.brewMethod,
      extraAdditions: form.extraAdditions,
      recipeName: form.recipeName,
      recipeDetail: form.recipeDetail,
      rating: form.rating,
      note: form.note,
    }
    if (isEdit) {
      updateLog(id, payload)
      const logDate = existingLog?.date || getTodayKey()
      navigate('/day/' + logDate)
    } else {
      const log = addLog(payload)
      navigate('/day/' + (log?.date || getTodayKey()))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <section className="card">
        <h2 className="text-lg font-semibold text-coffee-800 mb-3 flex items-center gap-2">
          {(() => {
            const Icon = getSectionIcon('beans')
            return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
          })()}
          豆子信息
        </h2>
        {beans.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm text-stone-500 mb-1">从豆子库填充</label>
            <select
              className="input-field"
              value=""
              onChange={(e) => {
                const b = beans.find((x) => x.id === e.target.value)
                if (b) fillFromBean(b)
              }}
            >
              <option value="">选择豆子...</option>
              {beans.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} · {b.origin}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-stone-500 mb-1">种类/名称</label>
            <input
              type="text"
              className="input-field"
              value={form.beanName}
              onChange={(e) => update('beanName', e.target.value)}
              placeholder="如：耶加雪菲"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">产地</label>
            <input
              type="text"
              className="input-field"
              value={form.beanOrigin}
              onChange={(e) => update('beanOrigin', e.target.value)}
              placeholder="如：埃塞俄比亚"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="block text-sm text-stone-500 mb-1">烘焙度</label>
          <div className="flex gap-2 flex-wrap">
            {ROAST_LEVELS.map((r) => {
              const Icon = getRoastIcon(r.value)
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => update('roast', r.value)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                    form.roast === r.value
                      ? 'bg-coffee-500 text-cream-100'
                      : 'bg-cream-300 text-coffee-700 hover:bg-cream-400'
                  }`}
                >
                  <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
                  {r.label}
                </button>
              )
            })}
          </div>
        </div>
        {getProductionAgeText(form.beanProductionDate) && (
          <p className="text-sm text-stone-500 mt-2">
            豆子已生产{getProductionAgeText(form.beanProductionDate)}
          </p>
        )}
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-coffee-800 mb-3 flex items-center gap-2">
          {(() => {
            const Icon = getSectionIcon('extraction')
            return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
          })()}
          萃取与设备
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-stone-500 mb-1">粉重 (g)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              className="input-field"
              value={form.doseG}
              onChange={(e) => update('doseG', e.target.value)}
              placeholder="18"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">液重 (ml)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              className="input-field"
              value={form.yieldMl}
              onChange={(e) => update('yieldMl', e.target.value)}
              placeholder="36"
            />
          </div>
        </div>
        {ratio && (
          <p className="mt-2 text-sm text-sage-500 font-medium">
            粉液比 ≈ {ratio}
          </p>
        )}

        {/* 设备：输入框 + 设备库联想 */}
        <div className="mt-4 space-y-3">
          <EquipmentCombobox
            label="使用设备（品牌 型号）"
            value={form.equipmentDisplay}
            onChange={(v) => update('equipmentDisplay', v)}
            placeholder="输入或从下方选择"
            equipment={equipment}
            filterType={null}
            allowedTypes={['espresso_machine', 'moka_pot', 'pour_over_kettle', 'other']}
            onSelect={fillDeviceFromEquipment}
          />
          <div className="grid grid-cols-2 gap-3">
            <EquipmentCombobox
              label="磨豆机"
              value={form.grinderBrand}
              onChange={(v) => update('grinderBrand', v)}
              placeholder="品牌/型号"
              equipment={equipment}
              filterType="grinder"
              onSelect={fillGrinderFromEquipment}
            />
            <div>
              <label className="block text-sm text-stone-500 mb-1">磨豆档位</label>
              <input
                type="text"
                className="input-field"
                value={form.grindSetting}
                onChange={(e) => update('grindSetting', e.target.value)}
                placeholder="如：15"
              />
            </div>
          </div>
          <EquipmentCombobox
            label="压粉器信息"
            value={form.tamperInfo}
            onChange={(v) => update('tamperInfo', v)}
            placeholder="输入或从下方选择"
            equipment={equipment}
            filterType="tamper"
            onSelect={fillTamperFromEquipment}
          />
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-coffee-800 mb-3 flex items-center gap-2">
          {(() => {
            const Icon = getSectionIcon('recipe')
            return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
          })()}
          饮品调配
        </h2>
        {recipes.length > 0 && (
          <div className="mb-3">
            <label className="block text-sm text-stone-500 mb-1">导入饮品配方</label>
            <select
              className="input-field"
              value=""
              onChange={(e) => {
                const r = recipes.find((x) => x.id === e.target.value)
                if (r) fillFromRecipe(r)
              }}
            >
              <option value="">选择配方...</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-stone-500 mb-1">配方名称</label>
            <input
              type="text"
              className="input-field"
              value={form.recipeName}
              onChange={(e) => update('recipeName', e.target.value)}
              placeholder="如：拿铁、橙C美式"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">配方说明</label>
            <input
              type="text"
              className="input-field"
              value={form.recipeDetail}
              onChange={(e) => update('recipeDetail', e.target.value)}
              placeholder="如：浓缩+200ml牛奶"
            />
          </div>
          <div>
            <label className="block text-sm text-stone-500 mb-1">制作流程（可选）</label>
            <textarea
              className="input-field min-h-[72px] resize-y"
              value={form.extraAdditions}
              onChange={(e) => update('extraAdditions', e.target.value)}
              placeholder="选择上方配方可自动带入该配方的制作流程，或在此手动填写。例如：1) 杯中加冰块；2) 倒入橙汁；3) 缓慢倒入浓缩"
            />
          </div>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold text-coffee-800 mb-3 flex items-center gap-2">
          {(() => {
            const Icon = getSectionIcon('rating')
            return <Icon size={DEFAULT_ICON_SIZE} weight="duotone" />
          })()}
          风味评分
        </h2>
        <div className="mb-3">
          <label className="block text-sm text-stone-500 mb-1">评分 (1-5)</label>
          <StarRating value={form.rating} onChange={(v) => update('rating', v)} />
        </div>
        <div>
          <label className="block text-sm text-stone-500 mb-1">备注</label>
          <textarea
            className="input-field min-h-[80px] resize-y"
            value={form.note}
            onChange={(e) => update('note', e.target.value)}
            placeholder="口感、风味、可改进点..."
          />
        </div>
      </section>

      <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
        <FloppyDisk size={22} weight="fill" />
        {isEdit ? '保存修改' : '保存记录'}
      </button>
    </form>
  )
}
