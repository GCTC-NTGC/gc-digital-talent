import React from "react";
import { useIntl } from "react-intl";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import { Button, useAnnouncer } from "@gc-digital-talent/ui";
import { formMessages } from "@gc-digital-talent/i18n";

/**
 * Generic button to apply styles to a
 * fieldset action button
 */
const ActionButton = (
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) => (
  <button
    type="button"
    data-h2-border="base(none)"
    data-h2-cursor="base(pointer)"
    data-h2-display="base(flex)"
    data-h2-align-items="base(center)"
    data-h2-padding="base(x.5)"
    data-h2-background-color="base(background) base:hover(gray.lightest) base:focus(focus)"
    {...props}
  />
);

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
  /** Set if the legend should be visually hidden (default: true) */
  hideLegend?: boolean;
  /** Disables deleting, moving and editing fields */
  disabled?: boolean;
  children: React.ReactNode;
}

const Fieldset = ({
  index,
  total,
  legend,
  hideLegend = true,
  onMove,
  onRemove,
  children,
  disabled,
}: RepeaterFieldsetProps) => {
  const intl = useIntl();
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
    <fieldset
      data-h2-background="base(background)"
      data-h2-display="base(flex)"
      data-h2-align-items="base(flex-start)"
      data-h2-gap="base(0, x.25)"
      data-h2-border="base(none)"
    >
      <legend data-h2-visually-hidden="base(hidden)">{legend}</legend>
      <div
        data-h2-flex-grow="base(1)"
        data-h2-padding="base(x1)"
        data-h2-shadow="base(medium)"
        data-h2-radius="base(rounded)"
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
      >
        <div
          data-h2-display="base(flex)"
          data-h2-radius="base(rounded)"
          data-h2-shadow="base(medium)"
          data-h2-flex-direction="base(column)"
          data-h2-align-items="base(center)"
          data-h2-overflow="base(hidden)"
        >
          <ActionButton
            disabled={disabled || index <= 0}
            onClick={decrement}
            aria-label={intl.formatMessage(formMessages.repeaterMove, {
              from: position,
              to: position - 1,
            })}
          >
            <ChevronUpIcon data-h2-width="base(x1)" />
          </ActionButton>
          <span
            aria-hidden="true"
            data-h2-text-align="base(center)"
            data-h2-font-weight="base(700)"
            data-h2-margin="base(x.25, 0)"
          >
            {index + 1}
          </span>
          <ActionButton
            disabled={disabled || index === total - 1}
            onClick={increment}
            aria-label={intl.formatMessage(formMessages.repeaterMove, {
              from: position,
              to: position + 1,
            })}
          >
            <ChevronDownIcon data-h2-width="base(x1)" />
          </ActionButton>
        </div>
        <ActionButton
          disabled={disabled}
          onClick={handleRemove}
          data-h2-shadow="base(medium)"
          data-h2-radius="base(rounded)"
          data-h2-color="base(error) base:focus(black) base:selectors[:disabled](error.3)"
          aria-label={intl.formatMessage(formMessages.repeaterRemove, {
            index: position,
          })}
        >
          <TrashIcon data-h2-width="base(x1)" />
        </ActionButton>
      </div>
    </fieldset>
  );
};

export interface RepeaterProps extends React.HTMLProps<HTMLDivElement> {
  children: React.ReactNode;
  /** Contextual text for the button to add items */
  addText: React.ReactNode;
  /** Additional props to style the add button */
  addButtonProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "children" | "type"
  >;
  /** Callback function when the add button is clicked */
  onAdd: () => void;
  /** Determine if we want to show the add button or not */
  showAdd?: boolean;
}

const Root = ({
  onAdd,
  addText,
  addButtonProps,
  children,
  showAdd = true,
  ...rest
}: RepeaterProps) => {
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5, 0)"
      {...rest}
    >
      {children}
      {showAdd && (
        <Button
          type="button"
          mode="solid"
          block
          color="secondary"
          onClick={onAdd}
          {...addButtonProps}
        >
          {addText}
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
