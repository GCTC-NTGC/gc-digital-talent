import {
  GetPoolCandidatesQuery,
  LanguageAbility,
  WorkRegion,
  SalaryRange,
  Language,
} from "../api/generated";

export default (): GetPoolCandidatesQuery["poolCandidates"] => [
  {
    id: "1",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "3",
      firstName: "Baron",
      lastName: "Barrows",
      email: "bwalter@example.org",
      telephone: "613-165-5431",
      preferredLang: Language.En,
    },
    cmoIdentifier: "omnis",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.Ontario,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "14",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "9",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: null,
  },
  {
    id: "2",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "4",
      firstName: "Danial",
      lastName: "McGlynn",
      email: "juanita.schaden@example.net",
      telephone: "613-111-2222",
      preferredLang: Language.En,
    },
    cmoIdentifier: "deserunt",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Quebec,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["80_89K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "4",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "12",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "20",
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
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "3",
    pool: {
      id: "1",
      name: {
        en: "Ortiz-Treutel",
        fr: "Ortiz-Treutel",
      },
      classifications: [
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "5",
      firstName: "Elmore",
      lastName: "Feeney",
      email: "cheyanne.walter@example.com",
      telephone: "613-333-4444",
      preferredLang: Language.En,
    },
    cmoIdentifier: "ea",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Prairie,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "1",
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
        id: "25",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "24",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "20",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: null,
  },
  {
    id: "4",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "6",
      firstName: "Mateo",
      lastName: "Wiegand",
      email: "ejacobson@example.com",
      telephone: "613-444-5555",
      preferredLang: Language.En,
    },
    cmoIdentifier: "rerum",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Quebec,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "20",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "15",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "16",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
  },
  {
    id: "5",
    pool: {
      id: "5",
      name: {
        en: "Gottlieb, Reinger and Harvey",
        fr: "Gottlieb, Reinger and Harvey",
      },
      classifications: [
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
      ],
    },
    user: {
      id: "7",
      firstName: "Mary",
      lastName: "Homenick",
      email: "remington48@example.net",
      telephone: "613-555-6666",
      preferredLang: Language.En,
    },
    cmoIdentifier: "mollitia",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Ontario,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
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
        id: "18",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "11",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "1",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "6",
    pool: {
      id: "3",
      name: {
        en: "Nikolaus-Block",
        fr: "Nikolaus-Block",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "8",
      firstName: "Immanuel",
      lastName: "Langosh",
      email: "umetz@example.com",
      telephone: "613-666-7777",
      preferredLang: Language.En,
    },
    cmoIdentifier: "pariatur",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "21",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
      {
        id: "10",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "13",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "7",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "9",
      firstName: "Enrico",
      lastName: "Bosco",
      email: "wrohan@example.com",
      telephone: "613-777-8888",
      preferredLang: Language.En,
    },
    cmoIdentifier: "sit",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Prairie,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
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
        id: "16",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "21",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
      {
        id: "12",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "8",
    pool: {
      id: "4",
      name: {
        en: "Auer-Leannon",
        fr: "Auer-Leannon",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
      ],
    },
    user: {
      id: "10",
      firstName: "Keenan",
      lastName: "Wilderman",
      email: "tpadberg@example.org",
      telephone: "613-888-9999",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "tenetur",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Telework,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["60_69K"],
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "15",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "17",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "24",
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
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
  },
  {
    id: "9",
    pool: {
      id: "4",
      name: {
        en: "Auer-Leannon",
        fr: "Auer-Leannon",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
      ],
    },
    user: {
      id: "11",
      firstName: "Abdul",
      lastName: "Weimann",
      email: "twhite@example.com",
      telephone: "613-999-0000",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "eum",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Prairie,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "2",
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
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "24",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: null,
  },
  {
    id: "10",
    pool: {
      id: "7",
      name: {
        en: "Kautzer and Sons",
        fr: "Kautzer and Sons",
      },
      classifications: [
        {
          id: "18",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 3,
        },
        {
          id: "10",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 5,
        },
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
      ],
    },
    user: {
      id: "12",
      firstName: "Golden",
      lastName: "Reichert",
      email: "botsford.shania@example.org",
      telephone: "613-000-1111",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "facere",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
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
        id: "14",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "9",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "17",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "11",
    pool: {
      id: "3",
      name: {
        en: "Nikolaus-Block",
        fr: "Nikolaus-Block",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "13",
      firstName: "Ernie",
      lastName: "Goodwin",
      email: "nola09@example.net",
      telephone: "613-111-2222",
      preferredLang: Language.En,
    },
    cmoIdentifier: "aut",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
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
        id: "19",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 4,
      },
      {
        id: "18",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "2",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: null,
  },
  {
    id: "12",
    pool: {
      id: "5",
      name: {
        en: "Gottlieb, Reinger and Harvey",
        fr: "Gottlieb, Reinger and Harvey",
      },
      classifications: [
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
      ],
    },
    user: {
      id: "14",
      firstName: "Christa",
      lastName: "Aufderhar",
      email: "hrussel@example.com",
      telephone: "613-112-3333",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "similique",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["80_89K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "20",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "21",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "13",
    pool: {
      id: "4",
      name: {
        en: "Auer-Leannon",
        fr: "Auer-Leannon",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
      ],
    },
    user: {
      id: "15",
      firstName: "Enola",
      lastName: "Mante",
      email: "rosalyn.cummerata@example.net",
      telephone: "613-112-4444",
      preferredLang: Language.En,
    },
    cmoIdentifier: "consequuntur",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.North,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
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
        id: "2",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "7",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "19",
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
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: null,
  },
  {
    id: "14",
    pool: {
      id: "14",
      name: {
        en: "Miller-Dickinson",
        fr: "Miller-Dickinson",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
      ],
    },
    user: {
      id: "16",
      firstName: "Matteo",
      lastName: "Hagenes",
      email: "unique34@example.com",
      telephone: "613-112-5555",
      preferredLang: Language.En,
    },
    cmoIdentifier: "quo",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Ontario,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["80_89K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "12",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "4",
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
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: null,
  },
  {
    id: "15",
    pool: {
      id: "1",
      name: {
        en: "Ortiz-Treutel",
        fr: "Ortiz-Treutel",
      },
      classifications: [
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "17",
      firstName: "Orland",
      lastName: "Fahey",
      email: "tstroman@example.com",
      telephone: "613-112-6666",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "cum",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.North,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "20",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "16",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "16",
    pool: {
      id: "1",
      name: {
        en: "Ortiz-Treutel",
        fr: "Ortiz-Treutel",
      },
      classifications: [
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "18",
      firstName: "Ezekiel",
      lastName: "Funk",
      email: "fisher.reuben@example.com",
      telephone: "613-112-7777",
      preferredLang: Language.En,
    },
    cmoIdentifier: "exercitationem",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.North,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["80_89K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "18",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "2",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "16",
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
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "17",
    pool: {
      id: "16",
      name: {
        en: "Rau-Osinski",
        fr: "Rau-Osinski",
      },
      classifications: [
        {
          id: "16",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 1,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
      ],
    },
    user: {
      id: "19",
      firstName: "Magdalena",
      lastName: "Pfannerstill",
      email: "loyal05@example.org",
      telephone: "613-112-8888",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "animi",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Ontario,
      WorkRegion.Telework,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "4",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "22",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "25",
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
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "18",
    pool: {
      id: "11",
      name: {
        en: "Haag Ltd",
        fr: "Haag Ltd",
      },
      classifications: [
        {
          id: "9",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 4,
        },
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "20",
      firstName: "Hallie",
      lastName: "Brown",
      email: "robbie.kuhic@example.org",
      telephone: "613-112-8888",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "quisquam",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Telework,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "10",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "8",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "19",
    pool: {
      id: "18",
      name: {
        en: "Hessel-Kerluke",
        fr: "Hessel-Kerluke",
      },
      classifications: [
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "19",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 4,
        },
      ],
    },
    user: {
      id: "21",
      firstName: "Wilfred",
      lastName: "Romaguera",
      email: "elise12@example.com",
      telephone: "613-113-8887",
      preferredLang: Language.En,
    },
    cmoIdentifier: "praesentium",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.Prairie,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "1",
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
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "21",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
      {
        id: "11",
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
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "20",
    pool: {
      id: "4",
      name: {
        en: "Auer-Leannon",
        fr: "Auer-Leannon",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
      ],
    },
    user: {
      id: "22",
      firstName: "Destinee",
      lastName: "Auer",
      email: "powlowski.larry@example.com",
      telephone: "613-123-8857",
      preferredLang: Language.En,
    },
    cmoIdentifier: "officiis",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "10",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "7",
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
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: null,
  },
  {
    id: "21",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "23",
      firstName: "Tyreek",
      lastName: "Lebsack",
      email: "max77@example.net",
      telephone: "613-163-8257",
      preferredLang: Language.En,
    },
    cmoIdentifier: "eveniet",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "4",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "9",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "12",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "22",
    pool: {
      id: "21",
      name: {
        en: "Krajcik, Ortiz and Russel",
        fr: "Krajcik, Ortiz and Russel",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "13",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 3,
        },
      ],
    },
    user: {
      id: "24",
      firstName: "Myrtis",
      lastName: "Swift",
      email: "hyatt.tre@example.org",
      telephone: "613-131-8657",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "vel",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Prairie,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["80_89K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "7",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "2",
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
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: null,
  },
  {
    id: "23",
    pool: {
      id: "6",
      name: {
        en: "Barton, Grant and Hyatt",
        fr: "Barton, Grant and Hyatt",
      },
      classifications: [
        {
          id: "10",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 5,
        },
        {
          id: "17",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 2,
        },
        {
          id: "9",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 4,
        },
      ],
    },
    user: {
      id: "25",
      firstName: "Oren",
      lastName: "Ullrich",
      email: "ypurdy@example.org",
      telephone: "613-131-8657",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "sint",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Quebec,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "16",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "23",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "2",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: null,
  },
  {
    id: "24",
    pool: {
      id: "22",
      name: {
        en: "Crooks LLC",
        fr: "Crooks LLC",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "15",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 5,
        },
      ],
    },
    user: {
      id: "26",
      firstName: "Mariah",
      lastName: "Mills",
      email: "chelsea25@example.org",
      telephone: "613-731-8617",
      preferredLang: Language.En,
    },
    cmoIdentifier: "quas",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "17",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "15",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "25",
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
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: null,
  },
  {
    id: "25",
    pool: {
      id: "26",
      name: {
        en: "Ratke, Prosacco and Homenick",
        fr: "Ratke, Prosacco and Homenick",
      },
      classifications: [
        {
          id: "18",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 3,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "6",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 1,
        },
      ],
    },
    user: {
      id: "27",
      firstName: "Torrance",
      lastName: "Considine",
      email: "ivon@example.org",
      telephone: "613-211-8417",
      preferredLang: Language.En,
    },
    cmoIdentifier: "error",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
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
        id: "14",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "16",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "26",
    pool: {
      id: "26",
      name: {
        en: "Ratke, Prosacco and Homenick",
        fr: "Ratke, Prosacco and Homenick",
      },
      classifications: [
        {
          id: "18",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 3,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "6",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 1,
        },
      ],
    },
    user: {
      id: "28",
      firstName: "Alexandria",
      lastName: "Swaniawski",
      email: "ohara.theresa@example.com",
      telephone: "613-741-8453",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "ut",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Telework,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
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
        id: "11",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "21",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
      {
        id: "2",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: null,
  },
  {
    id: "27",
    pool: {
      id: "14",
      name: {
        en: "Miller-Dickinson",
        fr: "Miller-Dickinson",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
      ],
    },
    user: {
      id: "29",
      firstName: "Harrison",
      lastName: "Ryan",
      email: "omcclure@example.net",
      telephone: "613-734-8481",
      preferredLang: Language.En,
    },
    cmoIdentifier: "et",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Prairie,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
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
        id: "11",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "12",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "16",
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
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "28",
    pool: {
      id: "27",
      name: {
        en: "Gerhold Group",
        fr: "Gerhold Group",
      },
      classifications: [
        {
          id: "17",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 2,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "11",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 1,
        },
      ],
    },
    user: {
      id: "30",
      firstName: "Lora",
      lastName: "Schuppe",
      email: "drolfson@example.net",
      telephone: "613-725-8811",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "voluptatibus",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Prairie,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["90_99K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "6",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "24",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "3",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: null,
  },
  {
    id: "29",
    pool: {
      id: "29",
      name: {
        en: "Luettgen, O'Hara and Flatley",
        fr: "Luettgen, O'Hara and Flatley",
      },
      classifications: [
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
        {
          id: "22",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 2,
        },
      ],
    },
    user: {
      id: "31",
      firstName: "Marina",
      lastName: "Zieme",
      email: "kelly48@example.com",
      telephone: "613-625-8211",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "commodi",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
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
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["80_89K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "16",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "2",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "9",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
    ],
    status: null,
  },
  {
    id: "30",
    pool: {
      id: "14",
      name: {
        en: "Miller-Dickinson",
        fr: "Miller-Dickinson",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
      ],
    },
    user: {
      id: "32",
      firstName: "Hilton",
      lastName: "Olson",
      email: "georgiana67@example.net",
      telephone: "613-825-3261",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "hic",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Ontario,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "8",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "4",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "18",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "31",
    pool: {
      id: "26",
      name: {
        en: "Ratke, Prosacco and Homenick",
        fr: "Ratke, Prosacco and Homenick",
      },
      classifications: [
        {
          id: "18",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 3,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "6",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 1,
        },
      ],
    },
    user: {
      id: "33",
      firstName: "Breanne",
      lastName: "Spencer",
      email: "bjohnston@example.net",
      telephone: "613-625-3347",
      preferredLang: Language.En,
    },
    cmoIdentifier: "quae",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Ontario,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
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
        id: "11",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "19",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 4,
      },
      {
        id: "8",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: null,
  },
  {
    id: "32",
    pool: {
      id: "22",
      name: {
        en: "Crooks LLC",
        fr: "Crooks LLC",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "15",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 5,
        },
      ],
    },
    user: {
      id: "34",
      firstName: "Zachery",
      lastName: "Nikolaus",
      email: "kohler.daisy@example.org",
      telephone: "613-645-3631",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "distinctio",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Prairie,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
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
        id: "24",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "19",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "33",
    pool: {
      id: "21",
      name: {
        en: "Krajcik, Ortiz and Russel",
        fr: "Krajcik, Ortiz and Russel",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "13",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 3,
        },
      ],
    },
    user: {
      id: "35",
      firstName: "Dayton",
      lastName: "Wilderman",
      email: "michale.auer@example.org",
    },
    cmoIdentifier: "totam",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.BritishColumbia,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "7",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "12",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "15",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: null,
    firstName: "Vincent",
    lastName: "Kristián",
    email: "Vincent.Kristian@irb-cisr.gc.ca",
    telephone: "613-845-8231",
    preferredLang: "EN",
  },
  {
    id: "34",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "36",
      firstName: "Abelardo",
      lastName: "Greenholt",
      email: "dickens.helga@example.com",
      telephone: "613-745-8315",
      preferredLang: Language.En,
    },
    cmoIdentifier: "nihil",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.North,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["80_89K"],
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "10",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "22",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "35",
    pool: {
      id: "21",
      name: {
        en: "Krajcik, Ortiz and Russel",
        fr: "Krajcik, Ortiz and Russel",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "13",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 3,
        },
      ],
    },
    user: {
      id: "37",
      firstName: "Danika",
      lastName: "Kiehn",
      email: "nelle76@example.org",
      telephone: "613-615-8515",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "voluptatem",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Prairie,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
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
        id: "10",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 5,
      },
      {
        id: "8",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "20",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: null,
  },
  {
    id: "36",
    pool: {
      id: "14",
      name: {
        en: "Miller-Dickinson",
        fr: "Miller-Dickinson",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
      ],
    },
    user: {
      id: "38",
      firstName: "Rafael",
      lastName: "Brakus",
      email: "jenkins.lexi@example.net",
      telephone: "613-365-6425",
      preferredLang: Language.En,
    },
    cmoIdentifier: "non",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Quebec,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
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
        id: "7",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 2,
      },
      {
        id: "25",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "14",
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
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "37",
    pool: {
      id: "11",
      name: {
        en: "Haag Ltd",
        fr: "Haag Ltd",
      },
      classifications: [
        {
          id: "9",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 4,
        },
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "39",
      firstName: "Enrico",
      lastName: "Herzog",
      email: "kbeer@example.org",
      telephone: "613-361-7615",
      preferredLang: Language.En,
    },
    cmoIdentifier: "quia",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.Quebec,
      WorkRegion.Atlantic,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
      SalaryRange["100KPlus"],
    ],
    expectedClassifications: [
      {
        id: "2",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "13",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 3,
      },
      {
        id: "6",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "38",
    pool: {
      id: "33",
      name: {
        en: "Barrows Inc",
        fr: "Barrows Inc",
      },
      classifications: [
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "40",
      firstName: "Celia",
      lastName: "Morar",
      email: "koch.alva@example.net",
      telephone: "613-651-7515",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "corporis",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Prairie,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "3",
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
        id: "3",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "18",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "24",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "39",
    pool: {
      id: "21",
      name: {
        en: "Krajcik, Ortiz and Russel",
        fr: "Krajcik, Ortiz and Russel",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "13",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 3,
        },
      ],
    },
    user: {
      id: "41",
      firstName: "Hope",
      lastName: "Johnson",
      email: "kstreich@example.org",
      telephone: "613-691-5816",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "eius",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
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
        id: "11",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "12",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "13",
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
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "40",
    pool: {
      id: "30",
      name: {
        en: "Quitzon Inc",
        fr: "Quitzon Inc",
      },
      classifications: [
        {
          id: "16",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 1,
        },
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "4",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 4,
        },
      ],
    },
    user: {
      id: "42",
      firstName: "Ora",
      lastName: "Mraz",
      email: "ometz@example.com",
      telephone: "613-691-6826",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "alias",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.Ontario,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["90_99K"],
      SalaryRange["70_79K"],
    ],
    expectedClassifications: [
      {
        id: "22",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "20",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "1",
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
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "41",
    pool: {
      id: "4",
      name: {
        en: "Auer-Leannon",
        fr: "Auer-Leannon",
      },
      classifications: [
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "20",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 5,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
      ],
    },
    user: {
      id: "43",
      firstName: "Destiny",
      lastName: "Marquardt",
      email: "kleannon@example.net",
      telephone: "613-715-5981",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "aliquam",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Quebec,
      WorkRegion.Ontario,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
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
        id: "6",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "17",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "10",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: null,
  },
  {
    id: "42",
    pool: {
      id: "13",
      name: {
        en: "Schneider, Boyle and Langworth",
        fr: "Schneider, Boyle and Langworth",
      },
      classifications: [
        {
          id: "4",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 4,
        },
        {
          id: "23",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 3,
        },
        {
          id: "7",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 2,
        },
      ],
    },
    user: {
      id: "44",
      firstName: "Elyse",
      lastName: "Torphy",
      email: "strosin.brannon@example.net",
      telephone: "613-176-1872",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "nostrum",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.Telework,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["100KPlus"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "24",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "10",
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
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: null,
  },
  {
    id: "43",
    pool: {
      id: "35",
      name: {
        en: "Kuhn LLC",
        fr: "Kuhn LLC",
      },
      classifications: [
        {
          id: "23",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 3,
        },
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "45",
      firstName: "Craig",
      lastName: "Hilpert",
      email: "bbode@example.org",
      telephone: "613-116-5272",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "corrupti",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.North,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "5",
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
        id: "21",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 1,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "4",
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
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "44",
    pool: {
      id: "2",
      name: {
        en: "O'Conner, Batz and Ziemann",
        fr: "O'Conner, Batz and Ziemann",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "46",
      firstName: "Lucile",
      lastName: "Johns",
      email: "swaniawski.libby@example.com",
      telephone: "613-716-3251",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "nemo",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.BritishColumbia,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
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
        id: "8",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "6",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "11",
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
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
    ],
    status: null,
  },
  {
    id: "45",
    pool: {
      id: "20",
      name: {
        en: "Bradtke Inc",
        fr: "Bradtke Inc",
      },
      classifications: [
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
      ],
    },
    user: {
      id: "47",
      firstName: "Maybell",
      lastName: "Wiza",
      email: "idach@example.net",
      telephone: "613-736-7814",
      preferredLang: Language.En,
    },
    cmoIdentifier: "qui",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Telework,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
      {
        id: "1",
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
        id: "22",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "8",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 3,
      },
      {
        id: "9",
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
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "46",
    pool: {
      id: "35",
      name: {
        en: "Kuhn LLC",
        fr: "Kuhn LLC",
      },
      classifications: [
        {
          id: "23",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 3,
        },
        {
          id: "2",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 2,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "48",
      firstName: "Jeremie",
      lastName: "Jakubowski",
      email: "griffin.shields@example.net",
      telephone: "613-743-6831",
      preferredLang: Language.En,
    },
    cmoIdentifier: "ratione",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.Ontario,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
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
        id: "16",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "2",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "47",
    pool: {
      id: "20",
      name: {
        en: "Bradtke Inc",
        fr: "Bradtke Inc",
      },
      classifications: [
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
      ],
    },
    user: {
      id: "49",
      firstName: "Lindsay",
      lastName: "Cormier",
      email: "rhea98@example.net",
      telephone: "613-518-5643",
      preferredLang: Language.En,
    },
    cmoIdentifier: "necessitatibus",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.Telework,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "18",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "9",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 4,
      },
      {
        id: "8",
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
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "48",
    pool: {
      id: "10",
      name: {
        en: "Predovic, Little and Windler",
        fr: "Predovic, Little and Windler",
      },
      classifications: [
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "14",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 4,
        },
      ],
    },
    user: {
      id: "50",
      firstName: "Desiree",
      lastName: "Osinski",
      email: "sunny05@example.com",
      telephone: "613-798-6581",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "asperiores",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
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
        id: "6",
        name: {
          en: "Administrative Services",
          fr: "Services des programmes et de l'administration",
        },
        group: "AS",
        level: 1,
      },
      {
        id: "12",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 2,
      },
      {
        id: "14",
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
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: null,
  },
  {
    id: "49",
    pool: {
      id: "29",
      name: {
        en: "Luettgen, O'Hara and Flatley",
        fr: "Luettgen, O'Hara and Flatley",
      },
      classifications: [
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
        {
          id: "22",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 2,
        },
      ],
    },
    user: {
      id: "51",
      firstName: "Quincy",
      lastName: "Fay",
      email: "predovic.tianna@example.org",
      telephone: "613-318-6431",
      preferredLang: Language.En,
    },
    cmoIdentifier: "neque",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Telework,
      WorkRegion.NationalCapital,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
      SalaryRange["50_59K"],
    ],
    expectedClassifications: [
      {
        id: "1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "24",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "16",
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
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: null,
  },
  {
    id: "50",
    pool: {
      id: "27",
      name: {
        en: "Gerhold Group",
        fr: "Gerhold Group",
      },
      classifications: [
        {
          id: "17",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 2,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "11",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 1,
        },
      ],
    },
    user: {
      id: "52",
      firstName: "Edwardo",
      lastName: "Swift",
      email: "iblanda@example.com",
      telephone: "613-332-4621",
      preferredLang: Language.En,
    },
    cmoIdentifier: "iste",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
      SalaryRange["90_99K"],
    ],
    expectedClassifications: [
      {
        id: "3",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "13",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "51",
    pool: {
      id: "23",
      name: {
        en: "Kassulke LLC",
        fr: "Kassulke LLC",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "6",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 1,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "53",
      firstName: "Troy",
      lastName: "Witting",
      email: "hermann.agustin@example.com",
      telephone: "613-461-6312",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "quis",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Quebec,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "2",
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
        id: "25",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 5,
      },
      {
        id: "14",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 4,
      },
      {
        id: "19",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "52",
    pool: {
      id: "36",
      name: {
        en: "Connelly LLC",
        fr: "Connelly LLC",
      },
      classifications: [
        {
          id: "23",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 3,
        },
        {
          id: "18",
          name: {
            en: "Programme Administration",
            fr: "Administration des programmes",
          },
          group: "PM",
          level: 3,
        },
        {
          id: "9",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 4,
        },
      ],
    },
    user: {
      id: "54",
      firstName: "Gracie",
      lastName: "Adams",
      email: "fhickle@example.net",
      telephone: "613-442-5212",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "expedita",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.NationalCapital,
      WorkRegion.BritishColumbia,
      WorkRegion.Quebec,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
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
        id: "3",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 3,
      },
      {
        id: "24",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 4,
      },
      {
        id: "19",
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
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
    ],
    status: null,
  },
  {
    id: "53",
    pool: {
      id: "20",
      name: {
        en: "Bradtke Inc",
        fr: "Bradtke Inc",
      },
      classifications: [
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
        {
          id: "21",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 1,
        },
      ],
    },
    user: {
      id: "55",
      firstName: "Harold",
      lastName: "Ullrich",
      email: "josephine.nitzsche@example.org",
      telephone: "613-213-5122",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "minima",
    expiryDate: null,
    isWoman: false,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
      SalaryRange["80_89K"],
    ],
    expectedClassifications: [
      {
        id: "17",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "2",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 2,
      },
      {
        id: "6",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
  {
    id: "54",
    pool: {
      id: "34",
      name: {
        en: "McDermott, Blanda and Rau",
        fr: "McDermott, Blanda and Rau",
      },
      classifications: [
        {
          id: "4",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 4,
        },
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "56",
      firstName: "Mellie",
      lastName: "Crooks",
      email: "rfahey@example.net",
      telephone: "613-153-6817",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "est",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Ontario,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "1",
        name: {
          en: "Overtime as required",
          fr: "Heures supplémentaires selon les besoins",
        },
      },
      {
        id: "6",
        name: {
          en: "Driver's license",
          fr: "Permis de conduire",
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
        id: "1",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 1,
      },
      {
        id: "11",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 1,
      },
      {
        id: "22",
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
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
    ],
    status: null,
  },
  {
    id: "55",
    pool: {
      id: "32",
      name: {
        en: "O'Kon, Eichmann and Haag",
        fr: "O'Kon, Eichmann and Haag",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "10",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 5,
        },
        {
          id: "15",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 5,
        },
      ],
    },
    user: {
      id: "57",
      firstName: "Theodora",
      lastName: "Grimes",
      email: "megane42@example.com",
      telephone: "613-513-6331",
      preferredLang: Language.En,
    },
    cmoIdentifier: "fuga",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Telework,
      WorkRegion.Prairie,
    ],
    acceptedOperationalRequirements: [
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["90_99K"],
      SalaryRange["50_59K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "15",
        name: {
          en: "Economics and Social Science Services",
          fr: "Économique et services de sciences sociales",
        },
        group: "EC",
        level: 5,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
      {
        id: "7",
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
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: null,
  },
  {
    id: "56",
    pool: {
      id: "44",
      name: {
        en: "Murazik-Stokes",
        fr: "Murazik-Stokes",
      },
      classifications: [
        {
          id: "22",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 2,
        },
        {
          id: "14",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 4,
        },
        {
          id: "25",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 5,
        },
      ],
    },
    user: {
      id: "58",
      firstName: "Dennis",
      lastName: "Bednar",
      email: "adan61@example.net",
      telephone: "613-325-6543",
      preferredLang: Language.En,
    },
    cmoIdentifier: "officia",
    expiryDate: null,
    isWoman: true,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.French,
    locationPreferences: [
      WorkRegion.North,
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
        },
      },
      {
        id: "1",
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
        id: "16",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "22",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "9",
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
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
    ],
    status: null,
  },
  {
    id: "57",
    pool: {
      id: "49",
      name: {
        en: "Nolan, Dare and Klein",
        fr: "Nolan, Dare and Klein",
      },
      classifications: [
        {
          id: "8",
          name: {
            en: "Administrative Services",
            fr: "Services des programmes et de l'administration",
          },
          group: "AS",
          level: 3,
        },
        {
          id: "4",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 4,
        },
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
      ],
    },
    user: {
      id: "59",
      firstName: "Ona",
      lastName: "Rohan",
      email: "irving97@example.org",
      telephone: "613-525-5411",
      preferredLang: Language.En,
    },
    cmoIdentifier: "labore",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.NationalCapital,
      WorkRegion.North,
    ],
    acceptedOperationalRequirements: [
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "5",
        name: {
          en: "Transport equipment up to 20kg",
          fr: "Transport de matériel jusqu'à 20 kg",
        },
      },
    ],
    expectedSalary: [
      SalaryRange["50_59K"],
      SalaryRange["70_79K"],
      SalaryRange["60_69K"],
    ],
    expectedClassifications: [
      {
        id: "22",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "23",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 3,
      },
      {
        id: "5",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 5,
      },
    ],
    cmoAssets: [
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
    ],
    status: null,
  },
  {
    id: "58",
    pool: {
      id: "22",
      name: {
        en: "Crooks LLC",
        fr: "Crooks LLC",
      },
      classifications: [
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "15",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 5,
        },
      ],
    },
    user: {
      id: "60",
      firstName: "Ruth",
      lastName: "Eichmann",
      email: "robel.georgette@example.com",
      telephone: "613-531-8766",
      preferredLang: Language.En,
    },
    cmoIdentifier: "illum",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Prairie,
      WorkRegion.BritishColumbia,
      WorkRegion.NationalCapital,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "4",
        name: {
          en: "Travel as required",
          fr: "Déplacements selon les besoins",
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
        id: "17",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 2,
      },
      {
        id: "22",
        name: {
          en: "Information Services",
          fr: "Services d'information",
        },
        group: "IS",
        level: 2,
      },
      {
        id: "2",
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
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "8",
        name: {
          en: "Infrastructure/Operations",
          fr: "Infrastructure/Opérations",
        },
      },
      {
        id: "5",
        name: {
          en: "Database Administration",
          fr: "Administration de bases de données",
        },
      },
    ],
    status: null,
  },
  {
    id: "59",
    pool: {
      id: "10",
      name: {
        en: "Predovic, Little and Windler",
        fr: "Predovic, Little and Windler",
      },
      classifications: [
        {
          id: "5",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 5,
        },
        {
          id: "3",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 3,
        },
        {
          id: "14",
          name: {
            en: "Economics and Social Science Services",
            fr: "Économique et services de sciences sociales",
          },
          group: "EC",
          level: 4,
        },
      ],
    },
    user: {
      id: "61",
      firstName: "Citlalli",
      lastName: "Marks",
      email: "runolfsdottir.josiah@example.net",
      telephone: "613-234-4361",
      preferredLang: Language.Fr,
    },
    cmoIdentifier: "dolorem",
    expiryDate: null,
    isWoman: true,
    hasDisability: false,
    isIndigenous: true,
    isVisibleMinority: false,
    hasDiploma: false,
    languageAbility: LanguageAbility.English,
    locationPreferences: [
      WorkRegion.Quebec,
      WorkRegion.NationalCapital,
      WorkRegion.BritishColumbia,
    ],
    acceptedOperationalRequirements: [
      {
        id: "3",
        name: {
          en: "24/7 on-call",
          fr: "Garde 24/7",
        },
      },
      {
        id: "4",
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
        id: "18",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 3,
      },
      {
        id: "20",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 5,
      },
      {
        id: "8",
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
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "1",
        name: {
          en: "Application Development",
          fr: "Développement d'applications",
        },
      },
      {
        id: "6",
        name: {
          en: "Enterprise Architecture (EA)",
          fr: "Architecture d'entreprise (EA)",
        },
      },
      {
        id: "3",
        name: {
          en: "Cybersecurity / Information Security / IT Security",
          fr: "Cybersécurité / Sécurité de l'information / Sécurité informatique",
        },
      },
    ],
    status: null,
  },
  {
    id: "60",
    pool: {
      id: "46",
      name: {
        en: "Walker LLC",
        fr: "Walker LLC",
      },
      classifications: [
        {
          id: "24",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 4,
        },
        {
          id: "23",
          name: {
            en: "Information Services",
            fr: "Services d'information",
          },
          group: "IS",
          level: 3,
        },
        {
          id: "1",
          name: {
            en: "Computer Systems",
            fr: "Systèmes d'ordinateurs",
          },
          group: "CS",
          level: 1,
        },
      ],
    },
    user: {
      id: "62",
      firstName: "Diego",
      lastName: "Nader",
      email: "lenora.hoeger@example.com",
      telephone: "613-235-3245",
      preferredLang: Language.En,
    },
    cmoIdentifier: "nulla",
    expiryDate: null,
    isWoman: false,
    hasDisability: true,
    isIndigenous: false,
    isVisibleMinority: true,
    hasDiploma: true,
    languageAbility: LanguageAbility.Bilingual,
    locationPreferences: [
      WorkRegion.Atlantic,
      WorkRegion.Prairie,
      WorkRegion.Telework,
    ],
    acceptedOperationalRequirements: [
      {
        id: "2",
        name: {
          en: "Shift work",
          fr: "Travail posté",
        },
      },
      {
        id: "4",
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
        id: "4",
        name: {
          en: "Computer Systems",
          fr: "Systèmes d'ordinateurs",
        },
        group: "CS",
        level: 4,
      },
      {
        id: "16",
        name: {
          en: "Programme Administration",
          fr: "Administration des programmes",
        },
        group: "PM",
        level: 1,
      },
      {
        id: "3",
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
        id: "2",
        name: {
          en: "Application Testing / Quality Assurance",
          fr: "Test d'application / Assurance qualité",
        },
      },
      {
        id: "9",
        name: {
          en: "IT Business Analyst / IT Project Management",
          fr: "Analyste d'affaires TI / Gestion de projets TI",
        },
      },
      {
        id: "7",
        name: {
          en: "Information Management (IM)",
          fr: "Gestion de l'information (IM)",
        },
      },
      {
        id: "4",
        name: {
          en: "Data Science / Analysis",
          fr: "Science des données / Analyse",
        },
      },
    ],
    status: null,
  },
];
