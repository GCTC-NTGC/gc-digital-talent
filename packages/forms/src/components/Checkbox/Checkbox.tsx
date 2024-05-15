import * as React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";
import { useReducedMotion } from "framer-motion";

import Field from "../Field";
import type { CommonInputProps, HTMLInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";
import getCheckboxRadioStyles from "../../utils/getCheckboxRadioStyles";

export type CheckboxProps = HTMLInputProps &
  CommonInputProps & {
    /** Wrap input in bounding box. */
    boundingBox?: boolean;
    /** Label for the bounding box. */
    boundingBoxLabel?: React.ReactNode;
    /** Determine if it should track unsaved changes and render it */
    isUnsaved?: boolean;
    /** Render differently when in a list */
    inCheckList?: boolean;
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
  inCheckList = false,
  ...rest
}: CheckboxProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const shouldReduceMotion = useReducedMotion();
  const baseStyles = getCheckboxRadioStyles(shouldReduceMotion);
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
  const Wrapper = asFieldset ? Field.Fieldset : React.Fragment;
  const BoundingBox = asFieldset ? Field.BoundingBox : React.Fragment;

  return (
    <Field.Wrapper>
      <Wrapper>
        {asFieldset && (
          <Field.Legend required={!!rules.required}>
            {boundingBoxLabel}
          </Field.Legend>
        )}
        <BoundingBox {...(asFieldset ? stateStyles : {})}>
          <Field.Label
            data-h2-cursor="base(pointer)"
            data-h2-display="base(flex)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.25)"
            {...(inCheckList && {
              "data-h2-padding": "base(x.25 x.5)",
            })}
          >
            <input
              id={id}
              type="checkbox"
              aria-describedby={ariaDescribedBy}
              aria-required={!!rules.required && !inCheckList}
              aria-invalid={!!error}
              data-h2-clip-path="base:selectors[::before](polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%))"
              data-h2-radius="base(input)"
              data-h2-vertical-align="base(middle)"
              {...register(name, rules)}
              {...baseStyles}
              {...rest}
            />
            <span
              data-h2-font-size="base(body)"
              data-h2-vertical-align="base(middle)"
              data-h2-line-height="base(x1)"
            >
              {label}
            </span>
            {!asFieldset && !inCheckList && (
              <Field.Required required={!!rules.required} />
            )}
          </Field.Label>
        </BoundingBox>
      </Wrapper>
      {!inCheckList && (
        <Field.Descriptions
          ids={descriptionIds}
          error={error}
          context={context}
        />
      )}
    </Field.Wrapper>
  );
};

export default Checkbox;
