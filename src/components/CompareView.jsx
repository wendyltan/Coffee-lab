import { BREW_METHODS, ROAST_LEVELS } from '../lib/constants'
import { getProductionAgeText } from '../lib/utils'

function getMethodLabel(v) {
  return BREW_METHODS.find((m) => m.value === v)?.label ?? v
}

function getRoastLabel(v) {
  return ROAST_LEVELS.find((r) => r.value === v)?.label ?? v
}

function Row({ label, leftVal, rightVal, highlight }) {
  const diff = String(leftVal ?? '') !== String(rightVal ?? '')
  const bg = highlight && diff ? 'bg-peach-300/30' : ''
  return (
    <div className={`grid grid-cols-3 gap-2 py-2 border-b border-cream-300/80 ${bg}`}>
      <div className="text-sm text-stone-500 font-medium">{label}</div>
      <div className="text-sm text-coffee-800">{leftVal ?? '—'}</div>
      <div className="text-sm text-coffee-800">{rightVal ?? '—'}</div>
    </div>
  )
}

export default function CompareView({ left, right }) {
  const fields = [
    { key: 'beanName', label: '豆子' },
    { key: 'beanOrigin', label: '产地' },
    { key: 'roast', label: '烘焙度', format: getRoastLabel },
    { key: 'beanProductionDate', label: '豆子生产时长', format: (v) => getProductionAgeText(v) ?? '—' },
    { key: 'equipmentDisplay', label: '使用设备' },
    { key: 'grinderBrand', label: '磨豆机品牌' },
    { key: 'grindSetting', label: '磨豆档位' },
    { key: 'tamperInfo', label: '压粉' },
    { key: 'doseG', label: '粉重 (g)' },
    { key: 'yieldMl', label: '液重 (ml)' },
    { key: 'brewMethod', label: '制作方式', format: getMethodLabel },
    { key: 'recipeName', label: '饮品' },
    { key: 'extraAdditions', label: '制作流程' },
    { key: 'rating', label: '评分' },
    { key: 'note', label: '备注' },
  ]

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2 mb-2 pb-2 border-b-2 border-coffee-500/30">
        <div className="text-xs font-semibold text-stone-500 uppercase">项目</div>
        <div className="text-xs font-semibold text-coffee-600 text-center">记录 A</div>
        <div className="text-xs font-semibold text-coffee-600 text-center">记录 B</div>
      </div>
      {fields.map(({ key, label, format }) => (
        <Row
          key={key}
          label={label}
          leftVal={format ? format(left[key]) : left[key]}
          rightVal={format ? format(right[key]) : right[key]}
          highlight
        />
      ))}
    </div>
  )
}
