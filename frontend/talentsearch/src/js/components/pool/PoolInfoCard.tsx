import React from "react";
import { useIntl } from "react-intl";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/solid";

import { getLocale, localizeSalaryRange } from "@common/helpers/localize";
import { relativeExpiryDate } from "@common/helpers/dateUtils";

import type { Maybe } from "../../api/generated";

export interface PoolInfoCardProps {
  closingDate: Date;
  classification: string;
  salary: {
    min: Maybe<number>;
    max: Maybe<number>;
  };
}

const P: React.FC = ({ children }) => (
  <p
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-margin="base(x.125, 0)"
  >
    {children}
  </p>
);

const PoolInfoCard = ({
  closingDate,
  salary,
  classification,
}: PoolInfoCardProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  return (
    <div
      data-h2-background-color="base(dt-gray.light)"
      data-h2-radius="base(s)"
      data-h2-padding="base(x.5)"
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-align-items="base(flex-start)"
    >
      <P>
        <CalendarIcon
          style={{ height: "1em", width: "1em", marginRight: "0.25rem" }}
        />
        <span>
          {intl.formatMessage({
            defaultMessage: "Closing date:",
            description: "Label for pool advertisement closing date",
          })}{" "}
          {relativeExpiryDate(new Date(closingDate), intl)}
        </span>
      </P>
      <P>
        <CurrencyDollarIcon
          style={{ height: "1em", width: "1em", marginRight: "0.25rem" }}
        />
        <span>
          {intl.formatMessage({
            defaultMessage: "Salary range:",
            description: "Label for pool advertisement salary range",
          })}{" "}
          {localizeSalaryRange(salary.min, salary.max, locale)} (
          {classification})
        </span>
      </P>
    </div>
  );
};

export default PoolInfoCard;
