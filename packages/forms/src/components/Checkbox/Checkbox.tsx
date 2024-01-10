import React from "react";
import get from "lodash/get";
import { FieldError, useFormContext } from "react-hook-form";

import Field from "../Field";
import type { CommonInputProps, HTMLInputProps } from "../../types";
import useInputDescribedBy from "../../hooks/useInputDescribedBy";
import useFieldStateStyles from "../../hooks/useFieldStateStyles";

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
            data-h2-display="base(flex)"
            data-h2-align-items="base(flex-start)"
            data-h2-gap="base(x.25)"
          >
            <input
              id={id}
              type="checkbox"
              className="Input--Checkbox"
              aria-describedby={ariaDescribedBy}
              aria-required={!!rules.required && !inCheckList}
              aria-invalid={!!error}
              data-h2-appearance="base(none)"
              data-h2-background-color="base(white) base:focus-visible(focus) base:selectors[::before](primary) base:dark:selectors[::before](primary.light) base:all:selectors[:focus-visible::before](black)"
              data-h2-border="base(thin solid black.light)"
              data-h2-clip-path="base:selectors[::before](polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%))"
              data-h2-color="base(currentColor)"
              data-h2-content="base:selectors[::before]('')"
              data-h2-display="base(grid)"
              data-h2-flex-shrink="base(0)"
              data-h2-place-content="base(center)"
              data-h2-height="base(x.9) base:selectors[::before](x.5)"
              data-h2-line-height="base(x1)"
              data-h2-margin="base(x.1 0 0 0)"
              data-h2-radius="base(input)"
              data-h2-transform="base:selectors[::before](scale(0)) base:selectors[:checked::before](scale(1))"
              data-h2-transition="base:selectors[::before](120ms transform ease-in-out)"
              data-h2-width="base(x.9) base:selectors[::before](x.5)"
              {...register(name, rules)}
              {...rest}
            />
            <span data-h2-font-size="base(body)">{label}</span>
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
