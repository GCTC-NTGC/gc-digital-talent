import { Notice, NoticeProps } from "@gc-digital-talent/ui";

const Error = (props: Omit<NoticeProps, "color">) => {
  return (
    <Notice
      role="alert"
      aria-live="polite"
      className="p-3 text-sm"
      color="error"
      {...props}
    />
  );
};

export default Error;
