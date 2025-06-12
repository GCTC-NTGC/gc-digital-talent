import { motion, useReducedMotion } from "motion/react";
import { useIntl } from "react-intl";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { useFormContext } from "react-hook-form";
import { ReactNode, HTMLProps, useId } from "react";
import { tv } from "tailwind-variants";

import { Button, Link, useAnnouncer } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { defaultLogger } from "@gc-digital-talent/logger";

import Field from "../Field";
import { flattenErrors } from "../../utils";
import ActionButton from "./ActionButton";

const innerBounding = tv({
  base: "rounded-md border-t-[12px] shadow-lg",
  variants: {
    hasError: {
      false: "border-primary",
      true: "border-error",
    },
  },
});

export interface RepeaterFieldsetProps {
  /** Field array index of this item */
  index: number;
  /** A string specifying a name for the input control. */
  name: string;
  /** The legend for the fieldset (required but hidden by default) */
  legend: ReactNode;
  /** Set if the legend should be visually hidden (default: false) */
  hideLegend?: boolean;
  children: ReactNode;
  /** Callback function when this item's index is changed' */
  onMove: (from: number, to: number) => void;
  /** Callback when the item is removed from the array */
  onRemove?: (index: number) => void;
  /** All indexes that should be prevented from moving */
  moveDisabledIndexes?: number[];
  /** Whether or not field is last item */
  isLast?: boolean;
}

const MotionFieldset = motion.create(Field.Fieldset);

const Fieldset = ({
  index,
  name,
  legend,
  hideLegend = false,
  onMove,
  onRemove,
  children,
  moveDisabledIndexes = [],
  isLast,
}: RepeaterFieldsetProps) => {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const { announce } = useAnnouncer();

  const {
    formState: { errors },
  } = useFormContext();

  const fieldErrors = flattenErrors(errors);
  const hasError = !!fieldErrors.find((fieldName) =>
    fieldName.includes(`${name}.${index}`),
  );

  // Non-zero index position of the fieldset for humans
  const position = index + 1;
  const disableDecrement =
    index <= 0 || // is the first item
    moveDisabledIndexes.some(
      (disabledIndex) =>
        index === disabledIndex || // is move disabled item
        index - 1 === disabledIndex, // has a move-disabled item previous
    );

  const disableIncrement =
    isLast || // is last item
    moveDisabledIndexes.some(
      (disabledIndex) =>
        index === disabledIndex || // is move disabled item
        index + 1 === disabledIndex, // has a move-disabled item following
    );
  const isMoveDisabled = moveDisabledIndexes.includes(index);
  const handleMove = (from: number, to: number) => {
    onMove(from, to);
    if (announce) {
      announce(
        intl.formatMessage(formMessages.repeaterAnnounceMove, {
          from: position,
          to: to + 1,
        }),
      );
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
      if (announce) {
        announce(
          intl.formatMessage(formMessages.repeaterAnnounceRemove, {
            index: position,
          }),
        );
      }
    } else {
      // eslint-disable-next-line testing-library/no-debugging-utils
      defaultLogger.debug("No onRemove for handler to call.");
    }
  };

  const decrement = () => {
    handleMove(index, index - 1);
  };

  const increment = () => {
    handleMove(index, index + 1);
  };

  return (
    <MotionFieldset
      layout
      transition={
        shouldReduceMotion
          ? {}
          : {
              type: "tween",
              ease: "anticipate",
              duration: 0.4,
            }
      }
    >
      <Field.Legend className="sr-only">{legend}</Field.Legend>
      <Field.BoundingBox flat>
        <div className={innerBounding({ hasError })}>
          <div className="flex flex-col items-start gap-3 bg-white p-6 pt-3 dark:bg-gray-600">
            <div className="flex w-full items-center justify-between">
              <div className="-ml-3 flex items-center justify-center gap-3">
                {!isMoveDisabled ? (
                  <>
                    <ActionButton
                      disabled={disableDecrement}
                      onClick={decrement}
                      icon={ArrowUpIcon}
                      {...(!shouldReduceMotion && {
                        animation: "up",
                      })}
                      aria-label={intl.formatMessage(
                        formMessages.repeaterMove,
                        {
                          from: position,
                          to: position - 1,
                        },
                      )}
                      {...(disableDecrement && { className: "p-3" })}
                    />
                    <span aria-hidden="true" className="text-center font-bold">
                      {index + 1}
                    </span>
                    <ActionButton
                      disabled={disableIncrement}
                      onClick={increment}
                      icon={ArrowDownIcon}
                      {...(!shouldReduceMotion && {
                        animation: "down",
                      })}
                      aria-label={intl.formatMessage(
                        formMessages.repeaterMove,
                        {
                          from: position,
                          to: position + 1,
                        },
                      )}
                    />
                  </>
                ) : (
                  <>
                    <LockClosedIcon className="ml-3 size-4.5" />
                    <span aria-hidden="true" className="text-center font-bold">
                      {index + 1}
                    </span>
                  </>
                )}
              </div>
              <div className="-mr-3 flex items-center">
                {onRemove && (
                  <ActionButton
                    icon={TrashIcon}
                    onClick={handleRemove}
                    aria-label={intl.formatMessage(
                      formMessages.repeaterRemove,
                      {
                        index: position,
                      },
                    )}
                  />
                )}
              </div>
            </div>
            <div className="w-full">
              {
                /** If hideLegend is true, legend will not be shown (but still exists in the legend tag above). */
                !hideLegend && (
                  <p
                    aria-hidden="true"
                    role="presentation"
                    className="mb-3 font-bold text-inherit"
                  >
                    {legend}
                  </p>
                )
              }
              {children}
            </div>
          </div>
        </div>
      </Field.BoundingBox>
    </MotionFieldset>
  );
};

export interface RepeaterProps extends HTMLProps<HTMLDivElement> {
  /** A string specifying a name for the input control. */
  name: string;
  children: ReactNode;
  /** Contextual text for the button to add items */
  addText?: ReactNode;
  /** Callback function when the add button is clicked */
  onAdd?: () => void;
  /** Determine if we want to show the add button or not */
  showAdd?: boolean;
}

const Root = ({
  name,
  onAdd,
  addText,
  children,
  showAdd = true,
  ...rest
}: RepeaterProps) => {
  const intl = useIntl();
  const addId = useId();

  const {
    formState: { errors },
  } = useFormContext();

  // Grab root error message from field errors list
  const hasError = errors?.[name] ? true : undefined;
  const errorMessage = errors?.[name]?.root?.message as string;

  return (
    <div id={`${name}.root`} className="flex flex-col gap-y-1.5" {...rest}>
      <Link
        external
        href={`#${addId}`}
        className="sr-only focus-visible:not-sr-only"
      >
        {intl.formatMessage(formMessages.repeaterSkipTo)}
      </Link>
      {children && <div className="mb-3">{children}</div>}
      {hasError && (
        <Field.Error
          id={name}
          className="mb-3 rounded-md border p-3 text-center text-sm"
        >
          <p className="font-bold">
            {intl.formatMessage(formMessages.repeaterDefaultError)}
          </p>
          {errorMessage && <p className="mt-3">{errorMessage}</p>}
        </Field.Error>
      )}
      {showAdd && (
        <Button
          id={addId}
          icon={PlusCircleIcon}
          type="button"
          mode="placeholder"
          block
          color="primary"
          onClick={onAdd}
        >
          {addText ?? intl.formatMessage(formMessages.repeaterAddItem)}
        </Button>
      )}
    </div>
  );
};

/**
 * @name Repeater
 * @desc A wrapper for repeatable form fields
 */
export default {
  /**
   * @name Root
   * @desc Contains all the parts of a Repeater.
   */
  Root,
  /**
   * @name Fieldset
   * @desc Contains a group of fields that can be repeated.
   */
  Fieldset,
};
