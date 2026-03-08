// 烘焙度
export const ROAST_LEVELS = [
  { value: 'light', label: '浅烘', emoji: '🌾' },
  { value: 'medium', label: '中烘', emoji: '🥜' },
  { value: 'dark', label: '深烘', emoji: '🫘' },
]

// 制作方式
export const BREW_METHODS = [
  { value: 'moka', label: '摩卡壶', emoji: '🫖' },
  { value: 'espresso', label: '咖啡机', emoji: '☕' },
  { value: 'pour_over', label: '手冲', emoji: '💧' },
]

// 设备类型（设备库用）
export const EQUIPMENT_TYPES = [
  { value: 'espresso_machine', label: '咖啡机', emoji: '☕' },
  { value: 'moka_pot', label: '摩卡壶', emoji: '🫖' },
  { value: 'grinder', label: '磨豆机', emoji: '⚙️' },
  { value: 'tamper', label: '压粉器', emoji: '🔩' },
  { value: 'pour_over_kettle', label: '手冲壶', emoji: '💧' },
  { value: 'other', label: '其他', emoji: '🔧' },
]

// 配方预设配料（用于量杯动画）
export const RECIPE_INGREDIENT_PRESETS = [
  { id: 'milk', name: '奶', color: '#E2D9CC', emoji: '🥛' },
  { id: 'espresso', name: '咖啡液', color: '#4A3728', emoji: '☕' },
  { id: 'orange', name: '橙汁', color: '#E8A64B', emoji: '🍊' },
  { id: 'oat_milk', name: '燕麦奶', color: '#D4C4A8', emoji: '🌾' },
  { id: 'ice', name: '冰块', color: '#CDE7F5', emoji: '🧊' },
]

// 豆子最佳赏味期默认阈值（按烘焙度，单位：周）
export const DEFAULT_BEAN_BEST_WINDOW_WEEKS = {
  light: 8,
  medium: 6,
  dark: 4,
}

// LocalStorage keys
export const STORAGE_KEYS = {
  LOGS: 'coffeelog_logs',
  BEANS: 'coffeelog_beans',
  EQUIPMENT: 'coffeelog_equipment',
  RECIPES: 'coffeelog_recipes',
  LANGUAGE: 'coffeelog_language',
  SUBSCRIPTION: 'coffeelog_subscription',
  BEAN_FRESHNESS_SETTINGS: 'coffeelog_bean_freshness_settings',
}
