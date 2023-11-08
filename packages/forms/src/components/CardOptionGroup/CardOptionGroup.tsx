import * as React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import { Color, IconType } from "@gc-digital-talent/ui";

import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";

export type CardOption = {
  value: string;
  label: string | React.ReactNode;
  unselectedIcon: IconType;
  selectedIcon: IconType;
  selectedIconColor: Color;
};

const getIconStyle = (color: Color): Record<string, string> => {
  if (color === "primary") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](primary.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "secondary") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](secondary.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "tertiary") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](tertiary.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "quaternary") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](quaternary.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "quinary") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](quinary.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "success") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](success.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "warning") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](warning.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "error") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](error.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "black") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](black.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }
  if (color === "white") {
    return {
      "data-h2-color": `
          base:children[+ label>svg](black)
          base:selectors[:checked]:children[+ label>svg](white.dark)
          base:focus-visible:children[+ label>svg](black)`,
    };
  }

  return {
    "data-h2-color": `
      base:children[+ label>svg](black)
      base:selectors[:checked]:children[+ label>svg](black.dark)
      base:focus-visible:children[+ label>svg](black)`,
  };
};

export type CardOptionGroupProps = Omit<CommonInputProps, "id" | "label"> &
  HTMLFieldsetProps & {
    /** Each input element will be given an id to match to its label, of the form `${idPrefix}-${value}` */
    idPrefix: string;
    /** Holds text for the legend associated with the CardOptionGroup fieldset. */
    legend: React.ReactNode;
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
      >
        <Field.Legend
          required={!!rules.required}
          data-h2-color="base(black)"
          data-h2-margin-bottom="base(x.5)"
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
              <div key={value}>
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
                  data-h2-background-color="base:focus-visible:children[+ label](focus)"
                  data-h2-font-weight="base:selectors[:checked]:children[+ label](700)"
                  data-h2-border="base:selectors[:checked]:children[+ label](2px solid black)"
                  // color the sibling label's icon when focused and/or checked
                  {...getIconStyle(selectedIconColor)}
                />
                <Field.Label
                  data-h2-display="base(flex)"
                  data-h2-align-items="base(center)"
                  data-h2-gap="base(x.5)"
                  data-h2-padding="base(x.5)"
                  data-h2-shadow="base(s)"
                  data-h2-radius="base(s)"
                  data-h2-margin-bottom="base(x.25)"
                  htmlFor={id}
                  data-h2-cursor="base(pointer)"
                  data-h2-color="base(black)"
                >
                  <Icon data-h2-height="base(x1)" data-h2-width="base(x1)" />
                  <span>{label}</span>
                </Field.Label>
              </div>
            );
          },
        )}
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ error, context }} />
    </Field.Wrapper>
  );
};

export default CardOptionGroup;
