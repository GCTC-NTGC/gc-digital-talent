import React from "react";
import { useIntl } from "react-intl";
import Button from "@common/components/Button";
import Link from "@common/components/Link";
import { useAdminRoutes } from "../../adminRoutes";
import { CmoAssetTableApi } from "./CmoAssetTable";

export const CmoAssetPage: React.FC = () => {
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
      </header>
      <CmoAssetTableApi />
    </div>
  );
};

export default CmoAssetPage;
