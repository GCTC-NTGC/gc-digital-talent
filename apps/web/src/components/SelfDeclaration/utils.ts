import { IntlShape } from "react-intl";

import { empty } from "@gc-digital-talent/helpers";

import { FirstNationsStatus } from "~/utils/indigenousDeclaration";

export const getSelfDeclarationLabels = (intl: IntlShape) => ({
  isIndigenous: intl.formatMessage({
    defaultMessage: "Self-Declaration",
    id: "r6L5aI",
    description: "label for the Indigenous self-declaration input",
  }),
  firstNations: intl.formatMessage({
    id: "VUPlmN",
    defaultMessage: "First Nations (Status or Non-status)",
    description: "Label for First Nations community",
  }),
  inuk: intl.formatMessage({
    id: "kUHaE/",
    defaultMessage: "Inuk",
    description: "Label for Inuk community",
  }),
  metis: intl.formatMessage({
    id: "KaisAC",
    defaultMessage: "Métis",
    description: "Label for Métis community",
  }),
  other: intl.formatMessage({
    id: "LIpK1v",
    defaultMessage: "My community isn't listed",
    description: "Label for not represented community",
  }),
  signature: intl.formatMessage({
    defaultMessage: "Your signature",
    id: "hhE2b6",
    description: "label for the signature input on the self-declaration form",
  }),
});

export const partOfCommunity = (
  community: string,
  selectedCommunities?: string[],
) => {
  return selectedCommunities?.includes(community);
};

export const hasCommunityAndOther = (selectedCommunities?: string[]) => {
  return (
    selectedCommunities &&
    selectedCommunities.length > 1 &&
    selectedCommunities.includes("other")
  );
};

const getCommunityLabels = (intl: IntlShape) =>
  new Map([
    [
      "status",
      intl.formatMessage({
        defaultMessage: "Status First Nations",
        id: "1Wbu+6",
        description: "The indigenous community for status First Nations",
      }),
    ],
    [
      "nonStatus",
      intl.formatMessage({
        defaultMessage: "Non-status First Nations",
        id: "JamdKo",
        description: "The indigenous community for non-status First Nations",
      }),
    ],
    [
      "inuk",
      intl.formatMessage({
        id: "kUHaE/",
        defaultMessage: "Inuk",
        description: "Label for Inuk community",
      }),
    ],
    [
      "metis",
      intl.formatMessage({
        id: "KaisAC",
        defaultMessage: "Métis",
        description: "Label for Métis community",
      }),
    ],
    [
      "other",
      intl.formatMessage({
        id: "Xvvcsg",
        defaultMessage: "I am Indigenous and I don't see my community here",
        description: "Label for not represented community",
      }),
    ],
  ]);

interface GetCommunityLabelArgs {
  community: string;
  intl: IntlShape;
  status?: FirstNationsStatus;
}

export const getCommunityLabel = ({
  community,
  status,
  intl,
}: GetCommunityLabelArgs) => {
  const labels = getCommunityLabels(intl);
  if (community === "firstNations") {
    if (empty(status)) return null;

    return labels.get(status);
  }

  return labels.get(community);
};
