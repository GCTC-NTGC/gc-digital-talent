import { ReactNode } from "react";
import { IntlShape, useIntl } from "react-intl";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import { commonMessages } from "@gc-digital-talent/i18n";

import { formatClassificationString } from "~/utils/poolUtils";

import Text from "./Text";

const PoolWhoCanApplyText_Fragment = graphql(/* GraphQL */ `
  fragment WhoCanApplyText on Pool {
    classification {
      group
      level
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
  intl: IntlShape,
): {
  body: ReactNode;
  finePrint?: ReactNode;
} => {
  let body;

  if (areaOfSelection == PoolAreaOfSelection.Employees) {
    body = (
      <>
        {intl.formatMessage({
          defaultMessage: "Employees of the Government of Canada who:",
          id: "KY4zuB",
          description:
            "Title for a list of criteria needed for employees to apply",
        })}
        <ul>
          {selectionLimitations?.includes(
            PoolSelectionLimitation.AtLevelOnly,
          ) ? (
            <li data-h2-margin-top="base(x0.5)">
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Currently hold an {classificationString} classification in their substantive role",
                  id: "pVnp82",
                  description: "At-level application criteria",
                },
                {
                  classificationString,
                },
              )}
            </li>
          ) : null}
          <li data-h2-margin-top="base(x0.5)">
            {intl.formatMessage({
              defaultMessage:
                "Are residing in Canada, are Canadian citizens, or are permanent residents abroad",
              id: "F6AwoP",
              description: "Regular criteria item needed in order to apply",
            })}
          </li>
        </ul>
      </>
    );
  } else {
    body = (
      <>
        {intl.formatMessage({
          defaultMessage:
            "Persons residing in Canada, and Canadian citizens and permanent residents abroad.",
          id: "faWz84",
          description: "List of criteria needed in order to apply",
        })}
      </>
    );
  }

  const finePrint = intl.formatMessage({
    defaultMessage:
      "* Preference will be given to veterans, Canadian citizens, and to permanent residents.",
    id: "PAOXlo",
    description: "Fine print for hiring policy for pool advertisement",
  });

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

  const { body, finePrint } = deriveWhoCanApplyMessages(
    areaOfSelection,
    selectionLimitations,
    classificationString,
    intl,
  );

  return (
    <>
      <Text data-h2-margin-top="base(0)">{body}</Text>
      <Text
        data-h2-margin-bottom="base(0)"
        data-h2-font-size="base(caption)"
        data-h2-color="base(black.70)"
      >
        {finePrint}
      </Text>
    </>
  );
};

export default WhoCanApplyText;
