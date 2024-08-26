import { ReactNode } from "react";

import { InputFieldError } from "../types";

/** Keys for the different types of descriptions we are using */
type InputDescription = "error" | "context" | "unsaved";

/** Contains the IDs used for each description element */
export type DescriptionIds = Record<InputDescription, string>;

interface UseInputDescribedByArgs {
  /** Unique identifier for the input */
  id: string;
  /** Existing description */
  describedBy?: string;
  /** Determines if each description type is visible or not */
  show: {
    error?: InputFieldError;
    context?: ReactNode;
    unsaved?: boolean;
  };
}

type UseInputDescribedByReturn = [
  /** The IDs that will be assigned to each description element */
  descriptionIds: DescriptionIds,
  /** A space separated string containing the IDs of each visible description element */
  ariaDescription?: string,
];

type UseInputDescribedBy = (
  args: UseInputDescribedByArgs,
) => UseInputDescribedByReturn;

/**
 * Use Input Description
 *
 * Calculates the `aria-describedby` attribute for
 * and input based on the visible descriptions
 *
 * @param {UseInputDescribedByArgs} args
 * @param {Object} args.show  The description elements and if they are visible
 * @param {InputFieldError} args.show.error If the error description is visible
 * @param {ReactNode} args.show.context If the context description is visible
 * @param {boolean} args.show.unsaved If the unsaved changes description is visible
 * @param {string}  args.id A unique identifier of the input
 * @returns {UseInputDescribedByReturn}
 */
const useInputDescribedBy: UseInputDescribedBy = ({
  show: { error, context, unsaved },
  id,
  describedBy,
}) => {
  const contextId = `context-${id}`;
  const errorId = `error-${id}`;
  const unsavedId = `unsaved-${id}`;

  const ariaDescribedByArray = [];

  if (describedBy) {
    ariaDescribedByArray.push(describedBy);
  }

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
