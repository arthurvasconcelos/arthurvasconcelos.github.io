import platform24Logo from "~/assets/img/logos/companies/platform24.png"
import kognityLogo from "~/assets/img/logos/companies/kognity.png"
import geniusSportsLogo from "~/assets/img/logos/companies/genius-sports.png"
import institutoIgarapeLogo from "~/assets/img/logos/companies/instituto-igarape.png"
import fgvLogo from "~/assets/img/logos/companies/fgv.png"
import pilotiLogo from "~/assets/img/logos/companies/piloti.png"

export type LocationType = "Remote" | "On-site" | "Hybrid"

export type WorkRoleData = {
  id: string
  title: string
  locationType: LocationType
  descriptionKey: string
  keywords: string[]
  start: string
  end?: string
}

export type WorkExperienceData = {
  id: string
  company: string
  companyLogo?: string
  locationIcon: string
  location: string
  roles: WorkRoleData[]
}

export const workExperiencesData: WorkExperienceData[] = [
  {
    id: "platform24",
    company: "Platform24",
    companyLogo: platform24Logo,
    locationIcon: "twemoji:flag-sweden",
    location: "Stockholm, Sweden",
    roles: [
      {
        id: "senior-front-end-engineer",
        title: "Senior Front-End Engineer",
        locationType: "Hybrid",
        descriptionKey: "about.workExperiences.descriptions.platform24",
        keywords: ["TypeScript", "React", "Healthcare", "Digital Care"],
        start: "2026-02-01",
      },
    ],
  },
  {
    id: "kognity",
    company: "Kognity",
    companyLogo: kognityLogo,
    locationIcon: "twemoji:flag-sweden",
    location: "Stockholm, Sweden",
    roles: [
      {
        id: "tech-lead",
        title: "Senior Software Engineer / Technical Lead",
        locationType: "Hybrid",
        descriptionKey: "about.workExperiences.descriptions.kognityTechLead",
        keywords: [
          "JavaScript",
          "TypeScript",
          "Vue.js 2",
          "Vue.js 3",
          "Python",
          "Django",
          "PostgreSQL",
          "Docker",
          "Heroku",
          "AWS",
        ],
        start: "2022-06-01",
        end: "2025-12-01",
      },
      {
        id: "senior-se",
        title: "Senior Software Engineer",
        locationType: "Hybrid",
        descriptionKey: "about.workExperiences.descriptions.kognitySeniorSe",
        keywords: [
          "JavaScript",
          "Angular 1.x",
          "Vue.js 2",
          "Python",
          "Django",
          "PostgreSQL",
          "Docker",
          "Heroku",
          "AWS",
        ],
        start: "2020-12-01",
        end: "2022-05-01",
      },
    ],
  },
  {
    id: "genius-sports",
    company: "Genius Sports",
    companyLogo: geniusSportsLogo,
    locationIcon: "twemoji:flag-estonia",
    location: "Tallinn, Estonia",
    roles: [
      {
        id: "software-engineer",
        title: "Software Engineer",
        locationType: "On-site",
        descriptionKey: "about.workExperiences.descriptions.geniusSports",
        keywords: [
          "JavaScript",
          "TypeScript",
          "Preact",
          "React",
          ".NET",
          "Kotlin",
          "PostgreSQL",
          "AWS",
          "Terraform",
          "Grafana",
        ],
        start: "2019-04-01",
        end: "2020-11-01",
      },
    ],
  },
  {
    id: "igarape",
    company: "Igarapé Institute",
    companyLogo: institutoIgarapeLogo,
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    roles: [
      {
        id: "software-developer",
        title: "Software Developer",
        locationType: "Hybrid",
        descriptionKey: "about.workExperiences.descriptions.igarape",
        keywords: [
          "JavaScript",
          "TypeScript",
          "Angular 1.x",
          "Ember.js",
          "Python",
          "Node.js",
          "PostgreSQL",
          "Java",
          "AWS",
        ],
        start: "2016-04-01",
        end: "2019-04-01",
      },
    ],
  },
  {
    id: "fgv",
    company: "Getulio Vargas Foundation",
    companyLogo: fgvLogo,
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    roles: [
      {
        id: "full-stack-developer",
        title: "Full-Stack Developer",
        locationType: "On-site",
        descriptionKey: "about.workExperiences.descriptions.fgv",
        keywords: [
          "JavaScript",
          "CoffeeScript",
          "TypeScript",
          "Node.js",
          "Python",
          "PostgreSQL",
          "D3.js",
          "AWS",
        ],
        start: "2014-07-01",
        end: "2016-02-01",
      },
    ],
  },
  {
    id: "piloti",
    company: "Piloti Mobile & Internet",
    companyLogo: pilotiLogo,
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    roles: [
      {
        id: "full-stack-developer",
        title: "Full-Stack Developer",
        locationType: "On-site",
        descriptionKey: "about.workExperiences.descriptions.piloti",
        keywords: ["JavaScript", "SASS", "LESS", "PHP", "Symfony", "MySQL"],
        start: "2013-03-01",
        end: "2014-06-01",
      },
    ],
  },
  {
    id: "brasil-ooh",
    company: "Brasil OOH",
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    roles: [
      {
        id: "junior-developer",
        title: "Junior Developer",
        locationType: "On-site",
        descriptionKey: "about.workExperiences.descriptions.brasilOoh",
        keywords: ["PHP"],
        start: "2012-06-01",
        end: "2013-02-01",
      },
    ],
  },
  {
    id: "help-ltda",
    company: "HELP LTDA",
    locationIcon: "twemoji:flag-brazil",
    location: "Rio de Janeiro, Brazil",
    roles: [
      {
        id: "junior-developer",
        title: "Junior Developer",
        locationType: "On-site",
        descriptionKey: "about.workExperiences.descriptions.helpLtda",
        keywords: ["PHP"],
        start: "2010-03-01",
        end: "2011-08-01",
      },
    ],
  },
]
