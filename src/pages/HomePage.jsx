import { useNavigate } from 'react-router-dom'
import { Coffee, Wine } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import Calendar from '../components/Calendar'
import DayLogList from '../components/DayLogList'
import { getTodayKey } from '../lib/utils'

export default function HomePage() {
  const navigate = useNavigate()
  const { todayCount, logsByDate, t, language } = useApp()
  const todayKey = getTodayKey()
  const dayLogs = logsByDate[todayKey] || []

  return (
    <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0px)+7rem)]">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
              <Coffee size={32} weight="duotone" className="text-coffee-600" />
              {t('home.title', 'CoffeeLab')}
            </h1>
            <p className="text-stone-500 text-sm mt-1">{t('home.subtitle', '记录每一次冲煮，找到你的完美配方')}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/log')}
            className="btn-primary shrink-0 py-2 px-4 text-sm"
          >
            {t('home.logOneCup', '记一杯')}
          </button>
        </div>
      </header>

      <div className="card mb-6 bg-gradient-to-br from-cream-100 to-sage-300/20 border-sage-300/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-stone-500">{t('home.todayCount', '今日已喝')}</p>
            <p className="text-3xl font-bold text-coffee-700 flex items-center gap-2">
              <Coffee size={28} className="text-coffee-500" />
              {todayCount}
              {language === 'en' ? '' : ' 杯'}
            </p>
          </div>
          <Wine size={40} weight="duotone" className="text-coffee-400/80" />
        </div>
      </div>

      <Calendar
        logsByDate={logsByDate}
        selectedDate={todayKey}
        onSelectDate={(dateKey) => navigate('/day/' + dateKey)}
      />

      <div className="mt-6">
        <DayLogList logs={dayLogs} dateLabel={language === 'en' ? 'Today Logs' : '今日记录'} />
      </div>
    </div>
  )
}
