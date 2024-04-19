import React from "react";
import { m, useReducedMotion } from "framer-motion";
import { useIntl } from "react-intl";
import ArrowDownIcon from "@heroicons/react/20/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/20/solid/ArrowUpIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";

import { formMessages } from "@gc-digital-talent/i18n";

import { useCardRepeaterContext } from "./CardRepeaterProvider";
import { Action, Edit, Remove } from "./Button";

type ActionsProps = {
  children: React.ReactNode;
};

const Actions = ({ children }: ActionsProps) => (
  <div
    className="flex"
    data-h2-align-items="base(center)"
    data-h2-justify-content="base(center)"
    data-h2-gap="base(x.5)"
  >
    {children}
  </div>
);

const LockedIcon = () => <LockClosedIcon data-h2-width="base(x.75)" />;

const DisabledAction = () => (
  <span
    aria-hidden
    className="block"
    data-h2-color="base(gray)"
    data-h2-height="base(x.975)"
    data-h2-radius="base(100%)"
    data-h2-width="base(x.975)"
    data-h2-text-align="base(center)"
    data-h2-vertical-align="base(middle)"
  >
    &bull;
  </span>
);

export const CARD_CLASS_NAME = "Card__Repeater";

export type CardProps = {
  index: number;
  children: React.ReactNode;
  edit?: React.ReactNode;
  remove?: React.ReactNode;
  error?: boolean;
  onMove?: (from: number, to: number) => void;
};

const Card = ({ index, edit, remove, error, onMove, children }: CardProps) => {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const {
    move,
    total,
    items,
    id,
    hideIndex,
    disabled,
    moveDisabledIndexes,
    editDisabledIndexes,
    removeDisabledIndexes,
  } = useCardRepeaterContext();
  const item = items?.[index];
  if (!item) return null;

  const position = index + 1;
  const isFirst = index === 0;
  const isLast = index === items.length - 1;
  const lockDecrement = moveDisabledIndexes?.includes(index);
  const isEditDisabled = disabled || editDisabledIndexes?.includes(index);
  const isRemoveDisabled = disabled || removeDisabledIndexes?.includes(index);
  const disableDecrement =
    disabled || // Whole repeater is disabled
    isFirst ||
    moveDisabledIndexes?.some(
      (disabledIndex) =>
        index === disabledIndex || // is move disabled item
        index - 1 === disabledIndex, // has a move-disabled item previous
    );
  const disableIncrement =
    disabled || // Whole repeater is disabled
    isLast ||
    total <= 1 || // Last item
    moveDisabledIndexes?.some(
      (disabledIndex) =>
        index === disabledIndex || // is move disabled item
        index + 1 === disabledIndex, // has a move-disabled item following
    );

  const handleMove = (from: number, to: number) => {
    move(from, to);
    onMove?.(from, to);
  };

  const decrement = () => {
    const to = index - 1;
    handleMove(index, to < 0 ? 0 : to);
  };

  const increment = () => {
    const to = index + 1;
    handleMove(index, to > total ? total : to);
  };

  let DisabledDecrementAction = DisabledAction;
  if (lockDecrement) {
    DisabledDecrementAction = LockedIcon;
  }

  return (
    <m.li
      layout
      transition={
        shouldReduceMotion
          ? {}
          : {
              type: "tween",
              ease: "circInOut",
              duration: 0.4,
            }
      }
      className={CARD_CLASS_NAME}
      id={`${id}-${item.id}`}
      tabIndex={-1}
      data-h2-background-color="base(foreground)"
      data-h2-color="base(black)"
      data-h2-padding="base(x1)"
      data-h2-shadow="base(medium)"
      data-h2-radius="base(s)"
      data-h2-outline="base(none)"
      data-h2-border-top="base(x.5 solid secondary)"
      {...(!error
        ? {
            "data-h2-border-color": "base(secondary) base:focus-visible(focus)",
          }
        : {
            "data-h2-border-color": "base(error) base:focus-visible(focus)",
          })}
    >
      <div
        data-h2-align-items="base(center)"
        className="flex"
        data-h2-justify-content="base(space-between)"
        data-h2-margin-bottom="base(x.5)"
        data-h2-width="base(100%)"
      >
        <Actions>
          {/* UP ARROW */}
          {!(disableDecrement || disabled) ? (
            <Action
              onClick={decrement}
              animation={!shouldReduceMotion ? "translate-up" : "none"}
              icon={ArrowUpIcon}
              aria-label={intl.formatMessage(formMessages.repeaterMove, {
                from: position,
                to: position - 1,
              })}
            />
          ) : (
            <DisabledDecrementAction />
          )}
          {/* INDEX */}
          {!hideIndex && (
            <span
              aria-hidden="true"
              data-h2-text-align="base(center)"
              className="font-bold"
            >
              {position}
            </span>
          )}
          {/* DOWN ARROW */}
          {!disableIncrement ? (
            <Action
              onClick={increment}
              animation={!shouldReduceMotion ? "translate-up" : "none"}
              icon={ArrowDownIcon}
              aria-label={intl.formatMessage(formMessages.repeaterMove, {
                from: position,
                to: position + 1,
              })}
            />
          ) : (
            <DisabledAction />
          )}
        </Actions>
        <Actions>
          {isEditDisabled && edit ? (
            <Edit
              disabled
              aria-label={intl.formatMessage(formMessages.repeaterEdit, {
                index: position,
              })}
            />
          ) : (
            edit
          )}
          {isRemoveDisabled && remove ? (
            <Remove
              disabled
              aria-label={intl.formatMessage(formMessages.repeaterRemove, {
                index: position,
              })}
            />
          ) : (
            remove
          )}
        </Actions>
      </div>
      {children}
    </m.li>
  );
};

export default Card;
