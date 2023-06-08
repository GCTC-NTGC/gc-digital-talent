import React from "react";
import { FieldError } from "react-hook-form";

import { DescriptionIds } from "../../hooks/useInputDescribedBy";
import { CommonInputProps } from "../../types";

import Context from "./Context";
import Error from "./Error";

interface DescriptionsProps {
  context?: CommonInputProps["context"];
  error?: FieldError;
  ids?: DescriptionIds;
}

const Descriptions = ({ context, error, ids }: DescriptionsProps) => (
  <>
    {context && <Context id={ids?.context}>{context}</Context>}
    {error && <Error id={ids?.error}>{error?.toString()}</Error>}
  </>
);

export default Descriptions;
