import type { Meta, StoryObj } from "@storybook/react";

import {
  allModes,
  MockGraphqlDecorator,
} from "@gc-digital-talent/storybook-helpers";
import {
  ACCESS_TOKEN,
  AuthenticationProvider,
  AuthorizationProvider,
  ROLE_NAME,
} from "@gc-digital-talent/auth";

import MainNavMenu from "./MainNavMenu";
import NavContextProvider from "../NavContext/NavContextProvider";

const meta = {
  component: MainNavMenu,
  parameters: {
    defaultPath: {
      path: "/:index",
      initialEntries: [`/one`],
    },
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
  render: () => (
    <AuthenticationProvider>
      <AuthorizationProvider>
        <NavContextProvider>
          <div className="relative h-screen w-full">
            <MainNavMenu />
          </div>
        </NavContextProvider>
      </AuthorizationProvider>
    </AuthenticationProvider>
  ),
} satisfies Meta<typeof MainNavMenu>;

export default meta;

type Story = StoryObj<typeof MainNavMenu>;

export const Anonymous: Story = {};

const localStorageLoader = (items: Record<string, string>) => {
  return () => {
    Object.entries(items).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  };
};

export const Authenticated: Story = {
  decorators: [MockGraphqlDecorator],
  loaders: [localStorageLoader({ [ACCESS_TOKEN]: "nav-user" })],
  parameters: {
    apiResponses: {
      authorizationQuery: {
        data: {
          myAuth: {
            id: "nav-user",
            roleAssignments: Object.values([
              ROLE_NAME.Applicant,
              ROLE_NAME.CommunityAdmin,
              ROLE_NAME.PlatformAdmin,
            ]).map((role) => ({
              role: {
                id: role,
                name: role,
              },
            })),
          },
        },
      },
    },
  },
};
