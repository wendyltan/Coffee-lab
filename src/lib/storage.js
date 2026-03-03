import { STORAGE_KEYS } from './constants'

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
