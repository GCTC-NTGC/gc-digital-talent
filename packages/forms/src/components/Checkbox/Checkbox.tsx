import React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import type { CommonInputProps, HTMLInputProps } from "../../types";
import Base from "../Base";
import useCommonInputStyles from "../../hooks/useCommonInputStyles";

export type CheckboxProps = HTMLInputProps &
  CommonInputProps & {
    /** Wrap input in bounding box. */
    boundingBox?: boolean;
    /** Label for the bounding box. */
    boundingBoxLabel?: React.ReactNode;
    /** Determine if it should track unsaved changes and render it */
    isUnsaved?: boolean;
  };

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
  ...rest
}: CheckboxProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const baseStyles = useCommonInputStyles();
  const stateStyles = useFieldStateStyles(name, !trackUnsaved);
  // To grab errors in nested objects we need to use lodash's get helper.
  const error = get(errors, name)?.message as FieldError;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    show: {
      error,
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const asFieldset = boundingBox && boundingBoxLabel;

  return (
    <Base.Wrapper
      {...(asFieldset
        ? {
            as: "fieldset",
            ...baseStyles,
            ...stateStyles,
            "data-h2-position": "base(relative)",
            "data-h2-margin-top": "base(x1.5)",
          }
        : {})}
    >
      {asFieldset && (
        <legend
          data-h2-position="base(absolute)"
          data-h2-left="base(0)"
          data-h2-top="base(-x1.25)"
        >
          {boundingBoxLabel}
          <Base.Required required={!!rules.required} />
        </legend>
      )}
      <Base.Label
        data-h2-display="base(flex)"
        data-h2-align-items="base(flex-start)"
        data-h2-gap="base(0 x.25)"
      >
        <input
          id={id}
          type="checkbox"
          aria-describedby={ariaDescribedBy}
          required={!!rules.required}
          {...register(name, rules)}
          {...rest}
        />
        <span data-h2-margin-top="base(-x.125)">{label}</span>
        {!asFieldset && <Base.Required required={!!rules.required} />}
      </Base.Label>

      <Base.Descriptions ids={descriptionIds} error={error} context={context} />
    </Base.Wrapper>
  );
};

export default Checkbox;
