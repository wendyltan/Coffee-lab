let hapticsModulePromise = null

async function getCapacitorHaptics() {
  if (!hapticsModulePromise) {
    hapticsModulePromise = import('@capacitor/haptics').catch(() => null)
  }
  return hapticsModulePromise
}

function vibrateFallback(ms = 10) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    navigator.vibrate(ms)
  }
}

export async function triggerHaptic(type = 'light') {
  const mod = await getCapacitorHaptics()
  if (mod?.Haptics && mod?.ImpactStyle) {
    const styleMap = {
      light: mod.ImpactStyle.Light,
      medium: mod.ImpactStyle.Medium,
      heavy: mod.ImpactStyle.Heavy,
    }
    try {
      await mod.Haptics.impact({ style: styleMap[type] ?? mod.ImpactStyle.Light })
      return
    } catch {
      // Fall through to web vibration fallback.
    }
  }
  vibrateFallback(type === 'heavy' ? 20 : 10)
}
