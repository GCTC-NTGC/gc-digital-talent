import { Decorator, Meta, StoryObj } from "@storybook/react-vite";

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
  PoolCandidate,
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

type ApplicationSidebarData = Pick<
  PoolCandidate,
  | "status"
  | "placementType"
  | "disqualificationReason"
  | "removalReason"
  | "expiryDate"
  | "screeningStage"
  | "assessmentStep"
>;

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
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof ApplicationSidebar>;

export const ToAsses: Story = {
  args: {
    query: makeApplication({
      status: toLocalizedEnum(ApplicationStatus.ToAssess),
    }),
  },
};

export const Disqualified: Story = {
  args: {
    query: makeApplication({
      status: toLocalizedEnum(ApplicationStatus.Disqualified),
      disqualificationReason: toLocalizedEnum(
        DisqualificationReason.ScreenedOutApplication,
      ),
    }),
  },
};

export const Removed: Story = {
  args: {
    query: makeApplication({
      status: toLocalizedEnum(ApplicationStatus.Removed),
      removalReason: toLocalizedEnum(CandidateRemovalReason.Ineligible),
    }),
  },
};

export const Qualified: Story = {
  args: {
    query: makeApplication({
      status: toLocalizedEnum(ApplicationStatus.Qualified),
    }),
  },
};

export const Placed: Story = {
  args: {
    query: makeApplication({
      status: toLocalizedEnum(ApplicationStatus.Qualified),
      placementType: toLocalizedEnum(PlacementType.PlacedTerm),
    }),
  },
};
