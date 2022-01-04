import { PoolCandidate } from "../api/generated";

export default (): PoolCandidate[] => [
  {
    id: "1d21fa5a-3452-4b59-b38b-2d3ac29db42a",
    user: {
      id: "16babad1-6e08-4795-8157-6d97da7ee0ee",
      email: "phermann@example.net",
      firstName: "Paolo",
      lastName: "Schuster",
    },
    expectedClassifications: [
      {
        id: "23886c70-57ae-4e05-a626-e245dc7c8d92",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "38c5a1c8-207d-433d-b0ea-79093de5c373",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "3b5a4916-90a9-4a66-9909-de07bca4f370",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
    ],
    acceptedOperationalRequirements: [
      {
        id: "c5cc39bc-0ce4-4c44-a837-843928ffc86e",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "dd4a2b92-b459-4462-b80c-4add2475642d",
        key: "travel",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    cmoAssets: [
      {
        id: "10f33082-a7d6-401c-90a6-333a72fa1792",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "fed0a5e9-f6ab-4ab7-bb5a-7655f5c5a995",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "d5929251-49d5-46c3-948c-9cd9ad253c1b",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "517bc1c2-48b1-4e21-8d9b-7966e0d98f6d",
        key: "infrastructure_ops",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    pool: {
      id: "e16d29dd-41ff-41f0-af87-a8985943f685",
    },
  },
  {
    id: "553a2952-b6d6-41af-ac8d-7e5e2e51884d",
    user: {
      id: "b4eb683f-e996-411f-b4bb-1ab01b040a16",
      email: "gfisher@example.org",
      firstName: "Bulah",
      lastName: "Kilback",
    },
    expectedClassifications: [
      {
        id: "b3e0d859-3d21-4d02-a59e-9ad8ae2f94ab",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "a0df4166-a48c-4f8e-9538-694fec3ec8c8",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "4d46f049-e30c-458c-9b18-649a132542f7",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
    ],
    acceptedOperationalRequirements: [
      {
        id: "c5cc39bc-0ce4-4c44-a837-843928ffc86e",
        key: "overtime",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "4a489dfd-c903-472f-8628-e4c978bf3f88",
        key: "on_call",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    cmoAssets: [
      {
        id: "1923d7ef-e98f-44f9-a322-33ca8124b5c4",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "517bc1c2-48b1-4e21-8d9b-7966e0d98f6d",
        key: "infrastructure_ops",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "10f33082-a7d6-401c-90a6-333a72fa1792",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "d5929251-49d5-46c3-948c-9cd9ad253c1b",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    pool: {
      id: "ea513a37-9537-46e4-9e06-ee9aecdb9d85",
    },
  },
  {
    id: "84efef0c-2d1c-4075-97dd-116d5fe708b3",
    user: {
      id: "55c4977e-6508-46fb-b39f-1b8f334b3787",
      email: "hayes.rosalyn@example.net",
      firstName: "Harrison",
      lastName: "Ondricka",
    },
    expectedClassifications: [
      {
        id: "3a461cc3-b0b7-423e-8e2f-badaf7b77187",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "76bcf130-0f6a-4bd1-8f25-0b74047f85c7",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "9be6ec17-cd98-48dd-a11b-e64fe13ae065",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
    ],
    acceptedOperationalRequirements: [
      {
        id: "4a489dfd-c903-472f-8628-e4c978bf3f88",
        key: "on_call",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "f020a2fa-d24b-4ba0-a204-f95dea110ab3",
        key: "drivers_license",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    cmoAssets: [
      {
        id: "d5929251-49d5-46c3-948c-9cd9ad253c1b",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "1923d7ef-e98f-44f9-a322-33ca8124b5c4",
        key: "app_testing",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "10f33082-a7d6-401c-90a6-333a72fa1792",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "61cba57b-4570-491f-8fc9-5df49e50eeb5",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    pool: {
      id: "ea513a37-9537-46e4-9e06-ee9aecdb9d85",
    },
  },
  {
    id: "2f7e475c-aa22-4de9-9ca9-9e9b6d439710",
    user: {
      id: "d5fcb5f6-809f-4052-a3b3-cabe6a014af1",
      email: "qschroeder@example.net",
      firstName: "Garfield",
      lastName: "Kunde",
    },
    expectedClassifications: [
      {
        id: "3a461cc3-b0b7-423e-8e2f-badaf7b77187",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "23886c70-57ae-4e05-a626-e245dc7c8d92",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "c63891dc-9048-42f3-8f7f-c51f535c7c2e",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
    ],
    acceptedOperationalRequirements: [
      {
        id: "73843c21-f3ea-454b-b850-f85240e12428",
        key: "transport_equipment",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "f020a2fa-d24b-4ba0-a204-f95dea110ab3",
        key: "drivers_license",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    cmoAssets: [
      {
        id: "61cba57b-4570-491f-8fc9-5df49e50eeb5",
        key: "cybersecurity",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "3c3999a7-bc9d-496a-9f3e-cdab5e8189a9",
        key: "db_admin",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "fed0a5e9-f6ab-4ab7-bb5a-7655f5c5a995",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "10f33082-a7d6-401c-90a6-333a72fa1792",
        key: "project_management",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    pool: {
      id: "ea513a37-9537-46e4-9e06-ee9aecdb9d85",
    },
  },
  {
    id: "41231a78-1b5b-4e29-91b3-a7d31c344ecb",
    user: {
      id: "8b3ebfb7-a2e0-4bea-a4f9-ed1312365b16",
      email: "uwhite@example.com",
      firstName: "Pat",
      lastName: "Rohan",
    },
    expectedClassifications: [
      {
        id: "3a461cc3-b0b7-423e-8e2f-badaf7b77187",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "bd17cbd6-a113-419a-92bf-375216e198f3",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "b8f1d4cb-3ac0-4e7c-9a3e-0a8d063e99d0",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
    ],
    acceptedOperationalRequirements: [
      {
        id: "73843c21-f3ea-454b-b850-f85240e12428",
        key: "transport_equipment",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "f020a2fa-d24b-4ba0-a204-f95dea110ab3",
        key: "drivers_license",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    cmoAssets: [
      {
        id: "d5929251-49d5-46c3-948c-9cd9ad253c1b",
        key: "enterprise_architecture",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "4f6b3b96-dde6-46ca-b70e-2aca4442ecbd",
        key: "information_management",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "517bc1c2-48b1-4e21-8d9b-7966e0d98f6d",
        key: "infrastructure_ops",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "fed0a5e9-f6ab-4ab7-bb5a-7655f5c5a995",
        key: "data_science",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    pool: {
      id: "e16d29dd-41ff-41f0-af87-a8985943f685",
    },
  },
];
