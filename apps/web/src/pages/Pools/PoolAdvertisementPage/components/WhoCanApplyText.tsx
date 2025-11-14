import { JSX, ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import {
  commonMessages,
  getLocale,
  getLocalizedName,
  Locales,
} from "@gc-digital-talent/i18n";
import { Link } from "@gc-digital-talent/ui";

import { formatClassificationString } from "~/utils/poolUtils";

import Text from "./Text";

const PoolWhoCanApplyText_Fragment = graphql(/* GraphQL */ `
  fragment WhoCanApplyText on Pool {
    classification {
      group
      level
    }
    department {
      name {
        en
        fr
      }
    }
    areaOfSelection {
      value
    }
    selectionLimitations {
      value
    }
  }
`);

const veteransAndArmedForcesLink = (
  locale: Locales,
  chunks: ReactNode,
): JSX.Element => (
  <Link
    external
    href={
      locale === "en"
        ? "https://www.canada.ca/en/public-service-commission/jobs/services/gc-jobs/canadian-armed-forces-members-veterans.html"
        : "https://www.canada.ca/fr/commission-fonction-publique/emplois/services/emplois-gc/anciens-combattants-militaires.html"
    }
  >
    {chunks}
  </Link>
);

const deriveWhoCanApplyMessages = (
  areaOfSelection: PoolAreaOfSelection,
  selectionLimitations: PoolSelectionLimitation[],
  classificationString: string,
  departmentName: string,
  intl: IntlShape,
): {
  body: ReactNode;
  finePrint?: ReactNode;
} => {
  let body;
  let finePrint;

  const locale = getLocale(intl);

  if (areaOfSelection == PoolAreaOfSelection.Employees) {
    body = selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly)
      ? intl.formatMessage(
          {
            defaultMessage:
              "Employees of the Government of Canada or persons employed by a Government of Canada agency who currently hold an {classificationString} classification or organizational equivalent in their substantive role. <link>Eligible veterans and Canadian Armed Forces members</link> may also apply.",
            id: "0P05iS",
            description: "At-level application criteria",
          },
          {
            classificationString,
            link: (chunks: ReactNode) =>
              veteransAndArmedForcesLink(locale, chunks),
          },
        )
      : intl.formatMessage(
          {
            defaultMessage:
              "Employees of the Government of Canada, persons employed by a Government of Canada agency, <link>and eligible veterans and Canadian Armed Forces members.</link>",
            id: "ZfLuWv",
            description: "Employee-only application criteria",
          },
          {
            link: (chunks: ReactNode) =>
              veteransAndArmedForcesLink(locale, chunks),
          },
        );
    finePrint = selectionLimitations?.includes(
      PoolSelectionLimitation.DepartmentalPreference,
    )
      ? intl.formatMessage(
          {
            defaultMessage:
              "* Preference will be given to eligible veterans, eligible Canadian Armed Forces members, and persons employed with the following departments or agencies: {department}.",
            id: "mnrRuo",
            description:
              "Fine print of a note describing that a pool is only open to employees with departmental preference",
          },
          {
            department: departmentName,
          },
        )
      : null;
  } else if (
    areaOfSelection == PoolAreaOfSelection.Public &&
    selectionLimitations?.includes(PoolSelectionLimitation.CanadianCitizens)
  ) {
    body =
      intl.formatMessage({
        defaultMessage: "Canadian citizens",
        id: "VotRI3",
        description: "Canadian citizen only application criteria",
      }) + "."; // period to make the message a sentence
    finePrint = null;
  } else {
    body = intl.formatMessage({
      defaultMessage:
        "All persons who are residing in Canada, are Canadian citizens, or are Canadian permanent residents abroad.",
      id: "XCUBLw",
      description: "Criteria for applying to public pool advertisement",
    });
    finePrint = intl.formatMessage({
      defaultMessage:
        "* Preference will be given to veterans, Canadian citizens, and to permanent residents.",
      id: "PAOXlo",
      description: "Fine print for hiring policy for pool advertisement",
    });
  }

  return { body, finePrint };
};

interface WhoCanApplyTextProps {
  poolQuery: FragmentType<typeof PoolWhoCanApplyText_Fragment>;
}

const WhoCanApplyText = ({ poolQuery }: WhoCanApplyTextProps) => {
  const intl = useIntl();
  const pool = getFragment(PoolWhoCanApplyText_Fragment, poolQuery);

  const areaOfSelection =
    pool.areaOfSelection?.value ?? PoolAreaOfSelection.Public;

  const selectionLimitations =
    pool.selectionLimitations?.map((l) => l.value) ?? [];

  const classificationString =
    !!pool.classification?.group && !!pool.classification?.level
      ? formatClassificationString({
          group: pool.classification.group,
          level: pool.classification.level,
        })
      : intl.formatMessage(commonMessages.notProvided);

  const departmentName = getLocalizedName(pool.department?.name, intl, true);

  const { body, finePrint } = deriveWhoCanApplyMessages(
    areaOfSelection,
    selectionLimitations,
    classificationString,
    departmentName,
    intl,
  );

  return (
    <>
      {body ? <Text className="mt-0">{body}</Text> : null}
      {finePrint ? (
        <Text className="mb-0 text-sm text-black/70 dark:text-white/70">
          {finePrint}
        </Text>
      ) : null}
    </>
  );
};

export default WhoCanApplyText;
