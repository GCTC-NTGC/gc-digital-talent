import React from "react";
import { useIntl } from "react-intl";
import { Link, Button } from "@common/components";
import { useAdminRoutes } from "../../adminRoutes";
import { DepartmentTableApi } from "./DepartmentTable";

export const DepartmentPage: React.FC = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  return (
    <div>
      <header
        data-h2-bg-color="b(linear-70[lightpurple][lightnavy])"
        data-h2-padding="b(top-bottom, l) b(right-left, xl)"
      >
        <div data-h2-flex-grid="b(middle, expanded, flush, l)">
          <div data-h2-flex-item="b(1of1) m(3of5)">
            <h1
              data-h2-font-color="b(white)"
              data-h2-font-weight="b(800)"
              data-h2-margin="b(all, none)"
              style={{ letterSpacing: "-2px" }}
            >
              {intl.formatMessage({
                defaultMessage: "Departments",
                description:
                  "Heading displayed above the Department Table component.",
              })}
            </h1>
          </div>
          <div
            data-h2-flex-item="b(1of1) m(2of5)"
            data-h2-text-align="m(right)"
          >
            <Link
              href={paths.departmentCreate()}
              color="white"
              mode="outline"
              type="button"
            >
              {intl.formatMessage({
                defaultMessage: "Create Department",
                description:
                  "Heading displayed above the Create Department form.",
              })}
            </Link>
          </div>
        </div>
      </header>
      <DepartmentTableApi />
    </div>
  );
};

export default DepartmentPage;
