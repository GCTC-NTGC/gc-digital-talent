import React from "react";
import { FieldError } from "react-hook-form";

import { Well } from "@gc-digital-talent/ui";

import { DescriptionIds } from "../../hooks/useInputDescribedBy";
import { CommonInputProps } from "../../types";

export interface DescriptionsProps {
  context?: CommonInputProps["context"];
  error?: FieldError;
  ids?: DescriptionIds;
}

const Descriptions = ({ context, error, ids }: DescriptionsProps) => (
  <>
    {context && (
      <Well id={ids?.context} color="default" fontSize="caption">
        {context}
      </Well>
    )}
    {error && (
      <Well id={ids?.error} color="error" fontSize="caption">
        {error?.toString()}
      </Well>
    )}
  </>
);

export default Descriptions;
