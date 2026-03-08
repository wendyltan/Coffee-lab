import { DEFAULT_BEAN_BEST_WINDOW_WEEKS } from './constants'

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

export const BEST_TASTE_WINDOW_DAYS = DEFAULT_BEAN_BEST_WINDOW_WEEKS.medium * 7

function parseDateOnly(input) {
  if (!input) return null
  const raw = String(input).trim().slice(0, 10)
  if (!raw) return null
  const [y, m, d] = raw.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  if (Number.isNaN(date.getTime())) return null
  return date
}

/**
 * 计算某个日期时豆子已生产多久，返回周/天等快照数据。
 */
export function getBeanAgeSnapshot(productionDate, atDate = new Date(), bestWindowDays = BEST_TASTE_WINDOW_DAYS) {
  const prod = parseDateOnly(productionDate)
  const target =
    atDate instanceof Date ? atDate : parseDateOnly(atDate)
  if (!prod || !target || prod > target) return null
  const msPerDay = 86400000
  const days = Math.floor((target - prod) / msPerDay)
  if (days < 0) return null
  const weeks = Math.floor(days / 7)
  const remainDays = days % 7
  const safeWindowDays = Number.isFinite(Number(bestWindowDays))
    ? Math.max(1, Math.round(Number(bestWindowDays)))
    : BEST_TASTE_WINDOW_DAYS
  return {
    days,
    weeks,
    remainDays,
    isOverBestWindow: days > safeWindowDays,
  }
}

export function getBestWindowDaysForRoast(roast, settings) {
  const source = settings && typeof settings === 'object'
    ? settings
    : DEFAULT_BEAN_BEST_WINDOW_WEEKS
  const weeks = Number(source[roast])
  if (!Number.isFinite(weeks)) return BEST_TASTE_WINDOW_DAYS
  return Math.max(1, Math.round(weeks)) * 7
}

/** 根据生产日期计算已过周数、天数，返回文案如 "第2周第3天" */
export function getProductionAgeText(productionDate) {
  const snapshot = getBeanAgeSnapshot(productionDate, new Date())
  if (!snapshot) return null
  return `第${snapshot.weeks}周第${snapshot.remainDays}天`
}

/** 计算粉液比，例如 1:2.5 */
export function calcRatio(doseG, yieldMl) {
  if (!doseG || !yieldMl || Number(doseG) <= 0) return null
  const ratio = Number(yieldMl) / Number(doseG)
  return `1:${ratio.toFixed(1)}`
}
