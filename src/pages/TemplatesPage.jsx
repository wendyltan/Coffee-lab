import { useState } from 'react'
import { Coffee, GearSix, Wine } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import BeanList from '../components/templates/BeanList'
import EquipmentList from '../components/templates/EquipmentList'
import RecipeList from '../components/templates/RecipeList'

const TABS = [
  { id: 'beans', label: '豆子库', icon: Coffee },
  { id: 'equipment', label: '设备库', icon: GearSix },
  { id: 'recipes', label: '饮品配方', icon: Wine },
]

export default function TemplatesPage() {
  const [tab, setTab] = useState('beans')
  const { beans, equipment, recipes } = useApp()

  return (
    <div className="p-4 pb-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-coffee-800 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          模板与配方
        </h1>
        <p className="text-stone-500 text-sm mt-1">预设豆子、设备和饮品配方，记录时一键填充</p>
      </header>

      <div className="flex rounded-2xl bg-cream-300 p-1 mb-6">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === t.id ? 'bg-cream-100 text-coffee-700 shadow-soft' : 'text-stone-500'
              }`}
            >
              <Icon size={18} />
              {t.label}
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
