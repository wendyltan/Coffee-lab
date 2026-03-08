import { BREW_METHODS, ROAST_LEVELS } from '../lib/constants'
import { getBeanAgeSnapshot } from '../lib/utils'
import { useApp } from '../context/AppContext'

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
  const { t, language } = useApp()
  const methodLabel = (v) => {
    const map = {
      moka: t('brew.moka', '摩卡壶'),
      espresso: t('brew.espresso', '咖啡机'),
      pour_over: t('brew.pour_over', '手冲'),
    }
    return map[v] ?? getMethodLabel(v)
  }
  const roastLabel = (v) => {
    const map = {
      light: t('roast.light', '浅烘'),
      medium: t('roast.medium', '中烘'),
      dark: t('roast.dark', '深烘'),
    }
    return map[v] ?? getRoastLabel(v)
  }
  const formatBeanAgeAtLog = (log) => {
    if (!log) return '—'
    if (log.beanOutOfBestWindowAtLog) {
      return language === 'en'
        ? 'Past best flavor window at logging'
        : '记录时已过最佳赏味期'
    }
    if (
      Number.isFinite(log.beanAgeWeeksAtLog) &&
      Number.isFinite(log.beanAgeRemainDaysAtLog)
    ) {
      return language === 'en'
        ? `Logged at week ${log.beanAgeWeeksAtLog}, day ${log.beanAgeRemainDaysAtLog}`
        : `记录于豆子生产第${log.beanAgeWeeksAtLog}周第${log.beanAgeRemainDaysAtLog}天`
    }
    const fallback = getBeanAgeSnapshot(
      log.beanProductionDate,
      log.date,
      log.beanBestWindowDaysAtLog
    )
    if (!fallback || fallback.isOverBestWindow) {
      return language === 'en'
        ? 'Past best flavor window at logging'
        : '记录时已过最佳赏味期'
    }
    return language === 'en'
      ? `Logged at week ${fallback.weeks}, day ${fallback.remainDays}`
      : `记录于豆子生产第${fallback.weeks}周第${fallback.remainDays}天`
  }

  const fields = [
    { key: 'beanName', label: t('compare.bean', '豆子') },
    { key: 'beanOrigin', label: t('compare.origin', '产地') },
    { key: 'roast', label: t('compare.roast', '烘焙度'), format: roastLabel },
    { key: 'beanProductionDate', label: t('compare.beanAge', '豆子生产时长'), formatRecord: formatBeanAgeAtLog },
    { key: 'equipmentDisplay', label: t('compare.equipment', '使用设备') },
    { key: 'grinderBrand', label: t('compare.grinder', '磨豆机品牌') },
    { key: 'grindSetting', label: t('compare.grind', '磨豆档位') },
    { key: 'tamperInfo', label: t('compare.tamper', '压粉') },
    { key: 'doseG', label: t('compare.dose', '粉重 (g)') },
    { key: 'yieldMl', label: t('compare.yield', '液重 (ml)') },
    { key: 'brewMethod', label: t('compare.method', '制作方式'), format: methodLabel },
    { key: 'recipeName', label: t('compare.drink', '饮品') },
    { key: 'extraAdditions', label: t('compare.steps', '制作流程') },
    { key: 'rating', label: t('compare.rating', '评分') },
    { key: 'note', label: t('compare.note', '备注') },
  ]

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-2 mb-2 pb-2 border-b-2 border-coffee-500/30">
        <div className="text-xs font-semibold text-stone-500 uppercase">{t('compare.item', '项目')}</div>
        <div className="text-xs font-semibold text-coffee-600 text-center">{t('compare.recordA', '记录 A')}</div>
        <div className="text-xs font-semibold text-coffee-600 text-center">{t('compare.recordB', '记录 B')}</div>
      </div>
      {fields.map(({ key, label, format, formatRecord }) => (
        <Row
          key={key}
          label={label}
          leftVal={formatRecord ? formatRecord(left) : format ? format(left[key]) : left[key]}
          rightVal={formatRecord ? formatRecord(right) : format ? format(right[key]) : right[key]}
          highlight
        />
      ))}
    </div>
  )
}
