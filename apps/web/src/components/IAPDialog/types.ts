import { ReactNode } from "react";

import { ButtonProps } from "@gc-digital-talent/ui";

export interface BasicDialogProps {
  btnProps?: Omit<ButtonProps, "color" | "mode" | "ref">;
  children?: ReactNode;
}
