import { Breadcrumbs, BreadcrumbsProps } from "@gc-digital-talent/ui";
import React from "react";

interface AdminContentWrapperProps {
  crumbs: BreadcrumbsProps["crumbs"];
  children: React.ReactNode;
}

const AdminContentWrapper = ({
  crumbs,
  children,
}: AdminContentWrapperProps) => {
  return (
    <>
      <div data-h2-container="base(center, full, x2)">
        <div data-h2-padding="base(0, 0, x3, 0)">{children}</div>
      </div>
      <Breadcrumbs crumbs={crumbs} />
    </>
  );
};

export default AdminContentWrapper;
