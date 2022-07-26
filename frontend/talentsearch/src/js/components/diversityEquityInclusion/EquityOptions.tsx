import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";

import type { Maybe } from "@common/api/generated";

import { getEmploymentEquityStatement } from "@common/constants";
import profileMessages from "../profile/profileMessages";
import Spinner from "../Spinner";
import EquityOption from "./EquityOption";
import type { EquityKeys, UserMutationPromise } from "./types";
import {
  DisabilityDialog,
  IndigenousDialog,
  VisibleMinorityDialog,
  WomanDialog,
} from "./dialogs";

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
  const [hasDisabilityOpen, setDisabilityOpen] = React.useState<boolean>(false);
  const [isIndigenousOpen, setIndigenousOpen] = React.useState<boolean>(false);
  const [isVisibleMinorityOpen, setVisibleMinorityOpen] =
    React.useState<boolean>(false);
  const [isWomanOpen, setWomanOpen] = React.useState<boolean>(false);

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
    <>
      <div data-h2-position="b(relative)" data-h2-margin="b(bottom, l)">
        <div
          style={{ zIndex: 1 }}
          data-h2-position="b(relative)"
          data-h2-flex-grid="m(normal, contained, flush, m)"
        >
          <div data-h2-flex-item="m(1of2)">
            <h3 data-h2-font-size="b(h4)">
              {intl.formatMessage({
                defaultMessage: "My employment equity information:",
                description:
                  "Heading for employment equity categories added to user profile.",
              })}
            </h3>
            {hasItems ? (
              <div data-h2-display="b(flex)" data-h2-flex-direction="b(column)">
                {resolvedWoman && (
                  <EquityOption
                    isAdded
                    onOpen={() => setWomanOpen(true)}
                    title={intl.formatMessage(
                      getEmploymentEquityStatement("woman"),
                    )}
                  />
                )}
                {resolvedIndigenous && (
                  <EquityOption
                    isAdded
                    onOpen={() => setIndigenousOpen(true)}
                    title={intl.formatMessage(
                      getEmploymentEquityStatement("indigenous"),
                    )}
                  />
                )}
                {resolvedMinority && (
                  <EquityOption
                    isAdded
                    onOpen={() => setVisibleMinorityOpen(true)}
                    title={intl.formatMessage(
                      getEmploymentEquityStatement("minority"),
                    )}
                  />
                )}
                {resolvedDisability && (
                  <EquityOption
                    isAdded
                    onOpen={() => setDisabilityOpen(true)}
                    title={intl.formatMessage(
                      getEmploymentEquityStatement("disability"),
                    )}
                  />
                )}
              </div>
            ) : (
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-radius="b(s)"
                data-h2-padding="b(all, m)"
              >
                <p data-h2-margin="b(top-bottom, none)">
                  {intl.formatMessage({
                    defaultMessage:
                      "You have not added any employment equity options to your profile.",
                    description:
                      "Message displayed when a user has no employment equity information.",
                  })}
                </p>
              </div>
            )}
          </div>
          <div data-h2-flex-item="m(1of2)">
            <h3 data-h2-font-size="b(h4)">
              {intl.formatMessage({
                defaultMessage: "Employment equity options:",
                description:
                  "Heading for employment equity categories available to be added to user profile.",
              })}
            </h3>
            {itemsAvailable || !hasItems ? (
              <div data-h2-display="b(flex)" data-h2-flex-direction="b(column)">
                {!hasDisability && (
                  <EquityOption
                    isAdded={false}
                    onOpen={() => setDisabilityOpen(true)}
                    title={intl.formatMessage({
                      defaultMessage: "Persons with disabilities",
                      description:
                        "Title for button to learn more information about disabled equity definition",
                    })}
                  />
                )}
                {!resolvedIndigenous && (
                  <EquityOption
                    isAdded={false}
                    onOpen={() => setIndigenousOpen(true)}
                    title={intl.formatMessage({
                      defaultMessage: "Indigenous Identity",
                      description:
                        "Title for button to learn more information about indigenous equity definition",
                    })}
                  />
                )}
                {!resolvedMinority && (
                  <EquityOption
                    isAdded={false}
                    onOpen={() => setVisibleMinorityOpen(true)}
                    title={intl.formatMessage({
                      defaultMessage: "Member of visible minorities",
                      description:
                        "Title for button to learn more information about visible minority equity definition",
                    })}
                  />
                )}
                {!resolvedWoman && (
                  <EquityOption
                    isAdded={resolvedWoman}
                    onOpen={() => setWomanOpen(true)}
                    title={intl.formatMessage({
                      defaultMessage: "Women",
                      description:
                        "Title for button to learn more information about women equity definition",
                    })}
                  />
                )}
              </div>
            ) : (
              <div
                data-h2-bg-color="b(lightgray)"
                data-h2-radius="b(s)"
                data-h2-padding="b(all, m)"
              >
                <p data-h2-margin="b(top-bottom, none)">
                  {intl.formatMessage({
                    defaultMessage:
                      "There are no available employment equity options.",
                    description:
                      "Message displayed when there are no employment equity categories available to be added.",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
        {isDisabled && (
          <div
            data-h2-position="b(absolute)"
            data-h2-bg-color="b(white)"
            data-h2-display="b(flex)"
            data-h2-align-items="b(center)"
            data-h2-justify-content="b(center)"
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
      <DisabilityDialog
        isAdded={resolvedDisability}
        isOpen={hasDisabilityOpen}
        onDismiss={() => setDisabilityOpen(false)}
        onSave={(newValue: boolean) => {
          handleOptionSave("hasDisability", newValue);
          setDisabilityOpen(false);
        }}
      />
      <IndigenousDialog
        isAdded={resolvedIndigenous}
        isOpen={isIndigenousOpen}
        onDismiss={() => setIndigenousOpen(false)}
        onSave={(newValue: boolean) => {
          handleOptionSave("isIndigenous", newValue);
          setIndigenousOpen(false);
        }}
      />
      <VisibleMinorityDialog
        isAdded={resolvedMinority}
        isOpen={isVisibleMinorityOpen}
        onDismiss={() => setVisibleMinorityOpen(false)}
        onSave={(newValue: boolean) => {
          handleOptionSave("isVisibleMinority", newValue);
          setVisibleMinorityOpen(false);
        }}
      />
      <WomanDialog
        isAdded={resolvedWoman}
        isOpen={isWomanOpen}
        onDismiss={() => setWomanOpen(false)}
        onSave={(newValue: boolean) => {
          handleOptionSave("isWoman", newValue);
          setWomanOpen(false);
        }}
      />
    </>
  );
};

export default EquityOptions;
