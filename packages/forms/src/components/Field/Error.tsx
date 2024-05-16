import { Well, WellProps } from "@gc-digital-talent/ui";

const Error = (props: Omit<WellProps, "color" | "fontSize">) => {
  return (
    <Well
      role="alert"
      aria-live="polite"
      fontSize="caption"
      color="error"
      {...props}
    />
  );
};

export default Error;
