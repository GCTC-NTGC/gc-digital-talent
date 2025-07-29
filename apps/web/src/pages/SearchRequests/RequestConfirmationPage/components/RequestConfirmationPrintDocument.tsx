import { useIntl } from "react-intl";
import { ReactNode, forwardRef } from "react";

import { Heading } from "@gc-digital-talent/ui";

interface RequestConfirmationPrintDocumentProps {
  requestId: string;
}

const PageSection = ({ children }: { children: ReactNode }) => (
  <div className="mb-8 block break-inside-avoid break-after-avoid">
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
      <div ref={ref}>
        <div className="border-b-2 border-dashed border-b-black pb-4 font-sans">
          <PageSection>
            <Heading level="h2" className="font-bold">
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
            <Heading level="h2" className="font-bold">
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
                  "You will receive a follow up on your request within the next 5 to 10 business days. If you have not heard from us or have any questions, please get in touch with us at: <strong>recruitmentimit-recrutementgiti@tbs-sct.gc.ca</strong>",
                id: "auSzlQ",
                description:
                  "Description of expected follow up time and contact information for an existing request",
              })}
            </p>
          </PageSection>
        </div>
      </div>
    </div>
  );
});

export default RequestConfirmationPrintDocument;
