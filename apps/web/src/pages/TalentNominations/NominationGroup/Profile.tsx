import { useQuery } from "urql";
import { useState, type ComponentProps } from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import { graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  Card,
  Heading,
  Pending,
  ThrowNotFound,
  Notice,
  Ul,
} from "@gc-digital-talent/ui";
import { assertUnreachable } from "@gc-digital-talent/helpers";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import BasicInformation from "~/components/BasicInformation/BasicInformation";
import useRequiredParams from "~/hooks/useRequiredParams";
import CommunitySpecificInfo from "~/components/CommunitySpecificInfo/CommunitySpecificInfo";
import TalentManagementPreferences from "~/components/TalentManagementPreferences/TalentManagementPreferences";
import NextRoleAndCareerObjective from "~/components/NextRoleAndCareerObjective/NextRoleAndCareerObjective";
import GoalsAndWorkStyle from "~/components/GoalsAndWorkStyle/GoalsAndWorkStyle";
import RecruitmentProcesses from "~/components/RecruitmentProcesses/RecruitmentProcesses";
import permissionConstants from "~/constants/permissionConstants";

import type { RouteParams } from "./types";
import { SECTION_KEY } from "./types";

const Nominee_Query = graphql(/* GraphQL */ `
  query Nominee($nomineeId: UUID!) {
    user(id: $nomineeId) {
      ...BasicInformation
      employeeProfile {
        ...CommunitySpecificInfo
        ...TalentManagementPreferences
        ...GoalsAndWorkStyle
      }
      ...RecruitmentProcesses
      ...NextRoleAndCareerObjective
    }
    ...BasicInformationOptions
    ...CommunitySpecificInfoOptions
    ...TalentManagementPreferencesOptions
  }
`);

interface ErrorNoticeProps {
  reason: "not-shared-with-community" | "not-verified-gov-employee";
}

const ErrorNotice = ({ reason }: ErrorNoticeProps) => {
  const intl = useIntl();

  if (reason == "not-shared-with-community") {
    return (
      <Notice.Root color="error" className="mt-9">
        <Notice.Title>
          {intl.formatMessage({
            defaultMessage:
              "This nominee has not agreed to share their information with your community",
            id: "4ujr5X",
            description: "Null message for nominee profile",
          })}
        </Notice.Title>
        <Notice.Content>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
              id: "8plD42",
              description: "Null secondary message for nominee profile",
            })}
          </p>
        </Notice.Content>
      </Notice.Root>
    );
  }

  if (reason == "not-verified-gov-employee") {
    return (
      <Notice.Root color="error" className="mt-9">
        <Notice.Title>
          {intl.formatMessage({
            defaultMessage:
              "The nominee is no longer a verified Government of Canada employee",
            id: "PbTf7L",
            description: "Null message for nominee profile",
          })}
        </Notice.Title>
        <Notice.Content>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "In order to view the nominee’s profile information and career experience, please reach out to the nominator and have them contact the nominee to confirm whether the nominee is still an employee.",
              id: "FcINAB",
              description: "Null secondary message for nominee profile",
            })}
          </p>
          <Ul space="md">
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "If they are, have them verify their employee status by confirming their work email and adding current Government of Canada work experience.",
                id: "1mNea9",
                description: "Null secondary message for nominee profile",
              })}
            </li>
            <li>
              {intl.formatMessage({
                defaultMessage:
                  "If they aren’t, mark this nomination as “Not supported”.",
                id: "hOiaIL",
                description: "Null secondary message for nominee profile",
              })}
            </li>
          </Ul>
        </Notice.Content>
      </Notice.Root>
    );
  }

  return assertUnreachable(reason);
};

interface TalentNominationGroupProfileProps {
  nomineeId: string;
  communityId: string;
  contentHiddenReason?: null | ErrorNoticeProps["reason"];
  defaultOpen?: boolean;
}

const TalentNominationGroupProfile = ({
  nomineeId,
  contentHiddenReason,
  defaultOpen = false,
  communityId,
}: TalentNominationGroupProfileProps) => {
  const intl = useIntl();
  const contentIsVisible = !contentHiddenReason;
  const [{ data, fetching, error }] = useQuery({
    query: Nominee_Query,
    variables: { nomineeId },
    pause: !contentIsVisible,
  });

  const [openSections, setOpenSections] = useState<string[]>(
    defaultOpen ? Object.values(SECTION_KEY) : [],
  );
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    setOpenSections((currentOpen) => {
      return currentOpen.length > 0 ? [] : Object.values(SECTION_KEY);
    });
  };

  return (
    <Pending fetching={fetching} error={error}>
      <Card
        className={
          data?.user?.employeeProfile
            ? "rounded-b-none pb-0 sm:pb-0"
            : undefined
        }
        space="lg"
      >
        <div className="flex flex-col items-center justify-between gap-y-6 sm:flex-row sm:gap-x-3 sm:gap-y-0">
          <Heading
            icon={UserCircleIcon}
            level="h2"
            size="h4"
            color="secondary"
            className="mt-0 font-normal"
          >
            {intl.formatMessage({
              defaultMessage: "Profile and career plan",
              id: "mSj3fM",
              description:
                "Heading for nominee profile page accordion sections",
            })}
          </Heading>
          {contentIsVisible && (
            <Button mode="inline" color="primary" onClick={toggleSections}>
              {hasOpenSections
                ? intl.formatMessage({
                    defaultMessage:
                      "Collapse all <hidden>profile and career plan</hidden>sections",
                    id: "/UoSSQ",
                    description:
                      "Button text to close all profile and career plan accordions",
                  })
                : intl.formatMessage({
                    defaultMessage:
                      "Expand all <hidden>profile and career plan</hidden>sections",
                    id: "tS5VSg",
                    description:
                      "Button text to open all profile and career plan accordions",
                  })}
            </Button>
          )}
        </div>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "The following sections can be expanded to show information about the nominee’s profile, their interest in this community, and their career goals.",
            id: "xA7XvK",
            description:
              "Description for the nominee profile page accordion sections",
          })}
        </p>
        <Card.Separator className="mt-9" />
        {!contentIsVisible && <ErrorNotice reason={contentHiddenReason} />}
      </Card>
      {data?.user?.employeeProfile ? (
        <Accordion.Root
          type="multiple"
          mode="card"
          size="sm"
          value={openSections}
          onValueChange={setOpenSections}
          className="mt-0 rounded-t-none"
        >
          <BasicInformation
            sectionKey={SECTION_KEY.BASIC}
            basicInfoQuery={data.user}
            basicInfoOptionsQuery={data}
          />
          <CommunitySpecificInfo
            sectionKey={SECTION_KEY.COMMUNITY}
            communitySpecificInfoQuery={data.user.employeeProfile}
            communitySpecificInfoOptionsQuery={data}
            communityId={communityId}
          />
          <TalentManagementPreferences
            sectionKey={SECTION_KEY.TALENT_MANAGEMENT}
            talentManagementPreferencesQuery={data.user.employeeProfile}
            talentManagementPreferencesOptionsQuery={data}
          />
          <NextRoleAndCareerObjective
            sectionKey={SECTION_KEY.NEXT_ROLE_CAREER_OBJECTIVE}
            nextRoleAndCareerObjectiveQuery={data.user}
          />
          <GoalsAndWorkStyle
            sectionKey={SECTION_KEY.GOALS_AND_WORK_STYLE}
            goalsAndWorkStyleQuery={data.user.employeeProfile}
          />
          <RecruitmentProcesses
            sectionKey={SECTION_KEY.RECRUITMENT_PROCESSES}
            recruitmentProcessesQuery={data.user}
            communityId={communityId}
          />
        </Accordion.Root>
      ) : null}
    </Pending>
  );
};

const TalentNominationGroupProfile_Query = graphql(/* GraphQL */ `
  query TalentNominationGroupProfile($talentNominationGroupId: UUID!) {
    talentNominationGroup(id: $talentNominationGroupId) {
      consentToShareProfile
      nominee {
        id
        isVerifiedGovEmployee
      }
      talentNominationEvent {
        community {
          id
        }
      }
    }
  }
`);

const TalentNominationGroupProfilePage = () => {
  const { talentNominationGroupId } = useRequiredParams<RouteParams>(
    "talentNominationGroupId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: TalentNominationGroupProfile_Query,
    variables: { talentNominationGroupId },
  });

  const nomineeId = data?.talentNominationGroup?.nominee?.id;
  const communityId =
    data?.talentNominationGroup?.talentNominationEvent?.community?.id;

  let contentHiddenReason: ComponentProps<
    typeof TalentNominationGroupProfile
  >["contentHiddenReason"] = null;
  if (!data?.talentNominationGroup?.consentToShareProfile) {
    contentHiddenReason = "not-shared-with-community";
  }
  if (!data?.talentNominationGroup?.nominee?.isVerifiedGovEmployee) {
    contentHiddenReason = "not-verified-gov-employee";
  }

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup && nomineeId && communityId ? (
        <TalentNominationGroupProfile
          nomineeId={nomineeId}
          contentHiddenReason={contentHiddenReason}
          communityId={communityId}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.viewCommunityTalentNominations}>
    <TalentNominationGroupProfilePage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupProfilePage";

export default Component;
