const FALLBACK_STORAGE_KEY = 'app.profile'

export function createDefaultProfile() {
  return {
    firstTime: true,
    name: '',
    onboarding: {},
    appearance: {
      theme: 'amber',
      density: 'comfortable',
      accent: 'amber',
    },
    settings: {
      launchAtStartup: false,
      mode: 'passive',
    },
  }
}

function normalizeProfile(profile) {
  const fallback = createDefaultProfile()

  return {
    ...fallback,
    ...(profile && typeof profile === 'object' ? profile : {}),
    onboarding: {
      ...fallback.onboarding,
      ...(profile && typeof profile === 'object' && profile.onboarding && typeof profile.onboarding === 'object'
        ? profile.onboarding
        : {}),
    },
    appearance: {
      ...fallback.appearance,
      ...(profile && typeof profile === 'object' && profile.appearance && typeof profile.appearance === 'object'
        ? profile.appearance
        : {}),
    },
    settings: {
      ...fallback.settings,
      ...(profile && typeof profile === 'object' && profile.settings && typeof profile.settings === 'object'
        ? profile.settings
        : {}),
    },
  }
}

export async function loadProfile() {
  const fallback = createDefaultProfile()

  try {
    if (window.electronAPI?.profile?.get) {
      return normalizeProfile(await window.electronAPI.profile.get())
    }

    const stored = window.localStorage.getItem(FALLBACK_STORAGE_KEY)
    return normalizeProfile(stored ? JSON.parse(stored) : fallback)
  } catch (error) {
    console.warn('Could not load profile', error)
    return fallback
  }
}

export async function saveProfile(profile) {
  const nextProfile = normalizeProfile(profile)

  try {
    if (window.electronAPI?.profile?.save) {
      return normalizeProfile(await window.electronAPI.profile.save(nextProfile))
    }

    window.localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(nextProfile))
  } catch (error) {
    console.warn('Could not save profile', error)
  }

  return nextProfile
}