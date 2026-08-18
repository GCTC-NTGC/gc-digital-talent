import type { OperationContext } from "@urql/core";

export interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIds: string[];
  onCompleted: () => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export const trackedUsersMutationContext: Partial<OperationContext> = {
  additionalTypenames: ["TalentRequest", "TalentRequestTrackedUser", "User"],
};
