import { GetPoolsQuery } from "../api/generated";
import fakeUsers from "./fakeUsers";
import fakeClassifications from "./fakeClassifications";
import fakeOperationalRequirements from "./fakeOperationalRequirements";

export default (): GetPoolsQuery["pools"] => [
  {
    id: "6fd959be-5265-4286-ab65-fbfd526e5e37",
    owner: fakeUsers()[0],
    name: {
      en: "CMO",
      fr: "CMO",
    },
    description: {
      en: "",
      fr: "",
    },
    classifications: [fakeClassifications()[2], fakeClassifications()[3]],
    assetCriteria: [],
    essentialCriteria: [],
    operationalRequirements: [
      fakeOperationalRequirements()[4],
      fakeClassifications()[5],
    ],
    poolCandidates: [],
  },
  {
    id: "c0c8a577-7488-42ea-85e4-d0c99d98d60f",
    owner: fakeUsers()[1],
    name: {
      en: "Indigenous Apprenticeship Program",
      fr: "Indigenous Apprenticeship Program FR",
    },
    description: {
      en: "",
      fr: "",
    },
    classifications: [fakeClassifications()[0], fakeClassifications()[1]],
    assetCriteria: [],
    essentialCriteria: [],
    operationalRequirements: [
      fakeOperationalRequirements()[2],
      fakeClassifications()[3],
    ],
    poolCandidates: [],
  },
];
