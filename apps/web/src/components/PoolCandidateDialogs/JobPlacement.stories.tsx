import { Meta, StoryFn } from "@storybook/react-vite";
import { useMemo } from "react";

import {
  fakeDepartments,
  fakeLocalizedEnum,
  fakePoolCandidates,
  toLocalizedEnum,
} from "@gc-digital-talent/fake-data";
import {
  MockGraphqlDecorator,
  OverlayOrDialogDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  ApplicationStatus,
  PlacementType,
  makeFragmentData,
} from "@gc-digital-talent/graphql";
import {
  AuthenticationContext,
  AuthorizationContext,
  ROLE_NAME,
  useAuthentication,
  useAuthorization,
} from "@gc-digital-talent/auth";

import JobPlacementDialog, {
  JobPlacementDialog_Fragment,
} from "./JobPlacementDialog";
import { JobPlacementOptions_Query } from "./JobPlacementForm";

const fakedCandidate = fakePoolCandidates(1)[0];
const departments = fakeDepartments();
const placedData = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: toLocalizedEnum(ApplicationStatus.Qualified),
    placementType: toLocalizedEnum(PlacementType.PlacedCasual),
    placedDepartment: departments[0],
  },
  JobPlacementDialog_Fragment,
);
const notPlacedData = makeFragmentData(
  {
    id: fakedCandidate.id,
    status: toLocalizedEnum(ApplicationStatus.Qualified),
    placedDepartment: departments[0],
  },
  JobPlacementDialog_Fragment,
);

export default {
  component: JobPlacementDialog,
  decorators: [OverlayOrDialogDecorator, MockGraphqlDecorator],
} as Meta;

const Template: StoryFn<typeof JobPlacementDialog> = (args) => {
  const authenticationState = useAuthentication();
  const authorizationState = useAuthorization();

  const mockAuthenticationState = useMemo(
    () => ({
      ...authenticationState,
      loggedIn: true,
    }),
    [authenticationState],
  );
  const mockAuthorizationState = useMemo(
    () => ({
      ...authorizationState,
      isLoaded: true,
      roleAssignments: [
        {
          id: "123",
          role: {
            id: "123",
            name: ROLE_NAME.CommunityAdmin,
          },
        },
      ],
    }),
    [authorizationState],
  );

  const optionsQueryData = makeFragmentData(
    {
      departments,
      placementTypes: fakeLocalizedEnum(PlacementType).map((pt) => ({
        __typename: "LocalizedPlacementType" as const,
        ...pt,
      })),
    },
    JobPlacementOptions_Query,
  );

  return (
    <AuthenticationContext.Provider value={mockAuthenticationState}>
      <AuthorizationContext.Provider value={mockAuthorizationState}>
        <JobPlacementDialog
          jobPlacementDialogQuery={args.jobPlacementDialogQuery}
          optionsQuery={optionsQueryData}
          defaultOpen={true}
        />
      </AuthorizationContext.Provider>
    </AuthenticationContext.Provider>
  );
};

export const Placed = Template.bind({});
Placed.args = {
  jobPlacementDialogQuery: placedData,
};

export const NotPlaced = Template.bind({});
NotPlaced.args = {
  jobPlacementDialogQuery: notPlacedData,
};
