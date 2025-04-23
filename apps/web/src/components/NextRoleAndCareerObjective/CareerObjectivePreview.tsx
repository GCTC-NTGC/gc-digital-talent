import { useIntl } from "react-intl";
import lowerCase from "lodash/lowerCase";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  HeadingLevel,
  PreviewList,
  PreviewMetaData,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";

import { formatClassificationString } from "~/utils/poolUtils";
import { wrapAbbr } from "~/utils/nameUtils";
import adminMessages from "~/messages/adminMessages";

import CareerObjectiveDialog from "./CareerObjectiveDialog";

export const CareerObjectivePreview_Fragment = graphql(/* GraphQL */ `
  fragment CareerObjectivePreview on User {
    employeeProfile {
      careerObjectiveClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      careerObjectiveJobTitle
      careerObjectiveCommunity {
        id
        key
        name {
          localized
        }
        workStreams {
          id
        }
      }
      careerObjectiveCommunityOther
      careerObjectiveWorkStreams {
        id
        name {
          localized
        }
      }
      careerObjectiveDepartments {
        id
        departmentNumber
        name {
          localized
        }
      }
    }
    ...CareerObjectiveDialog
  }
`);

interface CareerObjectivePreviewProps {
  careerObjectivePreviewQuery: FragmentType<
    typeof CareerObjectivePreview_Fragment
  >;
  headingAs?: HeadingLevel;
}

const CareerObjectivePreview = ({
  careerObjectivePreviewQuery,
  headingAs,
}: CareerObjectivePreviewProps) => {
  const intl = useIntl();
  const careerObjectivePreviewFragment = getFragment(
    CareerObjectivePreview_Fragment,
    careerObjectivePreviewQuery,
  );

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const employeeProfile = careerObjectivePreviewFragment.employeeProfile;
  const classificationName = employeeProfile?.careerObjectiveClassification
    ? wrapAbbr(
        formatClassificationString(
          employeeProfile.careerObjectiveClassification,
        ),
        intl,
      )
    : notProvided;
  const title = (
    <>
      <>
        {intl.formatMessage({
          defaultMessage: "Next role",
          id: "Sth/c4",
          description: "Title for next role dialog",
        })}
        {intl.formatMessage(commonMessages.dividingColon)}{" "}
      </>
      {/* TODO: What should title be if user hasn't selected a classification or added a job title? */}
      <>
        {classificationName}{" "}
        {employeeProfile?.careerObjectiveJobTitle ?? notProvided}
      </>
    </>
  );
  // Functional community - target role - # of desired work streams - # of desired departments
  // TODO: Move metadata to utils, and show other community title if it exists
  let metadata: PreviewMetaData[] = [];
  if (employeeProfile?.careerObjectiveCommunity) {
    metadata = [
      {
        key: "functional-community",
        type: "text",
        children: employeeProfile.careerObjectiveCommunity.name?.localized,
      },
    ];
  }
  if (employeeProfile?.careerObjectiveJobTitle) {
    metadata = [
      ...metadata,
      {
        key: "job-title",
        type: "text",
        children: employeeProfile.careerObjectiveJobTitle,
      },
    ];
  }
  if (employeeProfile?.careerObjectiveWorkStreams?.length) {
    metadata = [
      ...metadata,
      {
        key: "work-streams",
        type: "text",
        children: `${employeeProfile.careerObjectiveWorkStreams.length} ${lowerCase(intl.formatMessage(adminMessages.workStreams))}`,
      },
    ];
  }
  if (employeeProfile?.careerObjectiveDepartments?.length) {
    metadata = [
      ...metadata,
      {
        key: "departments",
        type: "text",
        children: `${employeeProfile.careerObjectiveDepartments.length} ${intl.formatMessage({ defaultMessage: "organizations", id: "ocgTi6", description: "label for organization metadata" })}`,
      },
    ];
  }
  return (
    <>
      <PreviewList.Item
        title={title}
        metaData={metadata}
        action={
          <CareerObjectiveDialog
            careerObjectiveDialogQuery={careerObjectivePreviewFragment}
            trigger={<PreviewList.Button label={title} />}
          />
        }
        headingAs={headingAs}
      />
    </>
  );
};

export default CareerObjectivePreview;
