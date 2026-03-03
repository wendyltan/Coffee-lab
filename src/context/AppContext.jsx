import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react'
import {
  getLogs,
  setLogs as saveLogs,
  getBeans,
  setBeans as saveBeans,
  getEquipment,
  setEquipment as saveEquipment,
  getRecipes,
  setRecipes as saveRecipes,
} from '../lib/storage'
import { generateId, getTodayKey } from '../lib/utils'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [logs, setLogsState] = useState([])
  const [beans, setBeansState] = useState([])
  const [equipment, setEquipmentState] = useState([])
  const [recipes, setRecipesState] = useState([])

  useEffect(() => {
    setLogsState(getLogs())
    setBeansState(getBeans())
    setEquipmentState(getEquipment())
    setRecipesState(getRecipes())
  }, [])

  const setLogs = useCallback((next) => {
    setLogsState((prev) => {
      const list = typeof next === 'function' ? next(prev) : next
      saveLogs(list)
      return list
    })
  }, [])

  const setBeans = useCallback((next) => {
    setBeansState((prev) => {
      const list = typeof next === 'function' ? next(prev) : next
      saveBeans(list)
      return list
    })
  }, [])

  const setEquipment = useCallback((next) => {
    setEquipmentState((prev) => {
      const list = typeof next === 'function' ? next(prev) : next
      saveEquipment(list)
      return list
    })
  }, [])

  const setRecipes = useCallback((next) => {
    setRecipesState((prev) => {
      const list = typeof next === 'function' ? next(prev) : next
      saveRecipes(list)
      return list
    })
  }, [])

  const addLog = useCallback(
    (entry) => {
      const log = {
        id: generateId(),
        date: getTodayKey(),
        createdAt: new Date().toISOString(),
        ...entry,
      }
      setLogs((prev) => [log, ...prev])
      return log
    },
    [setLogs]
  )

  const updateLog = useCallback(
    (id, updates) => {
      setLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, ...updates } : l))
      )
    },
    [setLogs]
  )

  const deleteLog = useCallback(
    (id) => {
      setLogs((prev) => prev.filter((l) => l.id !== id))
    },
    [setLogs]
  )

  const toggleFavoriteLog = useCallback(
    (id) => {
      setLogs((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))
      )
    },
    [setLogs]
  )

  const addBean = useCallback(
    (bean) => {
      const item = { id: generateId(), ...bean }
      setBeans((prev) => [...prev, item])
      return item
    },
    [setBeans]
  )

  const updateBean = useCallback(
    (id, updates) => {
      setBeans((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
      )
    },
    [setBeans]
  )

  const deleteBean = useCallback(
    (id) => {
      setBeans((prev) => prev.filter((b) => b.id !== id))
    },
    [setBeans]
  )

  const addEquipment = useCallback(
    (item) => {
      const eq = { id: generateId(), ...item }
      setEquipment((prev) => [...prev, eq])
      return eq
    },
    [setEquipment]
  )

  const updateEquipment = useCallback(
    (id, updates) => {
      setEquipment((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      )
    },
    [setEquipment]
  )

  const deleteEquipment = useCallback(
    (id) => {
      setEquipment((prev) => prev.filter((e) => e.id !== id))
    },
    [setEquipment]
  )

  const addRecipe = useCallback(
    (recipe) => {
      const item = { id: generateId(), ...recipe }
      setRecipes((prev) => [...prev, item])
      return item
    },
    [setRecipes]
  )

  const updateRecipe = useCallback(
    (id, updates) => {
      setRecipes((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
      )
    },
    [setRecipes]
  )

  const deleteRecipe = useCallback(
    (id) => {
      setRecipes((prev) => prev.filter((r) => r.id !== id))
    },
    [setRecipes]
  )

  const logsByDate = useMemo(() => {
    const map = {}
    logs.forEach((log) => {
      const d = log.date?.slice(0, 10) || ''
      if (!map[d]) map[d] = []
      map[d].push(log)
    })
    return map
  }, [logs])

  const todayCount = useMemo(() => {
    const today = getTodayKey()
    return (logsByDate[today] || []).length
  }, [logsByDate])

  const value = useMemo(
    () => ({
      logs,
      setLogs,
      addLog,
      updateLog,
      deleteLog,
      toggleFavoriteLog,
      logsByDate,
      todayCount,
      beans,
      setBeans,
      addBean,
      updateBean,
      deleteBean,
      equipment,
      setEquipment,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      recipes,
      setRecipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
    }),
    [
      logs,
      setLogs,
      addLog,
      updateLog,
      deleteLog,
      toggleFavoriteLog,
      logsByDate,
      todayCount,
      beans,
      setBeans,
      addBean,
      updateBean,
      deleteBean,
      equipment,
      setEquipment,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      recipes,
      setRecipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
