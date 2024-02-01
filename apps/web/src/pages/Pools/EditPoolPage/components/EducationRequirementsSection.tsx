import * as React from "react";
import { useIntl } from "react-intl";

import { Heading, ScrollToLink } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { PublishingGroup } from "~/api/generated";
import EducationRequirements from "~/components/EducationRequirements/EducationRequirements";
import { getClassificationGroup } from "~/utils/poolUtils";
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
  const classificationGroup = getClassificationGroup(pool);

  const { classifications } = pool;
  const classification = classifications ? classifications[0] : null;

  let classificationAbbr; // type wrangling the complex type into a string
  if (classification) {
    const { group, level } = classification;
    classificationAbbr = wrapAbbr(`${group}-0${level}`, intl);
  }

  return (
    <div>
      <Heading level="h3" size="h5">
        {sectionMetadata.title}
      </Heading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "These are the following education requirements, based on the Government of Canada qualification standards.",
          id: "lZ+aPI",
          description: "Lead-in text for a process' education requirements",
        })}
      </p>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "This is calculated based on your group and level choice",
          id: "bJRzd6",
          description: "Description of how education requirements are derived",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}
        <span data-h2-font-weight="base(700)">
          {classificationAbbr || intl.formatMessage(commonMessages.notProvided)}
        </span>{" "}
        <ScrollToLink to={changeTargetId} mode="text" color="secondary">
          {classification
            ? intl.formatMessage({
                defaultMessage: "change classification",
                id: "0L0MWD",
                description:
                  "Link text to scroll to the section and change a process' classification",
              })
            : intl.formatMessage({
                defaultMessage: "set classification",
                id: "n57MWI",
                description:
                  "Link text to scroll to the section and set a process' classification",
              })}
        </ScrollToLink>
      </p>
      <EducationRequirements
        isIAP={pool.publishingGroup === PublishingGroup.Iap}
        classificationGroup={classificationGroup}
      />
    </div>
  );
};

export default EducationRequirementsSection;
