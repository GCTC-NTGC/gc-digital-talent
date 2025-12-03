import { Notice, NoticeProps } from "@gc-digital-talent/ui";

const Context = ({ children, ...rest }: NoticeProps) => (
  <Notice.Root small {...rest}>
    <Notice.Content>{children}</Notice.Content>
  </Notice.Root>
);

export default Context;
