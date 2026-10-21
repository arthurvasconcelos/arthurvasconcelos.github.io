import { format, intervalToDuration, formatDuration } from "date-fns"
import { enGB } from "date-fns/locale"
import type { Locale } from "date-fns"
import type {
  LocationKey,
  LocationType,
  WorkExperienceData,
  WorkRoleData,
} from "~/data/work-experiences"
import { workExperiencesData } from "~/data/work-experiences"

type Period = {
  start: string
  startDate: string
  end: string | null
  endDate: string | null
  duration: string
}

export type WorkRole = Period & {
  id: string
  title: string
  locationType: LocationType
  descriptionKey: string
  keywords: string[]
}

export type WorkExperience = Period & {
  id: string
  company: string
  companyLogo?: string
  locationIcon: string
  locationKey: LocationKey
  roles: WorkRole[]
}

const DATE_FORMAT = "MMM yyyy"

function formatDate(date: string, locale: Locale): string {
  return format(new Date(date), DATE_FORMAT, { locale })
}

function getDuration(start: string, end: string | undefined, locale: Locale): string {
  const startDate = new Date(start)
  const endDate = end ? new Date(end) : new Date()
  const duration = intervalToDuration({ start: startDate, end: endDate })
  return formatDuration(duration, { format: ["years", "months"], locale })
}

function formatPeriod(start: string, end: string | undefined, locale: Locale): Period {
  return {
    start: formatDate(start, locale),
    startDate: start,
    end: end ? formatDate(end, locale) : null,
    endDate: end ?? null,
    duration: getDuration(start, end, locale),
  }
}

function formatWorkRole(role: WorkRoleData, locale: Locale): WorkRole {
  return {
    id: role.id,
    title: role.title,
    locationType: role.locationType,
    descriptionKey: role.descriptionKey,
    keywords: role.keywords,
    ...formatPeriod(role.start, role.end, locale),
  }
}

export function formatWorkExperience(
  data: WorkExperienceData,
  locale: Locale = enGB,
): WorkExperience {
  const starts = data.roles.map((role) => role.start).sort()
  const isCurrent = data.roles.some((role) => !role.end)
  const ends = data.roles.flatMap((role) => (role.end ? [role.end] : [])).sort()
  const start = starts[0] ?? ""
  const end = isCurrent ? undefined : ends[ends.length - 1]

  return {
    id: data.id,
    company: data.company,
    companyLogo: data.companyLogo,
    locationIcon: data.locationIcon,
    locationKey: data.locationKey,
    roles: data.roles.map((role) => formatWorkRole(role, locale)),
    ...formatPeriod(start, end, locale),
  }
}

export function useWorkExperiences() {
  const dateLocale = useDateLocale()

  return computed(() =>
    workExperiencesData.map((data) => formatWorkExperience(data, dateLocale.value)),
  )
}
