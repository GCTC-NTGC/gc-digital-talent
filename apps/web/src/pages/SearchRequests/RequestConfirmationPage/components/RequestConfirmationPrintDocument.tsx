import { useIntl } from "react-intl";
import { ReactNode, forwardRef } from "react";

import { Heading } from "@gc-digital-talent/ui";

interface RequestConfirmationPrintDocumentProps {
  requestId: string;
}

const PageSection = ({ children }: { children: ReactNode }) => (
  <div
    data-h2-margin-bottom="base(2rem)"
    data-h2-display="base(block)"
    data-h2-break-inside="base(avoid) base:print(avoid)"
    data-h2-break-after="base(avoid) base:print(avoid)"
  >
    {children}
  </div>
);

const RequestConfirmationPrintDocument = forwardRef<
  HTMLDivElement,
  RequestConfirmationPrintDocumentProps
>(({ requestId }, ref) => {
  const intl = useIntl();

  return (
    <div style={{ display: "none" }}>
      <div data-h2 ref={ref}>
        <div
          data-h2-font-family="base(sans) base:print(sans)"
          data-h2-padding-bottom="base(1rem)"
          data-h2-border-bottom="base(2px dashed black) base:print(2px dashed black)"
        >
          <PageSection>
            <Heading level="h2" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "We have received your request",
                id: "7DYnwq",
                description:
                  "Paragraph one, message to user the request was received",
              })}
            </Heading>
            <p>
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
          </PageSection>
          <PageSection>
            <Heading level="h2" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage: "What you can expect",
                id: "N/Vcp3",
                description:
                  "Heading for the section about user expectations for their request",
              })}
            </Heading>
            <p data-h2-margin="base(0, 0, x1, 0)">
              {intl.formatMessage({
                defaultMessage:
                  "You will receive a follow up on your request within the next 5 to 10 business days.",
                id: "3rbRfI",
                description:
                  "Description of when the user should expect a response to their request",
                // eslint-disable-next-line formatjs/no-literal-string-in-jsx
              })}{" "}
              {intl.formatMessage({
                defaultMessage:
                  "If you have not heard from us or have any questions, please get in touch with us at: <strong>recruitmentimit-recrutementgiti@tbs-sct.gc.ca</strong>",
                id: "Uea7/1",
                description:
                  "Description of how a user can contact someone for answers/information on their existing request",
              })}
            </p>
          </PageSection>
        </div>
      </div>
    </div>
  );
});

export default RequestConfirmationPrintDocument;
