import { IntlShape, useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import { Heading, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getLocalizedName } from "@gc-digital-talent/i18n";

import { formatClassificationString } from "~/utils/poolUtils";

export const PoolAreaOfSelectionNote_Fragment = graphql(/* GraphQL */ `
  fragment AreaOfSelectionNote on Pool {
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

export const deriveAreaOfSelectionMessages = (
  areaOfSelection: PoolAreaOfSelection,
  selectionLimitations: PoolSelectionLimitation[],
  classificationString: string,
  departmentString: string,
  intl: IntlShape,
): {
  title: ReactNode;
  body: ReactNode;
  finePrint?: ReactNode;
} | null => {
  if (areaOfSelection == PoolAreaOfSelection.Employees) {
    if (
      selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly) &&
      selectionLimitations?.includes(
        PoolSelectionLimitation.DepartmentalPreference,
      )
    ) {
      return {
        title: intl.formatMessage(
          {
            defaultMessage:
              "This opportunity is for internal employees with a classification of {classification} or equivalent with preference given to those at the departments listed*",
            id: "66xc/o",
            description:
              "Title of a note describing that a pool is only open to employees, at-level, with departmental preference. Has an asterisk for fine print.",
          },
          {
            classification: classificationString,
          },
        ),
        // The body is the same as the message for just at-level. No mention of departmental preference.
        body: intl.formatMessage(
          {
            defaultMessage:
              "This opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency who are currently classified as {classification} or an organizational equivalent. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
            id: "pVx/jP",
            description:
              "Body of a note describing that a pool is only open to employees at-level",
          },
          { classification: classificationString },
        ),
        finePrint: intl.formatMessage(
          {
            defaultMessage:
              "* Preference will be given to persons employed with the following departments or agencies: {department}.",
            id: "SoW0qk",
            description:
              "Fine print of a note describing that a pool is only open to employees, at-level, with departmental preference",
          },
          {
            department: departmentString,
          },
        ),
      };
    }

    if (selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly)) {
      return {
        title: intl.formatMessage(
          {
            defaultMessage:
              "This opportunity is for internal employees with a classification of {classification} or equivalent",
            id: "4l0wGu",
            description:
              "Title of a note describing that a pool is only open to employees at-level",
          },
          {
            classification: classificationString,
          },
        ),
        body: intl.formatMessage(
          {
            defaultMessage:
              "This opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency who are currently classified as {classification} or an organizational equivalent. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
            id: "pVx/jP",
            description:
              "Body of a note describing that a pool is only open to employees at-level",
          },
          {
            classification: classificationString,
          },
        ),
      };
    }
    if (
      selectionLimitations?.includes(
        PoolSelectionLimitation.DepartmentalPreference,
      )
    ) {
      return {
        title: intl.formatMessage({
          defaultMessage:
            "This opportunity is for internal employees with preference given to those at the departments listed*",
          id: "JKEDRo",
          description:
            "Title of a note describing that a pool is only open to employees with departmental preference. Has an asterisk for fine print.",
        }),
        // The same message is used for employees only. There is no mention of the departmental preference.
        body: intl.formatMessage({
          defaultMessage:
            "This opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
          id: "k9moOJ",
          description:
            "Body of a note describing that a pool is only open to employees",
        }),
        finePrint: intl.formatMessage(
          {
            defaultMessage:
              "* Preference will be given to persons employed with the following departments or agencies: {department}.",
            id: "8t1KYs",
            description:
              "Fine print of a note describing that a pool is only open to employees with departmental preference",
          },
          {
            department: departmentString,
          },
        ),
      };
    }

    // fall-through for employees only
    return {
      title: intl.formatMessage({
        defaultMessage: "This opportunity is for internal employees",
        id: "WcU42I",
        description:
          "Title of a note describing that a pool is only open to employees",
      }),
      body: intl.formatMessage({
        defaultMessage:
          "This opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
        id: "k9moOJ",
        description:
          "Body of a note describing that a pool is only open to employees",
      }),
    };
  }

  return null;
};

interface AreaOfSelectionWellProps {
  poolQuery: FragmentType<typeof PoolAreaOfSelectionNote_Fragment>;
}

const AreaOfSelectionWell = ({ poolQuery }: AreaOfSelectionWellProps) => {
  const intl = useIntl();
  const pool = getFragment(PoolAreaOfSelectionNote_Fragment, poolQuery);

  const areaOfSelection = pool.areaOfSelection?.value;
  if (!areaOfSelection) {
    return null;
  }

  const selectionLimitations = unpackMaybes(pool.selectionLimitations).map(
    (l) => l.value,
  );

  if (!pool.classification?.group || !pool.classification?.level) {
    return null;
  }
  const classificationString = formatClassificationString({
    group: pool.classification.group,
    level: pool.classification.level,
  });

  const departmentString = getLocalizedName(pool.department?.name, intl, true);
  if (!departmentString) {
    return null;
  }

  const areaOfSelectionMessages = deriveAreaOfSelectionMessages(
    areaOfSelection,
    selectionLimitations,
    classificationString,
    departmentString,
    intl,
  );
  if (!areaOfSelectionMessages) {
    return null;
  }

  return (
    <Well data-h2-margin="base(x1 0)" color="warning">
      <Heading
        level="h3"
        size="h6"
        data-h2-margin-top="base(0)"
        data-h2-font-size="base(body)"
      >
        {areaOfSelectionMessages.title}
      </Heading>
      {areaOfSelectionMessages.body}
      {areaOfSelectionMessages.finePrint ? (
        <div data-h2-font-size="base(caption)" data-h2-margin-top="base(x0.5)">
          {areaOfSelectionMessages.finePrint}
        </div>
      ) : null}
    </Well>
  );
};

export default AreaOfSelectionWell;
