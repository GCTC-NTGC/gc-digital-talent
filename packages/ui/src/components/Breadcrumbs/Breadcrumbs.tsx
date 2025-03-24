import { useIntl } from "react-intl";
import { ReactNode } from "react";

import { uiMessages } from "@gc-digital-talent/i18n";

import Flourish from "../Flourish";
import Crumb from "./Crumb";

export interface BreadcrumbsProps {
  crumbs: {
    label: ReactNode;
    url: string;
  }[];
}

const Breadcrumbs = ({ crumbs }: BreadcrumbsProps) => {
  const intl = useIntl();

  return (
    <>
      <div
        data-h2-background-color="base:all(black)"
        data-h2-border-top="base(1px solid black.20)"
        data-h2-padding="base(x.5, 0)"
      >
        <nav
          aria-label={intl.formatMessage(uiMessages.breadcrumbs)}
          data-h2-position="base(relative)"
          data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
        >
          <ol
            data-h2-list-style="base(none)"
            data-h2-display="base(flex) base:children[>li](inline-block)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-gap="base(x.5)"
            data-h2-padding="base(0)"
          >
            {crumbs.map((crumb, index) => (
              <Crumb
                key={crumb.url}
                url={crumb.url}
                isCurrent={index + 1 === crumbs.length}
              >
                {crumb.label}
              </Crumb>
            ))}
          </ol>
        </nav>
      </div>
      <Flourish />
    </>
  );
};

export default Breadcrumbs;
