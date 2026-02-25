import { useIntl } from "react-intl";
import lowerCase from "lodash/lowerCase";

import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import {
  HeadingLevel,
  PreviewList,
  PreviewMetaData,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import { nodeToString } from "@gc-digital-talent/helpers";

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
  dialogSubtitle?: string;
}

const CareerObjectivePreview = ({
  careerObjectivePreviewQuery,
  headingAs,
  dialogSubtitle,
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
      {intl.formatMessage({
        defaultMessage: "Career objective",
        id: "iJoahz",
        description: "Title for career objective dialog",
      })}
      {intl.formatMessage(commonMessages.dividingColon)} {classificationName}{" "}
      {employeeProfile?.careerObjectiveJobTitle}
    </>
  );
  // Functional community - target role - # of desired work streams - # of desired departments
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
        children: intl.formatMessage(
          {
            defaultMessage:
              "{total, plural, =0 {0 work streams} one {# work stream} other {# work streams}}",
            id: "xgawew",
            description: "Count of work streams",
          },
          { total: employeeProfile.careerObjectiveWorkStreams.length },
        ),
      },
    ];
  }
  if (employeeProfile?.careerObjectiveDepartments?.length) {
    metadata = [
      ...metadata,
      {
        key: "departments",
        type: "text",
        children: intl.formatMessage(
          {
            defaultMessage:
              "{total, plural, =0 {0 organizations} one {# organization} other {# organizations}}",
            id: "nRrlr1",
            description: "Count of organizations",
          },
          { total: employeeProfile.careerObjectiveDepartments.length },
        ),
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
            trigger={<PreviewList.Button label={nodeToString(title)} />}
            customSubtitle={dialogSubtitle}
          />
        }
        headingAs={headingAs}
      />
    </>
  );
};

export default CareerObjectivePreview;
