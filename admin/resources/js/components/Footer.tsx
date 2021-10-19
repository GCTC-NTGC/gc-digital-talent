import * as React from "react";
import { Link } from "@common/components";
import { currentDate } from "@common/helpers/formUtils";
import { imageUrl } from "@common/helpers/router";
import { defineMessages, useIntl } from "react-intl";
import { BASE_URL } from "../adminConstants";

const messages = defineMessages({
  feedbackTitle: {
    defaultMessage: "Submit feedback to GC Talent Cloud via email.",
    description: "Title for the feedback link in the Footer.",
  },
  feedbackLabel: {
    defaultMessage: "Feedback",
    description: "Label for the feedback link in the Footer.",
  },
  termsAndConditionsTitle: {
    defaultMessage: "View our terms and conditions.",
    description: "Title for the terms and conditions link in the Footer.",
  },
  termsAndConditionsLabel: {
    defaultMessage: "Terms & Conditions",
    description: "Label for the terms and conditions link in the Footer.",
  },
  privacyTitle: {
    defaultMessage: "View our privacy policy.",
    description: "Title for the privacy link in the Footer.",
  },
  privacyLabel: {
    defaultMessage: "Privacy Policy",
    description: "Label for the privacy link in the Footer.",
  },
  canadaTitle: {
    defaultMessage: "Visit Canada.ca.",
    description: "Title for the Canada link in the Footer.",
  },
  canadaLabel: {
    defaultMessage: "Canada.ca",
    description: "Label for the Canada link in the Footer.",
  },
  dateModified: {
    defaultMessage: "Date Modified",
    description:
      "Header for the sites last date modification found in the footer.",
  },
  canadaLogoTitle: {
    defaultMessage: "Visit Canada.ca.",
    description: "Title for the Canada logo in the Footer.",
  },
  canadaLogoLabel: {
    defaultMessage: "Canada.ca",
    description: "Label for the Canada logo in the Footer.",
  },
  canadaLogoAlt: {
    defaultMessage: "Canada's Logo.",
    description: "Alt text for the Canada logo in the Footer.",
  },
});

const Footer: React.FunctionComponent = () => {
  const intl = useIntl();
  const links = [
    {
      route: "mailto:talent.cloud-nuage.de.talents@tbs-sct.gc.ca",
      title: intl.formatMessage(messages.feedbackTitle),
      label: intl.formatMessage(messages.feedbackLabel),
    },
    {
      route: `/${intl.locale}/tos`,
      title: intl.formatMessage(messages.termsAndConditionsTitle),
      label: intl.formatMessage(messages.termsAndConditionsLabel),
    },
    {
      route: `/${intl.locale}/privacy`,
      title: intl.formatMessage(messages.privacyTitle),
      label: intl.formatMessage(messages.privacyLabel),
    },
    {
      route: `https://www.canada.ca/${intl.locale}.html`,
      title: intl.formatMessage(messages.canadaTitle),
      label: intl.formatMessage(messages.canadaLabel),
    },
  ];
  return (
    <footer
      className="footer"
      data-h2-border="b(gray, top, solid, s)"
      data-h2-bg-color="b(lightgray[.6])"
      style={{ marginTop: "auto" }}
    >
      <div data-h2-flex-grid="b(middle, contained, flush, xl)">
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-padding="b(left, xl)"
          data-h2-text-align="b(center) m(left)"
        >
          <nav>
            <ul
              style={{ gap: "1rem" }}
              className="reset-ul"
              data-h2-display="b(flex)"
              data-h2-flex-wrap="b(wrap)"
              data-h2-justify-content="b(center) m(flex-start)"
              data-h2-margin="b(bottom, xs)"
            >
              {links.map(({ route, title, label }) => (
                <li
                  key={label}
                  data-h2-display="b(inline-block)"
                  data-h2-margin="b(top-bottom, none)"
                >
                  <Link href={route} title={title}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p
            data-h2-font-size="b(caption)"
            data-h2-font-color="b([dark]gray)"
            data-h2-margin="b(bottom, none) b(top, m)"
          >
            {intl.formatMessage(messages.dateModified)}: {currentDate()}
          </p>
        </div>
        <div
          data-h2-flex-item="b(1of1) m(1of2)"
          data-h2-padding="b(right, xl)"
          data-h2-text-align="b(center) m(right)"
        >
          <a
            href={`https://www.canada.ca/${intl.locale}.html`}
            title={intl.formatMessage(messages.canadaLogoTitle)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              style={{ width: "12rem" }}
              src={imageUrl(BASE_URL, "logo_canada.png")}
              alt={intl.formatMessage(messages.canadaLogoAlt)}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
