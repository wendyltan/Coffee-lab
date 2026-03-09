/**
 * 统一图标映射：用 Phosphor 矢量图标替代 emoji，在 iOS 上更清晰一致。
 * 使用 weight="duotone" 或 "fill" 以在 Retina 上更优雅。
 */
import {
  Sun,
  CircleHalf,
  Moon,
  CloudSun,
  CloudMoon,
  Coffee,
  Flame,
  Drop,
  GearSix,
  Nut,
  Wrench,
  Leaf,
  Snowflake,
  Ruler,
  Wine,
  Star,
} from '@phosphor-icons/react'

const ROAST_ICONS = {
  light: Sun,
  medium_light: CloudSun,
  medium: CircleHalf,
  medium_dark: CloudMoon,
  dark: Moon,
}

const BREW_METHOD_ICONS = {
  moka: Flame,
  espresso: Coffee,
  pour_over: Drop,
}

const EQUIPMENT_ICONS = {
  espresso_machine: Coffee,
  moka_pot: Flame,
  grinder: GearSix,
  tamper: Nut,
  pour_over_kettle: Drop,
  other: Wrench,
}

const INGREDIENT_ICONS = {
  milk: Drop,
  espresso: Coffee,
  orange: Drop, // 橙汁用液滴表示
  oat_milk: Leaf,
  ice: Snowflake,
}

const SECTION_ICONS = {
  beans: Coffee,
  extraction: Ruler,
  recipe: Wine,
  rating: Star,
}

const DEFAULT_ICON_SIZE = 20
const DEFAULT_ICON_WEIGHT = 'duotone'

export function getRoastIcon(value) {
  return ROAST_ICONS[value] ?? CircleHalf
}

export function getBrewMethodIcon(value) {
  return BREW_METHOD_ICONS[value] ?? Coffee
}

export function getEquipmentIcon(value) {
  return EQUIPMENT_ICONS[value ?? 'other'] ?? Wrench
}

export function getIngredientIcon(id) {
  return INGREDIENT_ICONS[id] ?? Coffee
}

export function getSectionIcon(key) {
  return SECTION_ICONS[key] ?? Star
}

export {
  ROAST_ICONS,
  BREW_METHOD_ICONS,
  EQUIPMENT_ICONS,
  INGREDIENT_ICONS,
  SECTION_ICONS,
  DEFAULT_ICON_SIZE,
  DEFAULT_ICON_WEIGHT,
}
