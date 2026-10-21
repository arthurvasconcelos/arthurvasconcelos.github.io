import snapshot from "~/data/project-stats.json"
import type { ProjectPackage } from "~/data/projects"
import type {
  PackageVersion,
  ProjectStats,
  ProjectStatsSnapshot,
} from "#shared/utils/project-stats"

const STALE_AFTER_MS = 24 * 60 * 60 * 1000

const statsSnapshot = snapshot as ProjectStatsSnapshot

type Stamped = { fetchedAt: string }

function readCache<T extends Stamped>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

function writeCache<T extends Stamped>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage unavailable or full; the fetched data is still shown this session
  }
}

function isFresh(value: Stamped | undefined): boolean {
  return !!value && Date.now() - Date.parse(value.fetchedAt) < STALE_AFTER_MS
}

/**
 * Pre-rendered values come from the weekly snapshot in app/data/project-stats.json.
 * On the client, a newer localStorage copy wins, and anything older than a day is
 * refetched in the background. Failed fetches keep whatever was shown.
 */
function useSnapshotCache<T extends Stamped>(
  storageKey: string,
  initial: T | undefined,
  fetcher: (previous: T | undefined) => Promise<T>,
) {
  const value = ref<T | undefined>(initial) as Ref<T | undefined>

  onMounted(async () => {
    const cached = readCache<T>(storageKey)
    if (cached && (!value.value || cached.fetchedAt > value.value.fetchedAt)) {
      value.value = cached
    }
    if (isFresh(value.value)) return

    try {
      const fresh = await fetcher(value.value)
      value.value = fresh
      writeCache(storageKey, fresh)
    } catch {
      // rate limited or offline; keep the snapshot or cached copy
    }
  })

  return value
}

export function useProjectStats(repo: string, options: { npmCreateDate?: string } = {}) {
  return useSnapshotCache<ProjectStats>(
    `project-stats:${repo}`,
    statsSnapshot.repos[repo],
    (previous) => fetchProjectStats(repo, { ...options, previous }),
  )
}

export function usePackageVersion(pkg: ProjectPackage, repo: string) {
  const key = packageKey(pkg)
  return useSnapshotCache<PackageVersion>(
    `package-version:${key}`,
    statsSnapshot.packages[key],
    () => fetchPackageVersion(pkg, { repo }),
  )
}
