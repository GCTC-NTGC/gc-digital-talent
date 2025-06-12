import { ReactNode } from "react";
import { tv } from "tailwind-variants";

import { Container } from "@gc-digital-talent/ui";
interface AdminContentWrapperProps {
  table?: boolean;
  overflowScrollbar?: boolean;
  children: ReactNode;
}

const adminContentWrapper = tv({
  base: "py-18",
  variants: {
    overflowScrollbar: {
      true: "pb-18",
    },
    table: {
      true: "px-6 sm:px-12",
    },
  },
});

const AdminContentWrapper = ({
  table,
  overflowScrollbar,
  children,
}: AdminContentWrapperProps) => (
  <Container
    className={adminContentWrapper({ overflowScrollbar, table })}
    size={table ? "full" : "lg"}
    center
  >
    {children}
  </Container>
);

export default AdminContentWrapper;
