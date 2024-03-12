import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntl } from "react-intl";
import ArrowUpIcon from "@heroicons/react/24/solid/ArrowUpIcon";
import ArrowDownIcon from "@heroicons/react/24/solid/ArrowDownIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import LockClosedIcon from "@heroicons/react/24/solid/LockClosedIcon";
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon";
import { useFormContext } from "react-hook-form";
import isEqual from "lodash/isEqual";

import { Button, Link, Well, useAnnouncer } from "@gc-digital-talent/ui";
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
  /** Current total number of fields (eg: fields.length) */
  total: number;
  /** The legend for the fieldset (required but hidden by default) */
  legend: React.ReactNode;
  /** Set if the legend should be visually hidden (default: false) */
  hideLegend?: boolean;
  /** Disables removing, moving and editing fields */
  disabled?: boolean;
  children: React.ReactNode;
  /** Callback function when this item's index is changed' */
  onMove: (from: number, to: number) => void;
  /** Callback when the item is removed from the array */
  onRemove?: (index: number) => void;
  /** Callback function when edit button is clicked */
  onEdit?: (index: number) => void;
  /** All indexes that should be prevented from moving */
  moveDisabledIndexes?: Array<number>;
  /** Disables editing the item */
  editDisabled?: boolean;
  /** Disables removing the item */
  removeDisabled?: boolean;
}

const MotionFieldset = motion(Field.Fieldset);

const Fieldset = ({
  index,
  name,
  total,
  legend,
  hideLegend = false,
  onMove,
  onRemove,
  children,
  disabled: fieldSetDisabled,
  onEdit,
  moveDisabledIndexes = [],
  editDisabled = false,
  removeDisabled = false,
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
    fieldSetDisabled || // the whole fieldset is disabled
    index <= 0 || // is the first item
    moveDisabledIndexes.some(
      (disabledIndex) =>
        index === disabledIndex || // is move disabled item
        index - 1 === disabledIndex, // has a move-disabled item previous
    );

  const disableIncrement =
    fieldSetDisabled || // the whole fieldset is disabled
    index === total - 1 || // is the last item
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
      defaultLogger.debug("No onRemove for handler to call.");
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(index);
  };

  const decrement = () => {
    handleMove(index, index - 1);
  };

  const increment = () => {
    handleMove(index, index + 1);
  };

  // replaces a button when it should be disabled.
  const disabledIcon = (
    <span data-h2-color="base(gray)" aria-hidden data-h2-width="base(x.75)">
      &bull;
    </span>
  );

  // edit button might be custom or default or null
  const showDisabledEditButton = fieldSetDisabled || editDisabled;
  let editButton: React.ReactNode = null;
  if (onEdit) {
    // no custom button, but we have a handler so show the default button
    editButton = (
      <ActionButton
        disabled={showDisabledEditButton}
        onClick={handleEdit}
        aria-label={intl.formatMessage(formMessages.repeaterEdit, {
          index: position,
        })}
      >
        <PencilSquareIcon data-h2-width="base(x.75)" />
      </ActionButton>
    );
  }

  // remove button might be custom or default or null
  const showDisabledRemoveButton = fieldSetDisabled || removeDisabled;
  let removeButton: React.ReactNode = null;
  if (onRemove) {
    // no custom button, but we have a handler so show the default button
    removeButton = (
      <ActionButton
        disabled={showDisabledRemoveButton}
        onClick={handleRemove}
        aria-label={intl.formatMessage(formMessages.repeaterRemove, {
          index: position,
        })}
      >
        <TrashIcon data-h2-width="base(x.75)" />
      </ActionButton>
    );
  }
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
                    {/* UP ARROW */}
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
                    {/* INDEX */}
                    <span
                      aria-hidden="true"
                      data-h2-text-align="base(center)"
                      data-h2-font-weight="base(700)"
                    >
                      {index + 1}
                    </span>
                    {/* DOWN ARROW */}
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
                {editButton}
                {removeButton}
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

export interface RepeaterProps extends React.HTMLProps<HTMLDivElement> {
  /** A string specifying a name for the input control. */
  name: string;
  children: React.ReactNode;
  /** Contextual text for the button to add items */
  addText?: React.ReactNode;
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
  showUnsavedChanges?: boolean;
  showApproachingLimit?: boolean;
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
  children,
  showAdd = true,
  maxItems,
  total,
  customButton,
  showUnsavedChanges,
  showApproachingLimit,
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
    showUnsavedChanges &&
    (isDirty ||
      (changedItems?.length && currentItems.length !== originalItems?.length));

  // Grab root error message from field errors list
  const hasError = errors?.[name] ? true : undefined;
  const errorMessage = errors?.[name]?.root?.message as string;

  const approachingLimit =
    showApproachingLimit && maxItems ? total + 1 === maxItems : false;

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
          data-h2-margin-bottom="base(x.5)"
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
          data-h2-margin-bottom="base(x.5)"
          data-h2-text-align="base(center)"
          data-h2-color="base(black)"
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
          {errorMessage && (
            <p data-h2-margin-top="base(x.5)">
              {customErrorMessage ?? errorMessage}
            </p>
          )}
        </Field.Error>
      )}
      {total === maxItems && maxItemsMessage && <Well>{maxItemsMessage}</Well>}
      {hasUnsavedChanges ? (
        <Well
          data-h2-margin-bottom="base(x.5)"
          data-h2-text-align="base(center)"
          data-h2-color="base(black)"
        >
          {intl.formatMessage(formMessages.repeaterUnsavedChanges)}
        </Well>
      ) : null}
      {showAdd && !customButton ? (
        <Button
          id={addId}
          icon={PlusCircleIcon}
          type="button"
          mode="placeholder"
          block
          color="secondary"
          onClick={onAdd}
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
