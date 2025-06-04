import { useIntl } from "react-intl";
import TagIcon from "@heroicons/react/24/outline/TagIcon";
import { ReactNode, JSX } from "react";

import { Heading, Link, ScrollToLink, Well } from "@gc-digital-talent/ui";
import { Locales, getLocale } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  PublishingGroup,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { useLogger } from "@gc-digital-talent/logger";

import EducationRequirements from "~/components/EducationRequirements/EducationRequirements";
import { isInNullState } from "~/validators/process/classification";
import useToggleSectionInfo from "~/hooks/useToggleSectionInfo";
import { wrapAbbr } from "~/utils/nameUtils";
import {
  ClassificationGroup,
  isClassificationGroup,
} from "~/types/classificationGroup";

import { SectionProps } from "../types";

const qualityStandardsLink = (chunks: ReactNode, locale: Locales) => {
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

const scrollToLink = (chunks: ReactNode, to: string) => (
  <ScrollToLink to={to} mode="text" color="primary">
    {chunks}
  </ScrollToLink>
);

const EditPoolEducationRequirements_Fragment = graphql(/* GraphQL */ `
  fragment EditPoolEducationRequirements on Pool {
    id
    status {
      value
      label {
        en
        fr
      }
    }
    publishingGroup {
      value
      label {
        en
        fr
      }
    }
    classification {
      id
      group
      level
    }
  }
`);

type EducationRequirementsSectionProps = Omit<
  SectionProps<
    null,
    FragmentType<typeof EditPoolEducationRequirements_Fragment>
  >,
  "onSave"
> & {
  changeTargetId: string;
};

const EducationRequirementsSection = ({
  poolQuery,
  sectionMetadata,
  changeTargetId,
}: EducationRequirementsSectionProps): JSX.Element => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const pool = getFragment(EditPoolEducationRequirements_Fragment, poolQuery);
  const isNull = isInNullState(pool);
  const { icon } = useToggleSectionInfo({
    isNull,
    emptyRequired: isNull, // Not a required field
    fallbackIcon: TagIcon,
  });
  const logger = useLogger();

  let classificationGroup: ClassificationGroup;

  if (isClassificationGroup(pool.classification?.group)) {
    classificationGroup = pool.classification.group;
  } else {
    logger.error(`Unexpected classification: ${pool.classification?.group}`);
    classificationGroup = "IT";
  }
  const classificationAbbr = pool.classification
    ? wrapAbbr(
        `${classificationGroup}-${pool.classification.level < 10 ? "0" : ""}${pool.classification.level}`,
        intl,
      )
    : "";

  return (
    <div>
      <Heading
        icon={icon.icon}
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
            qualityStandardsLink: (chunks: ReactNode) =>
              qualityStandardsLink(chunks, locale),
            scrollToLink: (chunks: ReactNode) =>
              scrollToLink(chunks, changeTargetId),
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
          isIAP={pool.publishingGroup?.value === PublishingGroup.Iap}
          classificationGroup={classificationGroup}
        />
      )}
    </div>
  );
};

export default EducationRequirementsSection;
