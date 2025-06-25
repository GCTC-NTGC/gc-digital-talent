import { ReactNode, useRef } from "react";
import { defineMessage, useIntl } from "react-intl";
import { useReactToPrint } from "react-to-print";

import {
  Alert,
  Heading,
  ThrowNotFound,
  Button,
  Link,
  Container,
} from "@gc-digital-talent/ui";
import { Scalars } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import printStyles from "~/styles/printStyles";

import RequestConfirmationPrintDocument from "./components/RequestConfirmationPrintDocument";

const pageTitle = defineMessage({
  defaultMessage: "Successful request",
  id: "DcpFle",
  description: "Page title for the request confirmation page.",
});

const subTitle = defineMessage({
  defaultMessage: "Your request was submitted successfully.",
  id: "rVgBGi",
  description: "Subtitle for the request confirmation page.",
});

interface RouteParams extends Record<string, string> {
  requestId: Scalars["ID"]["output"];
}

const mailLink = (chunks: ReactNode) => (
  <Link external href="mailto:recruitmentimit-recrutementgiti@tbs-sct.gc.ca">
    {chunks}
  </Link>
);

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { requestId } = useRequiredParams<RouteParams>("requestId");

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedSubTitle = intl.formatMessage(subTitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
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
        url: paths.requestConfirmation(requestId),
      },
    ],
  });

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    pageStyle: printStyles,
    documentTitle: intl.formatMessage({
      defaultMessage: "Request submitted",
      id: "0zo274",
      description: "Link text for request confirmation breadcrumb",
    }),
  });

  return requestId ? (
    <>
      <SEO title={formattedPageTitle} description={formattedSubTitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedSubTitle}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <Alert.Root type="success" live={false} className="mb-18">
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage: "We have received your request",
              id: "7DYnwq",
              description:
                "Paragraph one, message to user the request was received",
            })}
          </Alert.Title>
          <p className="mt-6">
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
          </p>
          <Heading level="h3" size="h6" className="mt-6 mb-3 font-bold">
            {intl.formatMessage({
              defaultMessage: "What you can expect",
              id: "N/Vcp3",
              description:
                "Heading for the section about user expectations for their request",
            })}
          </Heading>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "You will receive a follow up on your request within the next 5 to 10 business days.",
              id: "3rbRfI",
              description:
                "Description of when the user should expect a response to their request",
              // eslint-disable-next-line formatjs/no-literal-string-in-jsx
            })}{" "}
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you have not heard from us or have any questions, please get in touch with us at: <mailLink>recruitmentimit-recrutementgiti@tbs-sct.gc.ca</mailLink>",
                id: "TsUcCM",
                description:
                  "Description of how a user can contact someone for answers/information on their existing request",
              },
              {
                mailLink,
              },
            )}
          </p>
          <div className="flex flex-wrap items-center gap-6 print:hidden">
            <Button mode="solid" color="primary" onClick={() => handlePrint()}>
              {intl.formatMessage({
                defaultMessage: "Print this information",
                id: "idu0MU",
                description:
                  "Button text to print the request confirmation page",
              })}
            </Button>
            <RequestConfirmationPrintDocument
              requestId={requestId}
              ref={componentRef}
            />
            <Link mode="inline" href={paths.search()} color="secondary">
              {intl.formatMessage({
                defaultMessage: "Create another talent request",
                id: "ZN9OsN",
                description: "Link text to start a new talent request",
              })}
            </Link>
          </div>
        </Alert.Root>
      </Container>
    </>
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "RequestConfirmationPage";

export default Component;
