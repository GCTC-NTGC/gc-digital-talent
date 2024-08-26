import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";
import { Fragment, ReactNode } from "react";

import { Color, IconType } from "@gc-digital-talent/ui";

import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";

// some colors are inappropriate for icons
type IconColor = Exclude<Color, "blackFixed" | "white" | "whiteFixed">;

export interface CardOption {
  /** form value */
  value: string;
  /** label beside the icon */
  label: string | ReactNode;
  /** icon when unselected - usually the outline version of the selected icon */
  unselectedIcon: IconType;
  /** icon when selected - usually the solid version of the unselected icon */
  selectedIcon: IconType;
  /** icon color when selected */
  selectedIconColor: IconColor;
}

const siblingIconColor: Record<IconColor, Record<string, string>> = {
  primary: {
    "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](primary.dark)
          base:focus-visible:children[+ label>svg](black)`,
  },
  secondary: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](secondary.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  secondaryDarkFixed: {
    "data-h2-color": `
        base:all:children[+ label>svg](white)
        base:all:selectors[:checked]:children[+ label>svg](secondary.light)
        base:all:focus-visible:children[+ label>svg](black)`,
  },
  tertiary: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](tertiary.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  quaternary: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](quaternary.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  quinary: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](quinary.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  success: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](success.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  warning: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](warning.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  error: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](error.dark)
        base:focus-visible:children[+ label>svg](black)`,
  },
  black: {
    "data-h2-color": `
        base:children[+ label>svg](black)
        base:selectors[:checked]:children[+ label>svg](black)
        base:focus-visible:children[+ label>svg](black)`,
  },
};

export type CardOptionGroupProps = Omit<CommonInputProps, "id" | "label"> &
  HTMLFieldsetProps & {
    /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
    idPrefix: string;
    /** Holds text for the legend associated with the CardOptionGroup fieldset. */
    legend: ReactNode;
    /** A list of value and label representing the CardOptions shown.
     * The form will represent the data at `name` as a string containing the chosen value. */
    items: CardOption[];
    /** If set to the value of an input element that element will start selected */
    defaultSelected?: string;
    /** If true, all input elements in this fieldset will be disabled. */
    disabled?: boolean;
    /** ID of a field description (help text) */
    describedBy?: string;
  };

/**
 * Must be part of a form controlled by react-hook-form.
 * The form will represent the data at `name` as an array, containing the values of the checked boxes.
 */
const CardOptionGroup = ({
  idPrefix,
  legend,
  name,
  items,
  rules = {},
  context,
  defaultSelected,
  trackUnsaved = true,
  describedBy,
  disabled,
  ...rest
}: CardOptionGroupProps) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: idPrefix,
    describedBy,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const selectedValue = watch(name);

  return (
    <Field.Wrapper>
      <Field.Fieldset
        id={idPrefix}
        aria-describedby={ariaDescribedBy}
        {...rest}
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column)"
        data-h2-gap="base(x.25)"
      >
        <Field.Legend
          required={!!rules.required}
          data-h2-color="base(black)"
          data-h2-margin-bottom="base(x.25)"
        >
          {legend}
        </Field.Legend>
        {items.map(
          ({
            value,
            label,
            unselectedIcon,
            selectedIcon,
            selectedIconColor,
          }) => {
            const id = `${idPrefix}-${value}`;
            const isSelected = selectedValue === value;
            const Icon = isSelected ? selectedIcon : unselectedIcon;
            return (
              <Fragment key={value}>
                <input
                  id={id}
                  {...register(name, rules)}
                  value={value}
                  type="radio"
                  disabled={disabled}
                  defaultChecked={defaultSelected === value}
                  // hide the input - this radio group does not show the radio buttons
                  data-h2-position="base(absolute)"
                  data-h2-opacity="base(0)"
                  data-h2-height="base(0)"
                  data-h2-width="base(0)"
                  // style the sibling label when focused and/or checked
                  data-h2-background-color="base:children[+ label](foreground) base:selectors[:checked]:children[+ label](foreground.dark.20) base:focus-visible:children[+ label](focus)"
                  data-h2-font-weight="base:selectors[:checked]:children[+ label](700)"
                  data-h2-border="base:selectors[:checked]:children[+ label](2px solid black)"
                  // color the sibling label's icon when focused and/or checked
                  {...siblingIconColor[selectedIconColor]}
                />
                <Field.Label
                  data-h2-display="base(flex)"
                  data-h2-padding="base(x.5)"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(x.5)"
                  data-h2-shadow="base(large)"
                  data-h2-radius="base(s)"
                  htmlFor={id}
                  data-h2-cursor="base(pointer)"
                  data-h2-color="base(black)"
                  data-h2-font-size="base(body)"
                >
                  <Icon data-h2-height="base(x1)" data-h2-width="base(x1)" />
                  <span>{label}</span>
                </Field.Label>
              </Fragment>
            );
          },
        )}
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ error, context }} />
    </Field.Wrapper>
  );
};

export default CardOptionGroup;
