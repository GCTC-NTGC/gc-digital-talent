import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntl } from "react-intl";
import ChevronUpIcon from "@heroicons/react/24/solid/ChevronUpIcon";
import ChevronDownIcon from "@heroicons/react/24/solid/ChevronDownIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";

import { Button, Link, useAnnouncer } from "@gc-digital-talent/ui";
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
      data-h2-cursor="base(pointer)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(center)"
      data-h2-padding="base(x.5)"
      data-h2-background-color="base(foreground) base:hover(gray.lightest) base:focus(focus)"
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
  /** Current total number of fields (eg: fields.length) */
  total: number;
  /** Callback function when this item's index is changed' */
  onMove: (from: number, to: number) => void;
  /** Callback when the item is removed from the array */
  onRemove: (index: number) => void;
  /** The legend for the fieldset (required but hidden by default) */
  legend: React.ReactNode;
  /** Set if the legend should be visually hidden (default: false) */
  hideLegend?: boolean;
  /** Set if the fieldset index is displayed to the user (default: false) */
  hideIndex?: boolean;
  /** Disables deleting, moving and editing fields */
  disabled?: boolean;
  children: React.ReactNode;
}

const MotionFieldset = motion(Field.Fieldset);

const Fieldset = ({
  index,
  total,
  legend,
  hideLegend = false,
  hideIndex = false,
  onMove,
  onRemove,
  children,
  disabled,
}: RepeaterFieldsetProps) => {
  const intl = useIntl();
  const shouldReduceMotion = useReducedMotion();
  const { announce } = useAnnouncer();
  // Non-zero index position of the fieldset for humans
  const position = index + 1;

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
          data-h2-display="base(flex)"
          data-h2-align-items="base(flex-start)"
          data-h2-gap="base(0, x.25)"
        >
          <div
            data-h2-background-color="base(foreground)"
            data-h2-flex-grow="base(1)"
            data-h2-padding="base(x1)"
            data-h2-shadow="base(medium)"
            data-h2-radius="base(s)"
            data-h2-order="base(2)"
          >
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
          <div
            data-h2-flex-shrink="base(0)"
            data-h2-display="base(flex)"
            data-h2-flex-direction="base(column)"
            data-h2-gap="base(x.25, 0)"
            data-h2-order="base(1)"
          >
            <div
              data-h2-background-color="base(foreground)"
              data-h2-display="base(flex)"
              data-h2-radius="base(s)"
              data-h2-shadow="base(medium)"
              data-h2-flex-direction="base(column)"
              data-h2-align-items="base(center)"
              data-h2-overflow="base(hidden)"
            >
              <ActionButton
                disabled={disabled || index <= 0}
                onClick={decrement}
                decrement
                animate={!shouldReduceMotion}
                aria-label={intl.formatMessage(formMessages.repeaterMove, {
                  from: position,
                  to: position - 1,
                })}
              >
                <ChevronUpIcon data-h2-width="base(x1)" />
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
                disabled={disabled || index === total - 1}
                onClick={increment}
                animate={!shouldReduceMotion}
                aria-label={intl.formatMessage(formMessages.repeaterMove, {
                  from: position,
                  to: position + 1,
                })}
              >
                <ChevronDownIcon data-h2-width="base(x1)" />
              </ActionButton>
            </div>
            <ActionButton
              data-h2-background-color="base(foreground)"
              disabled={disabled}
              animate={false}
              onClick={handleRemove}
              data-h2-shadow="base(medium)"
              data-h2-radius="base(s)"
              data-h2-color="base(error) base:focus(black) base:selectors[:disabled](error.3)"
              aria-label={intl.formatMessage(formMessages.repeaterRemove, {
                index: position,
              })}
            >
              <TrashIcon data-h2-width="base(x1)" />
            </ActionButton>
          </div>
        </div>
      </Field.BoundingBox>
    </MotionFieldset>
  );
};

export interface RepeaterProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  /** Contextual text for the button to add items */
  addText?: React.ReactNode;
  /** Additional props to style the add button */
  addButtonProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "children" | "type"
  >;
  /** Callback function when the add button is clicked */
  onAdd?: () => void;
  /** Determine if we want to show the add button or not */
  showAdd?: boolean;
  customButton?: {
    button: React.ReactNode;
    id: string;
  };
}

const Root = ({
  onAdd,
  addText,
  addButtonProps,
  children,
  showAdd = true,
  customButton,
  ...rest
}: RepeaterProps) => {
  const intl = useIntl();
  const addId = React.useId();

  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5, 0)"
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
      {children}
      {showAdd && !customButton ? (
        <Button
          id={addId}
          icon={PlusCircleIcon}
          type="button"
          mode="placeholder"
          block
          color="secondary"
          onClick={onAdd}
          {...addButtonProps}
        >
          {addText}
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
