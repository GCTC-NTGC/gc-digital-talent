import { useIntl } from "react-intl";
import ExclamationTriangleIcon from "@heroicons/react/24/solid/ExclamationTriangleIcon";
import { ReactNode } from "react";
import { tv } from "tailwind-variants";

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

const reqBlock = tv({ base: "flex gap-x-3 rounded-md p-6" });

interface MissingLanguageRequirementsBlockProps {
  chipType: { color: ChipProps["color"] };
  className?: string;
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
  className,
  ...rest
}: MissingLanguageRequirementsBlockProps) => {
  return (
    <div className={reqBlock({ class: className })} {...rest}>
      {icon}
      <div>
        <Heading level={headingLevel} size="h6" className="mt-0 mb-3">
          {title}
        </Heading>
        {missingLanguageRequirements.length ? (
          <>
            <p className="mt-3 mb-1.5">{languageRequirementsBlurb}</p>
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
      className="mb-3 bg-white shadow-md dark:bg-gray-600"
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
      icon={<ExclamationTriangleIcon className="size-4.5 text-error" />}
      missingLanguageRequirements={missingLanguageRequirements}
    />
  ) : null;
};

export default MissingLanguageRequirements;
