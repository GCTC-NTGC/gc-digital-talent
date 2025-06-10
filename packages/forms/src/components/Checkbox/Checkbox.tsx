import { useFormContext } from "react-hook-form";
import { useReducedMotion } from "motion/react";
import { ReactNode, Fragment } from "react";
import { tv, VariantProps } from "tailwind-variants";

import Field from "../Field";
import type { CommonInputProps, HTMLInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import { checkboxRadioStyles, inputStateStyles } from "../../styles";
import useFieldState from "../../hooks/useFieldState";

const checkbox = tv({
  extend: checkboxRadioStyles,
  slots: {
    label: "flex cursor-pointer items-start gap-1.5",
    input:
      "rounded-md align-middle before:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)]",
  },
  variants: {
    inCheckList: {
      true: {
        label: "px-3 py-1.5",
      },
    },
  },
});

type CheckboxVariants = VariantProps<typeof checkbox>;

export interface CheckboxProps
  extends CheckboxVariants,
    Omit<HTMLInputProps, "id" | "name">,
    CommonInputProps {
  /** Wrap input in bounding box. */
  boundingBox?: boolean;
  /** Label for the bounding box. */
  boundingBoxLabel?: ReactNode;
  /** Determine if it should track unsaved changes and render it */
  isUnsaved?: boolean;
}

const Checkbox = ({
  id,
  label,
  name,
  rules = {},
  context,
  isUnsaved,
  boundingBox = false,
  boundingBoxLabel = label,
  trackUnsaved = true,
  inCheckList = false,
  ...rest
}: CheckboxProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const shouldReduceMotion = useReducedMotion();
  const { label: labelStyles, input: inputStyles } = checkbox({
    inCheckList,
    shouldReduceMotion: shouldReduceMotion ?? false,
  });
  const fieldState = useFieldState(name, !trackUnsaved);
  const error = errors[name];
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error: !!error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const asFieldset = boundingBox && boundingBoxLabel;
  const Wrapper = asFieldset ? Field.Fieldset : Fragment;
  const BoundingBox = asFieldset ? Field.BoundingBox : Fragment;

  return (
    <Field.Wrapper>
      <Wrapper>
        {asFieldset && (
          <Field.Legend required={!!rules.required}>
            {boundingBoxLabel}
          </Field.Legend>
        )}
        <BoundingBox
          {...(asFieldset
            ? { className: inputStateStyles({ state: fieldState }) }
            : {})}
        >
          <Field.Label className={labelStyles()}>
            <input
              id={id}
              type="checkbox"
              aria-describedby={ariaDescribedBy}
              aria-required={!!rules.required && !inCheckList}
              aria-invalid={!!error}
              className={inputStyles()}
              {...register(name, rules)}
              {...rest}
            />
            <span className="align-middle text-base leading-6">{label}</span>
            {!asFieldset && !inCheckList && (
              <Field.Required required={!!rules.required} />
            )}
          </Field.Label>
        </BoundingBox>
      </Wrapper>
      {!inCheckList && (
        <Field.Descriptions
          ids={descriptionIds}
          {...{ errors, name, context }}
        />
      )}
    </Field.Wrapper>
  );
};

export default Checkbox;
