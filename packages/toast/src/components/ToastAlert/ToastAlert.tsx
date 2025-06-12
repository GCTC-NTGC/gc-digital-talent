import { Alert, AlertProps } from "@gc-digital-talent/ui";

const ToastAlert = ({ type, children }: AlertProps) => (
  <Alert.Root live={false} type={type} className="m-0" tabIndex={0}>
    <div className="leading-[1.1] xs:pr-12">{children}</div>
  </Alert.Root>
);

export default ToastAlert;
