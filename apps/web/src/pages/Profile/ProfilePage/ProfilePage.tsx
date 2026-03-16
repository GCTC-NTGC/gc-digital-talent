import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";

import { TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError } from "@gc-digital-talent/helpers";

import profileMessages from "~/messages/profileMessages";
import { SectionProps } from "~/components/Profile/types";
import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";
import { getSectionTitle } from "~/components/Profile/utils";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import GovernmentInformation from "~/components/Profile/components/GovernmentInformation/GovernmentInformation";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import PriorityEntitlements from "~/components/Profile/components/PriorityEntitlements/PriorityEntitlements";
import { requireUser } from "~/routing/auth";
import { graphqlClientContext, intlContext } from "~/routing/context";

import type { Route } from "./+types/ProfilePage";

const ProfileUpdateUser_Mutation = graphql(/* GraphQL */ `
  mutation UpdateUserAsUser($id: ID!, $user: UpdateUserAsUserInput!) {
    updateUserAsUser(id: $id, user: $user) {
      id
    }
  }
`);

export const handle = {
  pageTitle: defineMessage(navigationMessages.profilePage),
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, [{ name: ROLE_NAME.PlatformAdmin }]);
    return await next();
  },
];

const ProfileUser_Query = graphql(/* GraphQL */ `
  query ProfileUser {
    me {
      ...ProfileWorkPreferences
      ...ProfileDiversityEquityInclusion
      ...ProfilePriorityEntitlements
      ...ProfileGovernmentInformation
      ...ProfileLanguageProfile
    }
  }
`);

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const intl = context.get(intlContext);
  const client = context.get(graphqlClientContext);

  const res = await client.query(ProfileUser_Query, {}).toPromise();

  if (!res.data?.me) {
    throw new NotFoundError(intl.formatMessage(profileMessages.userNotFound));
  }

  return {
    user: res.data.me,
  };
}

const ProfilePage = ({ loaderData }: Route.ComponentProps) => {
  const intl = useIntl();
  const { user } = loaderData;

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    ProfileUpdateUser_Mutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then((res) => res.data?.updateUserAsUser);
  };

  const sectionProps = {
    query: user,
    isUpdating,
    onUpdate: handleUpdate,
    pool: null,
  };

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        <TableOfContents.List>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.WORK_PREFERENCES}>
              {intl.formatMessage(getSectionTitle("work"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.DEI}>
              {intl.formatMessage(getSectionTitle("dei"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink
              id={PAGE_SECTION_ID.PRIORITY_ENTITLEMENTS}
            >
              {intl.formatMessage(getSectionTitle("priority"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.GOVERNMENT}>
              {intl.formatMessage(getSectionTitle("government"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
              {intl.formatMessage(getSectionTitle("language"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
        </TableOfContents.List>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <div className="flex flex-col gap-y-18">
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
            <WorkPreferences {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
            <DiversityEquityInclusion {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.PRIORITY_ENTITLEMENTS}>
            <PriorityEntitlements {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.GOVERNMENT}>
            <GovernmentInformation query={user} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
            <LanguageProfile {...sectionProps} />
          </TableOfContents.Section>
        </div>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default ProfilePage;
