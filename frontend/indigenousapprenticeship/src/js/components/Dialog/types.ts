import { ButtonProps } from "@common/components/Button";

export interface BasicDialogProps {
  btnProps?: Omit<ButtonProps, "color" | "mode" | "ref">;
}
