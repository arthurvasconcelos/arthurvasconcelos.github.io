import type { ProjectPackage } from "../../app/data/projects"

export type ProjectStats = {
  name: string
  description: string
  archived: boolean
  stars: number
  forks: number
  watchers: number
  openIssues: number
  downloads?: number
  fetchedAt: string
}

export type PackageVersion = {
  version: string
  fetchedAt: string
}

export type ProjectStatsSnapshot = {
  generatedAt: string
  repos: Record<string, ProjectStats>
  packages: Record<string, PackageVersion>
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
  const gh = await getJson<GitHubRepo>(
    `https://api.github.com/repos/${OWNER}/${repo}`,
    githubHeaders(token),
  )

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
    const downloads = await optional(
      getJson<{ downloads: number }>(
        `https://api.npmjs.org/downloads/point/${npmCreateDate}:${today}/${repo}`,
      ),
      previous?.downloads === undefined ? undefined : { downloads: previous.downloads },
    )
    if (downloads) stats.downloads = downloads.downloads
  }

  return stats
}

export function packageKey(pkg: ProjectPackage): string {
  return `${pkg.ecosystem}:${pkg.name}`
}

function githubHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

// "v0.27.5" -> "0.27.5", "pair--v0.1.0" -> "0.1.0"
function versionFromTag(tag: string): string {
  return tag.replace(/^.*?v(?=\d)/, "")
}

export async function fetchPackageVersion(
  pkg: ProjectPackage,
  { repo, token }: { repo: string; token?: string },
): Promise<PackageVersion> {
  let version: string
  switch (pkg.ecosystem) {
    case "npm": {
      const data = await getJson<{ version: string }>(
        `https://registry.npmjs.org/${pkg.name}/latest`,
      )
      version = data.version
      break
    }
    case "pypi": {
      const data = await getJson<{ info: { version: string } }>(
        `https://pypi.org/pypi/${pkg.name}/json`,
      )
      version = data.info.version
      break
    }
    case "brew":
    case "github": {
      const data = await getJson<{ tag_name: string }>(
        `https://api.github.com/repos/${OWNER}/${repo}/releases/latest`,
        githubHeaders(token),
      )
      version = versionFromTag(data.tag_name)
      break
    }
  }
  return { version, fetchedAt: new Date().toISOString() }
}
