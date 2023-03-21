import React from "react";
import { useIntl } from "react-intl";

import { toast } from "@gc-digital-talent/toast";
import { Well } from "@gc-digital-talent/ui";
import {
  getEmploymentEquityGroup,
  getEmploymentEquityStatement,
} from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";

import profileMessages from "~/messages/profileMessages";
import Spinner from "~/components/Spinner/Spinner";
import type { IndigenousCommunity, Maybe } from "~/api/generated";

import EquityOption from "./EquityOption";
import type { EquityKeys, UserMutationPromise } from "../../types";
import IndigenousEquityOption from "../IndigenousEquityOption";

interface EquityOptionsProps {
  hasDisability?: Maybe<boolean>;
  indigenousCommunities?: Maybe<Array<Maybe<IndigenousCommunity>>>;
  isVisibleMinority?: Maybe<boolean>;
  isWoman?: Maybe<boolean>;
  isDisabled: boolean;
  onAdd: (key: EquityKeys) => UserMutationPromise;
  onRemove: (key: EquityKeys) => UserMutationPromise;
  onUpdate: (key: EquityKeys, value: unknown) => UserMutationPromise;
}

const resolveMaybe = (value: Maybe<boolean>): boolean => !!value;
const resolveMaybeArray = <T,>(value: Maybe<Array<Maybe<T>>>): Array<T> => {
  return value?.filter(notEmpty) ?? [];
};

const EquityOptions = ({
  hasDisability,
  indigenousCommunities,
  isVisibleMinority,
  isWoman,
  onAdd,
  onRemove,
  onUpdate,
  isDisabled,
}: EquityOptionsProps) => {
  const intl = useIntl();

  const resolvedDisability = resolveMaybe(hasDisability);
  const resolvedIndigenousCommunities = resolveMaybeArray(
    indigenousCommunities,
  );
  const resolvedMinority = resolveMaybe(isVisibleMinority);
  const resolvedWoman = resolveMaybe(isWoman);

  const hasItems =
    resolvedDisability ||
    resolvedIndigenousCommunities.length ||
    resolvedMinority ||
    resolvedWoman;

  const itemsAvailable =
    !resolvedDisability ||
    !resolvedIndigenousCommunities.length ||
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

  const handleArraySave = <T,>(key: EquityKeys, value: Array<T>) => {
    const handler = onUpdate;
    handler(key, value)
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
        data-h2-flex-grid="l-tablet(normal, x2)"
      >
        <div data-h2-flex-item="l-tablet(1of2)">
          <h2
            data-h2-font-size="base(h5, 1)"
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
              {resolvedIndigenousCommunities.length ? (
                <IndigenousEquityOption
                  option="indigenous"
                  indigenousCommunities={resolvedIndigenousCommunities}
                  onSave={(newValue) => {
                    handleArraySave("indigenousCommunities", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityStatement("indigenous"),
                  )}
                />
              ) : null}
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
            data-h2-font-size="base(h5, 1)"
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
              {!resolvedIndigenousCommunities.length ? (
                <IndigenousEquityOption
                  option="indigenous"
                  indigenousCommunities={resolvedIndigenousCommunities}
                  onSave={(newValue) => {
                    handleArraySave("indigenousCommunities", newValue);
                  }}
                  title={intl.formatMessage(
                    getEmploymentEquityGroup("indigenous"),
                  )}
                />
              ) : null}
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
          data-h2-background-color="base(background)"
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-justify-content="base(center)"
          data-h2-location="base(x2, -x1, -x1, -x1)"
          data-h2-z-index="base(2)"
        >
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default EquityOptions;
