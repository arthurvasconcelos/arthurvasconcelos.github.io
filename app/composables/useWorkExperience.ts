import { format, intervalToDuration, formatDuration } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export type WorkExperience = {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  locationIcon: string;
  location: string;
  locationType: "Remote" | "On-site" | "Hybrid";
  description: string;
  start: string;
  end?: string;
  duration: string;
};

export const useWorkExperience = (
  experienceData: Omit<WorkExperience, "id" | "duration">
) => {
  const DATE_FORMAT = "MMM yyyy";
  const NOW = "Present";

  const formatDate = (date: string) => {
    return format(new Date(date), DATE_FORMAT);
  };

  const getDuration = (start: string, end: string | undefined) => {
    if (!start) return "Unknown";

    const startDate = new Date(start);
    const endDate = !end ? new Date() : new Date(end);

    const duration = intervalToDuration({
      start: startDate,
      end: endDate,
    });

    return formatDuration(duration, { format: ["years", "months"] });
  };

  const experience = ref<WorkExperience>({
    id: uuidv4(),
    ...experienceData,
    start: formatDate(experienceData.start),
    end: experienceData.end ? formatDate(experienceData.end) : NOW,
    duration: getDuration(experienceData.start, experienceData.end),
  });

  return experience;
};
