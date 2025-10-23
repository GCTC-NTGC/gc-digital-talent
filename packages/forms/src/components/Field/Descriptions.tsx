import { FieldErrors } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import Context from "./Context";
import Error from "./Error";
import { DescriptionIds } from "../../hooks/useInputDescribedBy";
import { CommonInputProps } from "../../types";

export interface DescriptionsProps {
  name?: string;
  context?: CommonInputProps["context"];
  contextColor?: CommonInputProps["contextColor"];
  errors?: FieldErrors;
  ids?: DescriptionIds;
}

const Descriptions = ({
  context,
  errors,
  ids,
  name,
  contextColor,
}: DescriptionsProps) => (
  <>
    {context && (
      <Context id={ids?.context} color={contextColor}>
        {context}
      </Context>
    )}
    {name && (
      <ErrorMessage
        errors={errors}
        name={name}
        render={({ message }) => <Error id={ids?.error}>{message}</Error>}
      />
    )}
  </>
);

export default Descriptions;
