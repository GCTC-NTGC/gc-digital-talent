import { useFormContext } from "react-hook-form";
import { ReactNode } from "react";
import { tv, VariantProps } from "tailwind-variants";

import { IconType } from "@gc-digital-talent/ui";

import Field from "../Field";
import type { CommonInputProps, HTMLFieldsetProps } from "../../types";
import useFieldState from "../../hooks/useFieldState";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";

const cardOption = tv({
  slots: {
    label:
      "flex cursor-pointer items-center gap-3 rounded-md border-2 border-transparent bg-white p-3 text-base shadow-lg peer-checked:border-black peer-checked:bg-gray-100 peer-checked:font-bold peer-focus-visible:bg-focus peer-focus-visible:text-black dark:bg-gray-600 dark:peer-checked:border-gray-100 dark:peer-checked:border-white dark:peer-checked:bg-gray-700 peer-focus-visible:[&_svg]:text-black",
    icon: "size-6 text-black dark:text-white",
  },
  variants: {
    selectedIconColor: {
      primary: {
        label: "peer-checked:[&_svg]:text-primary",
      },
      secondary: {
        label: "peer-checked:[&_svg]:text-secondary",
      },
      success: {
        label: "peer-checked:[&_svg]:text-success",
      },
      warning: {
        label: "peer-checked:[&_svg]:text-warning",
      },
      error: {
        label: "peer-checked:[&_svg]:text-error",
      },
    },
  },
});

type CardOptionVariants = VariantProps<typeof cardOption>;

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
  selectedIconColor: NonNullable<CardOptionVariants["selectedIconColor"]>;
}

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
  } = useFormContext<Record<string, string | undefined>>();
  const fieldState = useFieldState(name, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id: idPrefix,
    describedBy,
    show: {
      error: fieldState === "invalid",
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
        className="flex flex-col gap-y-3"
        {...rest}
      >
        <Field.Legend
          required={!!rules.required}
          className="mb-3 text-black dark:text-white"
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
            const { label: labelStyles, icon: iconStyles } = cardOption({
              selectedIconColor,
            });
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
                  className="peer sr-only"
                />
                <Field.Label htmlFor={id} className={labelStyles()}>
                  <Icon className={iconStyles()} />
                  <span>{label}</span>
                </Field.Label>
              </div>
            );
          },
        )}
      </Field.Fieldset>
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default CardOptionGroup;
