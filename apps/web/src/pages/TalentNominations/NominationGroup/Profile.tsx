import { useQuery } from "urql";
import { useState } from "react";
import { useIntl } from "react-intl";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import { graphql } from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  CardBasic,
  Heading,
  Pending,
  ThrowNotFound,
  Well,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import RequireAuth from "~/components/RequireAuth/RequireAuth";
import BasicInformation from "~/components/BasicInformation/BasicInformation";
import useRequiredParams from "~/hooks/useRequiredParams";
import CommunitySpecificInfo from "~/components/CommunitySpecificInfo/CommunitySpecificInfo";
import TalentManagementPreferences from "~/components/TalentManagementPreferences/TalentManagementPreferences";
import NextRoleAndCareerObjective from "~/components/NextRoleAndCareerObjective/NextRoleAndCareerObjective";
import GoalsAndWorkStyle from "~/components/GoalsAndWorkStyle/GoalsAndWorkStyle";
import RecruitmentProcesses from "~/components/RecruitmentProcesses/RecruitmentProcesses";

import { RouteParams, SECTION_KEY } from "./types";

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

interface TalentNominationGroupProfileProps {
  nomineeId: string;
  communityId: string;
  shareProfile?: boolean;
  defaultOpen?: boolean;
}

const TalentNominationGroupProfile = ({
  nomineeId,
  shareProfile,
  defaultOpen = false,
  communityId,
}: TalentNominationGroupProfileProps) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: Nominee_Query,
    variables: { nomineeId },
    pause: !shareProfile,
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
      <CardBasic data-h2-border-radius="base(6px 6px 0 0)">
        <div
          data-h2-display="base(flex)"
          data-h2-align-items="base(center)"
          data-h2-flex-direction="base(column) l-tablet(row)"
          data-h2-justify-content="base(space-between)"
          data-h2-gap="base(x1 0) l-tablet(0 x.5)"
          data-h2-margin-bottom="base(x1)"
        >
          <Heading
            Icon={UserCircleIcon}
            level="h2"
            color="primary"
            data-h2-margin="base(0)"
            data-h2-font-weight="base(400)"
          >
            {intl.formatMessage({
              defaultMessage: "Profile and career plan",
              id: "mSj3fM",
              description:
                "Heading for nominee profile page accordion sections",
            })}
          </Heading>
          {shareProfile && (
            <Button mode="inline" color="secondary" onClick={toggleSections}>
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
        <p data-h2-margin="base(x1 0)">
          {intl.formatMessage({
            defaultMessage:
              "The following sections can be expanded to show information about the nominee’s profile, their interest in this community, and their career goals.",
            id: "xA7XvK",
            description:
              "Description for the nominee profile page accordion sections",
          })}
        </p>
        {!shareProfile && (
          <Well color="error">
            <p data-h2-margin-bottom="base(x1)" data-h2-font-weight="base(700)">
              {intl.formatMessage({
                defaultMessage:
                  "This nominee has not agreed to share their information with your community",
                id: "4ujr5X",
                description: "Null message for nominee profile",
              })}
            </p>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Nominees can agree to provide access to their profile using the “Functional communities” tool on their dashboard.",
                id: "8plD42",
                description: "Null secondary message for nominee profile",
              })}
            </p>
          </Well>
        )}
      </CardBasic>
      {data?.user?.employeeProfile ? (
        <Accordion.Root
          type="multiple"
          mode="card"
          size="sm"
          value={openSections}
          onValueChange={setOpenSections}
          data-h2-margin-top="base(0)"
          data-h2-border-radius="base(0 0 6px 6px)" // TODO: Won't it override accordion radius
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
  const shareProfile = data?.talentNominationGroup?.consentToShareProfile;
  const communityId =
    data?.talentNominationGroup?.talentNominationEvent?.community?.id;

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNominationGroup &&
      nomineeId &&
      shareProfile !== null &&
      communityId ? (
        <TalentNominationGroupProfile
          nomineeId={nomineeId}
          shareProfile={shareProfile}
          communityId={communityId}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.CommunityTalentCoordinator]}>
    <TalentNominationGroupProfilePage />
  </RequireAuth>
);

Component.displayName = "TalentNominationGroupProfilePage";
