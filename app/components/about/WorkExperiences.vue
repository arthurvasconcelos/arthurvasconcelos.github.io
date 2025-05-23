<script setup lang="ts">
import kognityLogo from "~/assets/img/logos/companies/kognity.png";
import geniusSportsLogo from "~/assets/img/logos/companies/genius-sports.png";
import institutoIgarapeLogo from "~/assets/img/logos/companies/instituto-igarape.png";
import fgvLogo from "~/assets/img/logos/companies/fgv.png";
import pilotiLogo from "~/assets/img/logos/companies/piloti.png";

const workExperiences = ref<Ref<WorkExperience>[]>([
  useWorkExperience({
    title: "Senior Software Engineer Technical Lead",
    company: "Kognity",
    companyLogo: kognityLogo,
    locationIcon: "twemoji:flag-sweden",
    location: "Stockholm, Sweden",
    locationType: "Hybrid",
    description: `
      As a Tech Lead, I work closely with my squad's Product Manager, Designer and Engineers to ensure the quality and alignment of our deliveries. I am always looking to improve our ways of working inside the team, optimising processes, scrum ceremonies, documentation and development guidelines.

      Alongside other Tech Leads, Architect, EMs and CTO, I work to keep squads alignment on future feature releases to uphold high quality and technical standards.

      Other responsibilities I have:

      - Planning and execution of our trimestral speed and quality improvements process;
      - Member of the Hiring Team
      - Onboarding new hires when necessary
    `,
    start: "2020-12-01",
  }),
  useWorkExperience({
    title: "Software Engineer",
    company: "Genius Sports",
    companyLogo: geniusSportsLogo,
    locationIcon: "twemoji:flag-estonia",
    location: "Tallinn, Estonia",
    locationType: "On-site",
    description:
      "Responsible for the development of internal tools for realtime bet monitoring.",
    start: "2019-04-01",
    end: "2020-11-01",
  }),
  useWorkExperience({
    title: "Software Developer",
    company: "Instituto Igarapé",
    companyLogo: institutoIgarapeLogo,
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    locationType: "Hybrid",
    description:
      "Responsible for the development of web, desktop, and mobile applications, data visualizations, and interfaces for internal tools.",
    start: "2016-04-01",
    end: "2019-04-01",
  }),
  useWorkExperience({
    title: "Full-Stack Developer",
    company: "FGV",
    companyLogo: fgvLogo,
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    locationType: "On-site",
    description:
      "Responsible for the development of interfaces and tools for data processing, server management and maintenance.",
    start: "2014-07-01",
    end: "2016-02-01",
  }),
  useWorkExperience({
    title: "Full-Stack Developer",
    company: "Piloti",
    companyLogo: pilotiLogo,
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    locationType: "On-site",
    description:
      "Responsible for the development of interfaces and systems using the Symfony framework.",
    start: "2013-03-01",
    end: "2014-06-01",
  }),
  useWorkExperience({
    title: "Junior Developer",
    company: "Brasil OOH",
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    locationType: "On-site",
    description: "...",
    start: "2012-06-01",
    end: "2013-02-01",
  }),
  useWorkExperience({
    title: "Junior Developer",
    company: "HELP LTDA",
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    locationType: "On-site",
    description: "...",
    start: "2010-03-01",
    end: "2011-08-01",
  }),
]);
</script>

<template>
  <AboutSectionsHeading title="Work Experiences" class="mt-10 mb-5" />
  <div class="flex flex-col">
    <AboutExperienceContainer
      v-for="{ value: experience } in workExperiences"
      :key="experience.id"
    >
      <AboutExperienceLogo :experience="experience" />
      <AboutExperiencePeriod :experience="experience" />
      <AboutExperienceDescription :experience="experience" />
    </AboutExperienceContainer>
  </div>
</template>

<style></style>
