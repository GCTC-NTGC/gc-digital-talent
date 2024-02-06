import React from "react";
import { useIntl } from "react-intl";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";

import { Heading, HeadingRank, Link, Chip, Chips } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  getLocale,
  getLocalizedName,
  localizeSalaryRange,
  commonMessages,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getShortPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import { Pool } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import IconLabel from "./IconLabel";

const getSalaryRanges = (pool: Pool, locale: string) => {
  if (!pool.classifications) return null;

  return pool.classifications
    .map((classification) => {
      if (!classification) return undefined;

      return localizeSalaryRange(
        classification.minSalary,
        classification.maxSalary,
        locale,
      );
    })
    .filter(notEmpty);
};

export interface PoolCardProps {
  pool: Pool;
  headingLevel?: HeadingRank;
}

const PoolCard = ({ pool, headingLevel = "h3" }: PoolCardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const { classifications } = pool;
  const classification = classifications ? classifications[0] : null;

  let classificationAbbr; // type wrangling the complex type into a string
  if (classification) {
    const { group, level } = classification;
    classificationAbbr = wrapAbbr(`${group}-0${level}`, intl);
  }
  const salaryRanges = getSalaryRanges(pool, locale);
  const nullMessage = intl.formatMessage(commonMessages.notAvailable);

  return (
    <div
      data-h2-background-color="base(foreground)"
      data-h2-shadow="base(larger)"
      data-h2-margin-top="base(x1)"
      data-h2-padding="base(x1) p-tablet(x2, x2, x2, x6.5)"
      data-h2-position="base(relative)"
      data-h2-radius="base(rounded)"
    >
      <div
        data-h2-background-color="base(secondary)"
        data-h2-position="base(absolute) base:selectors[::before](absolute) base:selectors[::after](absolute)"
        data-h2-location="base(-x.25, auto, auto, x1) p-tablet(-x.25, auto, auto, x1.5) base:selectors[::before](auto, auto, 0px, 0px) base:selectors[::after](auto, 0px, 0px, auto)"
        data-h2-radius="base(rounded, rounded, 0px, 0px)"
        data-h2-height="base(x4.5) base:selectors[::before](0px) base:selectors[:::after](0px)"
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
          {classificationAbbr || nullMessage}
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
            {getShortPoolTitleHtml(intl, pool)}
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
          data-h2-margin-top="base(x1) base:children[>p:last-child](x1) l-tablet:children[>p:last-child](0px)"
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
            {salaryRanges ? salaryRanges[0] : nullMessage}
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
          {pool.essentialSkills?.length ? (
            <Chips>
              {pool.essentialSkills.map((skill) => (
                <Chip
                  key={skill.id}
                  color="secondary"
                  mode="outline"
                  label={getLocalizedName(skill.name, intl)}
                />
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
    </div>
  );
};

export default PoolCard;
