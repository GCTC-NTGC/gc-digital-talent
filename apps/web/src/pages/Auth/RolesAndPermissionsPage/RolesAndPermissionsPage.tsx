import { defineMessage, defineMessages, useIntl } from "react-intl";
import { ReactNode } from "react";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";

import { commonMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import {
  Container,
  IconType,
  TableOfContents,
  Ul,
} from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import { messages } from "./messages";

interface Section {
  id: string;
  title: ReactNode;
  icon: IconType;
}

const RolesAndPermissionsPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.rolesAndPermissions),
        url: paths.rolesAndPermissions(),
      },
    ],
  });

  const sections: Section[] = [
    {
      id: "managing-platform-funcationalities",
      icon: MapIcon,
      title: intl.formatMessage({
        defaultMessage: "Managing platform functionalities",
        id: "RIZmyt",
        description: "Title for managing functionalities section",
      }),
    },
    {
      id: "process-operator",
      icon: ClipboardDocumentListIcon,
      title: intl.formatMessage(messages.processOperator),
    },
    {
      id: "community-recruiter",
      icon: BriefcaseIcon,
      title: intl.formatMessage(messages.communityRecruiter),
    },
    {
      id: "community-talent-coordinator",
      icon: PuzzlePieceIcon,
      title: intl.formatMessage(messages.communityTalentCoordinator),
    },
    {
      id: "community-admin",
      icon: FolderOpenIcon,
      title: intl.formatMessage(messages.communityAdmin),
    },
    {
      id: "permissions-tables",
      icon: TableCellsIcon,
      title: intl.formatMessage({
        defaultMessage: "Permission tables",
        id: "9/x/2b",
        description: "Heading for tables describing permissions each role has",
      }),
    },
  ];

  return (
    <>
      <SEO
        title={intl.formatMessage(navigationMessages.rolesAndPermissions)}
        description={intl.formatMessage(messages.description)}
      />
      <Hero
        centered
        title={intl.formatMessage(navigationMessages.rolesAndPermissions)}
        subtitle={intl.formatMessage(messages.description)}
        crumbs={crumbs}
      />
      <Container>
        <TableOfContents.Wrapper className="mt-18">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {sections.map((section) => (
                <TableOfContents.ListItem key={section.id}>
                  <TableOfContents.AnchorLink id={section.id}>
                    {section.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              ))}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections[0].id}>
              <TableOfContents.Heading
                icon={sections[0].icon}
                color="primary"
                className="mt-0"
              >
                {sections[0].title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "GC Digital Talent partners with functional communities across government. Functional communities connect colleagues in government with jobs, training, and talent management opportunities within the community’s area of expertise.",
                  id: "z79UaN",
                  description:
                    "Paragraph one, describing managing platform functionalities",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "There are different roles and permissions to manage the functionalities of the platform, while handling access to personal data on a need-to-know basis. ",
                  id: "PrQUBc",
                  description:
                    "Paragraph two, describing managing platform functionalities",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage: "The current roles are",
                  id: "qNGfmf",
                  description:
                    "Lead-in text for list of current roles on the platform",
                }) + intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>{intl.formatMessage(messages.processOperator)}</li>
                <li>{intl.formatMessage(messages.communityRecruiter)}</li>
                <li>
                  {intl.formatMessage(messages.communityTalentCoordinator)}
                </li>
                <li>{intl.formatMessage(messages.communityAdmin)}</li>
                <li>{intl.formatMessage(messages.platformAdmin)}</li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[1].id}>
              <TableOfContents.Heading
                icon={sections[1].icon}
                color="secondary"
              >
                {sections[1].title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "A Process Operator is primarily involved in handling tasks related to specific recruitment processes. The role is often assigned to hiring managers collaborating with a functional community to find their next hire.",
                  id: "Q85PS8",
                  description: "Description of the process operator role",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage(messages.keyPermissions) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can view and edit draft job advertisement",
                    id: "6LOBmp",
                    description:
                      "Description of the permission to view/edit job adverts",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can view and edit draft assessment plan",
                    id: "CUP24E",
                    description:
                      "Description of the permission to view/edit process assessment plans",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "can view, screen, and assess applicants for specific recruitment processes",
                    id: "IfVfr0",
                    description:
                      "Description of the permission to view and screen applicants",
                  })}
                </li>
              </Ul>
              <p className="my-6">
                {intl.formatMessage(messages.keyLimitations) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "has permissions only for recruitment processes that they have been specifically assigned to",
                    id: "rsmf+3",
                    description:
                      "Description of the limitation that process operators can only interact with processes they are assigned to",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "cannot create or publish recruitment processes ",
                    id: "sqCxWG",
                    description:
                      "Description of the limitation that process operators cannot create or publish a process",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "cannot mark qualified candidates as hired ",
                    id: "JWDfzJ",
                    description:
                      "Description of the limitation that process operators cannot mark an applicant as hired",
                  })}
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[2].id}>
              <TableOfContents.Heading icon={sections[2].icon} color="primary">
                {sections[2].title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "A Community Recruiter focuses on recruitment within their own community. They manage talent requests, have access to their community dashboard, and handle job applications. ",
                  id: "AelQ6S",
                  description: "Description of the community recruiter role",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage(messages.keyPermissions) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "has access to all recruitment processes and applicants within their community ",
                    id: "jAFGNr",
                    description:
                      "Description of the permission to view job adverts of a specific community",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can manage talent requests",
                    id: "sB6W6r",
                    description:
                      "Description of the permission to view/edit talent requests",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "can create, edit, and delete draft recruitment processes",
                    id: "xAuaIH",
                    description:
                      "Description of the permission to create/edit/delete draft processes",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "can screen, assess, and mark candidates as hired",
                    id: "nRodVX",
                    description:
                      "Description of the permission to fully assess and place applicants",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can assign Process Operators",
                    id: "A/uMD+",
                    description:
                      "Description of the permission to assign users as a process operator",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "can view employees interested in job and training opportunities within their community",
                    id: "pX6VRT",
                    description:
                      "Description of the permission to view employee profiles for users interested in their community",
                  })}
                </li>
              </Ul>
              <p className="my-6">
                {intl.formatMessage(messages.keyLimitations) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "cannot publish recruitment processes",
                    id: "8VQWN3",
                    description:
                      "Description of the limitation of publishing a process",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "cannot assign community roles",
                    id: "k5/7mP",
                    description:
                      "Description of the limitation of assigning users to a community",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "cannot view and manage talent management events",
                    id: "64yExe",
                    description:
                      "Description of the limitation of managing talent management events",
                  })}
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[3].id}>
              <TableOfContents.Heading
                icon={sections[3].icon}
                color="secondary"
              >
                {sections[3].title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "A Community Talent Coordinator focuses on talent mobility within their functional community. They can see employees who are interested in job and training opportunities within the community and those who have been nominated in talent management events.",
                  id: "dFl7AN",
                  description:
                    "Description of the community talent coordinator role",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage(messages.keyPermissions) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can view community talent",
                    id: "bh6bGz",
                    description:
                      "Description of the permission to view users who expressed interest in their community",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can create and manage nomination events",
                    id: "Vw9hbr",
                    description:
                      "Description of the permission to manage talent managements events",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "can triage nominations",
                    id: "TCL3HM",
                    description:
                      "Description of the permission to manage talent nominations",
                  })}
                </li>
              </Ul>
              <p className="my-6">
                {intl.formatMessage(messages.keyLimitations) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "doesn't have any permissions related to recruitment processes",
                    id: "eAHcdt",
                    description:
                      "Description of the limitation of having access to processes",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "cannot see or manage talent requests",
                    id: "htUIis",
                    description:
                      "Description of the limitation of managing talent requests",
                  })}
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[4].id}>
              <TableOfContents.Heading icon={sections[4].icon} color="primary">
                {sections[4].title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "Community Administrators can assign roles within their community. They also have the highest level of control over their community’s recruitment processes, including the ability to publish and archive them. By assigning community roles to themselves, they can get the complete set of permissions for their community.",
                  id: "/5MXl4",
                  description: "Description of the community admin role",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage(messages.keyPermissions) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "has full access to community management tools",
                    id: "7Je/3u",
                    description:
                      "Description of the permission to manage communities",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "can create, edit, publish, and archive recruitment processes",
                    id: "YJvjX9",
                    description:
                      "Description of the permission to manage processes",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "can assign Community Recruiters and Community Talent Coordinators",
                    id: "moB11/",
                    description:
                      "Description of the permission to assign users to communities",
                  })}
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[5].id}>
              <TableOfContents.Heading
                icon={sections[5].icon}
                color="secondary"
              >
                {sections[5].title}
              </TableOfContents.Heading>
            </TableOfContents.Section>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth
    roles={[
      ROLE_NAME.PlatformAdmin,
      ROLE_NAME.ProcessOperator,
      ROLE_NAME.CommunityAdmin,
      ROLE_NAME.CommunityRecruiter,
      ROLE_NAME.CommunityTalentCoordinator,
    ]}
  >
    <RolesAndPermissionsPage />
  </RequireAuth>
);
