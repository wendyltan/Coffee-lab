import { CrownSimple, Sparkle, TrendUp, Lightning } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'

function toNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export default function SubscriptionPage() {
  const { logs, isPremium, activatePremiumDemo, cancelPremiumDemo, t, language } = useApp()

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

  return (
    <div className="p-4 pb-6">
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
