import React from "react";

interface AdminContentWrapperProps {
  children: React.ReactNode;
}

const AdminContentWrapper = ({ children }: AdminContentWrapperProps) => (
  <div className="mx-auto px-12 pb-18">{children}</div>
);

export default AdminContentWrapper;
