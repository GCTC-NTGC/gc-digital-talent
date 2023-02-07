import React from "react";
import { InputFieldError } from "../components/inputPartials/InputError/InputError";

export type InputDescription = "error" | "context" | "unsaved";

export type DescriptionIds = Record<InputDescription, string>;

export type UseInputDescribedByArgs = {
  id: string;
  show: {
    error?: InputFieldError;
    context?: React.ReactNode;
    unsaved?: boolean;
  };
};

export type UseInputDescribedByReturn = [
  descriptionIds: DescriptionIds,
  ariaDescription?: string,
];

type UseInputDescribedBy = (
  args: UseInputDescribedByArgs,
) => UseInputDescribedByReturn;

const useInputDescribedBy: UseInputDescribedBy = ({
  show: { error, context, unsaved },
  id,
}) => {
  const contextId = `context-${id}`;
  const errorId = `error-${id}`;
  const unsavedId = `unsaved-${id}`;

  const ariaDescribedByArray = [];

  if (error) {
    ariaDescribedByArray.push(errorId);
  }

  if (context) {
    ariaDescribedByArray.push(contextId);
  }

  if (unsaved) {
    ariaDescribedByArray.push(unsavedId);
  }

  const ariaDescribedBy = ariaDescribedByArray.length
    ? ariaDescribedByArray.join(" ")
    : undefined;

  return [
    {
      context: contextId,
      error: errorId,
      unsaved: unsavedId,
    },
    ariaDescribedBy,
  ];
};

export default useInputDescribedBy;
