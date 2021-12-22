import {
  LanguageAbility,
  WorkRegion,
  SalaryRange,
  Language,
  PoolCandidateStatus,
  PoolCandidate,
} from "../api/generated";
import fakeClassifications from "./fakeClassifications";

export default (): PoolCandidate[] => [
  {
    id: "b0c4653c-e865-49a9-a63e-c741f85306ce",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "460f9f57-9982-43cc-b68e-c5f11afc3208",
      firstName: "Bernhard",
      lastName: "Mitchell",
      email: "schmitt.rosario@example.net",
      preferredLang: Language.En,
      telephone: "+13468269689",
    },
    cmoIdentifier: "doloribus",
    expiryDate: "2023-03-06",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Prairie,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "3ce1bcb7-0f27-4a99-a1e9-f51be19e9b97",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 4,
      },
      {
        id: "ab37a738-89ff-4463-97c5-c782ed73c156",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "55638f7d-151c-4910-81de-01f0ea0271b6",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "cd38135e-64dd-440f-a899-96c6dd2ee44f",
      firstName: "Melany",
      lastName: "Anderson",
      email: "rstracke@example.net",
      preferredLang: Language.Fr,
      telephone: "+19047202182",
    },
    cmoIdentifier: "atque",
    expiryDate: "2024-07-27",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "4ff52aba-1861-4ef0-a158-48964fdf3b85",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "d7899103-be0f-4ab5-8cc1-b70673612643",
      firstName: "Gunnar",
      lastName: "Hermann",
      email: "marjorie.reilly@example.org",
      preferredLang: Language.Fr,
      telephone: "+19019412469",
    },
    cmoIdentifier: "occaecati",
    expiryDate: "2024-07-23",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["80_89K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "a9576596-f0f0-4763-8796-3da272c5173b",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "0a03f6bf-918e-4e2d-90c9-a682b9fa23c2",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "2a4c8a3f-6c9b-4fcc-8611-805c4eba7f2a",
      firstName: "Tad",
      lastName: "Turner",
      email: "cole.karley@example.com",
      preferredLang: Language.En,
      telephone: "+15864882946",
    },
    cmoIdentifier: "excepturi",
    expiryDate: "2024-03-08",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["50_59K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "27d0b81f-1f59-4e03-91cc-fada5d1c9e48",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "159b9f95-aecd-47c3-a117-1c84f5cb0c4b",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "5ad40af0-b03b-4f6b-bdf2-a56e1385d588",
      firstName: "Jessyca",
      lastName: "Ebert",
      email: "cade52@example.net",
      preferredLang: Language.En,
      telephone: "+15406447119",
    },
    cmoIdentifier: "magnam",
    expiryDate: "2022-04-25",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "0946e7f1-6321-4723-83b3-4aa426f20a01",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "f6d907db-23c6-47a8-8aa9-8ec81df013d0",
      firstName: "Leonie",
      lastName: "Krajcik",
      email: "anjali.wintheiser@example.org",
      preferredLang: Language.Fr,
      telephone: "+14806934650",
    },
    cmoIdentifier: "aliquid",
    expiryDate: "2022-10-21",
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Prairie,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["60_69K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "0930b4b4-416d-4865-89a9-c945a4de44bb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "b2370648-5be2-44b7-a8d2-55fe1a50b47a",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "d88cbfe0-6497-456a-95fb-aebf898f54c9",
      firstName: "Leif",
      lastName: "Keeling",
      email: "blanca53@example.org",
      preferredLang: Language.Fr,
      telephone: "+12064553409",
    },
    cmoIdentifier: "et",
    expiryDate: "2023-09-03",
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Quebec,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["80_89K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "7fd16d5d-deee-49e1-bc26-b1db1a280fb6",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "50c87aae-fe40-4cae-a352-e25e2717548e",
      firstName: "Marcos",
      lastName: "Terry",
      email: "fahey.kim@example.net",
      preferredLang: Language.En,
      telephone: "+14455453144",
    },
    cmoIdentifier: "vitae",
    expiryDate: "2024-04-20",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.NationalCapital,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "432423e6-9ae7-4894-a2d4-db9374352bd0",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "ab6d1081-7d5b-4880-8586-367761b8d7ed",
      firstName: "Jaeden",
      lastName: "Langworth",
      email: "kyla66@example.com",
      preferredLang: Language.En,
      telephone: "+12407112242",
    },
    cmoIdentifier: "mollitia",
    expiryDate: "2023-03-18",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "0930b4b4-416d-4865-89a9-c945a4de44bb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "27d0b81f-1f59-4e03-91cc-fada5d1c9e48",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "a3b892bc-9ad0-42b8-8ac6-71e800320989",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "87fe1aa5-4bf8-4d3f-94e7-bc6f23ccc307",
      firstName: "Mitchell",
      lastName: "Weissnat",
      email: "arianna.emard@example.net",
      preferredLang: Language.En,
      telephone: "+16618814011",
    },
    cmoIdentifier: "autem",
    expiryDate: "2024-06-07",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Telework,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "78ccc3f9-20a0-41ef-93d9-8710f7368d09",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "d67d23c8-b222-4d82-a383-57b8ff2f6b8b",
      firstName: "Enrico",
      lastName: "Barrows",
      email: "kassulke.reina@example.org",
      preferredLang: Language.En,
      telephone: "+16617102103",
    },
    cmoIdentifier: "eveniet",
    expiryDate: "2022-05-23",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Ontario,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "016c55cf-c454-4693-91f7-31067faaf0fb",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "0f492b60-f0c5-4174-8f16-0f474e395265",
      firstName: "Llewellyn",
      lastName: "Zemlak",
      email: "marques.rau@example.org",
      preferredLang: Language.Fr,
      telephone: "+18061536684",
    },
    cmoIdentifier: "tenetur",
    expiryDate: "2023-11-27",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Telework,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "0930b4b4-416d-4865-89a9-c945a4de44bb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "cbbbcfc8-c64b-4823-a6d1-e3080b4f76bd",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "9d4d22f1-1dee-4be5-902c-1a569213896e",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "0fed9983-f5bb-4d7e-9b98-57d77a1c7268",
      firstName: "Jena",
      lastName: "Walsh",
      email: "will.jason@example.net",
      preferredLang: Language.En,
      telephone: "+15120244517",
    },
    cmoIdentifier: "delectus",
    expiryDate: "2021-10-29",
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "f07ea1bb-c5ca-432e-ac8b-d4f50264e8ed",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "9558b120-3b7d-4695-8383-669c47630b09",
      firstName: "Oda",
      lastName: "Stamm",
      email: "jayce.erdman@example.com",
      preferredLang: Language.Fr,
      telephone: "+14044855538",
    },
    cmoIdentifier: "quidem",
    expiryDate: "2021-12-24",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "a9576596-f0f0-4763-8796-3da272c5173b",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "4d6de092-a5bf-4872-9ce1-cbf202655a1b",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "1c978aa2-59f5-4292-8ffa-b04696f235cc",
      firstName: "Adele",
      lastName: "Hickle",
      email: "vdooley@example.net",
      preferredLang: Language.En,
      telephone: "+15090272573",
    },
    cmoIdentifier: "dolorum",
    expiryDate: "2023-12-19",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.Quebec,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "a9576596-f0f0-4763-8796-3da272c5173b",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "9c04cb45-8b13-4b26-82b3-ac98d17a9661",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "3b34aa95-6dcf-4032-a9c5-78d8fa41748b",
      firstName: "Kariane",
      lastName: "Schiller",
      email: "jada26@example.com",
      preferredLang: Language.En,
      telephone: "+14806005497",
    },
    cmoIdentifier: "cum",
    expiryDate: "2023-07-17",
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "27d0b81f-1f59-4e03-91cc-fada5d1c9e48",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "7d0e1f02-da3a-449d-ba0b-edadc33b9456",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "b7b09808-8092-4a40-91b9-59c91bc98afd",
      firstName: "Valentin",
      lastName: "Fisher",
      email: "gideon40@example.org",
      preferredLang: Language.En,
      telephone: "+12081420675",
    },
    cmoIdentifier: "in",
    expiryDate: "2022-01-07",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Ontario,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "61f43e75-c8dc-471b-b794-1adfd1e6daec",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "2f6d3a40-c9b0-48de-8ec4-37ce04116d74",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "f9114c7a-ae25-4646-b7bd-b46bfe596b0e",
      firstName: "Shemar",
      lastName: "Collins",
      email: "buddy.carter@example.net",
      preferredLang: Language.En,
      telephone: "+13075623433",
    },
    cmoIdentifier: "earum",
    expiryDate: "2023-10-17",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Ontario,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "074d21b3-1d62-4d27-afa2-0b5e218b8573",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "c4626353-2505-4751-bbe4-2c60d4a85106",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "478c2326-7720-4942-a6e0-8f468722438f",
      firstName: "Jayde",
      lastName: "Romaguera",
      email: "volkman.brain@example.net",
      preferredLang: Language.En,
      telephone: "+19250784544",
    },
    cmoIdentifier: "aut",
    expiryDate: "2024-02-25",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "0d06a3c3-6a8e-474d-8cb3-0b0b934e8a12",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "0607492f-df04-4c3e-9b66-24f44b64ce23",
      firstName: "Zetta",
      lastName: "Batz",
      email: "genevieve.kuhlman@example.com",
      preferredLang: Language.Fr,
      telephone: "+15127009401",
    },
    cmoIdentifier: "similique",
    expiryDate: "2023-07-24",
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "ab37a738-89ff-4463-97c5-c782ed73c156",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "e430b2e3-5afe-4416-9ac4-08a940c1aa33",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "b3f80d6a-40ca-4c22-901f-c52e369cb736",
      firstName: "Milan",
      lastName: "Robel",
      email: "shills@example.net",
      preferredLang: Language.Fr,
      telephone: "+12401490246",
    },
    cmoIdentifier: "a",
    expiryDate: "2023-05-29",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "e9d27d17-41d3-41b3-8234-5642509b39aa",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "0c835ab3-edfa-4196-9425-2cc82b4fdda0",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "03e4b958-a1f1-4416-9025-8b7cc29096f9",
      firstName: "Dimitri",
      lastName: "Carter",
      email: "berniece60@example.org",
      preferredLang: Language.En,
      telephone: "+19783497034",
    },
    cmoIdentifier: "odio",
    expiryDate: "2022-08-04",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "c62a489a-de4e-4691-9105-33520fcc2ec5",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "c78fd76f-4064-4171-af58-11ac53bca7ad",
      firstName: "Halie",
      lastName: "Koss",
      email: "madge.senger@example.net",
      preferredLang: Language.Fr,
      telephone: "+14631271383",
    },
    cmoIdentifier: "quibusdam",
    expiryDate: "2024-05-17",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Telework,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "65b7a781-86f2-4682-b4f2-771abf1111a6",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "9be0042d-db75-4b5e-a48d-29429d418f1e",
      firstName: "Gudrun",
      lastName: "Schmeler",
      email: "danial47@example.com",
      preferredLang: Language.Fr,
      telephone: "+19067192303",
    },
    cmoIdentifier: "unde",
    expiryDate: "2022-01-22",
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "64ac7922-e981-4533-818e-eaa9516a7efd",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "db6128f0-506f-4bae-9516-027d6aad7008",
      firstName: "Juliana",
      lastName: "Adams",
      email: "leuschke.jairo@example.com",
      preferredLang: Language.Fr,
      telephone: "+19346701790",
    },
    cmoIdentifier: "est",
    expiryDate: "2023-09-25",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "61f43e75-c8dc-471b-b794-1adfd1e6daec",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "8214423a-f114-4737-a1e1-1f3a6374fd02",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "bf8798a1-2391-4bc3-84bf-bafb23f524ae",
      firstName: "Casey",
      lastName: "Gleason",
      email: "giovanni.witting@example.com",
      preferredLang: Language.Fr,
      telephone: "+17240639348",
    },
    cmoIdentifier: "fugit",
    expiryDate: "2023-07-24",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.BritishColumbia,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["60_69K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "97d41d3e-d3f5-41dd-a2e5-70c3ab0e300c",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "acd606ab-e1b9-494d-86c9-0ff25bc5a15f",
      firstName: "Willis",
      lastName: "Block",
      email: "nicholas.crona@example.com",
      preferredLang: Language.Fr,
      telephone: "+17244947240",
    },
    cmoIdentifier: "sint",
    expiryDate: "2023-01-04",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.North,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "ae53f059-478d-4748-a9e0-c5b54f852bcd",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "9f6c9731-ae0c-4738-9322-ec5535dda45c",
      firstName: "Melyssa",
      lastName: "Graham",
      email: "yturner@example.org",
      preferredLang: Language.En,
      telephone: "+14349532281",
    },
    cmoIdentifier: "cumque",
    expiryDate: "2023-07-11",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Prairie,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "27d0b81f-1f59-4e03-91cc-fada5d1c9e48",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "2948f91d-1bd0-4000-b5a1-0527d56ce00e",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "fde3c681-e8ee-4b10-8879-283c8c4f8d35",
      firstName: "Kade",
      lastName: "Rowe",
      email: "luella94@example.org",
      preferredLang: Language.En,
      telephone: "+13185350711",
    },
    cmoIdentifier: "qui",
    expiryDate: "2022-05-15",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Quebec,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "32ba207c-3ee5-4d11-acd7-578baa84c05e",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "01aa3bd4-e8a8-4c1d-99bb-48571c197ed1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "cbbbcfc8-c64b-4823-a6d1-e3080b4f76bd",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "1f62df56-09bf-4077-a102-b0cb7298709a",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "55ae2e7f-0477-4dd7-8091-f52bd2af4f42",
      firstName: "Jaylon",
      lastName: "Gorczany",
      email: "cordie04@example.net",
      preferredLang: Language.En,
      telephone: "+16615006047",
    },
    cmoIdentifier: "eius",
    expiryDate: "2024-06-11",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "01aa3bd4-e8a8-4c1d-99bb-48571c197ed1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "e9d27d17-41d3-41b3-8234-5642509b39aa",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "17c8d0fb-680e-4b97-b5a6-0a2b1d028db9",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "1ba46224-1a8b-4edc-8bee-67848723eab8",
      firstName: "Rachael",
      lastName: "Pouros",
      email: "jermey.stracke@example.com",
      preferredLang: Language.Fr,
      telephone: "+17814272757",
    },
    cmoIdentifier: "error",
    expiryDate: "2023-11-23",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.NationalCapital,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "61f43e75-c8dc-471b-b794-1adfd1e6daec",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "9312c6f6-ad82-4ae4-b6fa-86c5873437e8",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "2c832985-a492-4f03-8c8b-124ff6d6c334",
      firstName: "Nick",
      lastName: "Rice",
      email: "zaria.mitchell@example.com",
      preferredLang: Language.En,
      telephone: "+17549184386",
    },
    cmoIdentifier: "consequatur",
    expiryDate: "2023-06-05",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Quebec,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "ab37a738-89ff-4463-97c5-c782ed73c156",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "e9d27d17-41d3-41b3-8234-5642509b39aa",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "c4adc03f-ec35-448a-a4aa-559ed0fccf07",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "b8978b4a-0a8a-4a15-8b23-878e4a49bf17",
      firstName: "Kris",
      lastName: "Russel",
      email: "emmerich.barrett@example.net",
      preferredLang: Language.Fr,
      telephone: "+15031156077",
    },
    cmoIdentifier: "expedita",
    expiryDate: "2024-04-27",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Telework,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "01aa3bd4-e8a8-4c1d-99bb-48571c197ed1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "3ce1bcb7-0f27-4a99-a1e9-f51be19e9b97",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "cb3c5383-241c-487d-bb34-d29cf81beef9",
    pool: {
      id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
      name: {
        en: "CMO",
        fr: "CMO",
      },
      classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    },
    user: {
      id: "9b58e685-64d3-4aad-be57-65a13bc0e46b",
      firstName: "Helga",
      lastName: "Barton",
      email: "nbatz@example.com",
      preferredLang: Language.Fr,
      telephone: "+15515322999",
    },
    cmoIdentifier: "animi",
    expiryDate: "2022-07-05",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.North,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "61f43e75-c8dc-471b-b794-1adfd1e6daec",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "d19fc9d4-6d48-41fd-b54b-02a4e603ef7b",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "82c12f53-ea8f-4d32-9b19-ff7fa495a059",
      firstName: "Afton",
      lastName: "Yost",
      email: "eschoen@example.com",
      preferredLang: Language.En,
      telephone: "+12523411377",
    },
    cmoIdentifier: "consequuntur",
    expiryDate: "2024-09-08",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.BritishColumbia,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["90_99K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "ab37a738-89ff-4463-97c5-c782ed73c156",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "1717a411-7085-4640-bde3-5f98e204d386",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "893f8d22-c9ff-4142-abb8-fd3dd9d0e81b",
      firstName: "Elbert",
      lastName: "West",
      email: "ncormier@example.com",
      preferredLang: Language.En,
      telephone: "+13164261246",
    },
    cmoIdentifier: "quis",
    expiryDate: "2022-09-02",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "32ba207c-3ee5-4d11-acd7-578baa84c05e",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "6946d4a3-15b7-4fd2-b827-8fcf14149245",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "a5482a96-0d95-4213-b919-6e1f83b6bf68",
      firstName: "Noemy",
      lastName: "Schimmel",
      email: "koelpin.cicero@example.org",
      preferredLang: Language.En,
      telephone: "+13643699456",
    },
    cmoIdentifier: "perspiciatis",
    expiryDate: "2022-11-13",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.North,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "32ba207c-3ee5-4d11-acd7-578baa84c05e",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "42c3596d-baa1-4ea8-8664-003792ce369a",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "4ad195c1-708d-414d-9ead-065f1c6cc179",
      firstName: "Janelle",
      lastName: "Goldner",
      email: "will.bartoletti@example.net",
      preferredLang: Language.Fr,
      telephone: "+12603796073",
    },
    cmoIdentifier: "non",
    expiryDate: "2021-10-12",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Prairie,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "4ff5b3b9-0415-44ef-b5b3-379e45e25d4d",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "a89e6831-1aa0-4b80-97c2-634e7e650594",
      firstName: "Colin",
      lastName: "Ebert",
      email: "beverly42@example.com",
      preferredLang: Language.Fr,
      telephone: "+19566932701",
    },
    cmoIdentifier: "voluptatibus",
    expiryDate: "2023-06-03",
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Ontario,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "e9d27d17-41d3-41b3-8234-5642509b39aa",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "dbc71478-13b5-4358-8bca-f82d5745b953",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "70e8dfaf-812c-4bc6-8f89-a844b2998511",
      firstName: "Broderick",
      lastName: "Schaden",
      email: "anthony.lueilwitz@example.com",
      preferredLang: Language.En,
      telephone: "+12546641535",
    },
    cmoIdentifier: "ab",
    expiryDate: "2021-10-10",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Quebec,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "3ce1bcb7-0f27-4a99-a1e9-f51be19e9b97",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 4,
      },
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "fc488967-b902-4c8f-bc52-6bcabed91f8f",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "6c5b50b8-b3e1-4b72-9afe-b5e25943217c",
      firstName: "Alfonso",
      lastName: "Block",
      email: "rickie.gutkowski@example.net",
      preferredLang: Language.En,
      telephone: "+13865115545",
    },
    cmoIdentifier: "nihil",
    expiryDate: "2022-07-02",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["50_59K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "0930b4b4-416d-4865-89a9-c945a4de44bb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "a6f1e259-960d-4fec-b685-23b561d52c92",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "b1c55163-de77-4f8f-9659-e3c3a132ee7b",
      firstName: "Angie",
      lastName: "Nikolaus",
      email: "reymundo49@example.net",
      preferredLang: Language.En,
      telephone: "+19124942286",
    },
    cmoIdentifier: "numquam",
    expiryDate: "2022-07-16",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "32ba207c-3ee5-4d11-acd7-578baa84c05e",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "903db2ac-861c-4ada-9a05-bbaa0ed47361",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "0f807758-0b7c-48d5-97e1-249e4b94d4ad",
      firstName: "Madie",
      lastName: "Kris",
      email: "myron.kutch@example.net",
      preferredLang: Language.Fr,
      telephone: "+15162330985",
    },
    cmoIdentifier: "amet",
    expiryDate: "2021-11-10",
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.North,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "ab37a738-89ff-4463-97c5-c782ed73c156",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "21946127-af85-4c56-b886-55fc2d80242c",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "18e58308-a2a4-4513-a24a-10689b4968d3",
      firstName: "Rory",
      lastName: "Heidenreich",
      email: "hartmann.rowena@example.net",
      preferredLang: Language.En,
      telephone: "+15640983284",
    },
    cmoIdentifier: "quod",
    expiryDate: "2023-04-22",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Atlantic,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "01aa3bd4-e8a8-4c1d-99bb-48571c197ed1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "074d21b3-1d62-4d27-afa2-0b5e218b8573",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "223c81d0-c111-4d56-a302-a0850c8ce1c8",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "aa73953f-25d6-4dbc-917e-c7b1c81e2754",
      firstName: "Ayden",
      lastName: "Buckridge",
      email: "schuppe.troy@example.net",
      preferredLang: Language.Fr,
      telephone: "+16820436265",
    },
    cmoIdentifier: "sequi",
    expiryDate: "2024-02-20",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "4e52646d-6373-422a-af5e-020c07ee5f3c",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "38943463-8577-4802-b2f2-78e7ba1a5e51",
      firstName: "Alexandre",
      lastName: "Senger",
      email: "susanna52@example.com",
      preferredLang: Language.En,
      telephone: "+19402705777",
    },
    cmoIdentifier: "iste",
    expiryDate: "2022-05-21",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "e6c1ef4f-caef-4865-9515-a0f0d9b5813d",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "d9ddcc93-ced2-4cd4-910a-dd23da2ba74b",
      firstName: "Tevin",
      lastName: "Boehm",
      email: "zsenger@example.org",
      preferredLang: Language.Fr,
      telephone: "+17154879400",
    },
    cmoIdentifier: "vero",
    expiryDate: "2023-03-25",
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Atlantic,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["80_89K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "0930b4b4-416d-4865-89a9-c945a4de44bb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "caa01b24-1b87-46a1-acf5-2db2ee026e74",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "457807e2-7f7a-40e0-b2ac-17821762e7cc",
      firstName: "Leatha",
      lastName: "Pouros",
      email: "harry31@example.com",
      preferredLang: Language.Fr,
      telephone: "+12203956565",
    },
    cmoIdentifier: "distinctio",
    expiryDate: "2024-05-29",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "a9576596-f0f0-4763-8796-3da272c5173b",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "ab37a738-89ff-4463-97c5-c782ed73c156",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "0b8f299e-775b-4a33-840d-b80aba51f951",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "6d4740fa-35b5-4875-b47b-e1b340982625",
      firstName: "Dolly",
      lastName: "Dickinson",
      email: "rhahn@example.org",
      preferredLang: Language.Fr,
      telephone: "+15851365813",
    },
    cmoIdentifier: "minima",
    expiryDate: "2024-02-06",
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["100KPlus"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "a9576596-f0f0-4763-8796-3da272c5173b",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "fc738aaa-8649-4e6f-b22e-ac88bb6f3cb8",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "15fc81e9-da3b-4fcf-81a2-f3f9097429a6",
      firstName: "Rachel",
      lastName: "Moen",
      email: "candace.lebsack@example.org",
      preferredLang: Language.En,
      telephone: "+19544553813",
    },
    cmoIdentifier: "voluptates",
    expiryDate: "2021-12-15",
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.Prairie,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "driver",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "e0fb670a-2a34-4498-8ca3-20dff264c447",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "e444b226-2c22-41b6-b78d-d5fd650c114b",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "7dff881d-420d-4b18-80fc-11fc9ebcbd56",
      firstName: "Cristobal",
      lastName: "Thompson",
      email: "sfunk@example.org",
      preferredLang: Language.En,
      telephone: "+12016395482",
    },
    cmoIdentifier: "quas",
    expiryDate: "2024-07-03",
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.North,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["70_79K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "fdc7bcd7-3849-4a1d-a03e-12ef9afbe1f2",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "32ba207c-3ee5-4d11-acd7-578baa84c05e",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "7fe407ae-f790-4328-949c-cb1856788e70",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "39adda1b-a58a-45d7-89d6-5c1431a9cee1",
      firstName: "Cortez",
      lastName: "Doyle",
      email: "porter74@example.net",
      preferredLang: Language.En,
      telephone: "+18789196905",
    },
    cmoIdentifier: "explicabo",
    expiryDate: "2024-07-17",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Telework,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "59ca96ca-8d67-4182-9af9-d8b3e5be8f07",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "209a393d-cfbf-4219-84bc-26cac8a9cfab",
      firstName: "Sonny",
      lastName: "Brekke",
      email: "effertz.henry@example.com",
      preferredLang: Language.En,
      telephone: "+17433386609",
    },
    cmoIdentifier: "possimus",
    expiryDate: "2022-03-10",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["50_59K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "61f43e75-c8dc-471b-b794-1adfd1e6daec",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "cbbbcfc8-c64b-4823-a6d1-e3080b4f76bd",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "dc6bd4ae-bf14-4900-b403-e6772476e8c0",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "ef494973-055a-4a24-a452-7dc2504d5d98",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "fa0d1ffa-a9d2-44b7-8573-bf665eacf632",
      firstName: "Alana",
      lastName: "Terry",
      email: "verner.cassin@example.net",
      preferredLang: Language.En,
      telephone: "+16239858854",
    },
    cmoIdentifier: "ipsa",
    expiryDate: "2024-07-15",
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.BritishColumbia,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "38b1d34a-822f-40a1-befe-6b9ad0025428",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "c408ebdf-af2d-41a9-93c5-1370f4390323",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "b1ebfcab-58f9-413b-8b37-3138968993f8",
      firstName: "Adolph",
      lastName: "Kuhn",
      email: "francis.sawayn@example.com",
      preferredLang: Language.En,
      telephone: "+19703192795",
    },
    cmoIdentifier: "reiciendis",
    expiryDate: "2023-04-21",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "701d4ba9-0aed-49a2-a45e-615f6a83c2f7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "b8d339a0-c4f4-4dc7-97ec-1998c90045c5",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "7c806ab2-33a2-49cc-b1b4-62d0536a87c1",
      firstName: "Polly",
      lastName: "Bartoletti",
      email: "garfield.koepp@example.org",
      preferredLang: Language.Fr,
      telephone: "+18150249092",
    },
    cmoIdentifier: "fugiat",
    expiryDate: "2022-01-09",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["60_69K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "0930b4b4-416d-4865-89a9-c945a4de44bb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "2b7060ca-98f4-4ea6-b078-22f2d165b3ae",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "d52751c5-d78b-4b7e-a001-4308786340a0",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "d3d2faf5-28aa-47f5-a0a1-1b9c2159e174",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: PoolCandidateStatus.NoLongerInterested,
  },
  {
    id: "0e89c6d1-3087-4bdc-9a7f-48536bff8bc4",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "3c7f9956-75dd-4aef-82b8-24b2fa6d6dab",
      firstName: "Elmira",
      lastName: "Champlin",
      email: "thaddeus.bartell@example.net",
      preferredLang: Language.Fr,
      telephone: "+13519534390",
    },
    cmoIdentifier: "id",
    expiryDate: "2022-10-04",
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.BritishColumbia,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "61f43e75-c8dc-471b-b794-1adfd1e6daec",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "3d07534b-6c5c-41fc-b0ba-d4d2b3737449",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedIndeterminate,
  },
  {
    id: "dddcf4aa-2866-4c13-ba69-b77cb13db39a",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "e8fec91e-4bd1-4963-a4d0-97ab9b9fe1fa",
      firstName: "Terrance",
      lastName: "Feest",
      email: "mayra57@example.com",
      preferredLang: Language.Fr,
      telephone: "+18477547374",
    },
    cmoIdentifier: "hic",
    expiryDate: "2022-03-21",
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Quebec,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "f97303f4-f77c-471a-900c-5a14f4c178fa",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "52191788-5649-417f-8b49-520dcf664a18",
        key: "20kg",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "2dcc2974-959c-4a5c-a5bd-c60eb4975f1f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "883c24b3-3aff-42d5-b6f7-b2ee775a4748",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "41cf28d5-399a-4bd3-a5a3-3acdd3f2f90f",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "b2349f51-059f-4914-8e27-d5c5f3e10e6b",
        key: "testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: PoolCandidateStatus.PlacedTerm,
  },
  {
    id: "81ebe1a8-84d8-4f06-9d92-8a835b991aed",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "18527360-2a01-4b58-85bd-4a1f980febee",
      firstName: "Dandre",
      lastName: "Dietrich",
      email: "joey25@example.net",
      preferredLang: Language.En,
      telephone: "+13853167632",
    },
    cmoIdentifier: "quaerat",
    expiryDate: "2024-09-20",
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "d9b5d0ea-d711-44e7-91a6-e43b261fa359",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "61bc37ec-94f9-4f72-a82a-4402126ae7e1",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "8d224b3e-1bfa-4868-8732-48979d517f97",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "0cf106e6-bd8d-482d-9c0f-e5ba2ce43bdb",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "fa0262fd-cbd0-4711-a522-cb171b597668",
        key: "ea",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "b3890a40-d694-45e3-9cd0-e5edfeed6c64",
        key: "infra",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
  {
    id: "9a8eb813-1d94-4bb2-8f5f-310f1e3b6cd0",
    pool: {
      id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
      name: {
        en: "Indigenous Apprenticeship Program",
        fr: "Indigenous Apprenticeship Program FR",
      },
      classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    },
    user: {
      id: "c4c9d18c-a28c-45a2-b4ae-087382720724",
      firstName: "Ara",
      lastName: "Blick",
      email: "domenick99@example.com",
      preferredLang: Language.Fr,
      telephone: "+18136214350",
    },
    cmoIdentifier: "quam",
    expiryDate: "2022-05-04",
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.North,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6827429d-b8b8-475e-b7db-2b892437dbc4",
        key: "shift_work",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "24-7",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["100KPlus"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "a9576596-f0f0-4763-8796-3da272c5173b",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "5cef26b0-eb95-485e-8d98-85d3a18d8bfe",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "074d21b3-1d62-4d27-afa2-0b5e218b8573",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "1d1e5258-0e8d-4d38-8691-854bc98c14f9",
        key: "cyber",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "cb7ee148-73ae-4d42-82d5-fa918d0e84a8",
        key: "dba",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "a6b269a0-01c1-4255-b429-6648a483884b",
        key: "itba",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "ac044805-fd37-4e9f-9616-5855f0458e49",
        key: "im",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: PoolCandidateStatus.Available,
  },
];
