import * as React from "react";
import { useIntl } from "react-intl";
import TagIcon from "@heroicons/react/24/outline/TagIcon";

import { Heading, Link, ScrollToLink, Well } from "@gc-digital-talent/ui";
import { getLocale } from "@gc-digital-talent/i18n";

import { PublishingGroup } from "~/api/generated";
import EducationRequirements from "~/components/EducationRequirements/EducationRequirements";
import { getClassificationGroup } from "~/utils/poolUtils";
import { isInNullState } from "~/validators/process/classification";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import { wrapAbbr } from "~/utils/nameUtils";

import { SectionProps } from "../types";

type EducationRequirementsSectionProps = Omit<SectionProps<null>, "onSave"> & {
  changeTargetId: string;
};

const EducationRequirementsSection = ({
  pool,
  sectionMetadata,
  changeTargetId,
}: EducationRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const isNull = isInNullState(pool);
  const { icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: isNull, // Not a required field
    fallbackIcon: TagIcon,
  });
  const classificationGroup = getClassificationGroup(pool);
  const { classifications } = pool;
  const classification = classifications ? classifications[0] : null;

  let classificationAbbr; // type wrangling the complex type into a string
  if (classification) {
    const { group, level } = classification;
    classificationAbbr = wrapAbbr(`${group}-0${level}`, intl);
  }

  const qualityStandardsLink = (chunks: React.ReactNode) => {
    const href =
      locale === "en"
        ? "https://www.canada.ca/en/treasury-board-secretariat/services/staffing/qualification-standards/core.html#rpsi"
        : "https://www.canada.ca/fr/secretariat-conseil-tresor/services/dotation/normes-qualification/centrale.html#eepr";
    return (
      <Link href={href} newTab external>
        {chunks}
      </Link>
    );
  };

  const scrollToLink = (chunks: React.ReactNode) => (
    <ScrollToLink to={changeTargetId} mode="text" color="secondary">
      {chunks}
    </ScrollToLink>
  );

  return (
    <div>
      <Heading
        Icon={icon.icon}
        color={icon.color}
        level="h2"
        size="h3"
        data-h2-margin-top="base(0)"
      >
        {sectionMetadata.title}
      </Heading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage(
          {
            defaultMessage:
              "The minimum education requirements provided in this section are determined by your choice of classification and level for this process {classificationAbbr}. They have been determined based on the <qualityStandardsLink>Government of Canada qualification standards.</qualityStandardsLink> These requirements can only be changed by <scrollToLink>selecting a different classification group and level.</scrollToLink>",
            id: "W5bt6H",
            description: "Lead-in text for a process' education requirements",
          },
          {
            qualityStandardsLink,
            scrollToLink,
            classificationAbbr,
          },
        )}
      </p>
      {isNull ? (
        <Well data-h2-margin="base(x1 0)" data-h2-text-align="base(center)">
          <Heading data-h2-margin-top="base(0)" data-h2-font-size="base(copy)">
            {intl.formatMessage({
              defaultMessage:
                "Select a classification to view education requirements.",
              id: "PymrxL",
              description: "Null message for education requirement section",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This information is automatically populated for you based on the classification selected for the opportunity.",
              id: "VitOoU",
              description: "Null message for education requirement section",
            })}
          </p>
        </Well>
      ) : (
        <EducationRequirements
          isIAP={pool.publishingGroup === PublishingGroup.Iap}
          classificationGroup={classificationGroup}
        />
      )}
    </div>
  );
};

export default EducationRequirementsSection;
