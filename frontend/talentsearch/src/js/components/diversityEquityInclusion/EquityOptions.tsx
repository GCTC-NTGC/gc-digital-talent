import React from "react";
import type { Maybe } from "@common/api/generated";
import { useIntl } from "react-intl";

import EquityOption from "./EquityOption";

interface EquityOptionsProps {
  hasDisability?: Maybe<boolean>;
  isIndigenous?: Maybe<boolean>;
  isVisibleMinority?: Maybe<boolean>;
  isWoman?: Maybe<boolean>;
  onAdd: (key: string) => void;
  onRemove: (key: string) => void;
}

const resolveMaybe = (value: Maybe<boolean>): boolean => !!value;

const EquityOptions: React.FC<EquityOptionsProps> = ({
  hasDisability,
  isIndigenous,
  isVisibleMinority,
  isWoman,
  onAdd,
  onRemove,
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
    !!resolvedDisability ||
    !!resolvedIndigenous ||
    !!resolvedMinority ||
    !!resolvedWoman;

  return (
    <div data-h2-flex-grid="m(normal, contained, flush, m)">
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
            {resolvedDisability && (
              <EquityOption
                isAdded
                onOpen={() => {}}
                title={intl.formatMessage({
                  defaultMessage: '"I Identify as a person with a disability"',
                  description:
                    "Title for when someone indicates they have a disability on their profile",
                })}
              />
            )}
            {resolvedIndigenous && (
              <EquityOption
                isAdded
                onOpen={() => {}}
                title={intl.formatMessage({
                  defaultMessage: '"I am Indigenous"',
                  description:
                    "Title for when someone indicates they are indigenous on their profile",
                })}
              />
            )}
            {resolvedMinority && (
              <EquityOption
                isAdded
                onOpen={() => {}}
                title={intl.formatMessage({
                  defaultMessage:
                    '"I Identify as a member of a visible minority"',
                  description:
                    "Title for when someone indicates they are a visible minority on their profile",
                })}
              />
            )}
            {resolvedWoman && (
              <EquityOption
                isAdded
                onOpen={() => {}}
                title={intl.formatMessage({
                  defaultMessage: '"I Identify as a woman"',
                  description:
                    "Title for when someone indicates they are a woman on their profile",
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
        {itemsAvailable ? (
          <div data-h2-display="b(flex)" data-h2-flex-direction="b(column)">
            {!hasDisability && (
              <EquityOption
                isAdded={false}
                onOpen={() => {}}
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
                onOpen={() => {}}
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
                onOpen={() => {}}
                title={intl.formatMessage({
                  defaultMessage: "Member of visible minorities",
                  description:
                    "Title for button to learn more information about visible minority equity definition",
                })}
              />
            )}
            {!resolvedWoman && (
              <EquityOption
                isAdded={false}
                onOpen={() => {}}
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
  );
};

export default EquityOptions;
