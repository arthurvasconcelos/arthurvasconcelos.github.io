export type ProjectStats = {
  name: string
  description: string
  archived: boolean
  stars: number
  forks: number
  watchers: number
  openIssues: number
  downloads?: number
  version?: string
  fetchedAt: string
}

export type ProjectStatsSnapshot = {
  generatedAt: string
  repos: Record<string, ProjectStats>
}

export type FetchProjectStatsOptions = {
  npmCreateDate?: string
  previous?: ProjectStats
  token?: string
}

type GitHubRepo = {
  name: string
  description: string | null
  archived: boolean
  stargazers_count: number
  forks_count: number
  subscribers_count: number
  open_issues_count: number
}

const OWNER = "arthurvasconcelos"

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`)
  }
  return (await response.json()) as T
}

async function optional<T>(promise: Promise<T>, fallback: T | undefined): Promise<T | undefined> {
  try {
    return await promise
  } catch {
    return fallback
  }
}

export async function fetchProjectStats(
  repo: string,
  { npmCreateDate, previous, token }: FetchProjectStatsOptions = {},
): Promise<ProjectStats> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (token) headers.Authorization = `Bearer ${token}`

  const gh = await getJson<GitHubRepo>(`https://api.github.com/repos/${OWNER}/${repo}`, headers)

  const stats: ProjectStats = {
    name: gh.name,
    description: gh.description ?? "",
    archived: gh.archived,
    stars: gh.stargazers_count,
    forks: gh.forks_count,
    watchers: gh.subscribers_count,
    openIssues: gh.open_issues_count,
    fetchedAt: new Date().toISOString(),
  }

  if (npmCreateDate) {
    const today = new Date().toISOString().slice(0, 10)
    const [downloads, pkg] = await Promise.all([
      optional(
        getJson<{ downloads: number }>(
          `https://api.npmjs.org/downloads/point/${npmCreateDate}:${today}/${repo}`,
        ),
        previous?.downloads === undefined ? undefined : { downloads: previous.downloads },
      ),
      optional(
        getJson<{ version?: string }>(
          `https://raw.githubusercontent.com/${OWNER}/${repo}/master/package.json`,
        ),
        previous?.version === undefined ? undefined : { version: previous.version },
      ),
    ])
    if (downloads) stats.downloads = downloads.downloads
    if (pkg?.version) stats.version = pkg.version
  }

  return stats
}
