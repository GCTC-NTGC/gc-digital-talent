import React from "react";
import { useIntl } from "react-intl";

import { toast } from "@common/components/Toast";
import Well from "@common/components/Well";
import type { Maybe } from "@common/api/generated";
import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@common/constants";

import profileMessages from "../profile/profileMessages";
import Spinner from "../Spinner";
import EquityOption from "./EquityOption";
import type { EquityKeys, UserMutationPromise } from "./types";

interface EquityOptionsProps {
  hasDisability?: Maybe<boolean>;
  isIndigenous?: Maybe<boolean>;
  isVisibleMinority?: Maybe<boolean>;
  isWoman?: Maybe<boolean>;
  isDisabled: boolean;
  onAdd: (key: EquityKeys) => UserMutationPromise;
  onRemove: (key: EquityKeys) => UserMutationPromise;
}

const resolveMaybe = (value: Maybe<boolean>): boolean => !!value;

const EquityOptions: React.FC<EquityOptionsProps> = ({
  hasDisability,
  isIndigenous,
  isVisibleMinority,
  isWoman,
  onAdd,
  onRemove,
  isDisabled,
}) => {
  const intl = useIntl();

  const resolvedDisability = resolveMaybe(hasDisability);
  const resolvedIndigenous = resolveMaybe(isIndigenous);
  const resolvedMinority = resolveMaybe(isVisibleMinority);
  const resolvedWoman = resolveMaybe(isWoman);

  const hasItems =
    resolvedDisability ||
    resolvedIndigenous ||
    resolvedMinority ||
    resolvedWoman;

  const itemsAvailable =
    !resolvedDisability ||
    !resolvedIndigenous ||
    !resolvedMinority ||
    !resolvedWoman;

  const handleOptionSave = (key: EquityKeys, value: boolean) => {
    const handler = value ? onAdd : onRemove;
    handler(key)
      .then(() => {
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  return (
    <div data-h2-position="base(relative)">
      <div
        data-h2-layer="base(1, relative)"
        data-h2-flex-grid="l-tablet(normal, x3)"
      >
        <div data-h2-flex-item="l-tablet(1of2)">
          <h2
            data-h2-font-size="base(h4, 1)"
            data-h2-margin="base(x2, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "My employment equity information:",
              id: "Q96xMb",
              description:
                "Heading for employment equity categories added to user profile.",
            })}
          </h2>
          {hasItems ? (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
            >
              {resolvedWoman && (
                <EquityOption
                  option="woman"
                  isAdded={resolvedWoman}
                  onSave={(newValue) => {
                    handleOptionSave("isWoman", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityStatement("woman"),
                  )}
                />
              )}
              {resolvedIndigenous && (
                <EquityOption
                  option="indigenous"
                  isAdded={resolvedIndigenous}
                  onSave={(newValue) => {
                    handleOptionSave("isIndigenous", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityStatement("indigenous"),
                  )}
                />
              )}
              {resolvedMinority && (
                <EquityOption
                  option="minority"
                  isAdded={resolvedMinority}
                  onSave={(newValue) => {
                    handleOptionSave("isVisibleMinority", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityStatement("minority"),
                  )}
                />
              )}
              {resolvedDisability && (
                <EquityOption
                  option="disability"
                  isAdded={resolvedDisability}
                  onSave={(newValue) => {
                    handleOptionSave("hasDisability", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityStatement("disability"),
                  )}
                />
              )}
            </div>
          ) : (
            <Well>
              <p data-h2-margin="base(0)">
                {intl.formatMessage({
                  defaultMessage:
                    "You have not added any employment equity options to your profile.",
                  id: "fK7jxe",
                  description:
                    "Message displayed when a user has no employment equity information.",
                })}
              </p>
            </Well>
          )}
        </div>
        <div data-h2-flex-item="l-tablet(1of2)">
          <h2
            data-h2-font-size="base(h4, 1)"
            data-h2-margin="base(x2, 0, x1, 0)"
          >
            {intl.formatMessage({
              defaultMessage: "Employment equity options:",
              id: "TuhgU0",
              description:
                "Heading for employment equity categories available to be added to user profile.",
            })}
          </h2>
          {itemsAvailable || !hasItems ? (
            <div
              data-h2-display="base(flex)"
              data-h2-flex-direction="base(column)"
            >
              {!resolvedWoman && (
                <EquityOption
                  option="woman"
                  isAdded={resolvedWoman}
                  onSave={(newValue) => {
                    handleOptionSave("isWoman", newValue);
                  }}
                  title={intl.formatMessage(getEmploymentEquityGroup("woman"))}
                />
              )}
              {!resolvedIndigenous && (
                <EquityOption
                  option="indigenous"
                  isAdded={resolvedIndigenous}
                  onSave={(newValue) => {
                    handleOptionSave("isIndigenous", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityGroup("indigenous"),
                  )}
                />
              )}
              {!resolvedMinority && (
                <EquityOption
                  option="minority"
                  isAdded={resolvedMinority}
                  onSave={(newValue) => {
                    handleOptionSave("isVisibleMinority", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityGroup("minority"),
                  )}
                />
              )}
              {!resolvedDisability && (
                <EquityOption
                  option="disability"
                  isAdded={resolvedDisability}
                  onSave={(newValue) => {
                    handleOptionSave("hasDisability", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityGroup("disability"),
                  )}
                />
              )}
            </div>
          ) : (
            <Well>
              <p data-h2-margin="base(0)">
                {intl.formatMessage({
                  defaultMessage:
                    "There are no available employment equity options.",
                  id: "px7yu1",
                  description:
                    "Message displayed when there are no employment equity categories available to be added.",
                })}
              </p>
            </Well>
          )}
        </div>
      </div>
      {isDisabled && (
        <div
          data-h2-position="base(absolute)"
          data-h2-background-color="base(dt-white)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-justify-content="base(center)"
          style={{
            bottom: 0,
            left: 0,
            opacity: 0.6,
            right: 0,
            top: 0,
            zIndex: 2,
          }}
        >
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default EquityOptions;
