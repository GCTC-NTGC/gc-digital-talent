import { Pool } from "../api/generated";
import fakeUsers from "./fakeUsers";

export default (): Pool[] => [
  {
    id: "1",
    owner: fakeUsers()[0],
    name: {
      en: "Pool1",
      fr: "Pool1FR",
    },
    description: {
      en: "Autem qui voluptas cumque. Molestiae dolor beatae tempora porro. Dolorem eligendi tempora consectetur id nostrum nihil. Quis et aut sit eveniet voluptatum. Quod veritatis vitae dignissimos provident.",
      fr: "A perferendis ut iste saepe error nihil. Fugiat eum qui et molestiae sapiente aperiam. Dolorum est nemo quasi consequatur ipsam facere fuga. In aliquid corrupti consequatur.",
    },
    classifications: [],
    assetCriteria: [],
    essentialCriteria: [],
    operationalRequirements: [],
    poolCandidates: [],
  },
];
