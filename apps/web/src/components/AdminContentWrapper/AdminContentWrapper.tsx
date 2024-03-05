import React from "react";

interface AdminContentWrapperProps {
  children: React.ReactNode;
}

const AdminContentWrapper = ({ children }: AdminContentWrapperProps) => (
  <div data-h2-container="base(center, full, x2)">
    <div data-h2-padding="base(0, 0, x3, 0)">{children}</div>
  </div>
);

export default AdminContentWrapper;
