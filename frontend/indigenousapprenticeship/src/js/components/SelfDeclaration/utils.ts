import { IntlShape } from "react-intl";

export const getSelfDeclarationLabels = (intl: IntlShape) => ({
  isIndigenous: intl.formatMessage({
    defaultMessage: "Self-Declaration",
    id: "r6L5aI",
    description: "label for the Indigenous self-declaration input",
  }),
  isStatusFirstNations: intl.formatMessage({
    defaultMessage: "First Nations Status",
    id: "+M8xoo",
    description: "label for the First Nations status self-declaration input",
  }),
  signature: intl.formatMessage({
    defaultMessage: "Signature",
    id: "3oW16P",
    description: "label for the signature input on the self-declaration form",
  }),
});

export const partOfCommunity = (
  community: string,
  selectedCommunities?: Array<string>,
) => {
  return selectedCommunities && selectedCommunities.includes(community);
};

export const hasCommunityAndOther = (selectedCommunities?: Array<string>) => {
  return (
    selectedCommunities &&
    selectedCommunities.length > 1 &&
    selectedCommunities.includes("other")
  );
};

export const getCommunityLabels = (intl: IntlShape) =>
  new Map([
    [
      "firstNations",
      intl.formatMessage({
        id: "GSqmjE",
        defaultMessage: "First Nations",
        description: "Label for First Nations community",
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
