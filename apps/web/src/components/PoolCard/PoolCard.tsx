import { IntlShape, useIntl } from "react-intl";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";

import {
  Heading,
  HeadingRank,
  Link,
  Chip,
  Chips,
  CardBasic,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  getLocale,
  getLocalizedName,
  localizeSalaryRange,
  commonMessages,
} from "@gc-digital-talent/i18n";
import {
  Classification,
  FragmentType,
  Maybe,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
  PoolSkillType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import { filterPoolSkillsByType } from "~/utils/skillUtils";

import IconLabel from "./IconLabel";

export const PoolCard_Fragment = graphql(/* GraphQL */ `
  fragment PoolCard on Pool {
    id
    workStream {
      id
      name {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    closingDate
    name {
      en
      fr
    }
    classification {
      id
      group
      level
      minSalary
      maxSalary
    }
    poolSkills {
      id
      type {
        value
        label {
          en
          fr
        }
      }
      skill {
        id
        category {
          value
          label {
            en
            fr
          }
        }
        key
        name {
          en
          fr
        }
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

const getSalaryRange = (
  locale: string,
  classification?: Maybe<Pick<Classification, "minSalary" | "maxSalary">>,
) => {
  if (!classification) return null;

  return localizeSalaryRange(
    classification.minSalary,
    classification.maxSalary,
    locale,
  );
};

const deriveWhoCanApplyString = (
  areaOfSelection: PoolAreaOfSelection,
  selectionLimitations: PoolSelectionLimitation[],
  intl: IntlShape,
): string | null => {
  if (areaOfSelection == PoolAreaOfSelection.Public) {
    return intl.formatMessage({
      defaultMessage: "Open to the public",
      id: "L0eho2",
      description: "Combined eligibility string for 'open to the public'",
    });
  }
  if (areaOfSelection == PoolAreaOfSelection.Employees) {
    if (
      selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly) &&
      selectionLimitations?.includes(
        PoolSelectionLimitation.DepartmentalPreference,
      )
    ) {
      return intl.formatMessage({
        defaultMessage: "Employees (at-level, departmental preference)",
        id: "4VQGU4",
        description:
          "Combined eligibility string for 'employees only', 'at-level only', and 'departmental preference'",
      });
    }
    if (selectionLimitations?.includes(PoolSelectionLimitation.AtLevelOnly)) {
      return intl.formatMessage({
        defaultMessage: "Employees (at-level)",
        id: "JCX6jN",
        description:
          "Combined eligibility string for 'employees only' and 'at-level only'",
      });
    }
    if (
      selectionLimitations?.includes(
        PoolSelectionLimitation.DepartmentalPreference,
      )
    ) {
      return intl.formatMessage({
        defaultMessage: "Employees (departmental preference)",
        id: "g6coYl",
        description:
          "Combined eligibility string for 'employees only' and 'departmental preference'",
      });
    }
    // fall-through for employees only
    return intl.formatMessage({
      defaultMessage: "Employees",
      id: "TOnXeM",
      description:
        "Combined eligibility string for 'employees only' with no other limitations",
    });
  }
  return null;
};

export interface PoolCardProps {
  poolQuery: FragmentType<typeof PoolCard_Fragment>;
  headingLevel?: HeadingRank;
}

const PoolCard = ({ poolQuery, headingLevel = "h3" }: PoolCardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const pool = getFragment(PoolCard_Fragment, poolQuery);
  const essentialSkills = filterPoolSkillsByType(
    pool.poolSkills,
    PoolSkillType.Essential,
  );

  const classificationAbbr = pool.classification
    ? wrapAbbr(
        `${pool.classification.group}-${pool.classification.level < 10 ? "0" : ""}${pool.classification.level}`,
        intl,
      )
    : "";
  const salaryRange = getSalaryRange(locale, pool.classification);

  const notAvailableAbbr = intl.formatMessage({
    defaultMessage: "N/A",
    id: "S4eHnR",
    description: "An abbreviation for not available",
  });

  return (
    <CardBasic
      data-h2-margin-top="base(x1)"
      data-h2-padding="base(x1) p-tablet(x2, x2, x2, x6.5)"
      data-h2-position="base(relative)"
    >
      <div
        data-h2-background-color="base(secondary)"
        data-h2-position="base(absolute) base:selectors[::before](absolute) base:selectors[::after](absolute)"
        data-h2-location="base(-x.25, auto, auto, x1) p-tablet(-x.25, auto, auto, x1.5) base:selectors[::before](auto, auto, 0px, 0px) base:selectors[::after](auto, 0px, 0px, auto)"
        data-h2-radius="base(rounded, rounded, 0px, 0px)"
        data-h2-height="base(x4.5) base:selectors[::before](0px) base:selectors[::after](0px)"
        data-h2-width="base(x3.5) base:selectors[::before](0px) base:selectors[::after](0px)"
        data-h2-content="base:selectors[::before](' ') base:selectors[::after](' ')"
        data-h2-display="base:selectors[::before](block) base:selectors[::after](block)"
        data-h2-border-top="base:selectors[::before](x3 solid transparent) base:selectors[::after](x3 solid transparent)"
        data-h2-border-bottom="base:selectors[::before](x1.5 solid transparent) base:selectors[::after](x1.5 solid transparent)"
        data-h2-border-left="base:selectors[::before](x3 solid secondary)"
        data-h2-border-right="base:selectors[::after](x3 solid secondary)"
        data-h2-transform="base:selectors[::before](translate(0, 1.5rem)) base:selectors[::after](translate(0, 1.5rem))"
      >
        <span
          data-h2-color="base:all(black) base:iap(white)"
          data-h2-font-weight="base(700)"
          data-h2-font-size="base(h5, 1)"
          data-h2-layer="base(2)"
          data-h2-position="base(absolute)"
          data-h2-location="base(auto, auto, x1.25, 50%)"
          data-h2-transform="base(translate(-50%, 0px))"
          data-h2-white-space="base:children[*](nowrap)"
        >
          {classificationAbbr || (
            <abbr title={intl.formatMessage(commonMessages.notAvailable)}>
              <span
                aria-label={intl.formatMessage(commonMessages.notAvailable)}
              >
                {notAvailableAbbr}
              </span>
            </abbr>
          )}
        </span>
      </div>
      <div>
        <div
          data-h2-display="base(block) p-tablet(flex)"
          data-h2-gap="base(x1.5)"
        >
          <Heading
            level={headingLevel}
            size="h5"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(0, 0, x1, 0) p-tablet(0)"
            data-h2-padding-left="base(x4.5) p-tablet(0)"
            data-h2-hyphens="base(auto)"
            data-h2-max-width="p-tablet(75%)"
            data-h2-min-height="base(x4.5) p-tablet(auto)"
          >
            {getShortPoolTitleHtml(intl, {
              workStream: pool.workStream,
              name: pool.name,
              publishingGroup: pool.publishingGroup,
              classification: pool.classification,
            })}
          </Heading>
          <div
            data-h2-background-color="base(secondary)"
            data-h2-display="base(none) p-tablet(block)"
            data-h2-height="base(x.25)"
            data-h2-width="base(100%)"
            data-h2-margin-top="base(x.5)"
            data-h2-flex="base(1)"
          />
        </div>
        <div
          data-h2-display="base(block) l-tablet(flex)"
          data-h2-gap="base(x2)"
          data-h2-margin-top="base(x1) base:children[>p](x1) l-tablet:children[>p](0px)"
        >
          <IconLabel
            icon={CalendarIcon}
            label={
              intl.formatMessage({
                defaultMessage: "Deadline",
                id: "FVEh7L",
                description: "Label for pool advertisement closing date",
              }) + intl.formatMessage(commonMessages.dividingColon)
            }
          >
            {pool.closingDate
              ? intl.formatMessage(
                  {
                    defaultMessage: "Apply on or before {closingDate}",
                    id: "LjYzkS",
                    description: "Message to apply to the pool before deadline",
                  },
                  {
                    closingDate: formatDate({
                      date: parseDateTimeUtc(pool.closingDate),
                      formatString: "PPP",
                      intl,
                      timeZone: "Canada/Pacific",
                    }),
                  },
                )
              : intl.formatMessage({
                  defaultMessage: "(To be determined)",
                  description:
                    "Message displayed when a pool has no expiry date yet",
                  id: "Hd0nHP",
                })}
          </IconLabel>
          {pool.areaOfSelection ? (
            <IconLabel
              icon={UsersIcon}
              label={
                intl.formatMessage({
                  defaultMessage: "Who can apply",
                  id: "/lByjT",
                  description: "Label for pool advertisement area of selection",
                }) + intl.formatMessage(commonMessages.dividingColon)
              }
            >
              {deriveWhoCanApplyString(
                pool.areaOfSelection.value,
                unpackMaybes(pool.selectionLimitations).map((l) => l.value),
                intl,
              ) ?? intl.formatMessage(commonMessages.notAvailable)}
            </IconLabel>
          ) : undefined}
          <IconLabel
            icon={CurrencyDollarIcon}
            label={
              intl.formatMessage({
                defaultMessage: "Salary range",
                id: "GgBjAd",
                description: "Label for pool advertisement salary range",
              }) + intl.formatMessage(commonMessages.dividingColon)
            }
          >
            {salaryRange ?? intl.formatMessage(commonMessages.notAvailable)}
          </IconLabel>
        </div>
        <div data-h2-margin-top="base(x1)">
          <div data-h2-margin-bottom="base(x.25)">
            <IconLabel
              icon={BoltIcon}
              label={intl.formatMessage({
                id: "V1DqDX",
                defaultMessage: "Required skills:",
                description: "Label for the skills required for a pool",
              })}
            />
          </div>
          {essentialSkills.length ? (
            <Chips>
              {essentialSkills.map((skill) => (
                <Chip key={skill.id} color="secondary">
                  {getLocalizedName(skill.name, intl)}
                </Chip>
              ))}
            </Chips>
          ) : (
            <p>
              {intl.formatMessage({
                id: "hL7Y6p",
                defaultMessage: "(No skills required)",
                description:
                  "Message displayed when no skills are required for a pool",
              })}
            </p>
          )}
        </div>
        <div data-h2-margin-top="base(x1.5)">
          {pool.id && (
            <Link color="secondary" mode="solid" href={paths.pool(pool.id)}>
              <span>
                {intl.formatMessage(
                  {
                    id: "YxqhQt",
                    defaultMessage:
                      "Apply to this recruitment process ({name})",
                    description:
                      "Message on link that say to apply to a recruitment advertisement",
                  },
                  { name: classificationAbbr },
                )}
              </span>
            </Link>
          )}
        </div>
      </div>
    </CardBasic>
  );
};

export default PoolCard;
