import React from "react";
import { useIntl } from "react-intl";
import { Link } from "@common/components";
import { useAdminRoutes } from "../../adminRoutes";
import { PoolTableApi } from "./PoolTable";

export const PoolPage: React.FC = () => {
  const intl = useIntl();
  const paths = useAdminRoutes();
  return (
    <div>
      <header
        data-h2-background-color="b(dt-linear)"
        data-h2-padding="b(x2, 0)"
      >
        <div data-h2-container="b(center, large, x2)">
          <div data-h2-flex-grid="b(center, 0, x2)">
            <div data-h2-flex-item="b(1of1) m(3of5)">
              <h1
                data-h2-color="b(dt-white)"
                data-h2-font-weight="b(700)"
                style={{ letterSpacing: "-2px" }}
              >
                {intl.formatMessage({
                  defaultMessage: "Pools",
                  description:
                    "Heading displayed above the Pool Table component.",
                })}
              </h1>
            </div>
            <div
              data-h2-flex-item="b(1of1) m(2of5)"
              data-h2-text-align="m(right)"
            >
              <Link
                href={paths.poolCreate()}
                color="white"
                mode="outline"
                type="button"
              >
                {intl.formatMessage({
                  defaultMessage: "Create Pool",
                  description: "Heading displayed above the Create Pool form.",
                })}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <PoolTableApi />
    </div>
  );
};

export default PoolPage;
