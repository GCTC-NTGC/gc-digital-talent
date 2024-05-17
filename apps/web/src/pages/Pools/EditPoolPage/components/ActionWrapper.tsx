import { ReactNode } from "react";

interface ActionWrapperProps {
  children: ReactNode;
}

const ActionWrapper = ({ children }: ActionWrapperProps) => (
  <div
    className="flex"
    data-h2-gap="base(x.5)"
    data-h2-align-items="base(center)"
    data-h2-flex-wrap="base(wrap)"
  >
    {children}
  </div>
);

export default ActionWrapper;
