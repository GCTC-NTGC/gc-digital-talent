import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntl } from "react-intl";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import { FieldError, FieldErrors, useFormContext } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { Button, Link, Well, useAnnouncer } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

import Field from "../Field";

/**
 * Generic button to apply styles to a
 * fieldset action button
 */
const ActionButton = ({
  decrement = false,
  animate = true,
  disabled,
  ...rest
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  decrement?: boolean;
  animate?: boolean;
}) => {
  const transform = decrement
    ? {
        "data-h2-transform":
          "base:children[svg](translateY(0%)) base:hover:children[svg](translateY(-20%)) base:focus-visible:children[svg](translateY(-20%))",
      }
    : {
        "data-h2-transform":
          "base:children[svg](translateY(0%)) base:hover:children[svg](translateY(20%)) base:focus-visible:children[svg](translateY(20%))",
      };
  return (
    <button
      type="button"
      data-h2-border="base(none)"
      data-h2-radius="base(50%)"
      data-h2-cursor="base(pointer)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(x.5)"
      data-h2-background-color="base(background) base:hover(gray.lightest) base:focus(focus)"
      data-h2-transition="base:children[svg](transform 200ms ease)"
      {...(disabled
        ? { disabled: true, "data-h2-color": "base(black.lightest)" }
        : {
            "data-h2-color": "base(black)",
            ...(animate ? transform : {}),
          })}
      {...rest}
    />
  );
};

export interface RepeaterFieldsetProps {
  /** Field array index of this item */
  index: number;
  /** A string specifying a name for the input control. */
  name: string;
  /** Current total number of fields (eg: fields.length) */
  total: number;
  /** The legend for the fieldset (required but hidden by default) */
  legend: React.ReactNode;
  /** Set if the legend should be visually hidden (default: false) */
  hideLegend?: boolean;
  /** Set if the fieldset index is displayed to the user (default: false) */
  hideIndex?: boolean;
  /** Disables deleting, moving and editing fields */
  disabled?: boolean;
  /** Locks item position (removes append and decrement actions) */
  numOfLockedItems?: number;
  children: React.ReactNode;
  /** Callback function when this item's index is changed' */
  onMove: (from: number, to: number) => void;
  /** Callback when the item is removed from the array */
  onRemove: (index: number) => void;
}

const MotionFieldset = motion(Field.Fieldset);

const Fieldset = ({
  index,
  name,
  total,
  legend,
  hideLegend = false,
  hideIndex = false,
  onMove,
  onRemove,
  children,
  disabled,
  numOfLockedItems,
}: RepeaterFieldsetProps) => {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const { announce } = useAnnouncer();

  const {
    formState: { errors, isDirty },
  } = useFormContext();

  const fieldErrors = errors[name] as FieldErrors<{
    [key: string]: FieldError;
  }>;
  const hasError = useMemo(() => {
    if (fieldErrors && isDirty) {
      return (
        Object.keys(fieldErrors).includes(`${index}`) && fieldErrors[index]
      );
    }
    return false;
  }, [fieldErrors, index, isDirty]);

  // Non-zero index position of the fieldset for humans
  const position = index + 1;
  const isFirstItem = disabled || index <= 0;
  const isLastItem = disabled || index === total - 1;

  const isLocked = numOfLockedItems ? index + 1 <= numOfLockedItems : false;
  const previousItemLocked = numOfLockedItems
    ? numOfLockedItems + 1 === index + 1
    : false;

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
    onRemove(index);
    if (announce) {
      announce(
        intl.formatMessage(formMessages.repeaterAnnounceRemove, {
          index: position,
        }),
      );
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
            data-h2-margin="base(x.5 x1 x1 x1)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-align-items="base(flex-start)"
          >
            <div
              data-h2-display="base(flex)"
              data-h2-justify-content="base(space-between)"
              data-h2-width="base(100%)"
              data-h2-margin-bottom="base(x.5)"
            >
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-margin-left="base(-x.5)"
              >
                {!isLocked ? (
                  <>
                    <ActionButton
                      disabled={isFirstItem || previousItemLocked}
                      onClick={decrement}
                      decrement
                      animate={!shouldReduceMotion}
                      aria-label={intl.formatMessage(
                        formMessages.repeaterMove,
                        {
                          from: position,
                          to: position - 1,
                        },
                      )}
                      data-h2-font-weight="base(700)"
                      data-h2-margin="base(0, x.25, 0, 0)"
                      {...(isFirstItem
                        ? { "data-h2-padding-left": "base(x.25)" }
                        : {})}
                    >
                      {!isFirstItem && !previousItemLocked ? (
                        <ArrowUpIcon data-h2-width="base(x.75)" />
                      ) : (
                        <div data-h2-width="base(x.75)">
                          <p data-h2-padding-bottom="base(x.25)">.</p>
                        </div>
                      )}
                    </ActionButton>
                    {!hideIndex && (
                      <span
                        aria-hidden="true"
                        data-h2-text-align="base(center)"
                        data-h2-font-weight="base(700)"
                        data-h2-margin="base(x.25, 0)"
                      >
                        {index + 1}
                      </span>
                    )}
                    <ActionButton
                      disabled={isLastItem}
                      onClick={increment}
                      animate={!shouldReduceMotion}
                      aria-label={intl.formatMessage(
                        formMessages.repeaterMove,
                        {
                          from: position,
                          to: position + 1,
                        },
                      )}
                      data-h2-font-weight="base(700)"
                      data-h2-margin="base(0, x.25)"
                    >
                      {!isLastItem ? (
                        <ArrowDownIcon data-h2-width="base(x.75)" />
                      ) : (
                        <div data-h2-width="base(x.75)">
                          <p data-h2-padding-bottom="base(x.25)">.</p>
                        </div>
                      )}
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <LockClosedIcon
                      data-h2-margin="base(0, x.5)"
                      data-h2-width="base(x.75)"
                    />
                    {!hideIndex && (
                      <span
                        aria-hidden="true"
                        data-h2-text-align="base(center)"
                        data-h2-font-weight="base(700)"
                        data-h2-margin="base(x.25, 0)"
                      >
                        {index + 1}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-margin-right="base(-x.5)"
              >
                <ActionButton
                  disabled={disabled || isLocked}
                  animate={false}
                  onClick={handleRemove}
                  aria-label={intl.formatMessage(formMessages.repeaterRemove, {
                    index: position,
                  })}
                >
                  <TrashIcon data-h2-width="base(x.75)" />
                </ActionButton>
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
                    data-h2-font-weight="base(800)"
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

export interface RepeaterProps extends React.HTMLProps<HTMLDivElement> {
  /** A string specifying a name for the input control. */
  name: string;
  /** Determine if it should track unsaved changes and render it */
  trackUnsaved?: boolean;
  children: React.ReactNode;
  /** Contextual text for the button to add items */
  addText?: React.ReactNode;
  /** Additional props to style the add button */
  addButtonProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "children" | "type"
  >;
  /** Current total number of fields (eg: fields.length) */
  total: number;
  /* Maximum number of items */
  maxItems?: number;
  /** Callback function when the add button is clicked */
  onAdd?: () => void;
  /** Determine if we want to show the add button or not */
  showAdd?: boolean;
  customButton?: {
    button: React.ReactNode;
    id: string;
  };
  /** Custom error message that overrides default root error message */
  customErrorMessage?: React.ReactNode;
  /** Custom null message when no items have been added */
  customNullMessage?: React.ReactNode;
  /** Max items message when maximum amount of items have been added */
  maxItemsMessage?: React.ReactNode;
}

const Root = ({
  name,
  onAdd,
  addText,
  addButtonProps,
  children,
  showAdd = true,
  maxItems,
  total,
  customButton,
  customErrorMessage,
  customNullMessage,
  maxItemsMessage,
  ...rest
}: RepeaterProps) => {
  const intl = useIntl();
  const addId = React.useId();

  const {
    formState: { errors, defaultValues, isDirty },
    watch,
  } = useFormContext();

  // Check if any changes have been made to repeater length or repeater items.
  const originalItems = defaultValues?.[name];
  const currentItems = watch(name);

  const changedItems = originalItems?.filter(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (original: any, index: string | number) => {
      const current = currentItems[index];
      return !current || !isEqual(original, current);
    },
  );
  const hasUnsavedChanges =
    isDirty ||
    (changedItems?.length && currentItems.length !== originalItems?.length);

  // Grab root error message from field errors list
  const hasError = errors?.[name] ? true : undefined;
  const errorMessage = errors?.[name]?.root?.message as string;

  const approachingLimit = maxItems ? total + 1 === maxItems : false;

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.25, 0)"
      {...rest}
    >
      <Link
        external
        href={`#${customButton?.id ?? addId}`}
        data-h2-visually-hidden="base(invisible)"
        data-h2-position="base:focus-visible(static)"
        data-h2-location="base:focus-visible(auto)"
        data-h2-height="base:focus-visible(auto)"
        data-h2-width="base:focus-visible(auto)"
      >
        {intl.formatMessage(formMessages.repeaterSkipTo)}
      </Link>
      {children && <div data-h2-margin-bottom="base(x.5)">{children}</div>}
      {approachingLimit && (
        <Well
          data-h2-margin-bottom="base(x1)"
          data-h2-text-align="base(center)"
        >
          <p data-h2-font-weight="base(700)" data-h2-margin-bottom="base(x.5)">
            {intl.formatMessage(formMessages.approachingLimit)}
          </p>
          <p>{intl.formatMessage(formMessages.approachingLimitDetails)}</p>
        </Well>
      )}
      {total === 0 && (
        <Well
          data-h2-margin-bottom="base(x1)"
          data-h2-text-align="base(center)"
        >
          {customNullMessage ?? (
            <>
              <p
                data-h2-font-weight="base(700)"
                data-h2-margin-bottom="base(x.5)"
              >
                {intl.formatMessage(formMessages.repeaterNull)}
              </p>
              <p>{intl.formatMessage(formMessages.repeaterNullDetails)}</p>
            </>
          )}
        </Well>
      )}
      {hasError && (
        <Field.Error id={name} data-h2-padding="base(0)">
          <Well
            data-h2-text-align="base(center)"
            data-h2-margin-bottom="base(x1)"
          >
            <p data-h2-font-weight="base(700)">
              {intl.formatMessage(formMessages.repeaterDefaultError)}
            </p>
            {errorMessage && (
              <p data-h2-margin-top="base(x.5)">
                {customErrorMessage ?? errorMessage}
              </p>
            )}
          </Well>
        </Field.Error>
      )}
      {total === maxItems && maxItemsMessage && <Well>{maxItemsMessage}</Well>}
      {hasUnsavedChanges ? (
        <Well data-h2-margin-bottom="base(x1)">
          {intl.formatMessage(formMessages.repeaterUnsavedChanges)}
        </Well>
      ) : null}
      {showAdd && !customButton ? (
        <Button
          id={addId}
          icon={PlusCircleIcon}
          type="button"
          mode="solid"
          block
          color="secondary"
          onClick={onAdd}
          {...(addButtonProps?.disabled
            ? {
                "data-h2-background": "base(background)",
                "data-h2-border-style": "base(dashed)",
                "data-h2-border-color": "base(gray.dark)",
                "data-h2-color": "base(gray.dark)",
              }
            : {
                "data-h2-background":
                  "base(background) base:hover(secondary.10) base:focus-visible(focus)",
                "data-h2-border-style":
                  "base(dashed) base:focus-visible(solid)",
                "data-h2-border-color":
                  "base(secondary.darker) base:focus-visible(focus)",
                "data-h2-color":
                  "base(secondary.darker) base:focus-visible(black)",
              })}
          {...addButtonProps}
        >
          {maxItems && total === maxItems ? (
            <>{intl.formatMessage(formMessages.repeaterDeleteItem)}</>
          ) : (
            addText || intl.formatMessage(formMessages.repeaterAddItem)
          )}{" "}
          {maxItems && `(${total}/${maxItems})`}
        </Button>
      ) : (
        customButton?.button
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
