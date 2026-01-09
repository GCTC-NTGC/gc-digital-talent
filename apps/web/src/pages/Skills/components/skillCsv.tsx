import { IntlShape } from "react-intl";

import { DownloadCsvProps } from "@gc-digital-talent/ui";
import { Skill } from "@gc-digital-talent/graphql";
import { appendLanguageName, commonMessages } from "@gc-digital-talent/i18n";
import { nodeToString } from "@gc-digital-talent/helpers";

import { getSkillFamilies } from "~/utils/csvUtils";
import adminMessages from "~/messages/adminMessages";

export const getSkillCsvData = (
  skills: Skill[],
  intlEn: IntlShape,
  intlFr: IntlShape,
) => {
  const data: DownloadCsvProps["data"] = skills.map(
    ({ id, name, description, category, families }) => {
      return {
        id,
        nameEn: name.en,
        categoryEn: category.label?.en,
        skillFamiliesEn: getSkillFamilies(families, intlEn),
        descriptionEn: description?.en ?? "",
        nameFr: name.fr,
        categoryFr: category.label?.fr,
        skillFamiliesFr: getSkillFamilies(families, intlFr),
        descriptionFr: description?.fr ?? "",
      };
    },
  );

  return data;
};

export const getSkillCsvHeaders = (
  intl: IntlShape,
): DownloadCsvProps["headers"] => {
  return [
    {
      id: "id",
      displayName: intl.formatMessage(adminMessages.id),
    },
    {
      id: "nameEn",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(commonMessages.name),
          lang: "en",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "categoryEn",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(adminMessages.category),
          lang: "en",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "skillFamiliesEn",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(adminMessages.skillFamilies),
          lang: "en",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "descriptionEn",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(commonMessages.description),
          lang: "en",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "nameFr",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(commonMessages.name),
          lang: "fr",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "categoryFr",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(adminMessages.category),
          lang: "fr",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "skillFamiliesFr",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(adminMessages.skillFamilies),
          lang: "fr",
          intl,
          formatted: false,
        }),
      ),
    },
    {
      id: "descriptionFr",
      displayName: nodeToString(
        appendLanguageName({
          label: intl.formatMessage(commonMessages.description),
          lang: "fr",
          intl,
          formatted: false,
        }),
      ),
    },
  ];
};
