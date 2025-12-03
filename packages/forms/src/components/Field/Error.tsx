import { Notice, NoticeProps } from "@gc-digital-talent/ui";

const Error = ({ children, ...rest }: Omit<NoticeProps, "color">) => {
  return (
    <Notice.Root small role="alert" aria-live="polite" color="error" {...rest}>
      <Notice.Content>{children}</Notice.Content>
    </Notice.Root>
  );
};
export default Error;
