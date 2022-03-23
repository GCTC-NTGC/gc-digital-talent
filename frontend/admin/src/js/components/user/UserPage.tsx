import React from "react";
import { useIntl } from "react-intl";
import { Link, Button } from "@common/components";
import { useAdminRoutes } from "../../adminRoutes";
import { UserTableApi } from "./UserTable";

export const UserPage: React.FC = () => {
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
                defaultMessage: "Users",
                description:
                  "Heading displayed above the User Table component.",
              })}
            </h1>
          </div>
          <div
            data-h2-flex-item="b(1of1) m(2of5)"
            data-h2-text-align="m(right)"
          >
            <Button color="white" mode="outline">
              <Link href={paths.userCreate()} title="">
                {intl.formatMessage({
                  defaultMessage: "Create User",
                  description: "Heading displayed above the Create User form.",
                })}
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <UserTableApi />
    </div>
  );
};

export default UserPage;
