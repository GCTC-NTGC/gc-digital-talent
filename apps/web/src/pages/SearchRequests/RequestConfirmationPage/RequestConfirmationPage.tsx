import React from "react";
import { useIntl } from "react-intl";
import { useParams } from "react-router-dom";

import Hero from "@common/components/Hero";
import Heading from "@common/components/Heading/Heading";
import { ThrowNotFound } from "@common/components/NotFound";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

import { Scalars } from "~/api/generated";
import { Button, Link } from "~/../../../frontend/common/src/components";
import SEO from "~/../../../frontend/common/src/components/SEO/SEO";

type RequestConfirmationParams = {
  requestId: Scalars["ID"];
};

const Text = ({ children, ...rest }: React.HTMLProps<HTMLParagraphElement>) => (
  <p data-h2-margin="base(x1, 0)" {...rest}>
    {children}
  </p>
);

const mailLink = (chunks: React.ReactNode) => (
  <a href="mailto:recruitmentimit-recrutementgiti@tbs-sct.gc.ca">{chunks}</a>
);

const RequestConfirmationPage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { requestId } = useParams<RequestConfirmationParams>();

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage({
        defaultMessage: "Search for talent",
        id: "weLwJA",
        description: "Link text for the search page breadcrumb",
      }),
      url: paths.search(),
    },
    {
      label: intl.formatMessage({
        defaultMessage: "Request submitted",
        id: "0zo274",
        description: "Link text for request confirmation breadcrumb",
      }),
      url: paths.requestConfirmation(requestId || ""),
    },
  ]);

  const pageTitle = intl.formatMessage({
    defaultMessage: "Successful request",
    id: "DcpFle",
    description: "Page title for the request confirmation page.",
  });

  return requestId ? (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage: "Your request was submitted successfully.",
          id: "rVgBGi",
          description: "Subtitle for the request confirmation page.",
        })}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <Text data-h2-font-size="base(3rem)">
          {intl.formatMessage({
            defaultMessage: "We got it!",
            id: "hEa14D",
            description:
              "Lead in text for the page content on the request confirmation page",
          })}
        </Text>
        <Text>
          {intl.formatMessage({
            defaultMessage:
              "We have received your request and will review it as soon as possible.",
            id: "lA+c8E",
            description:
              "Paragraph one, message to user the request was received",
          })}
        </Text>
        <Text>
          {intl.formatMessage(
            {
              defaultMessage:
                "Your tracking number for this request is: <strong>{requestId}</strong>",
              id: "amxWPg",
              description:
                "Message to the user about the ID of their request for referencing the request",
            },
            { requestId },
          )}
        </Text>
        <Heading level="h2" size="h4" data-h2-font-weight="base(700)">
          {intl.formatMessage({
            defaultMessage: "What you can expect",
            id: "N/Vcp3",
            description:
              "Heading for the section about user expectations for their request",
          })}
        </Heading>
        <Text>
          {intl.formatMessage({
            defaultMessage:
              "You will receive a follow up on your request within the next 2 to 4 business days.",
            id: "ltn4Er",
            description:
              "Description of when the user should expect a response to their request",
          })}
        </Text>
        <Text>
          {intl.formatMessage(
            {
              defaultMessage:
                "If you have not heard from us or have any immediate questions and request further guidance, please get in touch with use at: <mailLink>recruitmentimit-recrutementgiti@tbs-sct.gc.ca</mailLink>",
              id: "dLGxL6",
              description:
                "Description of how a user can contact someone for answers/information on their existing request",
            },
            {
              mailLink,
            },
          )}
        </Text>
        <div
          data-h2-margin="base(x1 0)"
          data-h2-display="base(flex)"
          data-h2-flex-wrap="base(wrap)"
          data-h2-gap="base(x1)"
        >
          <Button mode="solid" color="cta" onClick={() => window.print()}>
            {intl.formatMessage({
              defaultMessage: "Print this information",
              id: "idu0MU",
              description: "Button text to print the request confirmation page",
            })}
          </Button>
          <Link
            href={paths.search()}
            mode="outline"
            color="primary"
            type="button"
          >
            {intl.formatMessage({
              defaultMessage: "Create a new talent request",
              id: "+d2TiI",
              description: "Link text to start a new talent request",
            })}
          </Link>
        </div>
      </div>
    </>
  ) : (
    <ThrowNotFound />
  );
};

export default RequestConfirmationPage;
