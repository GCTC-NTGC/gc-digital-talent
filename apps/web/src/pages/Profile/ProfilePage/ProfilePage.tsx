import { defineMessage, useIntl } from "react-intl";
import { useMutation } from "urql";
import { useRevalidator } from "react-router";

import { Link, Separator, TableOfContents } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { useLocalStorage } from "@gc-digital-talent/storage";

import profileMessages from "~/messages/profileMessages";
import type { SectionProps } from "~/components/Profile/types";
import { PAGE_SECTION_ID } from "~/constants/sections/userProfile";
import { getSectionTitle } from "~/components/Profile/utils";
import WorkPreferences from "~/components/Profile/components/WorkPreferences/WorkPreferences";
import LanguageProfile from "~/components/Profile/components/LanguageProfile/LanguageProfile";
import DiversityEquityInclusion from "~/components/Profile/components/DiversityEquityInclusion/DiversityEquityInclusion";
import CitizenVeteranPriority from "~/components/Profile/components/CitizenVeteranPriority/CitizenVeteranPriority";
import { requireUser } from "~/routing/auth";
import { graphqlClientContext, intlContext } from "~/routing/context";
import useRoutes from "~/hooks/useRoutes";
import { KEY_NEW_USER_LANGUAGE_PRESET } from "~/constants/storageKeys";

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
    requireUser(context, request, { roles: [{ name: ROLE_NAME.Applicant }] });
    return await next();
  },
];

const ProfileUser_Query = graphql(/* GraphQL */ `
  query ProfileUser {
    me {
      isVerifiedGovEmployee
      ...ProfileWorkPreferences
      ...ProfileDiversityEquityInclusion
      ...ProfileCitizenVeteranPriority
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
  const paths = useRoutes();
  const revalidator = useRevalidator();
  const { user } = loaderData;

  const [languagePresetNoticeIsVisible, setLanguagePresetNoticeIsVisible] =
    useLocalStorage<boolean>(KEY_NEW_USER_LANGUAGE_PRESET, false);

  const [{ fetching: isUpdating }, executeUpdateMutation] = useMutation(
    ProfileUpdateUser_Mutation,
  );

  const handleUpdate: SectionProps["onUpdate"] = async (userId, userData) => {
    return executeUpdateMutation({
      id: userId,
      user: userData,
    }).then(async (res) => {
      await revalidator.revalidate();
      return res.data?.updateUserAsUser;
    });
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
              id={PAGE_SECTION_ID.CITIZEN_VETERAN_PRIORITY}
            >
              {intl.formatMessage(getSectionTitle("citizen-veteran-priority"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
          <TableOfContents.ListItem>
            <TableOfContents.AnchorLink id={PAGE_SECTION_ID.LANGUAGE}>
              {intl.formatMessage(getSectionTitle("language"))}
            </TableOfContents.AnchorLink>
          </TableOfContents.ListItem>
        </TableOfContents.List>
        <Separator space="sm" />
        <div className="flex flex-col gap-y-3">
          <Link href={paths.employeeProfile()}>
            {intl.formatMessage(navigationMessages.employeeProfileGC)}
          </Link>
          <Link href={paths.accountSettings()}>
            {intl.formatMessage(navigationMessages.accountSettings)}
          </Link>
        </div>
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        <div className="flex flex-col gap-y-18">
          <TableOfContents.Section id={PAGE_SECTION_ID.WORK_PREFERENCES}>
            <WorkPreferences {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.DEI}>
            <DiversityEquityInclusion {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section
            id={PAGE_SECTION_ID.CITIZEN_VETERAN_PRIORITY}
          >
            <CitizenVeteranPriority {...sectionProps} />
          </TableOfContents.Section>
          <TableOfContents.Section id={PAGE_SECTION_ID.LANGUAGE}>
            <LanguageProfile
              languagePresetNoticeIsVisible={languagePresetNoticeIsVisible}
              setLanguagePresetNoticeIsVisible={
                setLanguagePresetNoticeIsVisible
              }
              {...sectionProps}
            />
          </TableOfContents.Section>
        </div>
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default ProfilePage;
