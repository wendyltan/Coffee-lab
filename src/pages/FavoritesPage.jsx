import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import DayLogList from '../components/DayLogList'

export default function FavoritesPage() {
  const { logs } = useApp()
  const favoriteLogs = useMemo(() => {
    return logs
      .filter((log) => log.isFavorite)
      .sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.createdAt || '').localeCompare(a.createdAt || ''))
  }, [logs])

  return (
    <div className="p-4 pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-800">精选冲煮</h1>
        <p className="text-stone-500 text-sm mt-1">你收藏的冲煮记录，左滑可取消精选</p>
      </header>

      <DayLogList
        logs={favoriteLogs}
        dateLabel="精选冲煮"
        emptyMessage="还没有精选冲煮哦，在首页或日期页左滑记录可添加精选"
      />
    </div>
  )
}
