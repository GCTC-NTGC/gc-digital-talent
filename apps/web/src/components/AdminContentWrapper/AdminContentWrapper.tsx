import { ReactNode } from "react";

interface AdminContentWrapperProps {
  children: ReactNode;
}

const AdminContentWrapper = ({ children }: AdminContentWrapperProps) => (
  <div className="mx-auto px-12 pb-18">{children}</div>
);

export default AdminContentWrapper;
