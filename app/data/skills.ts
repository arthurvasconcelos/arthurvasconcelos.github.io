export type Skill = {
  id: string;
  name: string;
  icon: string;
  level: number;
};

export type SkillCategory = {
  id: string;
  labelKey: string;
  icon: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    labelKey: "about.skills.categories.languages",
    icon: "material-symbols:code",
    skills: [
      { id: "typescript", name: "TypeScript", icon: "logos:typescript-icon", level: 100 },
      { id: "javascript", name: "JavaScript", icon: "logos:javascript", level: 100 },
      { id: "python", name: "Python", icon: "logos:python", level: 70 },
      { id: "go", name: "Go", icon: "logos:go", level: 50 },
      { id: "php", name: "PHP", icon: "logos:php-alt", level: 50 },
      { id: "java", name: "Java", icon: "logos:java", level: 40 },
      { id: "kotlin", name: "Kotlin", icon: "logos:kotlin-icon", level: 30 },
    ],
  },
  {
    id: "frontend",
    labelKey: "about.skills.categories.frontend",
    icon: "material-symbols:deployed-code-outline",
    skills: [
      { id: "react", name: "React", icon: "logos:react", level: 90 },
      { id: "vue", name: "Vue.js", icon: "logos:vue", level: 100 },
      { id: "nuxt", name: "Nuxt", icon: "logos:nuxt-icon", level: 80 },
      { id: "angular", name: "Angular 1.x", icon: "logos:angular-icon", level: 60 },
      { id: "preact", name: "Preact", icon: "logos:preact", level: 50 },
      { id: "ember", name: "Ember.js", icon: "logos:ember", level: 40 },
      { id: "d3", name: "D3.js", icon: "logos:d3", level: 60 },
      { id: "sass", name: "SASS", icon: "logos:sass", level: 80 },
    ],
  },
  {
    id: "backend",
    labelKey: "about.skills.categories.backend",
    icon: "material-symbols:dns-outline",
    skills: [
      { id: "nodejs", name: "Node.js", icon: "logos:nodejs-icon-alt", level: 90 },
      { id: "django", name: "Django", icon: "logos:django-icon", level: 70 },
      { id: "symfony", name: "Symfony", icon: "logos:symfony", level: 50 },
    ],
  },
  {
    id: "data-infra",
    labelKey: "about.skills.categories.dataInfra",
    icon: "material-symbols:storage-rounded",
    skills: [
      { id: "postgresql", name: "PostgreSQL", icon: "logos:postgresql", level: 80 },
      { id: "mysql", name: "MySQL", icon: "logos:mysql", level: 60 },
      { id: "docker", name: "Docker", icon: "logos:docker-icon", level: 70 },
      { id: "aws", name: "AWS", icon: "logos:aws", level: 60 },
      { id: "heroku", name: "Heroku", icon: "logos:heroku-icon", level: 60 },
      { id: "grafana", name: "Grafana", icon: "logos:grafana", level: 50 },
    ],
  },
  {
    id: "practices",
    labelKey: "about.skills.categories.practices",
    icon: "material-symbols:checklist-rounded",
    skills: [
      { id: "tech-leadership", name: "Technical Leadership", icon: "material-symbols:groups-rounded", level: 90 },
      { id: "code-review", name: "Code Review", icon: "material-symbols:rate-review-outline-rounded", level: 100 },
      { id: "accessibility", name: "Accessibility (WCAG)", icon: "material-symbols:accessibility-new-rounded", level: 80 },
      { id: "e2e-testing", name: "E2E Testing (Cypress)", icon: "material-symbols:bug-report-outline-rounded", level: 80 },
      { id: "hiring", name: "Hiring & Interviewing", icon: "material-symbols:person-search-rounded", level: 80 },
    ],
  },
];
