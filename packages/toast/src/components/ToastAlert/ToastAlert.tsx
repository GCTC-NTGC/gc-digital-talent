import { Alert, AlertProps } from "@gc-digital-talent/ui";

const ToastAlert = ({ type, children }: AlertProps) => (
  <Alert.Root live={false} type={type} data-h2-margin="base(0)" tabIndex={0}>
    <div
      data-h2-padding-right="p-tablet(x2)"
      data-h2-line-height="base(var(--h2-base-line-height))"
    >
      {children}
    </div>
  </Alert.Root>
);

export default ToastAlert;
