import { m, useReducedMotion } from "motion/react";
import { useIntl } from "react-intl";
import ArrowDownIcon from "@heroicons/react/20/solid/ArrowDownIcon";
import ArrowUpIcon from "@heroicons/react/20/solid/ArrowUpIcon";
import LockClosedIcon from "@heroicons/react/20/solid/LockClosedIcon";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { formMessages } from "@gc-digital-talent/i18n";

import { useCardRepeaterContext } from "./CardRepeaterProvider";
import { Action, Edit, Remove } from "./Button";

interface ActionsProps {
  children: ReactNode;
}

const Actions = ({ children }: ActionsProps) => (
  <div className="flex items-center justify-center gap-3">{children}</div>
);

const LockedIcon = () => <LockClosedIcon data-h2-width="base(x.75)" />;

const DisabledAction = () => (
  <span
    aria-hidden
    className="block size-6 rounded-full text-center align-middle text-gray"
    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
  >
    &bull;
  </span>
);

export const CARD_CLASS_NAME = "Card__Repeater";

const card = tv({
  base: "rounded-md border-t-12 bg-white p-6 text-black shadow-lg outline-none dark:bg-gray-600 dark:text-white",
  variants: {
    hasError: {
      true: "border-t-error",
      false: "border-t-primary",
    },
  },
});

export interface CardProps {
  index: number;
  children: ReactNode;
  edit?: ReactNode;
  remove?: ReactNode;
  error?: boolean;
  onMove?: (from: number, to: number) => void;
}

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
      className={card({ hasError: !!error, class: CARD_CLASS_NAME })}
      id={`${id}-${item.id}`}
      tabIndex={-1}
    >
      <div className="mb-3 flex w-full items-center justify-between">
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
            <span aria-hidden="true" className="text-center font-bold">
              {position}
            </span>
          )}
          {/* DOWN ARROW */}
          {!disableIncrement ? (
            <Action
              onClick={increment}
              animation={!shouldReduceMotion ? "translate-down" : "none"}
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
