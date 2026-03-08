import { useMemo, useState } from 'react'
import { Coffee, GearSix, Wine } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import BeanList from '../components/templates/BeanList'
import EquipmentList from '../components/templates/EquipmentList'
import RecipeList from '../components/templates/RecipeList'

export default function TemplatesPage() {
  const [tab, setTab] = useState('beans')
  const { beans, equipment, recipes, t } = useApp()
  const tabs = useMemo(
    () => [
      { id: 'beans', label: t('page.tab.beans', '豆子库'), icon: Coffee },
      { id: 'equipment', label: t('page.tab.equipment', '设备库'), icon: GearSix },
      { id: 'recipes', label: t('page.tab.recipes', '饮品配方'), icon: Wine },
    ],
    [t]
  )

  return (
    <div className="p-4 pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          {t('page.templatesTitle', '模板与配方')}
        </h1>
        <p className="text-stone-500 text-sm mt-1">{t('page.templatesDesc', '预设豆子、设备和饮品配方，记录时一键填充')}</p>
      </header>

      <div className="flex rounded-2xl bg-cream-300 p-1 mb-6">
        {tabs.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === item.id ? 'bg-cream-100 text-coffee-700 shadow-soft' : 'text-stone-500'
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          )
        })}
      </div>

      {tab === 'beans' && <BeanList items={beans} />}
      {tab === 'equipment' && <EquipmentList items={equipment} />}
      {tab === 'recipes' && <RecipeList items={recipes} />}
    </div>
  )
}
