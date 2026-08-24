import type { IntlShape } from "react-intl";

import type { DownloadCsvProps } from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { appendLanguageName, commonMessages } from "@gc-digital-talent/i18n";
import { nodeToString } from "@gc-digital-talent/helpers";

import { getSkillFamilies } from "~/utils/csvUtils";
import adminMessages from "~/messages/adminMessages";

export const SkillCsv_Fragment = graphql(/* GraphQL */ `
  fragment SkillCsv on Skill {
    id
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    category {
      label {
        en
        fr
      }
    }
    families {
      name {
        en
        fr
      }
    }
  }
`);

export const getSkillCsvData = (
  query: FragmentType<typeof SkillCsv_Fragment>[],
) => {
  const skills = getFragment(SkillCsv_Fragment, query);
  const data: DownloadCsvProps["data"] = skills.map(
    ({ id, name, description, category, families }) => {
      return {
        id,
        nameEn: name.en,
        categoryEn: category.label?.en,
        skillFamiliesEn: getSkillFamilies(
          families?.map((family) => family.name?.en),
        ),
        descriptionEn: description?.en ?? "",
        nameFr: name.fr,
        categoryFr: category.label?.fr,
        skillFamiliesFr: getSkillFamilies(
          families?.map((family) => family.name?.fr),
        ),
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
