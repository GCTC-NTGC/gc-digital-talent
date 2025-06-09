import { ReactNode } from "react";

const Content = ({ children, ...rest }: { children?: ReactNode }) => (
  <div className="col-span-3" {...rest}>
    {children}
  </div>
);

export default Content;
