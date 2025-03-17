import { useFormContext, Controller } from "react-hook-form";
import { ComponentPropsWithoutRef } from "react";

import {
  CommonInputProps,
  Field,
  useFieldState,
} from "@gc-digital-talent/forms";
import { HydrogenAttributes } from "@gc-digital-talent/ui";
import { Maybe } from "@gc-digital-talent/graphql";

import ControlledInput from "./ControlledInput";
import { EmployeeSearchResult, ErrorMessages } from "./types";
export type { ErrorMessages } from "./types";

interface WrapperProps
  extends ComponentPropsWithoutRef<"div">,
    HydrogenAttributes {}

export interface EmployeeSearchInputProps
  extends Omit<ComponentPropsWithoutRef<"input">, "id" | "name">,
    Omit<CommonInputProps, "context"> {
  buttonLabel?: string;
  wrapperProps?: WrapperProps;
  errorMessages?: Partial<ErrorMessages>;
  employeeOption?: Maybe<EmployeeSearchResult>;
}

const EmployeeSearchInput = ({
  id,
  label,
  name,
  rules = {},
  buttonLabel,
  wrapperProps,
  errorMessages,
  employeeOption,
  "aria-describedby": describedBy,
  "aria-labelledby": labelledBy,
}: EmployeeSearchInputProps) => {
  const { control } = useFormContext();
  const fieldState = useFieldState(id, true);

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
            fieldState={fieldState}
            buttonLabel={buttonLabel}
            errorMessages={errorMessages}
            defaultEmployee={employeeOption}
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
