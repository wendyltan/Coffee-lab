export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatDateKey(date) {
  if (date instanceof Date) {
    return date.toISOString().slice(0, 10)
  }
  return String(date).slice(0, 10)
}

export function getTodayKey() {
  return formatDateKey(new Date())
}

/** 根据生产日期计算已过周数、天数，返回文案如 "第2周第3天" */
export function getProductionAgeText(productionDate) {
  if (!productionDate || typeof productionDate !== 'string') return null
  const dateStr = String(productionDate).trim().slice(0, 10)
  if (!dateStr) return null
  const prod = new Date(dateStr)
  const today = new Date()
  if (Number.isNaN(prod.getTime()) || prod > today) return null
  const msPerDay = 86400000
  const days = Math.floor((today - prod) / msPerDay)
  if (days < 0) return null
  const weeks = Math.floor(days / 7)
  const remainDays = days % 7
  return `第${weeks}周第${remainDays}天`
}

/** 计算粉液比，例如 1:2.5 */
export function calcRatio(doseG, yieldMl) {
  if (!doseG || !yieldMl || Number(doseG) <= 0) return null
  const ratio = Number(yieldMl) / Number(doseG)
  return `1:${ratio.toFixed(1)}`
}
