import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gear, Info, CrownSimple, ClockCounterClockwise } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'

const LANG_OPTIONS = [
  { value: 'zh-Hans', label: '中文' },
  { value: 'en', label: 'English' },
]

export default function SettingsPage() {
  const navigate = useNavigate()
  const {
    language,
    setLanguage,
    t,
    subscription,
    isPremium,
    beanFreshnessSettings,
    setBeanFreshnessSettings,
    resetBeanFreshnessSettings,
  } = useApp()
  const roastItems = useMemo(
    () => [
      { key: 'light', label: language === 'en' ? 'Light Roast' : '浅烘' },
      { key: 'medium', label: language === 'en' ? 'Medium Roast' : '中烘' },
      { key: 'dark', label: language === 'en' ? 'Dark Roast' : '深烘' },
    ],
    [language]
  )

  const updateWeeks = (roastKey, rawValue) => {
    const n = Number(rawValue)
    const safe = Number.isFinite(n) ? Math.max(1, Math.min(20, Math.round(n))) : 1
    setBeanFreshnessSettings((prev) => ({ ...prev, [roastKey]: safe }))
  }

  const stepWeeks = (roastKey, delta) => {
    const current = Number(beanFreshnessSettings[roastKey]) || 1
    const next = Math.max(1, Math.min(20, current + delta))
    setBeanFreshnessSettings((prev) => ({ ...prev, [roastKey]: next }))
  }

  return (
    <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0px)+7rem)]">
      <header className="mb-5">
        <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
          <Gear size={28} weight="duotone" />
          {t('settings.title', '设置')}
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          {language === 'en' ? 'Simple controls, better coffee.' : '简洁设置，专注一杯好咖啡。'}
        </p>
      </header>

      <section className="card mb-3">
        <h2 className="text-base font-semibold text-coffee-800 mb-3">{t('settings.language', '语言')}</h2>
        <div className="flex rounded-2xl bg-cream-300 p-1">
          {LANG_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setLanguage(option.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                language === option.value
                  ? 'bg-cream-100 text-coffee-700 shadow-soft'
                  : 'text-stone-500'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <section className="card mb-3">
        <h2 className="text-base font-semibold text-coffee-800 mb-2 flex items-center gap-2">
          <ClockCounterClockwise size={18} weight="duotone" />
          {language === 'en' ? 'Freshness Threshold' : '赏味期阈值'}
        </h2>
        <p className="text-xs text-stone-500 mb-3">
          {language === 'en'
            ? 'By roast level. Used for over-window reminders during logging.'
            : '按烘焙度分档，用于记录时超期提醒。'}
        </p>
        <div className="space-y-2">
          {roastItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-2xl bg-cream-50 border border-cream-300 px-3 py-2"
            >
              <span className="text-sm text-coffee-700">{item.label}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => stepWeeks(item.key, -1)}
                  className="w-7 h-7 rounded-lg bg-cream-300 text-coffee-700 text-sm"
                  aria-label={language === 'en' ? 'Decrease week' : '减少周数'}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="input-field no-spinner w-14 h-8 py-1 text-center text-sm"
                  value={beanFreshnessSettings[item.key]}
                  onChange={(e) => updateWeeks(item.key, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => stepWeeks(item.key, 1)}
                  className="w-7 h-7 rounded-lg bg-cream-300 text-coffee-700 text-sm"
                  aria-label={language === 'en' ? 'Increase week' : '增加周数'}
                >
                  +
                </button>
                <span className="text-xs text-stone-500 w-8 text-right">{language === 'en' ? 'w' : '周'}</span>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={resetBeanFreshnessSettings} className="btn-secondary w-full mt-3 py-2.5 text-sm">
          {language === 'en' ? 'Reset Defaults' : '恢复默认'}
        </button>
      </section>

      <section className="card mb-3">
        <h2 className="text-base font-semibold text-coffee-800 mb-1 flex items-center gap-2">
          <CrownSimple size={20} weight="duotone" />
          {t('settings.subscription', '订阅')}
        </h2>
        <p className="text-sm text-coffee-700 mb-3">
          {isPremium ? t('subscription.proPlan', 'Pro 订阅') : t('subscription.freePlan', '免费版')}
          {' · '}
          {subscription.isActive ? t('subscription.active', '已激活') : t('subscription.inactive', '未激活')}
        </p>
        <button
          type="button"
          onClick={() => navigate('/subscription')}
          className="btn-secondary w-full"
        >
          {t('settings.manageSubscription', '管理订阅')}
        </button>
      </section>

      <section className="card">
        <h2 className="text-base font-semibold text-coffee-800 mb-2 flex items-center gap-2">
          <Info size={20} weight="duotone" />
          {t('settings.about', '关于')}
        </h2>
        <p className="text-sm text-stone-600 mb-3">
          {language === 'en'
            ? 'Focused brewing journal for better consistency.'
            : '专注冲煮记录与复盘，帮助你更稳定地做出好喝咖啡。'}
        </p>
        <p className="text-sm text-stone-500 leading-6">
          {t('settings.contact', '联系邮箱')}: support@coffeelab.app
          <br />
          {t('settings.version', '版本')}: 1.0.0
        </p>
      </section>
    </div>
  )
}
