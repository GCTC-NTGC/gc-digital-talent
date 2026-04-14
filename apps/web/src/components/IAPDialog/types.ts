import type { ReactNode } from "react";

import type { ButtonProps } from "@gc-digital-talent/ui";

export interface BasicDialogProps {
  btnProps?: Omit<ButtonProps, "color" | "mode" | "ref">;
  children?: ReactNode;
}
