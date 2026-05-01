export type Skill = {
  id: string;
  name: string;
  icon: string;
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
      { id: "typescript", name: "TypeScript", icon: "logos:typescript-icon" },
      { id: "javascript", name: "JavaScript", icon: "logos:javascript" },
      { id: "python", name: "Python", icon: "logos:python" },
      { id: "go", name: "Go", icon: "logos:go" },
      { id: "php", name: "PHP", icon: "logos:php-alt" },
      { id: "java", name: "Java", icon: "logos:java" },
      { id: "kotlin", name: "Kotlin", icon: "logos:kotlin-icon" },
    ],
  },
  {
    id: "frontend",
    labelKey: "about.skills.categories.frontend",
    icon: "material-symbols:deployed-code-outline",
    skills: [
      { id: "react", name: "React", icon: "logos:react" },
      { id: "vue", name: "Vue.js", icon: "logos:vue" },
      { id: "nuxt", name: "Nuxt", icon: "logos:nuxt-icon" },
      { id: "angular", name: "Angular 1.x", icon: "logos:angular-icon" },
      { id: "preact", name: "Preact", icon: "logos:preact" },
      { id: "ember", name: "Ember.js", icon: "logos:ember" },
      { id: "d3", name: "D3.js", icon: "logos:d3" },
      { id: "sass", name: "SASS", icon: "logos:sass" },
    ],
  },
  {
    id: "backend",
    labelKey: "about.skills.categories.backend",
    icon: "material-symbols:dns-outline",
    skills: [
      { id: "nodejs", name: "Node.js", icon: "logos:nodejs-icon-alt" },
      { id: "django", name: "Django", icon: "logos:django-icon" },
      { id: "symfony", name: "Symfony", icon: "logos:symfony" },
    ],
  },
  {
    id: "data-infra",
    labelKey: "about.skills.categories.dataInfra",
    icon: "material-symbols:storage-rounded",
    skills: [
      { id: "postgresql", name: "PostgreSQL", icon: "logos:postgresql" },
      { id: "mysql", name: "MySQL", icon: "logos:mysql" },
      { id: "docker", name: "Docker", icon: "logos:docker-icon" },
      { id: "aws", name: "AWS", icon: "logos:aws" },
      { id: "heroku", name: "Heroku", icon: "logos:heroku-icon" },
      { id: "grafana", name: "Grafana", icon: "logos:grafana" },
    ],
  },
  {
    id: "practices",
    labelKey: "about.skills.categories.practices",
    icon: "material-symbols:checklist-rounded",
    skills: [
      { id: "tech-leadership", name: "Technical Leadership", icon: "material-symbols:groups-rounded" },
      { id: "code-review", name: "Code Review", icon: "material-symbols:rate-review-outline-rounded" },
      { id: "accessibility", name: "Accessibility (WCAG)", icon: "material-symbols:accessibility-new-rounded" },
      { id: "e2e-testing", name: "E2E Testing (Cypress)", icon: "material-symbols:bug-report-outline-rounded" },
      { id: "hiring", name: "Hiring & Interviewing", icon: "material-symbols:person-search-rounded" },
    ],
  },
];
