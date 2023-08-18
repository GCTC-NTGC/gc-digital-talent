import React from "react";
import { useIntl } from "react-intl";
import FlagIcon from "@heroicons/react/24/outline/FlagIcon";

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
        color="secondary"
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
              "All questions in this questionnaire are marked as required (<red>*</red>) unless otherwise specified. A copy of your submission will be emailed to you upon completion. Please note that you can also optionally download a blank copy of this form and submit it to the <link>GC Digital Talent mailbox</link> through email.",
            id: "kj2Qkb",
            description:
              "Paragraph two of the _instructions_ section of the _digital services contracting questionnaire_",
          },
          {
            link: (text: React.ReactNode) =>
              buildExternalLink("mailto:GCTalentGC@tbs-sct.gc.ca", text),
          },
        )}
      </p>
      <p data-h2-margin-top="base(x.5)">
        {intl.formatMessage(
          {
            defaultMessage:
              "For any questions or concerns regarding the questionnaire, contact <link>GC Digital Talent</link> for more information.",
            id: "Vjf463",
            description:
              "Paragraph three of the _instructions_ section of the _digital services contracting questionnaire_",
          },
          {
            link: (text: React.ReactNode) =>
              buildExternalLink("mailto:GCTalentGC@tbs-sct.gc.ca", text),
          },
        )}
      </p>
    </TableOfContents.Section>
  );
};

export default InstructionsSection;
