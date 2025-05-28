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
      <div className="border-t border-t-black/20 bg-black py-3">
        <nav
          aria-label={intl.formatMessage(uiMessages.breadcrumbs)}
          className="relative mx-auto w-full max-w-6xl px-6 xs:px-9"
        >
          <ol className="flex list-none flex-wrap gap-3 p-0">
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
