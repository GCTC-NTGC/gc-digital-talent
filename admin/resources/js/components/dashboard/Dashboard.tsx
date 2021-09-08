import React, { ReactElement } from "react";
import { defineMessages, useIntl } from "react-intl";
import { Routes } from "universal-router";
import { useGetPoolsQuery } from "../../api/generated";
import { getLocale } from "../../helpers/localize";
import {
  Link,
  RouterResult,
  useLocation,
  useRouter,
} from "../../helpers/router";
import { poolCandidateTablePath } from "../../helpers/routes";
import Footer from "../Footer";
import Button from "../H2Components/Button";
import SideMenu from "../menu/SideMenu";

export const exactMatch = (ref: string, test: string): boolean => ref === test;
export const startsWith = (ref: string, test: string): boolean =>
  test.startsWith(ref);

const messages = defineMessages({
  menuPoolCandidates: {
    id: "poolDashboard.menu.poolCandidatesLabel",
    defaultMessage: "Pool Candidates",
    description: "Label displayed on the Pool Candidates menu item.",
  },
});

export const MenuHeading: React.FC<{ text: string }> = ({ text }) => {
  return (
    <span
      data-h2-display="b(block)"
      data-h2-padding="b(top-bottom, xs) b(right-left, s)"
      data-h2-bg-color="b(lightnavy)"
      data-h2-text-align="b(center)"
      data-h2-font-color="b(white)"
      data-h2-font-size="b(caption) m(normal)"
      data-h2-font-weight="b(700)"
      style={{
        overflowWrap: "break-word",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  );
};

interface MenuLinkProps {
  href: string;
  text: string;
  title?: string;
  isActive?: (href: string, path: string) => boolean;
}

export const MenuLink: React.FC<MenuLinkProps> = ({
  href,
  text,
  title,
  isActive = startsWith,
}) => {
  const location = useLocation();
  return (
    <Link
      href={href}
      title={title ?? ""}
      {...(isActive(href, location.pathname)
        ? { "data-h2-font-style": "b(reset)" }
        : { "data-h2-font-style": "b(underline)" })}
    >
      <Button color="white" mode="inline" block tabIndex={-1}>
        <span
          {...(isActive(href, location.pathname)
            ? { "data-h2-font-weight": "b(700)" }
            : { "data-h2-font-weight": "b(100)" })}
        >
          {text}
        </span>
      </Button>
    </Link>
  );
};

const PoolListApi = () => {
  const intl = useIntl();
  const [result] = useGetPoolsQuery();
  const { data, fetching, error } = result;
  const items = [];

  if (!fetching && !error) {
    items.push(
      <MenuHeading
        key="pool-candidates"
        text={intl.formatMessage(messages.menuPoolCandidates)}
      />,
    );
    data?.pools.map((pool) =>
      items.push(
        <MenuLink
          key={`pools/${pool?.id}/pool-candidates`}
          href={poolCandidateTablePath(pool?.id ?? "")}
          text={(pool?.name && pool?.name[getLocale(intl)]) ?? ""}
        />,
      ),
    );
  }

  return items;
};

export const Dashboard: React.FC<{
  menuItems: ReactElement[];
  contentRoutes: Routes<RouterResult>;
}> = ({ menuItems, contentRoutes }) => {
  const content = useRouter(contentRoutes);
  return (
    <div className="container">
      <section
        className="dashboard"
        data-h2-flex-grid="b(stretch, contained, flush, none)"
      >
        <div
          data-h2-bg-color="b(lightnavy)"
          data-h2-flex-item="b(1of1) m(1of4) l(1of6)"
        >
          <div data-h2-padding="b(right-left, m)">
            <SideMenu items={[...menuItems, ...PoolListApi()]} />
          </div>
        </div>
        <div data-h2-flex-item="b(1of1) m(8of12) l(10of12)">
          <div data-h2-text-align="b(right)">
            <a href="login">Login</a>
          </div>
          {content}
        </div>
      </section>
      <Footer />
    </div>
  );
};
