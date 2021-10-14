import {
  GetPoolCandidateFiltersQuery,
  LanguageAbility,
  WorkRegion,
} from "../api/generated";

export default (): GetPoolCandidateFiltersQuery["poolCandidateFilters"] => [
  {
    id: "9ef184ad-1752-411e-a022-7f7989f6bf27",
    classifications: [
      {
        id: "90689420-553d-4a3b-999a-fb94b1baaa69",
        group: "CS",
        level: 4,
      },
      {
        id: "bcfa88b3-ed22-4879-8642-e7dd003e91b4",
        group: "CS",
        level: 5,
      },
      {
        id: "7b0d9293-e811-413c-b0df-346e55f3fdd0",
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "f506e278-e4af-4ab5-b8d6-8f38c1c1591a",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "6cf47865-5079-4584-87d3-395b1825c5d4",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "1225da7c-c8ff-46c0-be1c-df97f8a4f253",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    hasDiploma: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    isWoman: false,
    languageAbility: null,
    operationalRequirements: [
      {
        id: "f92cf3d9-f283-4776-bb93-27b067ad2008",
        key: "drivers_license",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "dba77b57-6727-4321-af8b-1d5af2ec59a8",
        key: "on_call",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    workRegions: [WorkRegion.Ontario, WorkRegion.Quebec, WorkRegion.Ontario],
    pools: [
      {
        id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
      },
    ],
  },
  {
    id: "0ee3e4ea-857d-4a83-8731-f19b3ecb17dd",
    classifications: [
      {
        id: "2b006e6a-324d-400f-bfea-13b4be3a9b79",
        group: "CS",
        level: 2,
      },
      {
        id: "55c86cb5-ad95-4f38-ace5-cf9b1c87e959",
        group: "AS",
        level: 3,
      },
      {
        id: "1837138f-b96d-4fc8-983d-977362e2e590",
        group: "AS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6cf47865-5079-4584-87d3-395b1825c5d4",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "3700b945-b950-4312-9cf7-8b520c45eff3",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "e109579e-0823-4431-94ab-ebecf6093c51",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    hasDiploma: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    isWoman: true,
    languageAbility: LanguageAbility.English,
    operationalRequirements: null,
    workRegions: [
      WorkRegion.North,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    pools: [
      {
        id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
      },
    ],
  },
  {
    id: "bcd8b3eb-3b5c-4bfa-a5ca-732b64d8042e",
    classifications: [
      {
        id: "9336e753-35d3-41c0-ae53-9c0f314efd95",
        group: "CS",
        level: 3,
      },
      {
        id: "71100d92-47bd-45f6-bdff-91c290bf928b",
        group: "PM",
        level: 1,
      },
      {
        id: "79b60cbd-bad4-4f12-874f-20d164b7c304",
        group: "PM",
        level: 3,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "1225da7c-c8ff-46c0-be1c-df97f8a4f253",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "ea18fbd0-8fb0-4a65-8078-5b21bf67cb83",
        key: "db_admin",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "3700b945-b950-4312-9cf7-8b520c45eff3",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    hasDiploma: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    isWoman: false,
    languageAbility: null,
    operationalRequirements: null,
    workRegions: [WorkRegion.Atlantic, WorkRegion.North, WorkRegion.Telework],
    pools: [
      {
        id: "8b7f016a-ea78-48a8-b25e-806d8b2ffd3b",
      },
    ],
  },
  {
    id: "d0a38a4e-93f0-4355-adb5-6849b67011de",
    classifications: [
      {
        id: "2b006e6a-324d-400f-bfea-13b4be3a9b79",
        group: "CS",
        level: 2,
      },
      {
        id: "e3c50962-6daf-4a98-bc30-f4dc0dae1e3a",
        group: "IS",
        level: 1,
      },
      {
        id: "8d8047ad-10c6-4090-8f8c-b96f2065bbd8",
        group: "IS",
        level: 4,
      },
    ],
    cmoAssets: [
      {
        id: "f506e278-e4af-4ab5-b8d6-8f38c1c1591a",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "ea18fbd0-8fb0-4a65-8078-5b21bf67cb83",
        key: "db_admin",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "a06ddd56-64c8-4f24-ab61-04b35d6f320a",
        key: "information_management",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "e22f2d01-092f-4578-a554-e753865eb02d",
        key: "infrastructure_ops",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    hasDiploma: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    isWoman: true,
    languageAbility: null,
    operationalRequirements: null,
    workRegions: [
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
      WorkRegion.Telework,
    ],
    pools: [
      {
        id: "8b7f016a-ea78-48a8-b25e-806d8b2ffd3b",
      },
    ],
  },
  {
    id: "c99904e9-47ad-4251-8321-a41ee624c168",
    classifications: [
      {
        id: "f07ab566-71e6-4874-b28b-5e8ebdf28d33",
        group: "CS",
        level: 1,
      },
      {
        id: "bcfa88b3-ed22-4879-8642-e7dd003e91b4",
        group: "CS",
        level: 5,
      },
      {
        id: "7b0d9293-e811-413c-b0df-346e55f3fdd0",
        group: "EC",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "f506e278-e4af-4ab5-b8d6-8f38c1c1591a",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "1225da7c-c8ff-46c0-be1c-df97f8a4f253",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "e109579e-0823-4431-94ab-ebecf6093c51",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    hasDiploma: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    isWoman: true,
    languageAbility: LanguageAbility.English,
    operationalRequirements: null,
    workRegions: [
      WorkRegion.Atlantic,
      WorkRegion.North,
      WorkRegion.BritishColumbia,
    ],
    pools: [
      {
        id: "8b7f016a-ea78-48a8-b25e-806d8b2ffd3b",
      },
    ],
  },
  {
    id: "82a10558-24c7-4888-9ded-53994a6cc4d2",
    classifications: [
      {
        id: "f07ab566-71e6-4874-b28b-5e8ebdf28d33",
        group: "CS",
        level: 1,
      },
      {
        id: "55c86cb5-ad95-4f38-ace5-cf9b1c87e959",
        group: "AS",
        level: 3,
      },
      {
        id: "e3c50962-6daf-4a98-bc30-f4dc0dae1e3a",
        group: "IS",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "6cf47865-5079-4584-87d3-395b1825c5d4",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "1225da7c-c8ff-46c0-be1c-df97f8a4f253",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "3700b945-b950-4312-9cf7-8b520c45eff3",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "e109579e-0823-4431-94ab-ebecf6093c51",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    hasDiploma: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    isWoman: true,
    languageAbility: null,
    operationalRequirements: null,
    workRegions: [
      WorkRegion.Atlantic,
      WorkRegion.BritishColumbia,
      WorkRegion.Quebec,
    ],
    pools: [
      {
        id: "8b7f016a-ea78-48a8-b25e-806d8b2ffd3b",
      },
    ],
  },
  {
    id: "9a2d67a4-5c88-4089-8cc1-04fdb5b3e06d",
    classifications: [
      {
        id: "2730fc5c-c0cb-4766-8d55-d306b26b9302",
        group: "AS",
        level: 1,
      },
      {
        id: "05409257-bcb0-4774-ab03-b232fe79bfe7",
        group: "AS",
        level: 4,
      },
      {
        id: "71100d92-47bd-45f6-bdff-91c290bf928b",
        group: "PM",
        level: 1,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "1225da7c-c8ff-46c0-be1c-df97f8a4f253",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "ea18fbd0-8fb0-4a65-8078-5b21bf67cb83",
        key: "db_admin",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "e109579e-0823-4431-94ab-ebecf6093c51",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    hasDiploma: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    isWoman: false,
    languageAbility: LanguageAbility.Bilingual,
    operationalRequirements: null,
    workRegions: [WorkRegion.North, WorkRegion.Atlantic, WorkRegion.Quebec],
    pools: [
      {
        id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
      },
    ],
  },
  {
    id: "cbff70f2-bdec-486a-b5b8-19dadbc46029",
    classifications: [
      {
        id: "55c86cb5-ad95-4f38-ace5-cf9b1c87e959",
        group: "AS",
        level: 3,
      },
      {
        id: "6e2a33ff-5503-432a-8b4b-0acaa6f42e00",
        group: "EC",
        level: 4,
      },
      {
        id: "647502e9-ea3c-4df0-a83d-577749634633",
        group: "IS",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6cf47865-5079-4584-87d3-395b1825c5d4",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "ea18fbd0-8fb0-4a65-8078-5b21bf67cb83",
        key: "db_admin",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "e109579e-0823-4431-94ab-ebecf6093c51",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    hasDiploma: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    isWoman: false,
    languageAbility: LanguageAbility.French,
    operationalRequirements: null,
    workRegions: [WorkRegion.North, WorkRegion.Quebec, WorkRegion.Prairie],
    pools: [
      {
        id: "8b7f016a-ea78-48a8-b25e-806d8b2ffd3b",
      },
    ],
  },
  {
    id: "28969cb8-a74b-4f3b-885e-9c56e485cbac",
    classifications: [
      {
        id: "6645ff59-dd44-4147-ab1d-638183daea11",
        group: "AS",
        level: 2,
      },
      {
        id: "1837138f-b96d-4fc8-983d-977362e2e590",
        group: "AS",
        level: 5,
      },
      {
        id: "d3a7270f-c0d2-4e0f-a5f4-1ba4ec3bbe42",
        group: "PM",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "f506e278-e4af-4ab5-b8d6-8f38c1c1591a",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "3700b945-b950-4312-9cf7-8b520c45eff3",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "a06ddd56-64c8-4f24-ab61-04b35d6f320a",
        key: "information_management",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    hasDiploma: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    isWoman: true,
    languageAbility: null,
    operationalRequirements: null,
    workRegions: [WorkRegion.Ontario, WorkRegion.Prairie, WorkRegion.Atlantic],
    pools: [
      {
        id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
      },
    ],
  },
  {
    id: "2d5c7e2b-6cd7-49ab-ba0e-6ac8b085fee1",
    classifications: [
      {
        id: "bcfa88b3-ed22-4879-8642-e7dd003e91b4",
        group: "CS",
        level: 5,
      },
      {
        id: "7b0d9293-e811-413c-b0df-346e55f3fdd0",
        group: "EC",
        level: 1,
      },
      {
        id: "d3a7270f-c0d2-4e0f-a5f4-1ba4ec3bbe42",
        group: "PM",
        level: 2,
      },
    ],
    cmoAssets: [
      {
        id: "6605d898-bd08-4b30-bb16-d56e299b475b",
        key: "app_dev",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "f506e278-e4af-4ab5-b8d6-8f38c1c1591a",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "6cf47865-5079-4584-87d3-395b1825c5d4",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "e109579e-0823-4431-94ab-ebecf6093c51",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    hasDiploma: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    isWoman: true,
    languageAbility: LanguageAbility.Bilingual,
    operationalRequirements: null,
    workRegions: [
      WorkRegion.BritishColumbia,
      WorkRegion.Prairie,
      WorkRegion.Ontario,
    ],
    pools: [
      {
        id: "acf045c9-6daf-4a59-aeb3-ab62acb0418e",
      },
    ],
  },
];
