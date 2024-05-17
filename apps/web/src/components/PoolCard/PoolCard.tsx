import { useIntl } from "react-intl";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";

import {
  Heading,
  HeadingRank,
  Link,
  CardBasic,
  Chip,
  Chips,
  cn,
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
  PoolSkillType,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import useRoutes from "~/hooks/useRoutes";
import { filterPoolSkillsByType } from "~/utils/skillUtils";

import IconLabel from "./IconLabel";

export const PoolCard_Fragment = graphql(/* GraphQL */ `
  fragment PoolCard on Pool {
    id
    stream
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
      type
      skill {
        id
        category
        key
        name {
          en
          fr
        }
      }
    }
  }
`);

const getSalaryRange = (
  locale: string,
  classification?: Maybe<Classification>,
) => {
  if (!classification) return null;

  return localizeSalaryRange(
    classification.minSalary,
    classification.maxSalary,
    locale,
  );
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
        `${pool.classification.group}-0${pool.classification.level}`,
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
        className={cn(
          "absolute -top-1.5 left-6 h-28 w-24 rounded-t sm:left-10",
          "before:absolute before:bottom-0 before:left-0 before:block before:h-0 before:w-0 before:translate-y-6",
          "after:absolute after:bottom-0 after:right-0 after:block after:h-0 after:w-0 after:translate-y-6",
        )}
        data-h2-border-top="base:selectors[::before](x3 solid transparent) base:selectors[::after](x3 solid transparent)"
        data-h2-border-bottom="base:selectors[::before](x1.5 solid transparent) base:selectors[::after](x1.5 solid transparent)"
        data-h2-border-left="base:selectors[::before](x3 solid secondary)"
        data-h2-border-right="base:selectors[::after](x3 solid secondary)"
      >
        <span
          data-h2-color="base:all(black) base:iap(white)"
          className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 font-bold *:whitespace-nowrap"
          data-h2-font-size="base(h5, 1)"
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
        <div className="block gap-10 sm:flex">
          <Heading
            level={headingLevel}
            size="h5"
            className="max-w-3/4 min-h-28 hyphens-auto pl-28 font-bold sm:min-h-0 sm:pl-0 "
            data-h2-margin="base(0, 0, x1, 0) p-tablet(0)"
          >
            {getShortPoolTitleHtml(intl, pool)}
          </Heading>
          <div
            data-h2-background-color="base(secondary)"
            className="mt-3 hidden h-1.5 w-full flex-1 sm:block"
          />
        </div>
        <div className="mt-6 flex flex-col flex-wrap gap-y-6 md:flex-row md:gap-12">
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
        <div className="mt-6">
          <div className="mb-1.5">
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
        {pool.id && (
          <div className="mt-12">
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
          </div>
        )}
      </div>
    </CardBasic>
  );
};

export default PoolCard;
