import { readFile, writeFile } from "node:fs/promises"
import { projects } from "../app/data/projects.ts"
import { fetchProjectStats } from "../shared/utils/project-stats.ts"
import type { ProjectStatsSnapshot } from "../shared/utils/project-stats.ts"

const OUTPUT = new URL("../app/data/project-stats.json", import.meta.url)
const token = process.env.GITHUB_TOKEN

async function readPrevious(): Promise<ProjectStatsSnapshot> {
  try {
    return JSON.parse(await readFile(OUTPUT, "utf8")) as ProjectStatsSnapshot
  } catch {
    return { generatedAt: "", repos: {} }
  }
}

const previous = await readPrevious()
const repos = [...new Set(projects.map((project) => project.repo))]
const snapshot: ProjectStatsSnapshot = { generatedAt: new Date().toISOString(), repos: {} }
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

await writeFile(OUTPUT, `${JSON.stringify(snapshot, null, 2)}\n`)
console.log(`Wrote ${Object.keys(snapshot.repos).length} repos to app/data/project-stats.json`)

if (failures === repos.length) process.exit(1)
