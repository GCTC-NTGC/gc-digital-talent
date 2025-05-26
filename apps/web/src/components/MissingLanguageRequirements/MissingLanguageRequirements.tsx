import { useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import { ReactNode } from "react";

import {
  Chip,
  ChipProps,
  Chips,
  Heading,
  HeadingRank,
} from "@gc-digital-talent/ui";
import { Pool } from "@gc-digital-talent/graphql";

import {
  getMissingLanguageRequirements,
  PartialUser,
} from "~/utils/languageUtils";

interface MissingLanguageRequirementsBlockProps {
  chipType: { color: ChipProps["color"] };
  /** Title for the block */
  title: ReactNode;
  /** Message displayed before language requirements that are missing from application */
  languageRequirementsBlurb: ReactNode;
  /** Icon displayed next to the title */
  icon: ReactNode;
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
  ...rest
}: MissingLanguageRequirementsBlockProps) => {
  return (
    <div
      data-h2-display="base(flex)"
      data-h2-padding="base(x1)"
      data-h2-radius="base(rounded)"
      {...rest}
    >
      <span data-h2-margin="base(x.15, x1, 0, 0)">{icon}</span>
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
            <p data-h2-margin="base(x.5, 0, x.25, 0)">
              {languageRequirementsBlurb}
            </p>
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
  pool?: Pick<Pool, "language"> | null;
  headingLevel?: HeadingRank;
}

const MissingLanguageRequirements = ({
  user,
  pool,
  headingLevel = "h2",
}: MissingLanguageRequirementsProps) => {
  const intl = useIntl();

  const missingLanguageRequirements = getMissingLanguageRequirements(user, {
    language: pool?.language,
  }).map((messageDescriptor) => intl.formatMessage(messageDescriptor));

  return missingLanguageRequirements.length ? (
    <MissingLanguageRequirementsBlock
      data-h2-background-color="base(foreground)"
      data-h2-shadow="base(medium)"
      data-h2-margin="base(0, 0, x.5, 0)"
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
