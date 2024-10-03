import { ReactNode } from "react";

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
    error?: boolean;
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
