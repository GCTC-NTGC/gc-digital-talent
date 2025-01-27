import { useIntl } from "react-intl";

import { OrganizationTypeInterest } from "@gc-digital-talent/graphql";

import BoolCheckIcon from "./BoolCheckIcon";

interface OrganizationTypeInterestsListProps {
  organizationTypeInterests: OrganizationTypeInterest[];
}

const OrganizationTypeInterestsList = ({
  organizationTypeInterests,
}: OrganizationTypeInterestsListProps) => {
  const intl = useIntl();

  return (
    <ul data-h2-list-style="base(none)" data-h2-padding-left="base(0)">
      <li
        key={OrganizationTypeInterest.Current}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={organizationTypeInterests.includes(
            OrganizationTypeInterest.Current,
          )}
          trueLabel={intl.formatMessage({
            defaultMessage: "Interested in",
            id: "AQiPuW",
            description:
              "Label for user expressing interest in a specific work stream",
          })}
          falseLabel={intl.formatMessage({
            defaultMessage: "Not interested in",
            id: "KyLikL",
            description:
              "Label for user expressing they are not interested in a specific work stream",
          })}
        >
          {intl.formatMessage({
            defaultMessage:
              "I'd consider opportunities in my current department, agency, or crown corporation.",
            id: "KKZgfJ",
            description:
              "List item, interest in opportunities at present organization",
          })}
        </BoolCheckIcon>
      </li>
      <li
        key={OrganizationTypeInterest.OtherDepartment}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={organizationTypeInterests.includes(
            OrganizationTypeInterest.OtherDepartment,
          )}
          trueLabel={intl.formatMessage({
            defaultMessage: "Interested in",
            id: "AQiPuW",
            description:
              "Label for user expressing interest in a specific work stream",
          })}
          falseLabel={intl.formatMessage({
            defaultMessage: "Not interested in",
            id: "KyLikL",
            description:
              "Label for user expressing they are not interested in a specific work stream",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "I'd consider opportunities in other departments.",
            id: "91/wW5",
            description:
              "List item, interest in opportunities at other departments",
          })}
        </BoolCheckIcon>
      </li>
      <li
        key={OrganizationTypeInterest.OtherAgency}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={organizationTypeInterests.includes(
            OrganizationTypeInterest.OtherAgency,
          )}
          trueLabel={intl.formatMessage({
            defaultMessage: "Interested in",
            id: "AQiPuW",
            description:
              "Label for user expressing interest in a specific work stream",
          })}
          falseLabel={intl.formatMessage({
            defaultMessage: "Not interested in",
            id: "KyLikL",
            description:
              "Label for user expressing they are not interested in a specific work stream",
          })}
        >
          {intl.formatMessage({
            defaultMessage: "I'd consider opportunities in other agencies",
            id: "427bsx",
            description:
              "List item, interest in opportunities at other agencies",
          })}
        </BoolCheckIcon>
      </li>
      <li
        key={OrganizationTypeInterest.OtherCrownCorp}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={organizationTypeInterests.includes(
            OrganizationTypeInterest.OtherCrownCorp,
          )}
          trueLabel={intl.formatMessage({
            defaultMessage: "Interested in",
            id: "AQiPuW",
            description:
              "Label for user expressing interest in a specific work stream",
          })}
          falseLabel={intl.formatMessage({
            defaultMessage: "Not interested in",
            id: "KyLikL",
            description:
              "Label for user expressing they are not interested in a specific work stream",
          })}
        >
          {intl.formatMessage({
            defaultMessage:
              "I'd consider opportunities in other crown corporations.",
            id: "GCjnow",
            description:
              "List item, interest in opportunities at other crown corporations",
          })}
        </BoolCheckIcon>
      </li>
    </ul>
  );
};

export default OrganizationTypeInterestsList;
