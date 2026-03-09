import * as XLSX from 'xlsx'

function ts() {
  return new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
}

function safeJsonParse(raw, fallback) {
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function normalizeRoast(value) {
  const v = String(value ?? '').trim().toLowerCase()
  const map = {
    light: 'light',
    '浅烘': 'light',
    medium_light: 'medium_light',
    'medium-light': 'medium_light',
    '中浅烘': 'medium_light',
    medium: 'medium',
    '中烘': 'medium',
    medium_dark: 'medium_dark',
    'medium-dark': 'medium_dark',
    '中深烘': 'medium_dark',
    dark: 'dark',
    '深烘': 'dark',
  }
  return map[v] ?? 'medium'
}

function normalizeId(value) {
  const str = String(value ?? '').trim()
  if (str) return str
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function exportBrewLogsExcel(logs = [], language = 'zh-Hans') {
  const rows = logs.map((log) => ({
    id: log.id ?? '',
    date: log.date ?? '',
    createdAt: log.createdAt ?? '',
    recipeName: log.recipeName ?? '',
    recipeDetail: log.recipeDetail ?? '',
    beanName: log.beanName ?? '',
    beanOrigin: log.beanOrigin ?? '',
    beanFlavor: log.beanFlavor ?? '',
    roast: log.roast ?? '',
    brewMethod: log.brewMethod ?? '',
    doseG: log.doseG ?? '',
    yieldMl: log.yieldMl ?? '',
    grinderBrand: log.grinderBrand ?? '',
    grindSetting: log.grindSetting ?? '',
    equipmentDisplay: log.equipmentDisplay ?? '',
    tamperInfo: log.tamperInfo ?? '',
    rating: log.rating ?? '',
    isFavorite: log.isFavorite ? 1 : 0,
    note: log.note ?? '',
    extraAdditions: log.extraAdditions ?? '',
  }))

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(rows)
  XLSX.utils.book_append_sheet(wb, ws, 'BrewLogs')
  const filename = language === 'en' ? `CoffeeLab-BrewLogs-${ts()}.xlsx` : `咖方-冲煮记录-${ts()}.xlsx`
  XLSX.writeFile(wb, filename)
}

export function exportTemplateExcel({ beans = [], equipment = [], recipes = [] }, language = 'zh-Hans') {
  const wb = XLSX.utils.book_new()
  const beanRows = beans.map((b) => ({
    id: b.id ?? '',
    name: b.name ?? '',
    origin: b.origin ?? '',
    flavorNotes: b.flavorNotes ?? '',
    roast: b.roast ?? '',
    productionDate: b.productionDate ?? '',
  }))
  const eqRows = equipment.map((e) => ({
    id: e.id ?? '',
    type: e.type ?? '',
    brand: e.brand ?? '',
    model: e.model ?? '',
  }))
  const recipeRows = recipes.map((r) => ({
    id: r.id ?? '',
    name: r.name ?? '',
    serveType: r.serveType ?? '',
    detail: r.detail ?? '',
    extraAdditions: r.extraAdditions ?? '',
    ingredientsJson: JSON.stringify(Array.isArray(r.ingredients) ? r.ingredients : []),
  }))

  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(beanRows), 'Beans')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(eqRows), 'Equipment')
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(recipeRows), 'Recipes')

  const filename = language === 'en' ? `CoffeeLab-Templates-${ts()}.xlsx` : `咖方-模板数据-${ts()}.xlsx`
  XLSX.writeFile(wb, filename)
}

export async function importTemplateExcel(file) {
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data)

  const beansRaw =
    wb.Sheets.Beans ||
    wb.Sheets['豆子库'] ||
    wb.Sheets['Bean Library']
  const equipmentRaw =
    wb.Sheets.Equipment ||
    wb.Sheets['设备库'] ||
    wb.Sheets['Equipment Library']
  const recipesRaw =
    wb.Sheets.Recipes ||
    wb.Sheets['饮品配方'] ||
    wb.Sheets['Recipe Library']

  const beanRows = beansRaw ? XLSX.utils.sheet_to_json(beansRaw, { defval: '' }) : []
  const eqRows = equipmentRaw ? XLSX.utils.sheet_to_json(equipmentRaw, { defval: '' }) : []
  const recipeRows = recipesRaw ? XLSX.utils.sheet_to_json(recipesRaw, { defval: '' }) : []

  const beans = beanRows.map((row) => ({
    id: normalizeId(row.id),
    name: String(row.name ?? '').trim(),
    origin: String(row.origin ?? '').trim(),
    flavorNotes: String(row.flavorNotes ?? '').trim(),
    roast: normalizeRoast(row.roast),
    productionDate: String(row.productionDate ?? '').trim(),
  })).filter((row) => row.name)

  const equipment = eqRows.map((row) => ({
    id: normalizeId(row.id),
    type: String(row.type ?? 'other').trim() || 'other',
    brand: String(row.brand ?? '').trim(),
    model: String(row.model ?? '').trim(),
  })).filter((row) => row.brand || row.model)

  const recipes = recipeRows.map((row) => ({
    id: normalizeId(row.id),
    name: String(row.name ?? '').trim(),
    serveType: String(row.serveType ?? 'hot').trim() || 'hot',
    detail: String(row.detail ?? '').trim(),
    extraAdditions: String(row.extraAdditions ?? '').trim(),
    ingredients: safeJsonParse(row.ingredientsJson, []),
  })).filter((row) => row.name)

  return { beans, equipment, recipes }
}
