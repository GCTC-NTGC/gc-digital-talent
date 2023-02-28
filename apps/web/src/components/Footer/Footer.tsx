import * as React from "react";
import { useIntl } from "react-intl";

import { CanadaLogo, CanadaLogoWhite } from "../Svg";

interface FooterProps {
  width?: string;
}

const Footer = ({ width }: FooterProps) => {
  const intl = useIntl();

  const links = [
    {
      route: `/${intl.locale}/support`,
      label: intl.formatMessage({
        defaultMessage: "Contact Us",
        id: "AWiMVP",
        description: "Label for the support link in the Footer.",
      }),
    },
    {
      route: `/${intl.locale}/terms-and-conditions`,
      label: intl.formatMessage({
        defaultMessage: "Terms & Conditions",
        id: "ZGpncy",
        description: "Label for the terms and conditions link in the Footer.",
      }),
    },
    {
      route: `/${intl.locale}/privacy-notice`,
      label: intl.formatMessage({
        defaultMessage: "Privacy Policy",
        id: "VcOlXA",
        description: "Label for the privacy link in the Footer.",
      }),
    },
    {
      // This needs a real route and translated label
      route: `/${intl.locale}/accessibility-statement`,
      label: intl.formatMessage({
        defaultMessage: "Accessibility statement",
        id: "2iCpAL",
        description: "Title for the websites accessibility statement",
      }),
    },
    {
      route: `https://www.canada.ca/${intl.locale}.html`,
      label: intl.formatMessage({
        defaultMessage: "Canada.ca",
        id: "ZE77nf",
        description: "Label for the Canada link in the Footer.",
      }),
    },
  ];
  let footerWidth = {
    "data-h2-container": "base(center, large, x1) p-tablet(center, large, x2)",
  };
  if (width === "full") {
    footerWidth = {
      "data-h2-container": "base(center, full, x1) p-tablet(center, full, x2)",
    };
  }
  return (
    <footer
      className="footer"
      data-h2-background-color="base(black.lightest.10) base:dark(black.light)"
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
              {links.map(({ route, label }) => (
                <a
                  key={route}
                  href={route}
                  data-h2-background-color="base:focus-visible(focus)"
                  data-h2-outline="base(none)"
                  data-h2-color="base:hover(tm-blue.dark) base:focus-visible(black)"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div data-h2-margin="base(x2, 0, x1, 0) p-tablet(x1, 0, 0, 0)">
              <p
                data-h2-color="base(black.70) base:dark(white.70)"
                data-h2-font-size="base(caption)"
              >
                {intl.formatMessage(
                  {
                    defaultMessage: "Date Modified: {modifiedDate}",
                    id: "Fc/i3e",
                    description:
                      "Header for the sites last date modification found in the footer.",
                  },
                  {
                    modifiedDate: new Date(
                      process.env.BUILD_DATE ?? "1970-01-01",
                    )
                      .toISOString()
                      .slice(0, 10),
                  },
                )}
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
