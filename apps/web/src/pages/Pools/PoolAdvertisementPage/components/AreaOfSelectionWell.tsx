import { IntlShape, useIntl } from "react-intl";
import { ReactNode } from "react";

import {
  FragmentType,
  getFragment,
  graphql,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
} from "@gc-digital-talent/graphql";
import { Heading, Link, Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { getLocale, getLocalizedName, Locales } from "@gc-digital-talent/i18n";

import { formatClassificationString } from "~/utils/poolUtils";

const pseaUrl: Record<Locales, string> = {
  en: "https://laws-lois.justice.gc.ca/eng/acts/p-33.01/",
  fr: "https://laws-lois.justice.gc.ca/fra/lois/p-33.01/",
} as const;

const PoolAreaOfSelectionNote_Fragment = graphql(/* GraphQL */ `
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

const deriveAreaOfSelectionMessages = (
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
  const locale = getLocale(intl);
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
              "This job opportunity is for internal employees with a classification of {classification} or equivalent with preference given to those at the departments listed*",
            id: "1MJGsD",
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
              "This job opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency who are currently classified as {classification} or an organizational equivalent. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
            id: "QXB3EX",
            description:
              "Body of a note describing that a pool is only open to employees at-level",
          },
          { classification: classificationString },
        ),
        // The same message is used for just departmental preference. There is no mention of being at-level.
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

    if (selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly)) {
      return {
        title: intl.formatMessage(
          {
            defaultMessage:
              "This job opportunity is for internal employees with a classification of {classification} or equivalent",
            id: "LDVGvh",
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
              "This job opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency who are currently classified as {classification} or an organizational equivalent. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
            id: "QXB3EX",
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
            "This job opportunity is for internal employees with preference given to those at the departments listed*",
          id: "3FAEil",
          description:
            "Title of a note describing that a pool is only open to employees with departmental preference. Has an asterisk for fine print.",
        }),
        // The same message is used for employees only. There is no mention of the departmental preference.
        body: intl.formatMessage({
          defaultMessage:
            "This job opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
          id: "FrQmN+",
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
        defaultMessage: "This job opportunity is for internal employees",
        id: "RGl+Dr",
        description:
          "Title of a note describing that a pool is only open to employees",
      }),
      body: intl.formatMessage({
        defaultMessage:
          "This job opportunity is reserved for existing employees of the Government of Canada or persons employed by a Government of Canada agency. By applying you are confirming that you are an active employee and that the employee information you provide as a part of your profile is up-to-date.",
        id: "FrQmN+",
        description:
          "Body of a note describing that a pool is only open to employees",
      }),
    };
  }

  if (areaOfSelection == PoolAreaOfSelection.Public) {
    if (
      selectionLimitations?.includes(PoolSelectionLimitation.CanadianCitizens)
    ) {
      return {
        title: intl.formatMessage({
          defaultMessage: "This opportunity is for Canadian citizens only",
          id: "LA+7mQ",
          description:
            "Title of a note describing that a pool is only open to canadian citizens",
        }),
        body: (
          <>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "This opportunity is reserved for persons with Canadian citizenship*.",
                id: "ZeDdxG",
                description:
                  "Body p1 of a note describing that a pool is only open to canadian citizens",
              })}
            </p>
            <p
              data-h2-margin-top="base(x0.5)"
              data-h2-font-size="base(caption)"
            >
              {intl.formatMessage(
                {
                  defaultMessage:
                    "*This opportunity is with a department or agency that is not subject to the <a><italic>Public Service Employment Act</italic></a>. As a result, the hiring process and terminology might be different from those typically found in the federal public service.",
                  id: "AlhZFb",
                  description:
                    "Body p2 of a note describing that a pool is only open to canadian citizens",
                },
                {
                  a: (chunks: ReactNode) => (
                    <Link href={pseaUrl[locale]} color="black" newTab external>
                      {chunks}
                    </Link>
                  ),
                },
              )}
            </p>
          </>
        ),
      };
    }

    // no fall-through for public
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
