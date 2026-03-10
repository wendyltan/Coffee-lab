import { useRef, useState } from 'react'
import { CrownSimple, Sparkle, TrendUp, Lightning, FileArrowDown, FileArrowUp } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import {
  exportBrewLogsExcel,
  exportTemplateExcel,
  importTemplateExcel,
} from '../lib/excel'

function toNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export default function SubscriptionPage() {
  const {
    logs,
    beans,
    equipment,
    recipes,
    setBeans,
    setEquipment,
    setRecipes,
    isPremium,
    activatePremiumDemo,
    cancelPremiumDemo,
    t,
    language,
  } = useApp()
  const fileInputRef = useRef(null)
  const [actionMessage, setActionMessage] = useState('')

  const ratedLogs = logs.filter((l) => toNumber(l.rating) > 0)
  const avgRating = ratedLogs.length
    ? (ratedLogs.reduce((acc, cur) => acc + toNumber(cur.rating), 0) / ratedLogs.length).toFixed(1)
    : null

  const validRatioLogs = logs.filter((l) => toNumber(l.doseG) > 0 && toNumber(l.yieldMl) > 0)
  const avgRatio = validRatioLogs.length
    ? (
        validRatioLogs.reduce((acc, cur) => acc + toNumber(cur.yieldMl) / toNumber(cur.doseG), 0) /
        validRatioLogs.length
      ).toFixed(2)
    : null

  const advice =
    logs.length < 3
      ? t('subscription.needMoreData', '记录不足，至少 3 条记录后可生成更稳定建议。')
      : language === 'en'
        ? `Try keeping ratio near 1:${avgRatio || '2.0'} and grind slightly finer when rating drops below 3.5.`
        : `建议将粉液比稳定在 1:${avgRatio || '2.0'} 附近，若评分低于 3.5 可尝试略微调细磨度。`

  const trendText =
    avgRating == null
      ? language === 'en'
        ? 'No rating trend yet'
        : '暂无评分趋势'
      : language === 'en'
        ? `Average flavor score: ${avgRating}/5`
        : `平均风味评分：${avgRating}/5`

  const mergeById = (prev, incoming) => {
    const map = new Map(prev.map((item) => [item.id, item]))
    incoming.forEach((item) => {
      map.set(item.id, item)
    })
    return Array.from(map.values())
  }

  const handleExportLogs = async () => {
    if (!isPremium) return
    if (!logs.length) {
      setActionMessage(language === 'en' ? 'No brew data to export yet.' : '暂无可导出的冲煮数据。')
      return
    }
    try {
      const result = await exportBrewLogsExcel(logs, language)
      setActionMessage(
        result.mode === 'share'
          ? (language === 'en' ? 'Export ready. Choose "Save to Files" in share sheet.' : '导出已就绪，请在系统分享面板选择“存储到文件”。')
          : (language === 'en' ? `Exported ${logs.length} brew logs.` : `已导出 ${logs.length} 条冲煮记录。`)
      )
    } catch {
      setActionMessage(language === 'en' ? 'Export failed. Please try again.' : '导出失败，请重试。')
    }
  }

  const handleExportTemplates = async () => {
    if (!isPremium) return
    const total = beans.length + equipment.length + recipes.length
    if (!total) {
      setActionMessage(language === 'en' ? 'No template data to export yet.' : '暂无可导出的模板数据。')
      return
    }
    try {
      const result = await exportTemplateExcel({ beans, equipment, recipes }, language)
      setActionMessage(
        result.mode === 'share'
          ? (language === 'en'
              ? 'Export ready. Choose "Save to Files" in share sheet.'
              : '导出已就绪，请在系统分享面板选择“存储到文件”。')
          : (language === 'en'
              ? `Exported templates: ${beans.length} beans, ${equipment.length} equipment, ${recipes.length} recipes`
              : `已导出模板数据：豆子 ${beans.length} 条，设备 ${equipment.length} 条，配方 ${recipes.length} 条`)
      )
    } catch {
      setActionMessage(language === 'en' ? 'Export failed. Please try again.' : '导出失败，请重试。')
    }
  }

  const handlePickImport = () => {
    if (!isPremium) return
    fileInputRef.current?.click()
  }

  const handleImportTemplates = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = await importTemplateExcel(file)
      setBeans((prev) => mergeById(prev, parsed.beans))
      setEquipment((prev) => mergeById(prev, parsed.equipment))
      setRecipes((prev) => mergeById(prev, parsed.recipes))
      setActionMessage(
        language === 'en'
          ? `Imported: ${parsed.beans.length} beans, ${parsed.equipment.length} equipment, ${parsed.recipes.length} recipes`
          : `导入完成：豆子 ${parsed.beans.length} 条，设备 ${parsed.equipment.length} 条，配方 ${parsed.recipes.length} 条`
      )
    } catch {
      setActionMessage(language === 'en' ? 'Import failed. Please check file format.' : '导入失败，请检查 Excel 文件格式')
    }
  }

  return (
    <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0px)+7rem)]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
          <CrownSimple size={28} weight="duotone" />
          {t('subscription.title', 'CoffeeLab 订阅')}
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          {t('subscription.subtitle', '基础记录永久免费，订阅解锁高级成长能力。')}
        </p>
      </header>

      <section className="card mb-4">
        <h2 className="text-lg font-semibold text-coffee-800 mb-2">{t('subscription.currentPlan', '当前方案')}</h2>
        <p className="text-sm text-stone-600 mb-3">
          {isPremium ? t('subscription.proPlan', 'Pro 订阅') : t('subscription.freePlan', '免费版')}
          {' · '}
          {isPremium ? t('subscription.active', '已激活') : t('subscription.inactive', '未激活')}
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" className="btn-secondary text-sm py-2.5">
            {t('subscription.monthly', '月订阅')}
          </button>
          <button type="button" className="btn-secondary text-sm py-2.5">
            {t('subscription.yearly', '年订阅')}
          </button>
        </div>
        <ul className="mt-3 text-sm text-stone-600 space-y-1">
          <li>• {t('subscription.feature1', '智能萃取建议')}</li>
          <li>• {t('subscription.feature2', '风味趋势分析')}</li>
          <li>• {t('subscription.feature3', '高级对比总结')}</li>
          <li>• {t('subscription.feature4', '云同步（预留）')}</li>
        </ul>
        <button
          type="button"
          onClick={isPremium ? cancelPremiumDemo : activatePremiumDemo}
          className="btn-primary w-full mt-4"
        >
          {isPremium
            ? t('subscription.disableDemo', '关闭本地订阅演示')
            : t('subscription.enableDemo', '开启本地订阅演示')}
        </button>
        <p className="text-xs text-stone-500 mt-2">
          {t('subscription.demoNote', '当前为本地演示模式，后续可无缝接入 App Store 内购。')}
        </p>
      </section>

      {isPremium && (
        <>
          <section className="card mb-4">
            <h3 className="font-semibold text-coffee-800 mb-2">
              {language === 'en' ? 'Pro Data Center (Excel)' : '高级版数据中心（Excel）'}
            </h3>
            <p className="text-sm text-stone-600 mb-3">
              {language === 'en'
                ? 'Export brew logs for analysis, or import/export template library in one click.'
                : '支持导出冲煮记录做分析，或一键导入/导出豆子库、设备库、饮品配方。'}
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={handleExportLogs}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FileArrowDown size={18} />
                {language === 'en' ? 'Export Brew Data (.xlsx)' : '导出冲煮数据（Excel）'}
              </button>
              <button
                type="button"
                onClick={handleExportTemplates}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <FileArrowDown size={18} />
                {language === 'en' ? 'Export Template Data (.xlsx)' : '导出模板数据（Excel）'}
              </button>
              <button
                type="button"
                onClick={handlePickImport}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FileArrowUp size={18} />
                {language === 'en' ? 'Import Template Data (.xlsx)' : '导入模板数据（Excel）'}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportTemplates}
            />
            {actionMessage && <p className="text-xs text-stone-500 mt-2">{actionMessage}</p>}
          </section>

          <section className="card mb-4">
            <h3 className="font-semibold text-coffee-800 mb-2 flex items-center gap-2">
              <Lightning size={18} weight="duotone" />
              {t('subscription.smartAdvice', '本周智能建议')}
            </h3>
            <p className="text-sm text-stone-600 leading-6">{advice}</p>
          </section>

          <section className="card">
            <h3 className="font-semibold text-coffee-800 mb-2 flex items-center gap-2">
              <TrendUp size={18} weight="duotone" />
              {t('subscription.trend', '风味趋势')}
            </h3>
            <p className="text-sm text-stone-600 mb-2">{trendText}</p>
            <div className="text-xs text-stone-500 flex items-center gap-1.5">
              <Sparkle size={14} />
              {language === 'en'
                ? `Based on ${logs.length} logs and ${ratedLogs.length} rated cups`
                : `基于 ${logs.length} 条记录、${ratedLogs.length} 条带评分记录生成`}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
