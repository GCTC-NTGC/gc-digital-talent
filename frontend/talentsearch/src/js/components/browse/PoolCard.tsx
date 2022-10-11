import { Link } from "@common/components";
import { getPoolStream } from "@common/constants/localizedConstants";
import React from "react";
import { useIntl } from "react-intl";
import Chip, { Chips } from "@common/components/Chip";
import {
  getLocale,
  getLocalizedName,
  localizeSalaryRange,
} from "@common/helpers/localize";
import { formattedDateMonthDayYear } from "@common/helpers/dateUtils";
import Heading, { type HeadingLevel } from "@common/components/Heading";
import { PoolAdvertisement } from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

export interface CardProps {
  pool: PoolAdvertisement;
  headingLevel?: HeadingLevel;
}

const PoolCard = ({
  pool,
  headingLevel = "h3",
}: CardProps & React.HTMLProps<HTMLDivElement>) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useDirectIntakeRoutes();

  const poolClassificationString = (): string | null => {
    if (pool.classifications && pool.classifications[0]) {
      const classification = pool.classifications[0];
      return `${classification.group}-0${classification.level}`;
    }
    return null;
  };
  const classificationResult = poolClassificationString();

  const poolClassificationSalary = (): string | undefined => {
    if (pool.classifications && pool.classifications[0]) {
      const classification = pool.classifications[0];
      return localizeSalaryRange(
        classification.minSalary,
        classification.maxSalary,
        locale,
      );
    }
    return undefined;
  };
  const salaryResult = poolClassificationSalary();

  const poolEssentialSkillKeys = (): JSX.Element[] | null => {
    if (pool.essentialSkills && pool.essentialSkills[0]) {
      const chipsArray = pool?.essentialSkills?.map((skill) => (
        <Chip
          key={`essentialSkill-${skill.id}`}
          mode="outline"
          color="neutral"
          label={getLocalizedName(skill.name, intl)}
        />
      ));
      return chipsArray;
    }
    return null;
  };
  const skillResults = poolEssentialSkillKeys();

  return (
    <div
      className="card"
      data-h2-display="base(block)"
      data-h2-shadow="base(s)"
      data-h2-max-width="base(50rem)"
    >
      <div
        className="card__body"
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x0.25, x0.75, x0.75, x0.75)"
      >
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-padding="base(0, 0, x0.75, 0)"
          data-h2-font-weight="base(700)"
        >
          {classificationResult ||
            intl.formatMessage({
              defaultMessage: "(No Classification)",
              description: "No Classification",
              id: "y+OZjx",
            })}{" "}
          {pool.stream ? intl.formatMessage(getPoolStream(pool.stream)) : ""}
        </Heading>

        <p data-h2-padding="base(0, 0, x0.75, 0)">
          {pool.description ? pool.description[locale] : ""}
        </p>
        <p data-h2-padding="base(0, 0, x0.75, 0)">
          <span
            data-h2-font-weight="base(700)"
            data-h2-padding="base(0, x0.25, 0, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Salary range",
              id: "MKyZVJ",
            })}
            :{" "}
          </span>{" "}
          {salaryResult ||
            intl.formatMessage({
              defaultMessage: "(Needs classification)",
              description: "Needs classification",
              id: "nTGIfl",
            })}
        </p>

        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(row)"
          data-h2-align-items="base(center)"
          data-h2-padding="base(0, 0, x0.75, 0)"
        >
          <span
            data-h2-font-weight="base(700)"
            data-h2-padding="base(0, x0.25, 0, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Key skills",
              description: "key skills",
              id: "ppuSbM",
            })}
            :{" "}
          </span>{" "}
          <span>
            {skillResults ? (
              <Chips>{skillResults}</Chips>
            ) : (
              intl.formatMessage({
                defaultMessage: "(No skills required)",
                description: "No skills required",
                id: "WbET08",
              })
            )}
          </span>
        </div>

        <div
          data-h2-display="base(flex)"
          data-h2-flex-direction="base(row)"
          data-h2-justify-content="base(space-between)"
          data-h2-align-items="base(center)"
        >
          <span>
            {intl.formatMessage({
              defaultMessage: "Apply by",
              description: "Apply by",
              id: "gh4VQv",
            })}
            :{" "}
            {pool.expiryDate
              ? formattedDateMonthDayYear(new Date(pool.expiryDate), intl)
              : intl.formatMessage({
                  defaultMessage: "(To be determined)",
                  description: "To be determined",
                  id: "3ozZky",
                })}
          </span>
          <Link
            href={pool.id ? paths.pool(pool.id) : "#"}
            type="button"
            mode="outline"
            color="black"
          >
            {intl.formatMessage(
              {
                defaultMessage:
                  "Apply to this recruitment<hidden> {name}</hidden>",
                description:
                  "Message on link that say to apply to a recruitment advertisement",
                id: "1zkApr",
              },
              { name: classificationResult },
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
