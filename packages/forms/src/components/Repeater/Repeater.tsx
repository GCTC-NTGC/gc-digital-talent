import { motion, useReducedMotion } from "motion/react";
import { useIntl } from "react-intl";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { useFormContext } from "react-hook-form";
import { ReactNode, HTMLProps, useId } from "react";

import { Button, Link, useAnnouncer } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";
import { defaultLogger } from "@gc-digital-talent/logger";

import Field from "../Field";
import { flattenErrors } from "../../utils";
import ActionButton from "./ActionButton";

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

  // replaces a button when it should be disabled.
  const disabledIcon = (
    // eslint-disable-next-line formatjs/no-literal-string-in-jsx
    <span data-h2-color="base(gray)" aria-hidden data-h2-width="base(x.75)">
      &bull;
    </span>
  );

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
      <Field.Legend data-h2-visually-hidden="base(invisible)">
        {legend}
      </Field.Legend>
      <Field.BoundingBox flat>
        <div
          {...(!hasError
            ? { "data-h2-border-top": "base(x.5 solid secondary)" }
            : { "data-h2-border-top": "base(x.5 solid error)" })}
          data-h2-shadow="base(medium)"
          data-h2-radius="base(s)"
        >
          <div
            data-h2-padding="base(x.5, x1, x1, x1)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.5)"
            data-h2-background-color="base(foreground)"
          >
            <div
              data-h2-background-color="base(foreground)"
              data-h2-display="base(flex)"
              data-h2-justify-content="base(space-between)"
              data-h2-align-items="base(center)"
              data-h2-width="base(100%)"
            >
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-margin-left="base(-x.5)"
                data-h2-justify-content="base(center)"
                data-h2-gap="base(x.5)"
              >
                {!isMoveDisabled ? (
                  <>
                    <ActionButton
                      disabled={disableDecrement}
                      onClick={decrement}
                      animation={!shouldReduceMotion ? "translate-up" : "none"}
                      aria-label={intl.formatMessage(
                        formMessages.repeaterMove,
                        {
                          from: position,
                          to: position - 1,
                        },
                      )}
                      {...(disableDecrement
                        ? { "data-h2-padding-left": "base(x.25)" }
                        : {})}
                    >
                      {!disableDecrement ? (
                        <ArrowUpIcon data-h2-width="base(x.75)" />
                      ) : (
                        disabledIcon
                      )}
                    </ActionButton>
                    <span
                      aria-hidden="true"
                      data-h2-text-align="base(center)"
                      data-h2-font-weight="base(700)"
                    >
                      {index + 1}
                    </span>
                    <ActionButton
                      disabled={disableIncrement}
                      onClick={increment}
                      animation={
                        !shouldReduceMotion ? "translate-down" : "none"
                      }
                      aria-label={intl.formatMessage(
                        formMessages.repeaterMove,
                        {
                          from: position,
                          to: position + 1,
                        },
                      )}
                    >
                      {!disableIncrement ? (
                        <ArrowDownIcon data-h2-width="base(x.75)" />
                      ) : (
                        disabledIcon
                      )}
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <LockClosedIcon
                      data-h2-margin-left="base(x.5)"
                      data-h2-width="base(x.75)"
                    />
                    <span
                      aria-hidden="true"
                      data-h2-text-align="base(center)"
                      data-h2-font-weight="base(700)"
                    >
                      {index + 1}
                    </span>
                  </>
                )}
              </div>
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-margin-right="base(-x.5)"
              >
                {onRemove && (
                  <ActionButton
                    onClick={handleRemove}
                    aria-label={intl.formatMessage(
                      formMessages.repeaterRemove,
                      {
                        index: position,
                      },
                    )}
                  >
                    <TrashIcon data-h2-width="base(x.75)" />
                  </ActionButton>
                )}
              </div>
            </div>
            <div data-h2-width="base(100%)">
              {
                /** If hideLegend is true, legend will not be shown (but still exists in the legend tag above). */
                !hideLegend && (
                  <p
                    aria-hidden="true"
                    role="presentation"
                    data-h2-margin="base(0, 0, x.5, 0)"
                    data-h2-color="base(inherit)"
                    data-h2-font-weight="base(700)"
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
    <div
      id={`${name}.root`}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.25, 0)"
      {...rest}
    >
      <Link
        external
        href={`#${addId}`}
        data-h2-visually-hidden="base(invisible)"
        data-h2-position="base:focus-visible(static)"
        data-h2-location="base:focus-visible(auto)"
        data-h2-height="base:focus-visible(auto)"
        data-h2-width="base:focus-visible(auto)"
      >
        {intl.formatMessage(formMessages.repeaterSkipTo)}
      </Link>
      {children && <div data-h2-margin-bottom="base(x.5)">{children}</div>}
      {hasError && (
        <Field.Error
          id={name}
          data-h2-border-style="base(solid)"
          data-h2-border-width="base(1px)"
          data-h2-font-size="base(caption)"
          data-h2-padding="base(x.5)"
          data-h2-radius="base(rounded)"
          data-h2-text-align="base(center)"
          data-h2-margin-bottom="base(x.5)"
        >
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage(formMessages.repeaterDefaultError)}
          </p>
          {errorMessage && <p data-h2-margin-top="base(x.5)">{errorMessage}</p>}
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
