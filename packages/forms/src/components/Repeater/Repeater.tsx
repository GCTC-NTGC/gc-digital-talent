import { Button, ButtonProps } from "@gc-digital-talent/ui";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import React from "react";

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
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
  children: React.ReactNode;
  legend: React.ReactNode;
  hideLegend?: boolean;
}

const Fieldset = ({
  index,
  total,
  legend,
  hideLegend = true,
  onMove,
  onRemove,
  children,
}: RepeaterFieldsetProps) => {
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
            disabled={index <= 0}
            onClick={() => onMove(index, index - 1)}
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
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
          >
            <ChevronDownIcon data-h2-width="base(x1)" />
          </ActionButton>
        </div>
        <ActionButton
          onClick={onRemove}
          data-h2-shadow="base(medium)"
          data-h2-radius="base(rounded)"
          data-h2-color="base(error) base:focus(black)"
        >
          <TrashIcon data-h2-width="base(x1)" />
        </ActionButton>
      </div>
    </fieldset>
  );
};

export interface RepeaterProps {
  children: React.ReactNode;
  addText: React.ReactNode;
  addButtonProps?: Omit<
    React.ComponentPropsWithoutRef<typeof Button>,
    "children" | "type"
  >;
  onAdd: () => void;
  showAdd?: boolean;
}

const Root = ({
  onAdd,
  addText,
  addButtonProps,
  children,
  showAdd = true,
}: RepeaterProps) => {
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      data-h2-gap="base(x.5, 0)"
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

export default {
  Root,
  Fieldset,
};
