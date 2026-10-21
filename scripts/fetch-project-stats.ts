import { readFile, writeFile } from "node:fs/promises"
import { projects } from "../app/data/projects.ts"
import {
  fetchPackageVersion,
  fetchProjectStats,
  packageKey,
} from "../shared/utils/project-stats.ts"
import type { ProjectStatsSnapshot } from "../shared/utils/project-stats.ts"

const OUTPUT = new URL("../app/data/project-stats.json", import.meta.url)
const token = process.env.GITHUB_TOKEN

async function readPrevious(): Promise<ProjectStatsSnapshot> {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8")) as ProjectStatsSnapshot
  } catch {
    return { generatedAt: "", repos: {}, packages: {} }
  }
}

const previous = await readPrevious()
const repos = [...new Set(projects.map((project) => project.repo))]
const snapshot: ProjectStatsSnapshot = {
  generatedAt: new Date().toISOString(),
  repos: {},
  packages: {},
}
let failures = 0

for (const repo of repos) {
  const project = projects.find((p) => p.repo === repo)
  try {
    snapshot.repos[repo] = await fetchProjectStats(repo, {
      npmCreateDate: project?.npmCreateDate,
      previous: previous.repos[repo],
      token,
    })
    console.log(`✔ ${repo}`)
  } catch (error) {
    failures += 1
    const kept = previous.repos[repo]
    if (kept) snapshot.repos[repo] = kept
    console.error(`✖ ${repo}: ${(error as Error).message}${kept ? " (kept previous)" : ""}`)
  }
}

const packages = projects.flatMap((project) => [
  ...(project.pkg ? [{ pkg: project.pkg, repo: project.repo }] : []),
  ...(project.subPackages ?? []).map((sub) => ({ pkg: sub.pkg, repo: sub.repo })),
])

for (const { pkg, repo } of packages) {
  const key = packageKey(pkg)
  try {
    snapshot.packages[key] = await fetchPackageVersion(pkg, { repo, token })
    console.log(`✔ ${key} ${snapshot.packages[key].version}`)
  } catch (error) {
    const kept = previous.packages?.[key]
    if (kept) snapshot.packages[key] = kept
    console.error(`✖ ${key}: ${(error as Error).message}${kept ? " (kept previous)" : ""}`)
  }
}

await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(
  `Wrote ${Object.keys(snapshot.repos).length} repos and ${Object.keys(snapshot.packages).length} packages to app/data/project-stats.json`,
)

if (failures === repos.length) process.exit(1)
