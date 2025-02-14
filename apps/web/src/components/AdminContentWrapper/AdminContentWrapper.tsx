import { ReactNode } from "react";

interface AdminContentWrapperProps {
  table?: boolean;
  overflowScrollbar?: boolean;
  children: ReactNode;
}

const AdminContentWrapper = ({
  table,
  overflowScrollbar,
  children,
}: AdminContentWrapperProps) => (
  <div
    {...(overflowScrollbar
      ? {
          "data-h2-padding": "base(0, 0, x3, 0)",
        }
      : {
          "data-h2-padding": "base(x3, 0)",
        })}
    {...(table
      ? {
          "data-h2-wrapper":
            "base(center, full, x1) p-tablet(center, full, x2)",
        }
      : {
          "data-h2-wrapper":
            "base(center, large, x1) p-tablet(center, large, x2)",
        })}
  >
    {children}
  </div>
);

export default AdminContentWrapper;
