import { format, intervalToDuration, formatDuration } from "date-fns";
import type { WorkExperienceData } from "~/data/work-experiences";

export type WorkExperience = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  locationIcon: string;
  location: string;
  locationType: "Remote" | "On-site" | "Hybrid";
  descriptionKey: string;
  keywords: string[];
  start: string;
  end: string | null;
  duration: string;
};

const DATE_FORMAT = "MMM yyyy";

function formatDate(date: string): string {
  return format(new Date(date), DATE_FORMAT);
}

function getDuration(start: string, end: string | undefined): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const duration = intervalToDuration({ start: startDate, end: endDate });
  return formatDuration(duration, { format: ["years", "months"] });
}

export function formatWorkExperience(data: WorkExperienceData): WorkExperience {
  return {
    id: data.id,
    title: data.title,
    company: data.company,
    companyLogo: data.companyLogo,
    locationIcon: data.locationIcon,
    location: data.location,
    locationType: data.locationType,
    descriptionKey: data.descriptionKey,
    keywords: data.keywords,
    start: formatDate(data.start),
    end: data.end ? formatDate(data.end) : null,
    duration: getDuration(data.start, data.end),
  };
}
