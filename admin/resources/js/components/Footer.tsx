import * as React from "react";
import { defineMessages, useIntl } from "react-intl";
import { Link } from "../helpers/router";
import { currentDate } from "./form/formUtils";

const messages = defineMessages({
  feedbackTitle: {
    id: "footer.feedbackTitle",
    defaultMessage: "Submit feedback to GC Talent Cloud via email.",
    description: "Title for the feedback link in the Footer.",
  },
  feedbackLabel: {
    id: "footer.feedbackLabel",
    defaultMessage: "Feedback",
    description: "Label for the feedback link in the Footer.",
  },
  termsAndConditionsTitle: {
    id: "footer.termsAndConditionsTitle",
    defaultMessage: "View our terms and conditions.",
    description: "Title for the terms and conditions link in the Footer.",
  },
  termsAndConditionsLabel: {
    id: "footer.termsAndConditionsLabel",
    defaultMessage: "Terms & Conditions",
    description: "Label for the terms and conditions link in the Footer.",
  },
  privacyTitle: {
    id: "footer.privacyTitle",
    defaultMessage: "View our privacy policy.",
    description: "Title for the privacy link in the Footer.",
  },
  privacyLabel: {
    id: "footer.privacyLabel",
    defaultMessage: "Privacy Policy",
    description: "Label for the privacy link in the Footer.",
  },
  canadaTitle: {
    id: "footer.canadaTitle",
    defaultMessage: "Visit Canada.ca.",
    description: "Title for the canada link in the Footer.",
  },
  canadaLabel: {
    id: "footer.canadaLabel",
    defaultMessage: "Canada.ca",
    description: "Label for the canada link in the Footer.",
  },
  dateModified: {
    id: "footer.dateModified",
    defaultMessage: "Date Modified",
    description:
      "Header for the sites last date modification found in the footer.",
  },
  canadaLogoTitle: {
    id: "footer.canadaLogoTitle",
    defaultMessage: "Visit Canada.ca.",
    description: "Title for the canada logo in the Footer.",
  },
  canadaLogoLabel: {
    id: "footer.canadaLogoLabel",
    defaultMessage: "Canada.ca",
    description: "Label for the canada logo in the Footer.",
  },
  canadaLogoAlt: {
    id: "footer.canadaLogoLabel",
    defaultMessage: "Canada's Logo.",
    description: "Alt text for the canada logo in the Footer.",
  },
});

const Footer: React.FunctionComponent<{}> = () => {
  const intl = useIntl();
  const links = [
    {
      route: "mailto:talent.cloud-nuage.de.talents@tbs-sct.gc.ca",
      title: intl.formatMessage(messages.feedbackTitle),
      label: intl.formatMessage(messages.feedbackLabel),
    },
    {
      route: "/en/tos",
      title: intl.formatMessage(messages.termsAndConditionsTitle),
      label: intl.formatMessage(messages.termsAndConditionsLabel),
    },
    {
      route: "/en/privacy",
      title: intl.formatMessage(messages.privacyTitle),
      label: intl.formatMessage(messages.privacyLabel),
    },
    {
      route: `https://www.canada.ca/${intl.locale}.html`, // TODO: Change 'en' to dynamic locale
      title: intl.formatMessage(messages.canadaTitle),
      label: intl.formatMessage(messages.canadaLabel),
    },
  ];
  return (
    <footer
      className="footer"
      data-h2-border="b(gray, top, solid, s)"
      data-h2-bg-color="b(lightgray[.6])"
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
              src="/images/logo_canada.png"
              alt={intl.formatMessage(messages.canadaLogoAlt)}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
