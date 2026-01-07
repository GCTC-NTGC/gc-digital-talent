import { IntlShape, useIntl } from "react-intl";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import { tv } from "tailwind-variants";

import {
  Heading,
  HeadingRank,
  Link,
  Chip,
  Chips,
  Card,
} from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  getLocale,
  getLocalizedName,
  commonMessages,
} from "@gc-digital-talent/i18n";
import {
  FragmentType,
  PoolAreaOfSelection,
  PoolSelectionLimitation,
  PoolSkillType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { DATE_FORMAT_LOCALIZED } from "@gc-digital-talent/date-helpers/const";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import { filterPoolSkillsByType } from "~/utils/skillUtils";
import { getSalaryRange } from "~/utils/classification";

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

const deriveWhoCanApplyString = (
  areaOfSelection: PoolAreaOfSelection,
  selectionLimitations: PoolSelectionLimitation[],
  intl: IntlShape,
): string | null => {
  if (areaOfSelection == PoolAreaOfSelection.Public) {
    if (
      selectionLimitations?.includes(PoolSelectionLimitation.CanadianCitizens)
    ) {
      return intl.formatMessage({
        defaultMessage: "Canadian citizens",
        id: "VotRI3",
        description: "Canadian citizen only application criteria",
      });
    }

    // fall-through for public
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

const flag = tv({
  base: "absolute bottom-0 size-0 translate-y-6 border-t-[calc(var(--spacing)*18)] border-b-[calc(var(--spacing)*9)] border-transparent",
  variants: {
    side: {
      left: "left-0 border-l-[calc(var(--spacing)*18)] border-l-primary",
      right: "right-0 border-r-[calc(var(--spacing)*18)] border-r-primary",
    },
  },
});

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
    <Card className="relative mt-6 p-6 xs:p-12 xs:pl-39">
      <div className="absolute -top-1.5 left-6 h-27 w-21 rounded-t-md bg-primary xs:left-9">
        <span aria-hidden className={flag({ side: "left" })} />
        <span aria-hidden className={flag({ side: "right" })} />
        <span className="absolute bottom-7.5 left-1/2 z-[2] -translate-x-1/2 text-xl font-bold text-black *:whitespace-nowrap lg:text-2xl iap:text-white">
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
        <div className="gap-7.5 xs:flex">
          <Heading
            level={headingLevel}
            size="h5"
            className="mt-0 mb-6 min-h-27 pl-27 font-bold hyphens-auto xs:mb-0 xs:min-h-auto xs:max-w-3/4 xs:pl-0"
          >
            {getShortPoolTitleHtml(intl, {
              workStream: pool.workStream,
              name: pool.name,
              publishingGroup: pool.publishingGroup,
              classification: pool.classification,
            })}
          </Heading>
          <div className="mt-3 hidden h-1.5 w-full flex-1 bg-primary xs:block" />
        </div>
        <div className="mt-6 gap-12 sm:flex [&>p]:mt-6 sm:[&>p]:mt-0">
          <IconLabel
            icon={CalendarIcon}
            label={
              intl.formatMessage(commonMessages.deadline) +
              intl.formatMessage(commonMessages.dividingColon)
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
                      formatString: DATE_FORMAT_LOCALIZED,
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
              intl.formatMessage(commonMessages.salaryRange) +
              intl.formatMessage(commonMessages.dividingColon)
            }
          >
            {salaryRange ?? intl.formatMessage(commonMessages.notAvailable)}
          </IconLabel>
        </div>
        <div className="mt-6">
          <div className="mb-1.5">
            <IconLabel
              icon={BoltIcon}
              label={
                intl.formatMessage(commonMessages.requiredSkills) +
                intl.formatMessage(commonMessages.dividingColon)
              }
            />
          </div>
          {essentialSkills.length ? (
            <Chips>
              {essentialSkills.map((skill) => (
                <Chip key={skill.id}>{getLocalizedName(skill.name, intl)}</Chip>
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
        <div className="mt-7.5">
          {pool.id && (
            <Link color="primary" mode="solid" href={paths.jobPoster(pool.id)}>
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
    </Card>
  );
};

export default PoolCard;
