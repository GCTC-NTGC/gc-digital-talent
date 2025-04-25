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

import NextRoleDialog from "./NextRoleDialog";

export const NextRolePreview_Fragment = graphql(/* GraphQL */ `
  fragment NextRolePreview on User {
    employeeProfile {
      nextRoleClassification {
        id
        group
        level
        name {
          en
          fr
        }
      }
      nextRoleJobTitle
      nextRoleCommunity {
        id
        key
        name {
          localized
        }
        workStreams {
          id
        }
      }
      nextRoleCommunityOther
      nextRoleWorkStreams {
        id
        name {
          localized
        }
      }
      nextRoleDepartments {
        id
        departmentNumber
        name {
          localized
        }
      }
    }
    ...NextRoleDialog
  }
`);

interface NextRolePreviewProps {
  nextRolePreviewQuery: FragmentType<typeof NextRolePreview_Fragment>;
  headingAs?: HeadingLevel;
}

const NextRolePreview = ({
  nextRolePreviewQuery,
  headingAs,
}: NextRolePreviewProps) => {
  const intl = useIntl();
  const nextRolePreviewFragment = getFragment(
    NextRolePreview_Fragment,
    nextRolePreviewQuery,
  );

  const notProvided = intl.formatMessage(commonMessages.notProvided);

  const employeeProfile = nextRolePreviewFragment.employeeProfile;
  const classificationName = employeeProfile?.nextRoleClassification
    ? wrapAbbr(
        formatClassificationString(employeeProfile.nextRoleClassification),
        intl,
      )
    : notProvided;
  const title = (
    <>
      {intl.formatMessage({
        defaultMessage: "Next role",
        id: "Sth/c4",
        description: "Title for next role dialog",
      })}
      {intl.formatMessage(commonMessages.dividingColon)} {classificationName}{" "}
      {employeeProfile?.nextRoleJobTitle ?? notProvided}
    </>
  );
  // Functional community - target role - # of desired work streams - # of desired departments
  let metadata: PreviewMetaData[] = [];
  if (employeeProfile?.nextRoleCommunity) {
    metadata = [
      {
        key: "functional-community",
        type: "text",
        children: employeeProfile.nextRoleCommunity.name?.localized,
      },
    ];
  }
  if (employeeProfile?.nextRoleJobTitle) {
    metadata = [
      ...metadata,
      {
        key: "job-title",
        type: "text",
        children: employeeProfile.nextRoleJobTitle,
      },
    ];
  }
  if (employeeProfile?.nextRoleWorkStreams?.length) {
    metadata = [
      ...metadata,
      {
        key: "work-streams",
        type: "text",
        children: `${employeeProfile.nextRoleWorkStreams.length} ${lowerCase(intl.formatMessage(adminMessages.workStreams))}`,
      },
    ];
  }
  if (employeeProfile?.nextRoleDepartments?.length) {
    metadata = [
      ...metadata,
      {
        key: "departments",
        type: "text",
        children: `${employeeProfile.nextRoleDepartments.length} ${intl.formatMessage({ defaultMessage: "organizations", id: "ocgTi6", description: "label for organization metadata" })}`,
      },
    ];
  }
  return (
    <>
      <PreviewList.Item
        title={title}
        metaData={metadata}
        action={
          <NextRoleDialog
            nextRoleDialogQuery={nextRolePreviewFragment}
            trigger={<PreviewList.Button label={title} />}
          />
        }
        headingAs={headingAs}
      />
    </>
  );
};

export default NextRolePreview;
