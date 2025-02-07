import { Well, WellProps } from "@gc-digital-talent/ui";

const Context = (props: Omit<WellProps, "fontSize">) => {
  return <Well fontSize="caption" {...props} />;
};

export default Context;
