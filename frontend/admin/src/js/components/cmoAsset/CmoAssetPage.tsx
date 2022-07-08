import React from "react";
import { useIntl } from "react-intl";
import Link from "@common/components/Link";
import { useAdminRoutes } from "../../adminRoutes";
import { CmoAssetTableApi } from "./CmoAssetTable";

export const CmoAssetPage: React.FC = () => {
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
                  defaultMessage: "CMO Assets",
                  description:
                    "Heading displayed above the CMO Asset Table component.",
                })}
              </h1>
            </div>
            <div
              data-h2-flex-item="b(1of1) m(2of5)"
              data-h2-text-align="m(right)"
            >
              <Link
                href={paths.cmoAssetCreate()}
                color="white"
                mode="outline"
                type="button"
              >
                {intl.formatMessage({
                  defaultMessage: "Create CMO Asset",
                  description:
                    "Heading displayed above the Create CMO Asset form.",
                })}
              </Link>
            </div>
          </div>
        </div>
      </header>
      <CmoAssetTableApi />
    </div>
  );
};

export default CmoAssetPage;
