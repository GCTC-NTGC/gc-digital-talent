import { defineMessages } from "react-intl";

const recruiterMessages = defineMessages({
  subtitle: {
    defaultMessage: "More about the employee’s nomination during {eventName}",
    id: "VXb4Sa",
    description: "Subtitle for the nomination details dialog on the GC profile",
  },
  whoNominated: {
    defaultMessage: "Who nominated them",
    id: "riapK6",
    description: "Label for who nominated the employee on the GC profile",
  },
  whatNominatedFor: {
    defaultMessage: "What they were nominated for",
    id: "65Ocoa",
    description: "Label for the type(s) of nomination an employee received",
  },
  meaningAdvancement: {
    defaultMessage:
      "Being nominated for advancement means that the employee has been identified as someone who might benefit from new and challenging opportunities. This nomination recognizes that promotion may be the most effective way to maximize their contribution to their organization and the broader public service. <link>Reach out to the community event team</link> for event-specific details.",
    id: "vvekOE",
    description:
      "Description for advancement nomination meaning, shown to a recruiter",
  },
  meaningLateralMovement: {
    defaultMessage:
      "Being nominated for lateral movement means that the employee might benefit from diversifying their experience in similar roles that will expand their understanding of the enterprise and its programs and services. Lateral moves can support professional goals and are an opportunity to gain new perspectives, strengthen skills and build the breadth of experience needed for future advancement.",
    id: "oWou0j",
    description:
      "Description for lateral movement nomination meaning, shown to a recruiter",
  },
  meaningDevelopment: {
    defaultMessage:
      "Being nominated for development opportunities means that the employee has been referred for potential participation in the development programs listed. These programs are often designed to compliment or enhance their skillset in preparation for new career opportunities.",
    id: "BoLvlN",
    description:
      "Description for development nomination meaning, shown to a recruiter",
  },
});

export default recruiterMessages;
