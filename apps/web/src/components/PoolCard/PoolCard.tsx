import React from "react";
import { useIntl } from "react-intl";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import BoltIcon from "@heroicons/react/24/outline/BoltIcon";
import CalendarDaysIcon from "@heroicons/react/24/outline/CalendarDaysIcon";

import { Heading, HeadingRank, Link, Chip, Chips } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import {
  getLocalizedName,
  localizeSalaryRange,
  commonMessages,
  useLocale,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import { Pool } from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";

import IconLabel from "./IconLabel";

import "./pool-card.css";

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
  const { locale } = useLocale();
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
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-shadow="base(large)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-padding="base(x1) p-tablet(x1, x1, x1, x6) l-tablet(x2, x2, x2, x8)"
      data-h2-position="base(relative)"
      data-h2-radius="base(rounded)"
    >
      <div
        aria-hidden="true"
        data-h2-position="base(absolute)"
        data-h2-location="base(0, auto, auto, x.5) p-tablet(0, auto, auto, x2)"
      >
        <div
          className="recruitment-flag"
          data-h2-background-color="base(secondary)"
          data-h2-padding="base(x2, x.5, x1, x.5)"
          // data-h2-padding="base(x2, x.5, x2.5, x.5)"
          // style={{
          //   clipPath: `polygon(0% 0%, 0% 100%, 50% calc(100% - 2rem), 100% 100%, 100% 0)`,
          // }}
        >
          <span
            data-h2-color="base(black) base:admin(white) base:iap(white)"
            data-h2-font-weight="base(700)"
            data-h2-font-size="base(h6) l-tablet(h4, 1.2)"
            data-h2-layer="base(2, relative)"
          >
            {classificationAbbr || nullMessage}
          </span>
        </div>
      </div>

      <div data-h2-position="base(relative)">
        <div
          data-h2-padding="base(x.75, 0, 0, x3.5) p-tablet(0)"
          data-h2-display="p-tablet(flex)"
          data-h2-gap="base(x2)"
          data-h2-align-items="base(center)"
          data-h2-margin="base(0, 0, x1, 0)"
        >
          <Heading
            level={headingLevel}
            size="h2"
            data-h2-font-size="base(h4, 1.2)"
            data-h2-margin="base(0, 0, x1, 0) p-tablet(0)"
            style={{ wordBreak: "break-word" }}
          >
            {getFullPoolTitleHtml(intl, pool)}
          </Heading>
          <div
            data-h2-flex-grow="p-tablet(1)"
            data-h2-height="base(x.25)"
            data-h2-background-color="base(secondary)"
          />
        </div>
        <div
          data-h2-display="p-tablet(grid)"
          data-h2-gap="base(x1, x3)"
          data-h2-grid-template-columns="base(repeat(2, minmax(0, 1fr)))"
          data-h2-grid-template-rows="base(2fr)"
        >
          <div
            data-h2-grid-column="base(2)"
            data-h2-grid-row="base(1/3)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            <IconLabel
              icon={CurrencyDollarIcon}
              label={intl.formatMessage({
                id: "TrO4uL",
                defaultMessage: "Salary range: ",
                description:
                  "Label for the range of salary expected for a classification",
              })}
            >
              {salaryRanges ? salaryRanges[0] : nullMessage}
            </IconLabel>
            <IconLabel
              icon={BoltIcon}
              label={intl.formatMessage({
                id: "V1DqDX",
                defaultMessage: "Required skills:",
                description: "Label for the skills required for a pool",
              })}
            />
            <div
              data-h2-padding="base(0, 0, 0, x1.5)"
              data-h2-margin="base(0, 0, x1, 0)"
            >
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
            <IconLabel
              icon={CalendarDaysIcon}
              label={intl.formatMessage({
                id: "Gp+70V",
                defaultMessage: "Apply by: ",
                description: "Label for the pool expiry date",
              })}
            >
              {pool.closingDate
                ? formatDate({
                    date: parseDateTimeUtc(pool.closingDate),
                    formatString: "PPP p",
                    intl,
                  })
                : intl.formatMessage({
                    defaultMessage: "(To be determined)",
                    description:
                      "Message displayed when a pool has no expiry date yet",
                    id: "Hd0nHP",
                  })}
            </IconLabel>
          </div>
          {pool.id && (
            <p>
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
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
