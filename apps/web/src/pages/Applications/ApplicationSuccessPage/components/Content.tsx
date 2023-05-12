import React from "react";
import { useIntl } from "react-intl";

import { ExternalLink, Link } from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";

const DefaultContent = () => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();

  return (
    <>
      <p data-h2-margin="base(x.5, 0)">
        {intl.formatMessage({
          defaultMessage:
            "We'll be in touch if your application matches the criteria outlined by the opportunity. In the meantime, check out the following resources for further information on what might be next.",
          id: "lE92J0",
          description:
            "Description of review process and next steps for the applicant.",
        })}
      </p>
      <ul data-h2-margin-bottom="base(x1.5)">
        <li data-h2-margin-bottom="base(x.25)">
          <ExternalLink
            newTab
            href={
              locale === "en"
                ? "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-eng.asp"
                : "https://www.tbs-sct.canada.ca/tbsf-fsct/330-60-fra.asp"
            }
          >
            {intl.formatMessage({
              defaultMessage: "Find and complete security clearance forms.",
              id: "otUMji",
              description:
                "Link text for government of canada security clearance forms",
            })}
          </ExternalLink>
        </li>
        <li data-h2-margin-bottom="base(x.25)">
          <Link href={paths.myProfile()}>
            {intl.formatMessage({
              defaultMessage:
                "Update profile and contact information to ensure you receive notifications.",
              id: "nFO3Ai",
              description:
                "Link text to users profile to update contact information",
            })}
          </Link>
        </li>
        <li data-h2-margin-bottom="base(x.25)">
          <Link href={`${paths.browsePools()}#ongoingRecruitments`}>
            {intl.formatMessage({
              defaultMessage:
                "Submit an application to ongoing recruitment talent pools.",
              id: "ZTnze/",
              description:
                "Link text to the ongoing recruitments section on the browse page",
            })}
          </Link>
        </li>
      </ul>
    </>
  );
};

const IAPContent = () => {
  const intl = useIntl();
  const { locale } = useLocale();
  const paths = useRoutes();

  return (
    <>
      <p data-h2-margin="base(x.5, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Thank you for your interest in becoming an IT apprentice with the Government of Canada. Your lived experience, skills, passion and interests are warmly received and acknowledged. A member of the Office of Indigenous Initiatives team will contact you within the next three to five business days to discuss your application.",
          id: "lE92J0",
          description:
            "Description of review process and next steps for the indigenous apprenticeship applicant.",
        })}
      </p>
      <ul data-h2-margin-bottom="base(x1.5)">
        <li data-h2-margin-bottom="base(x.25)">
          <Link href={paths.myProfile()}>
            {intl.formatMessage({
              defaultMessage:
                "Update profile and contact information to ensure you receive notifications.",
              id: "nFO3Ai",
              description:
                "Link text to users profile to update contact information",
            })}
          </Link>
        </li>
      </ul>
    </>
  );
};
