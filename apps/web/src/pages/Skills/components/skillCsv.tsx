import { IntlShape } from "react-intl";

import { DownloadCsvProps } from "@gc-digital-talent/ui";
import { Skill } from "@gc-digital-talent/graphql";

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
        descriptionEn: description?.en || "",
        nameFr: name.fr,
        categoryFr: category.label?.fr,
        skillFamiliesFr: getSkillFamilies(families, intlFr),
        descriptionFr: description?.fr || "",
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
      displayName: intl.formatMessage(adminMessages.nameEn),
    },
    {
      id: "categoryEn",
      displayName: intl.formatMessage(adminMessages.categoryEn),
    },
    {
      id: "skillFamiliesEn",
      displayName: intl.formatMessage(adminMessages.skillFamiliesEn),
    },
    {
      id: "descriptionEn",
      displayName: intl.formatMessage(adminMessages.descriptionEn),
    },
    {
      id: "nameFr",
      displayName: intl.formatMessage(adminMessages.nameFr),
    },
    {
      id: "categoryFr",
      displayName: intl.formatMessage(adminMessages.categoryFr),
    },
    {
      id: "skillFamiliesFr",
      displayName: intl.formatMessage(adminMessages.skillFamiliesFr),
    },
    {
      id: "descriptionFr",
      displayName: intl.formatMessage(adminMessages.descriptionFr),
    },
  ];
};
