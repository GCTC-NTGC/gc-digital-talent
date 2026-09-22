import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import {
  fakeDepartments,
  fakeLocalizedEnum,
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  ApplicationStatus,
  CandidateRemovalReason,
  DisqualificationReason,
  makeFragmentData,
  PlacementType,
  PauseReferralsLength,
} from "@gc-digital-talent/graphql";
import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";
import { Sidebar } from "@gc-digital-talent/ui";
import {
  ACCESS_TOKEN,
  AuthenticationProvider,
  AuthorizationProvider,
  ROLE_NAME,
} from "@gc-digital-talent/auth";

import ApplicationSidebar, {
  ApplicationSidebar_Fragment,
} from "./ApplicationSidebar";

const application = fakePoolCandidates(1)[0];

type ApplicationSidebarData = Pick<typeof application, "applicationStatusData">;

const makeApplication = (data?: ApplicationSidebarData) =>
  makeFragmentData(
    {
      ...application,
      ...data,
    },
    ApplicationSidebar_Fragment,
  );

const localStorageLoader = (items: Record<string, string>) => {
  return () => {
    Object.entries(items).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  };
};

const ContainerDecorator: Decorator = (StoryComp) => (
  <AuthenticationProvider>
    <AuthorizationProvider>
      <Sidebar.Wrapper>
        <Sidebar.Sidebar>
          <StoryComp />
        </Sidebar.Sidebar>
      </Sidebar.Wrapper>
    </AuthorizationProvider>
  </AuthenticationProvider>
);

const USER_ID = "assessment-user";

const meta = {
  component: ApplicationSidebar,
  decorators: [
    MockGraphqlDecorator,
    OverlayOrDialogDecorator,
    ContainerDecorator,
  ],
  loaders: [localStorageLoader({ [ACCESS_TOKEN]: USER_ID })],
  parameters: {
    design: {
      type: "figma",
      url: "https://www.figma.com/design/mbgNRMD2ujao55nJkakrZM/Candidate-application--Communities-?node-id=2840-17841&t=72dxQ3T4Mx1g6A5C-1",
    },
    apiResponses: {
      authorizationQuery: {
        data: {
          myAuth: {
            id: USER_ID,
            roleAssignments: [
              {
                role: {
                  id: ROLE_NAME.CommunityRecruiter,
                  name: ROLE_NAME.CommunityRecruiter,
                },
              },
            ],
          },
        },
      },
      ApplicationBookmarkFlagState: {
        data: {
          poolCandidate: {
            id: application.id,
            isBookmarked: application.isBookmarked ?? false,
            applicationAssessmentData: {
              isFlagged: application.applicationAssessmentData?.isFlagged,
            },
          },
        },
      },
      ApplicationStatusFormOptions: {
        data: {
          statuses: fakeLocalizedEnum(
            ApplicationStatus,
            "LocalizedApplicationStatus",
          ),
          placementTypes: fakeLocalizedEnum(
            PlacementType,
            "LocalizedPlacementType",
          ),
          disqualificationReasons: fakeLocalizedEnum(
            DisqualificationReason,
            "LocalizedDisqualificationReason",
          ),
          removalReasons: fakeLocalizedEnum(
            CandidateRemovalReason,
            "LocalizedCandidateRemovalReason",
          ),
          departments: fakeDepartments(),
        },
      },
      ApplicationReferralPauseOptions: {
        data: {
          referralPauseLengths: fakeLocalizedEnum(
            PauseReferralsLength,
            "LocalizedReferralPauseLength",
          ),
        },
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof ApplicationSidebar>;

export const ToAssess: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.ToAssess,
          "LocalizedApplicationStatus",
        ),
      },
    }),
  },
};

export const Disqualified: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.Disqualified,
          "LocalizedApplicationStatus",
        ),
        disqualificationReason: toLocalizedEnum(
          DisqualificationReason.ScreenedOutApplication,
          "LocalizedDisqualificationReason",
        ),
      },
    }),
  },
};

export const Removed: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.Removed,
          "LocalizedApplicationStatus",
        ),
        removalReason: toLocalizedEnum(
          CandidateRemovalReason.Ineligible,
          "LocalizedCandidateRemovalReason",
        ),
      },
    }),
  },
};

export const QualifiedUnpaused: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.Qualified,
          "LocalizedApplicationStatus",
        ),
        pauseReferralsAt: null,
        resumeReferralsAt: null,
        pauseReferralsReason: null,
      },
    }),
  },
};

export const QualifiedPaused: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.Qualified,
          "LocalizedApplicationStatus",
        ),
        pauseReferralsAt: "2001-01-01",
        resumeReferralsAt: "2050-12-31",
      },
    }),
  },
};

export const Placed: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.Qualified,
          "LocalizedApplicationStatus",
        ),
        placementType: toLocalizedEnum(
          PlacementType.PlacedTerm,
          "LocalizedPlacementType",
        ),
        placedDepartment: fakeDepartments()[0],
      },
    }),
  },
};

export const PlacedIndeterminate: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(
          ApplicationStatus.Qualified,
          "LocalizedApplicationStatus",
        ),
        placementType: toLocalizedEnum(
          PlacementType.PlacedIndeterminate,
          "LocalizedPlacementType",
        ),
        placedDepartment: fakeDepartments()[0],
      },
    }),
  },
};
