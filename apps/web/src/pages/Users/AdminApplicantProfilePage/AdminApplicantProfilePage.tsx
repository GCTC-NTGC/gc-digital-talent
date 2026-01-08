import { useState } from "react";
import { useIntl } from "react-intl";
import { useQuery } from "urql";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";

import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import {
  Accordion,
  Button,
  Container,
  Pending,
  Separator,
  TableOfContents,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import profileMessages from "~/messages/profileMessages";
import { FlexibleWorkLocationOptions_Fragment } from "~/components/Profile/components/WorkPreferences/fragment";

import { SECTION_KEY } from "./types";
import PersonalAndContactInformation, {
  PERSONAL_CONTACT_INFO_ID,
} from "./components/PersonalAndContactInformation";
import LanguageProfile, {
  LANGUAGE_PROFILE_ID,
} from "./components/LanguageProfile";
import WorkPreferences, {
  WORK_PREFERENCES_ID,
} from "./components/WorkPreferences";
import DiversityEquityInclusion, {
  DEI_ID,
} from "./components/DiversityEquityInclusion";
import GovernmentInformation, {
  GOV_INFO_ID,
} from "./components/GovernmentInformation";
import DownloadButton from "../DownloadButton";

const AdminApplicantProfile_Fragment = graphql(/** GraphQL */ `
  fragment AdminApplicantProfile on User {
    id
    ...PersonalAndContactInformation
    ...LanguageProfile
    ...AdminWorkPreferences
    ...DiversityEquityInclusion
    ...GovernmentInformation
  }
`);

interface AdminApplicantProfileProps {
  query: FragmentType<typeof AdminApplicantProfile_Fragment>;
  optionsQuery:
    | FragmentType<typeof FlexibleWorkLocationOptions_Fragment>
    | undefined;
}

const AdminApplicantProfile = ({
  query,
  optionsQuery,
}: AdminApplicantProfileProps) => {
  const intl = useIntl();
  const user = getFragment(AdminApplicantProfile_Fragment, query);
  const [openSections, setOpenSections] = useState<string[]>([]);
  const hasOpenSections = openSections.length > 0;

  const toggleSections = () => {
    const newValue = hasOpenSections ? [] : Object.values(SECTION_KEY);
    setOpenSections(newValue);
  };

  return (
    <Container className="my-18">
      <TableOfContents.Wrapper>
        <TableOfContents.Navigation>
          <TableOfContents.List>
            <TableOfContents.ListItem>
              <TableOfContents.AnchorLink id="basic-information">
                {intl.formatMessage({
                  defaultMessage: "Basic information",
                  id: "RDFAWE",
                  description: "Title for basic information",
                })}
              </TableOfContents.AnchorLink>
              <TableOfContents.List className="mt-1.5">
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={PERSONAL_CONTACT_INFO_ID}>
                    {intl.formatMessage(
                      profileMessages.personalAndContactInformation,
                    )}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={LANGUAGE_PROFILE_ID}>
                    {intl.formatMessage(profileMessages.languageProfile)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={WORK_PREFERENCES_ID}>
                    {intl.formatMessage(navigationMessages.workPreferences)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={DEI_ID}>
                    {intl.formatMessage(
                      navigationMessages.diversityEquityInclusion,
                    )}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
                <TableOfContents.ListItem>
                  <TableOfContents.AnchorLink id={GOV_INFO_ID}>
                    {intl.formatMessage(profileMessages.govEmployeeInformation)}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              </TableOfContents.List>
            </TableOfContents.ListItem>
          </TableOfContents.List>
          <Separator orientation="horizontal" space="xs" decorative />
          <DownloadButton id={user.id} />
        </TableOfContents.Navigation>
        <TableOfContents.Content>
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <TableOfContents.Heading
              icon={UserCircleIcon}
              color="secondary"
              className="m-0"
              id="basic-information"
            >
              {intl.formatMessage({
                defaultMessage: "Basic information",
                id: "RDFAWE",
                description: "Title for basic information",
              })}
            </TableOfContents.Heading>
            <div className="flex items-end gap-3">
              <Button mode="inline" color="primary" onClick={toggleSections}>
                {hasOpenSections
                  ? intl.formatMessage({
                      defaultMessage:
                        "Collapse all<hidden> application information</hidden> sections",
                      id: "3amaVI",
                      description:
                        "Button text to close all application information accordions",
                    })
                  : intl.formatMessage({
                      defaultMessage:
                        "Expand all<hidden> application information</hidden> sections",
                      id: "N/OaWg",
                      description:
                        "Button text to open all application information accordions",
                    })}
              </Button>
            </div>
          </div>
          <Accordion.Root
            mode="card"
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
          >
            <Accordion.Item
              value={SECTION_KEY.PERSONAL}
              id={PERSONAL_CONTACT_INFO_ID}
            >
              <Accordion.Trigger as="h3">
                {intl.formatMessage(
                  profileMessages.personalAndContactInformation,
                )}
              </Accordion.Trigger>
              <Accordion.Content>
                <PersonalAndContactInformation query={user} />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value={SECTION_KEY.LANGUAGE}
              id={LANGUAGE_PROFILE_ID}
            >
              <Accordion.Trigger as="h3">
                {intl.formatMessage(profileMessages.languageProfile)}
              </Accordion.Trigger>
              <Accordion.Content>
                <LanguageProfile query={user} />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item
              value={SECTION_KEY.WORK_PREFERENCES}
              id={WORK_PREFERENCES_ID}
            >
              <Accordion.Trigger as="h3">
                {intl.formatMessage(navigationMessages.workPreferences)}
              </Accordion.Trigger>
              <Accordion.Content>
                <WorkPreferences query={user} optionsQuery={optionsQuery} />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value={SECTION_KEY.DEI} id={DEI_ID}>
              <Accordion.Trigger as="h3">
                {intl.formatMessage(
                  navigationMessages.diversityEquityInclusion,
                )}
              </Accordion.Trigger>
              <Accordion.Content>
                <DiversityEquityInclusion query={user} />
              </Accordion.Content>
            </Accordion.Item>

            <Accordion.Item value={SECTION_KEY.GOV_INFO} id={GOV_INFO_ID}>
              <Accordion.Trigger as="h3">
                {intl.formatMessage(profileMessages.govEmployeeInformation)}
              </Accordion.Trigger>
              <Accordion.Content>
                <GovernmentInformation query={user} />
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </Container>
  );
};

const AdminApplicantProfilePage_Query = graphql(/** GraphQL */ `
  query AdminApplicantProfilePage($id: UUID!) {
    user(id: $id, trashed: WITH) {
      ...AdminApplicantProfile
    }
    ...FlexibleWorkLocationOptionsFragment
  }
`);

interface RouteParams extends Record<string, string> {
  userId: Scalars["ID"]["output"];
}

const AdminApplicantProfilePage = () => {
  const intl = useIntl();
  const { userId } = useRequiredParams<RouteParams>("userId");
  const [{ data, fetching, error }] = useQuery({
    query: AdminApplicantProfilePage_Query,
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user ? (
        <AdminApplicantProfile query={data.user} optionsQuery={data} />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
      ROLE_NAME.ProcessOperator,
    ]}
  >
    <AdminApplicantProfilePage />
  </RequireAuth>
);

Component.displayName = "AdminApplicantProfilePage";

export default Component;
