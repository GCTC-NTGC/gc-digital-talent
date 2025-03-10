import { useFormContext, Controller } from "react-hook-form";
import { ComponentPropsWithoutRef } from "react";

import {
  CommonInputProps,
  Field,
  useFieldState,
} from "@gc-digital-talent/forms";
import { HydrogenAttributes } from "@gc-digital-talent/ui";
import { workEmailDomainRegex } from "@gc-digital-talent/helpers";

import ControlledInput from "./ControlledInput";
import { EmployeeSearchValue } from "./types";
export { type EmployeeSearchValue } from "./types";

interface WrapperProps
  extends ComponentPropsWithoutRef<"div">,
    HydrogenAttributes {}

export interface EmployeeSearchInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "id" | "name">,
    Omit<CommonInputProps, "context"> {
  buttonLabel?: string;
  wrapperProps: WrapperProps;
}

const EmployeeSearchInput = ({
  id,
  label,
  name,
  rules = {},
  buttonLabel,
  wrapperProps,
  "aria-describedby": describedBy,
  "aria-labelledby": labelledBy,
}: EmployeeSearchInputProps) => {
  const { control } = useFormContext();
  const fieldState = useFieldState(id, true);
  const isGovEmail = (value: EmployeeSearchValue) => {
    if (!value.workEmail) return true;

    return workEmailDomainRegex.test(value.workEmail) || "NOT_WORK_EMAIL";
  };

  const labelId = `${id}-label`;
  return (
    <Field.Wrapper {...wrapperProps}>
      <Field.Label id={labelId} htmlFor={id} required={!!rules.required}>
        {label}
      </Field.Label>
      <Controller
        control={control}
        name={name}
        rules={{ ...rules, validate: { isGovEmail } }}
        render={(props) => (
          <ControlledInput
            {...props}
            fieldState={fieldState}
            buttonLabel={buttonLabel}
            inputProps={{
              id,
              "aria-labelledby": `${labelId}${
                labelledBy ? ` ${labelledBy}` : ``
              }`,
              ...(describedBy && {
                "aria-describedby": describedBy,
              }),
            }}
          />
        )}
      />
    </Field.Wrapper>
  );
};

export default EmployeeSearchInput;
