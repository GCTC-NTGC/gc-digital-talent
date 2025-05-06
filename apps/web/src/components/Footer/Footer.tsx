/* eslint-disable react/forbid-elements */
import { useIntl } from "react-intl";

import { hrefToString, Link, LinkProps } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";

import { CanadaLogo, CanadaLogoWhite } from "../Svg";
import VersionLink from "./VersionLink";

interface FooterProps {
  width?: string;
}

const Footer = ({ width }: FooterProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const links: LinkProps[] = [
    {
      href: paths.support(),
      children: intl.formatMessage({
        defaultMessage: "Contact us",
        id: "RIi/3q",
        description: "Title for Contact us action",
      }),
      state: { referrer: window.location.href },
    },
    {
      href: paths.termsAndConditions(),
      children: intl.formatMessage({
        defaultMessage: "Terms & Conditions",
        id: "ZGpncy",
        description: "Label for the terms and conditions link in the Footer.",
      }),
    },
    {
      href: paths.privacyPolicy(),
      children: intl.formatMessage({
        defaultMessage: "Privacy Policy",
        id: "VcOlXA",
        description: "Label for the privacy link in the Footer.",
      }),
    },
    {
      href: paths.accessibility(),
      children: intl.formatMessage({
        defaultMessage: "Accessibility statement",
        id: "2iCpAL",
        description: "Title for the websites accessibility statement",
      }),
    },
    {
      href: `https://www.canada.ca/${intl.locale}.html`,
      external: true,
      children: intl.formatMessage({
        defaultMessage: "Canada.ca",
        id: "ZE77nf",
        description: "Label for the Canada link in the Footer.",
      }),
    },
  ];

  let footerWidth = {
    "data-h2-wrapper": "base(center, large, x1) p-tablet(center, large, x2)",
  };

  if (width === "full") {
    footerWidth = {
      "data-h2-wrapper": "base(center, full, x1) p-tablet(center, full, x2)",
    };
  }

  return (
    <footer
      data-h2-background-color="base(foreground) base:dark(white)"
      data-h2-border-top="base(1px solid black.20)"
      data-h2-padding="base(x2, 0)"
      data-h2-margin="base(auto, 0, 0, 0)"
    >
      <div {...footerWidth}>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr) laptop(repeat(3, minmax(0, 1fr)))"
          data-h2-gap="base(x1) p-tablet(x2)"
          data-h2-align-items="base(center)"
        >
          <div
            data-h2-text-align="base(center) p-tablet(left)"
            data-h2-grid-column="laptop(1 / 3)"
          >
            <nav
              data-h2-display="base(flex)"
              data-h2-gap="base(x1)"
              data-h2-flex-direction="base(column) p-tablet(row)"
              data-h2-flex-wrap="p-tablet(wrap)"
              aria-label={intl.formatMessage({
                defaultMessage: "Policy and feedback",
                id: "xdojyj",
                description:
                  "Label for the policy, conditions and feedback navigation",
              })}
            >
              {links.map((props) => (
                <Link key={hrefToString(props.href)} color="black" {...props} />
              ))}
            </nav>
            <div data-h2-margin="base(x2, 0, x1, 0) p-tablet(x1, 0, 0, 0)">
              <p
                data-h2-color="base(black.70)"
                data-h2-font-size="base(caption)"
              >
                <span>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Date modified: {modifiedDate}",
                      id: "Jkg004",
                      description:
                        "Header for the date of the last modification of the site",
                    },
                    {
                      modifiedDate: new Date(BUILD_DATE ?? "1970-01-01")
                        .toISOString()
                        .slice(0, 10),
                    },
                  )}
                </span>
                <VersionLink />
              </p>
            </div>
          </div>
          <div data-h2-text-align="base(center) p-tablet(right)">
            <a
              href={`https://www.canada.ca/${intl.locale}.html`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CanadaLogo
                data-h2-display="base(inline-block) base:dark(none)"
                data-h2-max-width="base(x10)"
              />
              <CanadaLogoWhite
                data-h2-display="base(none) base:dark(inline-block)"
                data-h2-max-width="base(x10)"
              />
              <span data-h2-visually-hidden="base(invisible)">
                {intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "m1eQrS",
                  description:
                    "Alt text for the Canada logo link in the Footer.",
                })}
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
