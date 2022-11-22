import { IntlShape } from "react-intl";

export const getSelfDeclarationLabels = (intl: IntlShape) => ({
  isIndigenous: intl.formatMessage({
    defaultMessage: "Self-Declaration",
    id: "r6L5aI",
    description: "label for the Indigenous self-declaration input",
  }),
});
