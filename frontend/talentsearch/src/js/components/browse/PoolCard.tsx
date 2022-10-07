import { Link } from "@common/components";
import { getPoolStream } from "@common/constants/localizedConstants";
import React from "react";
import { useIntl } from "react-intl";
import Chip, { Chips } from "@common/components/Chip";
import { getLocale, getLocalizedName } from "@common/helpers/localize";
import { formattedDateMonthDayYear } from "@common/helpers/dateUtils";
import { PoolAdvertisement } from "../../api/generated";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";

export interface CardProps {
  pool: PoolAdvertisement;
}

const PoolCard = ({ pool }: CardProps & React.HTMLProps<HTMLDivElement>) => {
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

  const poolClassificationSalary = (): string | null => {
    if (pool.classifications && pool.classifications[0]) {
      const classification = pool.classifications[0];
      if (!classification.minSalary && !classification.maxSalary) {
        return null;
      }
      if (classification.minSalary && !classification.maxSalary) {
        return `$${classification.minSalary} -`;
      }
      if (!classification.minSalary && classification.maxSalary) {
        return `- $${classification.maxSalary}`;
      }
      return `$${classification.minSalary} - $${classification.maxSalary}`;
    }
    return null;
  };

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

  return (
    <div
      className="card"
      data-h2-display="base(block)"
      data-h2-shadow="base(s)"
      data-h2-max-width="base(40rem)"
    >
      <div
        className="card__body"
        data-h2-background-color="base(dt-white)"
        data-h2-padding="base(x.75)"
      >
        <h6
          data-h2-font-weight="base(700)"
          data-h2-padding="base(0, 0, x0.75, 0)"
        >
          {poolClassificationString()
            ? poolClassificationString()
            : intl.formatMessage({
                defaultMessage: "No Classification",
                description: "No Classification",
                id: "NCvLjF",
              })}{" "}
          {pool.stream ? intl.formatMessage(getPoolStream(pool.stream)) : ""}
        </h6>

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
          {poolClassificationSalary() ? poolClassificationSalary() : ""}
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
            <Chips>
              {poolEssentialSkillKeys() ? poolEssentialSkillKeys() : ""}
            </Chips>
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
              : ""}
          </span>
          <Link
            href={pool.id ? paths.pool(pool.id) : "#"}
            type="button"
            mode="outline"
            color="black"
          >
            {intl.formatMessage({
              defaultMessage: "Apply to this recruitment",
              description:
                "Message on link that say to apply to a recruitment advertisement",
              id: "zvn+Gu",
            })}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PoolCard;
