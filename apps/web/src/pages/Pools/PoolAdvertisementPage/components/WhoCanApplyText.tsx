import { ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";

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

  if (areaOfSelection == PoolAreaOfSelection.Employees) {
    body = selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly)
      ? intl.formatMessage(
          {
            defaultMessage:
              "Employees of the Government of Canada or persons employed by a Government of Canada agency who currently hold an {classificationString} classification or organizational equivalent in their substantive role.",
            id: "yV/mQS",
            description: "At-level application criteria",
          },
          {
            classificationString,
          },
        )
      : intl.formatMessage({
          defaultMessage:
            "Employees of the Government of Canada or persons employed by a Government of Canada agency.",
          id: "CoIL0K",
          description: "Employee-only application criteria",
        });
    finePrint = selectionLimitations?.includes(
      PoolSelectionLimitation.DepartmentalPreference,
    )
      ? intl.formatMessage(
          {
            defaultMessage:
              "* Preference will be given to persons employed with the following departments or agencies: {departmentName}.",
            id: "3dwnFt",
            description:
              "Fine print for departmental preference for pool advertisement",
          },
          {
            departmentName,
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
