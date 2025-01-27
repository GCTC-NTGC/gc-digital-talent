import { useIntl } from "react-intl";

import { MoveInterest } from "@gc-digital-talent/graphql";

import BoolCheckIcon from "./BoolCheckIcon";

interface MoveInterestsListProps {
  moveInterests: MoveInterest[];
}

const MoveInterestsList = ({ moveInterests }: MoveInterestsListProps) => {
  const intl = useIntl();

  return (
    <ul data-h2-list-style="base(none)" data-h2-padding-left="base(0)">
      <li
        key={MoveInterest.AboveLevel}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={moveInterests.includes(MoveInterest.AboveLevel)}
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
            defaultMessage: "I'm interested in promotional opportunities.",
            id: "evwxYn",
            description: "List item, interest in promotion",
          })}
        </BoolCheckIcon>
      </li>
      <li
        key={MoveInterest.AtLevel}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={moveInterests.includes(MoveInterest.AtLevel)}
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
              "I’m interested in opportunities at my current level.",
            id: "O9wEXR",
            description: "List item, interest in lateral moves",
          })}
        </BoolCheckIcon>
      </li>
      <li
        key={MoveInterest.BelowLevel}
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(x.25)"
        data-h2-margin-bottom="base(x.25)"
      >
        <BoolCheckIcon
          value={moveInterests.includes(MoveInterest.BelowLevel)}
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
              "I'm interested in opportunities below my current level.",
            id: "0NkIxW",
            description: "List item, interest in demotion",
          })}
        </BoolCheckIcon>
      </li>
    </ul>
  );
};

export default MoveInterestsList;
