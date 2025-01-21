import { ReactNode } from "react";

interface AdminContentWrapperProps {
  table?: boolean;
  children: ReactNode;
}

const AdminContentWrapper = ({ table, children }: AdminContentWrapperProps) => (
  <div
    {...(table
      ? {
          "data-h2-wrapper":
            "base(center, full, x1) p-tablet(center, full, x2)",
          "data-h2-padding": "base(x3, 0)",
        }
      : {
          "data-h2-wrapper":
            "base(center, large, x1) p-tablet(center, large, x2)",
          "data-h2-padding": "base(x3, 0)",
        })}
  >
    {children}
  </div>
);

export default AdminContentWrapper;
