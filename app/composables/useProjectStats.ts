import snapshot from "~/data/project-stats.json"
import type { ProjectStats, ProjectStatsSnapshot } from "#shared/utils/project-stats"

const STALE_AFTER_MS = 24 * 60 * 60 * 1000
const STORAGE_PREFIX = "project-stats:"

const statsSnapshot = snapshot as ProjectStatsSnapshot

function readCache(repo: string): ProjectStats | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + repo)
    return raw ? (JSON.parse(raw) as ProjectStats) : undefined
  } catch {
    return undefined
  }
}

function writeCache(repo: string, stats: ProjectStats) {
  try {
    localStorage.setItem(STORAGE_PREFIX + repo, JSON.stringify(stats))
  } catch {
    // storage unavailable or full; the fetched data is still shown this session
  }
}

function isFresh(stats: ProjectStats | undefined): boolean {
  return !!stats && Date.now() - Date.parse(stats.fetchedAt) < STALE_AFTER_MS
}

/**
 * Pre-rendered numbers come from the weekly snapshot in app/data/project-stats.json.
 * On the client, a newer localStorage copy wins, and anything older than a day is
 * refetched in the background. Failed fetches keep whatever was shown.
 */
export function useProjectStats(repo: string, options: { npmCreateDate?: string } = {}) {
  const stats = ref<ProjectStats | undefined>(statsSnapshot.repos[repo])

  onMounted(async () => {
    const cached = readCache(repo)
    if (cached && (!stats.value || cached.fetchedAt > stats.value.fetchedAt)) {
      stats.value = cached
    }
    if (isFresh(stats.value)) return

    try {
      const fresh = await fetchProjectStats(repo, { ...options, previous: stats.value })
      stats.value = fresh
      writeCache(repo, fresh)
    } catch {
      // rate limited or offline; keep the snapshot or cached copy
    }
  })

  return stats
}
