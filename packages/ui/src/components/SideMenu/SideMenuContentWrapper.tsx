import { ReactNode } from "react";

const SideMenuContentWrapper = ({ children }: { children?: ReactNode }) => (
  <div data-h2-flex-item="base(fill)">{children}</div>
);

export default SideMenuContentWrapper;
