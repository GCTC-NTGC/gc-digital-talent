import { useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";
import { ReactNode } from "react";

import { Heading, TableOfContents } from "@gc-digital-talent/ui";

import { getSectionTitle, PAGE_SECTION_ID } from "../navigation";
import { buildExternalLink } from "../../util";

const InstructionsSection = () => {
  const intl = useIntl();
  return (
    <TableOfContents.Section id={PAGE_SECTION_ID.INSTRUCTIONS}>
      <Heading
        Icon={FlagIcon}
        level="h2"
        size="h3"
        color="secondary"
        data-h2-font-weight="base(400)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        {intl.formatMessage(getSectionTitle(PAGE_SECTION_ID.INSTRUCTIONS))}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Complete and submit this questionnaire at the time when a contract for digital services is submitted to departmental procurement authorities for processing.",
          id: "SgkkWp",
          description:
            "Paragraph one of the _instructions_ section of the _digital services contracting questionnaire_",
        })}
      </p>
      <p data-h2-margin-top="base(x.5)">
        {intl.formatMessage(
          {
            defaultMessage:
              "All questions in this questionnaire are marked as required (<red>*</red>) unless otherwise specified. A copy of your submission will be emailed to you upon completion.",
            id: "xoT1eU",
            description:
              "Paragraph two of the _instructions_ section of the _digital services contracting questionnaire_",
          },
          {
            link: (text: ReactNode) =>
              buildExternalLink("mailto:GCTalentGC@tbs-sct.gc.ca", text),
          },
        )}
      </p>
      <p data-h2-margin-top="base(x.5)">
        {intl.formatMessage(
          {
            defaultMessage:
              "There are two ways to submit this questionnaire. The first way is to complete this questionnaire online here. Please note that the questionnaire needs to be completed and submitted in one go. You cannot save your answers as draft. The second way to complete this questionnaire is by downloading it as a file, completing it off the platform, and submitting it via email to the <link>GC Digital Talent mailbox</link>.",
            id: "WNqXQa",
            description:
              "Paragraph three of the _instructions_ section of the _digital services contracting questionnaire_",
          },
          {
            link: (text: ReactNode) =>
              buildExternalLink("mailto:GCTalentGC@tbs-sct.gc.ca", text),
          },
        )}
      </p>
      <p data-h2-margin-top="base(x.5)">
        {intl.formatMessage(
          {
            defaultMessage:
              "For any questions or concerns regarding the questionnaire, contact <link>GC Digital Talent</link> for more information.",
            id: "4l+jIq",
            description:
              "Paragraph four of the _instructions_ section of the _digital services contracting questionnaire_",
          },
          {
            link: (text: ReactNode) =>
              buildExternalLink("mailto:GCTalentGC@tbs-sct.gc.ca", text),
          },
        )}
      </p>
    </TableOfContents.Section>
  );
};

export default InstructionsSection;
