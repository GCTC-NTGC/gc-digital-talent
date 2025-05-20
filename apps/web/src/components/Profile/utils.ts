import { IntlShape, MessageDescriptor, defineMessage } from "react-intl";

import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { FieldLabels } from "@gc-digital-talent/forms/types";

import { getLabels as getPersonalLabels } from "./components/PersonalInformation/utils";
import { getLabels as getWorkLabels } from "./components/WorkPreferences/utils";
import { getLabels as getGovLabels } from "./components/GovernmentInformation/utils";
import { getLabels as getLangLabels } from "./components/LanguageProfile/utils";
import { SectionKey } from "./types";

const sectionTitles = new Map<SectionKey, MessageDescriptor>([
  [
    "personal",
    defineMessage({
      defaultMessage: "Personal and contact information",
      id: "BWh6S1",
      description: "Title for the personal and contact information section",
    }),
  ],
  [
    "work",
    defineMessage({
      defaultMessage: "Work preferences",
      id: "nnMYWr",
      description: "Name of Work preferences page",
    }),
  ],
  ["dei", defineMessage(navigationMessages.diversityEquityInclusion)],
  [
    "government",
    defineMessage({
      defaultMessage: "Government employee information",
      id: "Jf3vT5",
      description: "Title for the government employee information section",
    }),
  ],
  [
    "language",
    defineMessage({
      defaultMessage: "Language profile",
      id: "Rn3HMc",
      description:
        "Heading for the language profile section on the application profile",
    }),
  ],
]);

export const getSectionTitle = (key: SectionKey): MessageDescriptor => {
  const title = sectionTitles.get(key);

  return title ?? commonMessages.notFound;
};

type LabelAccessorFunc = (intl: IntlShape) => FieldLabels;

const labelAccessorMap = new Map<SectionKey, LabelAccessorFunc>([
  ["personal", getPersonalLabels],
  ["work", getWorkLabels],
  ["government", getGovLabels],
  ["language", getLangLabels],
]);

export const getSectionLabels = (
  key: SectionKey,
  intl: IntlShape,
): FieldLabels => {
  const labels = labelAccessorMap.get(key);

  return labels ? labels(intl) : {};
};
