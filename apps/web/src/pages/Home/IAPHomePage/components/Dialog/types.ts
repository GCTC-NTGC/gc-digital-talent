import { ButtonProps } from "@common/components/Button";
import React from "react";

export interface BasicDialogProps {
  btnProps?: Omit<ButtonProps, "color" | "mode" | "ref">;
  children?: React.ReactNode;
}
