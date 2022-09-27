import * as React from "react";
import { useIntl } from "react-intl";
import { imageUrl } from "../../helpers/router";

const Footer: React.FunctionComponent<{
  baseUrl: string;
  width?: string;
}> = ({ baseUrl, width }) => {
  const intl = useIntl();
  const links = [
    {
      route: "mailto:GCTalentGC@tbs-sct.gc.ca",
      title: intl.formatMessage({
        defaultMessage: "Submit feedback to GC Talent Cloud via email.",
        id: "mZMdKM",
        description: "Title for the feedback link in the Footer.",
      }),
      label: intl.formatMessage({
        defaultMessage: "Feedback",
        id: "1J4e+j",
        description: "Label for the feedback link in the Footer.",
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
      data-h2-background-color="base(black.lightest.1) base:dark(black.light)"
      data-h2-border="base(top, 1px, solid, black.2)"
      data-h2-padding="base(x2, 0)"
      data-h2-margin="base(auto, 0, 0, 0)"
    >
      <div {...footerWidth}>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(1fr) p-tablet(1fr 1fr)"
          data-h2-gap="base(x1) p-tablet(x2)"
          data-h2-align-items="base(center)"
        >
          <div data-h2-text-align="base(center) p-tablet(left)">
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
                data-h2-color="base(black.7) base:dark(white.7)"
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
              <img
                data-h2-display="base(block) base:dark(none)"
                data-h2-max-width="base(x10)"
                src={imageUrl(baseUrl, "canada-logo-light.svg")}
                alt={intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "m1eQrS",
                  description:
                    "Alt text for the Canada logo link in the Footer.",
                })}
              />
              <img
                data-h2-display="base(none) base:dark(block)"
                data-h2-max-width="base(x10)"
                src={imageUrl(baseUrl, "canada-logo-dark.svg")}
                alt={intl.formatMessage({
                  defaultMessage: "Canada.ca",
                  id: "m1eQrS",
                  description:
                    "Alt text for the Canada logo link in the Footer.",
                })}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
