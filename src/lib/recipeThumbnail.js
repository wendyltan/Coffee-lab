import { RECIPE_INGREDIENT_PRESETS } from './constants'

function getIngredientColor(name, customColor) {
  if (customColor) return customColor
  const p = RECIPE_INGREDIENT_PRESETS.find((x) => x.name === name)
  return p?.color ?? '#A89F94'
}

/** 根据配料列表绘制出品杯缩略图，返回 base64 PNG */
export function drawRecipeThumbnail(ingredients, size = 80) {
  if (!ingredients || ingredients.length === 0) return null
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const totalMl = ingredients.reduce((s, i) => s + (Number(i.ml) || 0), 0)
  if (totalMl <= 0) return null

  const padding = 4
  const cupH = size - padding * 2
  const cupW = size * 0.6
  const cupX = (size - cupW) / 2
  const cupY = padding

  ctx.strokeStyle = 'rgba(139, 115, 85, 0.7)'
  ctx.lineWidth = 2
  ctx.strokeRect(cupX, cupY, cupW, cupH)

  const usedH = cupH * 0.8 // 只填满 8 分高度
  let y = cupY + cupH
  ingredients.forEach((ing) => {
    const pct = (Number(ing.ml) || 0) / totalMl
    const h = Math.max(2, usedH * pct)
    y -= h
    ctx.fillStyle = getIngredientColor(ing.name, ing.color)
    ctx.fillRect(cupX + 1, y, cupW - 2, h)
  })

  try {
    return canvas.toDataURL('image/png')
  } catch {
    return null
  }
}
