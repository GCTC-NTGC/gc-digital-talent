import React from "react";
import { FormattedMessage } from "react-intl";
import Button from "@common/components/Button";
import Link from "@common/components/Link";
import { classificationCreatePath } from "../../adminRoutes";
import { ClassificationTableApi } from "./ClassificationTable";

export const ClassificationPage: React.FC = () => {
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
              <FormattedMessage
                description="Heading displayed above the Classification Table component."
                defaultMessage="Classifications"
              />
            </h1>
          </div>
          <div
            data-h2-flex-item="b(1of1) m(2of5)"
            data-h2-text-align="m(right)"
          >
            <Button color="white" mode="outline">
              <Link href={classificationCreatePath()} title="">
                <FormattedMessage
                  description="Heading displayed above the Create Classification form."
                  defaultMessage="Create Classification"
                />
              </Link>
            </Button>
          </div>
        </div>
      </header>
      <ClassificationTableApi />
    </div>
  );
};

export default ClassificationPage;
