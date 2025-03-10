import { useFormContext, Controller } from "react-hook-form";
import { ComponentPropsWithoutRef } from "react";

import {
  CommonInputProps,
  Field,
  useFieldState,
  useInputDescribedBy,
} from "@gc-digital-talent/forms";
import { HydrogenAttributes } from "@gc-digital-talent/ui";

import ControlledInput from "./ControlledInput";
export { type EmployeeSearchValue } from "./types";

interface WrapperProps
  extends ComponentPropsWithoutRef<"div">,
    HydrogenAttributes {}

export interface EmployeeSearchInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "id" | "name">,
    CommonInputProps {
  buttonLabel?: string;
  wrapperProps: WrapperProps;
}

const EmployeeSearchInput = ({
  id,
  context,
  label,
  name,
  rules = {},
  buttonLabel,
  wrapperProps,
  trackUnsaved = true,
  "aria-describedby": describedBy,
  "aria-labelledby": labelledBy,
}: EmployeeSearchInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const fieldState = useFieldState(id, !trackUnsaved);
  const isUnsaved = fieldState === "dirty" && trackUnsaved;
  const [descriptionIds, ariaDescribedBy] = useInputDescribedBy({
    id,
    describedBy,
    show: {
      error: fieldState === "invalid",
      unsaved: trackUnsaved && isUnsaved,
      context,
    },
  });

  const labelId = `${id}-label`;
  return (
    <Field.Wrapper {...wrapperProps}>
      <Field.Label id={labelId} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={(props) => (
          <ControlledInput
            {...props}
            trackUnsaved={trackUnsaved}
            fieldState={fieldState}
            buttonLabel={buttonLabel}
            inputProps={{
              id,
              "aria-labelledby": `${labelId}${
                labelledBy ? ` ${labelledBy}` : ``
              }`,
              ...(ariaDescribedBy && {
                "aria-describedby": ariaDescribedBy,
              }),
            }}
          />
        )}
      />
      <Field.Descriptions ids={descriptionIds} {...{ errors, name, context }} />
    </Field.Wrapper>
  );
};

export default EmployeeSearchInput;
