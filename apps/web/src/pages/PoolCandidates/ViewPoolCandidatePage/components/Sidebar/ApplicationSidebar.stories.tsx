import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";

import {
  fakeDepartments,
  fakeLocalizedEnum,
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import type { PoolCandidate } from "@gc-digital-talent/graphql";
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

type ApplicationSidebarData = Pick<PoolCandidate, "applicationStatusData">;

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
      ApplicationStatusFormOptions: {
        data: {
          statuses: fakeLocalizedEnum(ApplicationStatus).map((value) => ({
            __typename: "LocalizedApplicationStatus",
            ...value,
          })),
          placementTypes: fakeLocalizedEnum(PlacementType).map((value) => ({
            __typename: "LocalizedPlacementType",
            ...value,
          })),
          disqualificationReasons: fakeLocalizedEnum(
            DisqualificationReason,
          ).map((value) => ({
            __typename: "LocalizedDisqualificationReason",
            ...value,
          })),
          removalReasons: fakeLocalizedEnum(CandidateRemovalReason).map(
            (value) => ({
              __typename: "LocalizedCandidateRemovalReason",
              ...value,
            }),
          ),
          departments: fakeDepartments(),
        },
      },
      ApplicationReferralPauseOptions: {
        data: {
          referralPauseLengths: fakeLocalizedEnum(PauseReferralsLength).map(
            (value) => ({
              __typename: "LocalizedReferralPauseLength",
              ...value,
            }),
          ),
        },
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof ApplicationSidebar>;

export const ToAsses: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(ApplicationStatus.ToAssess),
      },
    }),
  },
};

export const Disqualified: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(ApplicationStatus.Disqualified),
        disqualificationReason: toLocalizedEnum(
          DisqualificationReason.ScreenedOutApplication,
        ),
      },
    }),
  },
};

export const Removed: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(ApplicationStatus.Removed),
        removalReason: toLocalizedEnum(CandidateRemovalReason.Ineligible),
      },
    }),
  },
};

export const QualifiedUnpaused: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(ApplicationStatus.Qualified),
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
        status: toLocalizedEnum(ApplicationStatus.Qualified),
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
        status: toLocalizedEnum(ApplicationStatus.Qualified),
        placementType: toLocalizedEnum(PlacementType.PlacedTerm),
        placedDepartment: fakeDepartments()[0],
      },
    }),
  },
};

export const PlacedIndeterminate: Story = {
  args: {
    query: makeApplication({
      applicationStatusData: {
        status: toLocalizedEnum(ApplicationStatus.Qualified),
        placementType: toLocalizedEnum(PlacementType.PlacedIndeterminate),
        placedDepartment: fakeDepartments()[0],
      },
    }),
  },
};
