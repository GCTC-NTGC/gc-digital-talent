import { ReactNode } from "react";

interface ActionWrapperProps {
  children: ReactNode;
}

const ActionWrapper = ({ children }: ActionWrapperProps) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

export default ActionWrapper;
