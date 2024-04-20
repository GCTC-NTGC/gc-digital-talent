import React from "react";
import { useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";

import {
  Chip,
  Chips,
  Color,
  Heading,
  HeadingRank,
} from "@gc-digital-talent/ui";
import { Pool } from "@gc-digital-talent/graphql";

import {
  getMissingLanguageRequirements,
  PartialUser,
} from "~/utils/languageUtils";

interface MissingLanguageRequirementsBlockProps {
  chipType: { color: Color };
  /** Title for the block */
  title: React.ReactNode;
  /** Message displayed before language requirements that are missing from application */
  languageRequirementsBlurb: React.ReactNode;
  /** Icon displayed next to the title */
  icon: React.ReactNode;
  /** Language requirements missing from the application */
  missingLanguageRequirements: string[];
  /** heading rank to display the title as */
  headingLevel: HeadingRank;
}

const MissingLanguageRequirementsBlock = ({
  chipType,
  title,
  languageRequirementsBlurb,
  icon,
  missingLanguageRequirements,
  headingLevel = "h2",
}: MissingLanguageRequirementsBlockProps) => {
  return (
    <div
      data-h2-background-color="base(foreground)"
      className="mb-3 flex rounded p-6 shadow-md"
    >
      <span className="mr-6 mt-1">{icon}</span>
      <div>
        <Heading
          level={headingLevel}
          size="h6"
          data-h2-margin="base(0, 0, x.5, 0)"
        >
          {title}
        </Heading>
        {missingLanguageRequirements.length ? (
          <>
            <p className="mb-1.5 mt-3">{languageRequirementsBlurb}</p>
            <Chips>
              {missingLanguageRequirements.map((requirementName: string) => (
                <Chip key={requirementName} color={chipType.color}>
                  {requirementName}
                </Chip>
              ))}
            </Chips>
          </>
        ) : null}
      </div>
    </div>
  );
};

export interface MissingLanguageRequirementsProps {
  user?: PartialUser;
  pool?: Pool | null;
  headingLevel?: HeadingRank;
}

const MissingLanguageRequirements = ({
  user,
  pool,
  headingLevel = "h2",
}: MissingLanguageRequirementsProps) => {
  const intl = useIntl();

  const missingLanguageRequirements = getMissingLanguageRequirements(
    user,
    pool,
  ).map((messageDescriptor) => intl.formatMessage(messageDescriptor));

  return missingLanguageRequirements.length ? (
    <MissingLanguageRequirementsBlock
      chipType={{ color: "error" }}
      headingLevel={headingLevel}
      title={intl.formatMessage({
        defaultMessage: "There is a missing language requirement",
        id: "Vbt/G1",
        description:
          "Title that appears when a user is missing a language requirement.",
      })}
      languageRequirementsBlurb={intl.formatMessage({
        defaultMessage:
          "For this application process, you need the following language requirement:",
        id: "hWHT65",
        description:
          "Text that appears when a user is missing a language requirement on their profile.",
      })}
      icon={
        <ExclamationTriangleIcon
          style={{ width: "1.2rem" }}
          data-h2-color="base(error)"
        />
      }
      missingLanguageRequirements={missingLanguageRequirements}
    />
  ) : null;
};

export default MissingLanguageRequirements;
