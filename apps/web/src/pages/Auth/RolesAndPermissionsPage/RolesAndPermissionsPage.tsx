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

interface Section {
  id: string;
  title: ReactNode;
  icon: IconType;
}

const desc = defineMessage({
  defaultMessage:
    "Learn about the different community roles and permissions on our platform.",
  id: "Pz0Qmn",
  description:
    "Description of the page outlining different roles and permissions of the application",
});

const roleNames = defineMessages({
  processOperator: {
    defaultMessage: "Process Operator",
    id: "h0l+na",
    description: "Name of the process operator role",
  },
  communityRecruiter: {
    defaultMessage: "Community Recruiter",
    id: "1CLGPQ",
    description: "Name of the community recruiter role",
  },
  communityTalentCoordinator: {
    defaultMessage: "Community Talent Coordinator",
    id: "UQnep6",
    description: "Name of the community talent coordinator role",
  },
  communityAdmin: {
    defaultMessage: "Community Administrator",
    id: "jym4M2",
    description: "Name of the community admin role",
  },
  platformAdmin: {
    defaultMessage: "Platform Administrator",
    id: "QZBYGX",
    description: "Name of the platform admin role",
  },
});

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
      title: intl.formatMessage(roleNames.processOperator),
    },
    {
      id: "community-recruiter",
      icon: BriefcaseIcon,
      title: intl.formatMessage(roleNames.communityRecruiter),
    },
    {
      id: "community-talent-coordinator",
      icon: PuzzlePieceIcon,
      title: intl.formatMessage(roleNames.communityTalentCoordinator),
    },
    {
      id: "community-admin",
      icon: FolderOpenIcon,
      title: intl.formatMessage(roleNames.communityAdmin),
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
        description={intl.formatMessage(desc)}
      />
      <Hero
        centered
        title={intl.formatMessage(navigationMessages.rolesAndPermissions)}
        subtitle={intl.formatMessage(desc)}
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
                <li>{intl.formatMessage(roleNames.processOperator)}</li>
                <li>{intl.formatMessage(roleNames.communityRecruiter)}</li>
                <li>
                  {intl.formatMessage(roleNames.communityTalentCoordinator)}
                </li>
                <li>{intl.formatMessage(roleNames.communityAdmin)}</li>
                <li>{intl.formatMessage(roleNames.platformAdmin)}</li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[1].id}>
              <TableOfContents.Heading
                icon={sections[1].icon}
                color="secondary"
              >
                {sections[1].title}
              </TableOfContents.Heading>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[2].id}>
              <TableOfContents.Heading icon={sections[2].icon} color="primary">
                {sections[2].title}
              </TableOfContents.Heading>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[3].id}>
              <TableOfContents.Heading
                icon={sections[3].icon}
                color="secondary"
              >
                {sections[3].title}
              </TableOfContents.Heading>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections[4].id}>
              <TableOfContents.Heading icon={sections[4].icon} color="primary">
                {sections[4].title}
              </TableOfContents.Heading>
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
