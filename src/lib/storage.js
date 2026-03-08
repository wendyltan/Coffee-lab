import { STORAGE_KEYS, DEFAULT_BEAN_BEST_WINDOW_WEEKS } from './constants'
import { detectSystemLanguage, normalizeLanguage } from './i18n'

function get(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return defaultValue
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function getLogs() {
  return get(STORAGE_KEYS.LOGS, [])
}

export function setLogs(logs) {
  return set(STORAGE_KEYS.LOGS, logs)
}

export function getBeans() {
  return get(STORAGE_KEYS.BEANS, [])
}

export function setBeans(beans) {
  return set(STORAGE_KEYS.BEANS, beans)
}

export function getEquipment() {
  return get(STORAGE_KEYS.EQUIPMENT, [])
}

export function setEquipment(equipment) {
  return set(STORAGE_KEYS.EQUIPMENT, equipment)
}

export function getRecipes() {
  return get(STORAGE_KEYS.RECIPES, [])
}

export function setRecipes(recipes) {
  return set(STORAGE_KEYS.RECIPES, recipes)
}

export function getLanguage() {
  const saved = get(STORAGE_KEYS.LANGUAGE, null)
  if (typeof saved === 'string') return normalizeLanguage(saved)
  return detectSystemLanguage()
}

export function setLanguage(language) {
  return set(STORAGE_KEYS.LANGUAGE, normalizeLanguage(language))
}

const defaultSubscription = {
  plan: 'free',
  isActive: false,
  startedAt: null,
}

export function getSubscription() {
  const saved = get(STORAGE_KEYS.SUBSCRIPTION, defaultSubscription)
  if (!saved || typeof saved !== 'object') return defaultSubscription
  return {
    plan: saved.plan === 'pro' ? 'pro' : 'free',
    isActive: Boolean(saved.isActive),
    startedAt: saved.startedAt || null,
  }
}

export function setSubscription(subscription) {
  const next = {
    plan: subscription?.plan === 'pro' ? 'pro' : 'free',
    isActive: Boolean(subscription?.isActive),
    startedAt: subscription?.startedAt || null,
  }
  return set(STORAGE_KEYS.SUBSCRIPTION, next)
}

function normalizeBeanFreshnessSettings(value) {
  const input = value && typeof value === 'object' ? value : {}
  const normalizeWeeks = (v, fallback) => {
    const n = Number(v)
    if (!Number.isFinite(n)) return fallback
    return Math.max(1, Math.min(20, Math.round(n)))
  }
  return {
    light: normalizeWeeks(input.light, DEFAULT_BEAN_BEST_WINDOW_WEEKS.light),
    medium: normalizeWeeks(input.medium, DEFAULT_BEAN_BEST_WINDOW_WEEKS.medium),
    dark: normalizeWeeks(input.dark, DEFAULT_BEAN_BEST_WINDOW_WEEKS.dark),
  }
}

export function getBeanFreshnessSettings() {
  const saved = get(STORAGE_KEYS.BEAN_FRESHNESS_SETTINGS, null)
  return normalizeBeanFreshnessSettings(saved)
}

export function setBeanFreshnessSettings(settings) {
  return set(STORAGE_KEYS.BEAN_FRESHNESS_SETTINGS, normalizeBeanFreshnessSettings(settings))
}
