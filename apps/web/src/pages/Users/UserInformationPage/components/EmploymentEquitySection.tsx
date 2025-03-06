import { useIntl } from "react-intl";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";

import { Well } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import { BasicUserInformationProps } from "../types";

const EmploymentEquitySection = ({ user }: BasicUserInformationProps) => {
  const intl = useIntl();

  const isIndigenous = unpackMaybes(user.indigenousCommunities)?.length > 0;

  return (
    <Well>
      {!isIndigenous &&
        !user.hasDisability &&
        !user.isVisibleMinority &&
        !user.isWoman &&
        intl.formatMessage({
          defaultMessage:
            "Has not identified as a member of any employment equity groups.",
          id: "PjK/4B",
          description:
            "Text on view-user page that the user isn't part of any employment equity groups",
        })}
      {isIndigenous && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Indigenous",
            id: "YoIRbn",
            description: "Title for Indigenous",
          })}
        </div>
      )}
      {user.hasDisability && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Person with disability",
            id: "4Zl/mp",
            description:
              "Text on view-user page that the user has a disability",
          })}
        </div>
      )}
      {user.isVisibleMinority && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Visible minority",
            id: "eickbr",
            description:
              "Text on view-user page that the user is part of a visible minority",
          })}
        </div>
      )}
      {user.isWoman && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {/* eslint-disable-next-line formatjs/no-literal-string-in-jsx */}
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Woman",
            id: "3HJ51b",
            description: "Text on view-user page that the user is a woman",
          })}
        </div>
      )}
    </Well>
  );
};

export default EmploymentEquitySection;
