import React from "react";
import { useIntl } from "react-intl";
import {
  CurrencyDollarIcon,
  BoltIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

import Heading, { type HeadingLevel } from "@common/components/Heading";
import Link from "@common/components/Link";
import Pill from "@common/components/Pill";

import { getPoolStream } from "@common/constants/localizedConstants";
import { formattedDateMonthDayYear } from "@common/helpers/dateUtils";
import {
  getLocale,
  getLocalizedName,
  localizeSalaryRange,
} from "@common/helpers/localize";
import { notEmpty } from "@common/helpers/util";

import { PoolAdvertisement } from "../../../api/generated";
import { useDirectIntakeRoutes } from "../../../directIntakeRoutes";

import IconLabel from "./IconLabel";

const getClassificationStrings = (pool: PoolAdvertisement) => {
  if (!pool.classifications) return null;

  return pool.classifications
    .map((classification) => {
      if (!classification) return undefined;

      return `${classification.group}-0${classification.level}`;
    })
    .filter(notEmpty);
};

const getSalaryRanges = (pool: PoolAdvertisement, locale: string) => {
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

export interface CardProps {
  pool: PoolAdvertisement;
  headingLevel?: HeadingLevel;
}

const PoolCard = ({ pool, headingLevel = "h3" }: CardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useDirectIntakeRoutes();

  const classifications = getClassificationStrings(pool);
  const salaryRanges = getSalaryRanges(pool, locale);

  return (
    <div
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-shadow="base(large)"
      data-h2-margin="base(0, 0, x1, 0)"
      data-h2-padding="base(x1) p-tablet(x1, x1, x1, x6) l-tablet(x2, x2, x2, x8)"
      data-h2-position="base(relative)"
      data-h2-radius="base(rounded)"
    >
      {classifications && classifications.length > 0 ? (
        <div
          data-h2-position="base(absolute)"
          data-h2-offset="base(0, auto, auto, x.5) p-tablet(0, auto, auto, x2)"
        >
          <div
            data-h2-background-color="base(tm-blue)"
            data-h2-padding="base(x2, x.5, x1, x.5)"
            className="recruitment-flag"
          >
            <span
              data-h2-color="base(black)"
              data-h2-font-weight="base(700)"
              data-h2-font-size="base(h6) l-tablet(h4, 1.2)"
              data-h2-layer="base(2, relative)"
            >
              {classifications[0]}
            </span>
          </div>
        </div>
      ) : null}

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
            data-h2-font-size="base(h4, 1.2)"
            data-h2-margin="base(0, 0, x1, 0) p-tablet(0)"
            style={{ wordBreak: "break-word" }}
          >
            {pool.stream
              ? intl.formatMessage(getPoolStream(pool.stream))
              : intl.formatMessage({
                  defaultMessage: "(no stream)",
                  id: "6TX9CR",
                  description: "Message displayed when a pool has no stream",
                })}
          </Heading>
          <div
            data-h2-flex-grow="p-tablet(1)"
            data-h2-height="base(x.25)"
            data-h2-background-color="base(tm-blue)"
          />
        </div>
        <div
          data-h2-display="p-tablet(grid)"
          data-h2-gap="base(x3, x1)"
          data-h2-grid-template-columns="base(repeat(2, minmax(0, 1fr)))"
          data-h2-grid-template-rows="base(2fr)"
        >
          {pool.description && pool.description[locale] && (
            <p>{pool.description[locale]}</p>
          )}
          <div
            data-h2-grid-column="base(2)"
            data-h2-grid-row="base(1/3)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
          >
            {salaryRanges ? (
              <IconLabel
                icon={CurrencyDollarIcon}
                label={intl.formatMessage({
                  id: "TrO4uL",
                  defaultMessage: "Salary range: ",
                  description:
                    "Label for the range of salary expected for a classification",
                })}
              >
                {salaryRanges[0]}
              </IconLabel>
            ) : null}
            <IconLabel
              icon={BoltIcon}
              label={intl.formatMessage({
                id: "V1DqDX",
                defaultMessage: "Required skills:",
                description: "Label for the skills required for a pool",
              })}
            />
            {pool.essentialSkills && pool.essentialSkills.length > 0 ? (
              <div
                data-h2-padding="base(0, 0, 0, x1.5)"
                data-h2-display="base(flex)"
                data-h2-margin="base(-x.5, 0, x1, 0)"
                data-h2-gap="base(x.25)"
                data-h2-flex-wrap="base(wrap)"
              >
                {pool.essentialSkills.map((skill) => (
                  <Pill
                    key={skill.id}
                    color="blue"
                    mode="outline"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {getLocalizedName(skill.name, intl)}
                  </Pill>
                ))}
              </div>
            ) : (
              <>
                {intl.formatMessage({
                  id: "hL7Y6p",
                  defaultMessage: "(No skills required)",
                  description:
                    "Message displayed when no skills are required for a pool",
                })}
              </>
            )}
            <IconLabel
              icon={CalendarDaysIcon}
              label={intl.formatMessage({
                id: "Gp+70V",
                defaultMessage: "Apply by: ",
                description: "Label for the pool expiry date",
              })}
            >
              {pool.expiryDate
                ? formattedDateMonthDayYear(new Date(pool.expiryDate), intl)
                : intl.formatMessage({
                    defaultMessage: "(To be determined)",
                    description:
                      "Message displayed when a pool has no expiry date yet",
                    id: "Hd0nHP",
                  })}
            </IconLabel>
          </div>
          <p>
            <Link
              color="blue"
              mode="solid"
              type="button"
              weight="bold"
              href={paths.pool(pool.id)}
              data-h2-text-align="base(center)"
              data-h2-display="base(inline-block)"
            >
              {intl.formatMessage(
                {
                  id: "1zkApr",
                  defaultMessage:
                    "Apply to this recruitment<hidden> {name}</hidden>",
                  description:
                    "Message on link that say to apply to a recruitment advertisement",
                },
                { name: classifications ? classifications[0] : "" },
              )}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
