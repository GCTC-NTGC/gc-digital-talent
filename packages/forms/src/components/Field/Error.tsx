import { Notice, NoticeProps } from "@gc-digital-talent/ui";

const Error = (props: Omit<NoticeProps, "color">) => {
  return (
    <Notice
      role="alert"
      aria-live="polite"
      small
      color="error"
      {...props}
    />
  );
};

export default Error;
