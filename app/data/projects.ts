export type ProjectEcosystem = "npm" | "pypi" | "brew" | "github";

export type ProjectPackage = {
  ecosystem: ProjectEcosystem;
  name: string;
  installCommand: string;
};

export type ProjectType = "flagship" | "standalone" | "legacy";

export type ProjectSDK = {
  id: string;
  repo: string;
  language: string;
  languageIcon: string;
  pkg: ProjectPackage;
};

export type Project = {
  id: string;
  name: string;
  repo: string;
  type: ProjectType;
  groupId?: string;
  language: string;
  languageIcon: string;
  pkg?: ProjectPackage;
  sdks?: ProjectSDK[];
  npmCreateDate?: string;
};

export const projects: Project[] = [
  {
    id: "overseer",
    name: "overseer",
    repo: "overseer",
    type: "flagship",
    groupId: "overseer-family",
    language: "Go",
    languageIcon: "logos:go",
    pkg: {
      ecosystem: "brew",
      name: "overseer",
      installCommand: "brew install arthurvasconcelos/tap/overseer",
    },
    sdks: [
      {
        id: "overseer-sdk-python",
        repo: "overseer-sdk-python",
        language: "Python",
        languageIcon: "logos:python",
        pkg: {
          ecosystem: "pypi",
          name: "overseer-sdk",
          installCommand: "pip install overseer-sdk",
        },
      },
      {
        id: "overseer-sdk-ts",
        repo: "overseer-sdk",
        language: "TypeScript",
        languageIcon: "logos:typescript-icon",
        pkg: {
          ecosystem: "npm",
          name: "overseer-sdk",
          installCommand: "npm install overseer-sdk",
        },
      },
    ],
  },
  {
    id: "sqlalchemy-seedling",
    name: "sqlalchemy-seedling",
    repo: "seedling",
    type: "standalone",
    language: "Python",
    languageIcon: "logos:python",
    pkg: {
      ecosystem: "pypi",
      name: "sqlalchemy-seedling",
      installCommand: "pip install sqlalchemy-seedling",
    },
  },
  {
    id: "vue-izitoast",
    name: "vue-izitoast",
    repo: "vue-izitoast",
    type: "legacy",
    language: "JavaScript",
    languageIcon: "logos:javascript",
    pkg: {
      ecosystem: "npm",
      name: "vue-izitoast",
      installCommand: "npm install vue-izitoast",
    },
    npmCreateDate: "2018-01-28",
  },
  {
    id: "vue-cbsc",
    name: "vue-cbsc",
    repo: "vue-cbsc",
    type: "legacy",
    language: "JavaScript",
    languageIcon: "logos:javascript",
    pkg: {
      ecosystem: "npm",
      name: "vue-cbsc",
      installCommand: "npm install vue-cbsc",
    },
    npmCreateDate: "2018-02-16",
  },
];

export const legacyProjects = projects.filter((p) => p.type === "legacy");
export const flagshipProjects = projects.filter((p) => p.type === "flagship");
export const standaloneProjects = projects.filter((p) => p.type === "standalone");
