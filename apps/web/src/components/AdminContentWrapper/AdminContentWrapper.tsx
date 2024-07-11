import { ReactNode } from "react";

interface AdminContentWrapperProps {
  children: ReactNode;
}

const AdminContentWrapper = ({ children }: AdminContentWrapperProps) => (
  <div data-h2-wrapper="base(center, full, x2)">
    <div data-h2-padding="base(0, 0, x3, 0)">{children}</div>
  </div>
);

export default AdminContentWrapper;
