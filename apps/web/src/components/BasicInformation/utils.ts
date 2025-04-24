import { MessageDescriptor } from "react-intl";

import { EstimatedLanguageAbility, graphql } from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

export const BasicInformationOptions_Fragment = graphql(/* GraphQL */ `
  fragment BasicInformationOptions on Query {
    ...WorkPreferencesOptions
  }
`);

const estimatedLanguageAbilityMessage = new Map<
  EstimatedLanguageAbility,
  MessageDescriptor
>([
  [
    EstimatedLanguageAbility.Beginner,
    {
      defaultMessage: "Basic reading, writing and verbal communication skills",
      id: "iusldC",
      description: "Description for the beginner language ability",
    },
  ],
  [
    EstimatedLanguageAbility.Intermediate,
    {
      defaultMessage: "Strong reading, writing and verbal communication skills",
      id: "69icSD",
      description: "Description for the intermediate language ability",
    },
  ],
  [
    EstimatedLanguageAbility.Advanced,
    {
      defaultMessage: "Completely fluent",
      id: "NzUwa2",
      description: "Description for the advanced language ability",
    },
  ],
]);

export const getEstimatedLanguageAbility = (
  estimatedLanguageAbility: EstimatedLanguageAbility,
) =>
  estimatedLanguageAbilityMessage.get(estimatedLanguageAbility) ??
  commonMessages.notProvided;
