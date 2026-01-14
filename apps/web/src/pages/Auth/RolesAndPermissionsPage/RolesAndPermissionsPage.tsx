import { useIntl } from "react-intl";
import { ReactNode } from "react";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import FolderOpenIcon from "@heroicons/react/24/outline/FolderOpenIcon";
import MapIcon from "@heroicons/react/24/outline/MapIcon";
import PuzzlePieceIcon from "@heroicons/react/24/outline/PuzzlePieceIcon";
import TableCellsIcon from "@heroicons/react/24/outline/TableCellsIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
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
import adminMessages from "~/messages/adminMessages";

import { messages } from "./messages";
import RolesAndPermissionsTable from "./RolesAndPermissionsTable";

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
        label: intl.formatMessage(adminMessages.rolesAndPermissions),
        url: paths.rolesAndPermissions(),
      },
    ],
  });

  const sections: Record<string, Section> = {
    managingFunctionalities: {
      id: "managing-platform-functionalities",
      icon: MapIcon,
      title: intl.formatMessage({
        defaultMessage: "Managing platform functionalities",
        id: "RIZmyt",
        description: "Title for managing functionalities section",
      }),
    },
    processOperator: {
      id: "process-operator",
      icon: ClipboardDocumentListIcon,
      title: intl.formatMessage(messages.processOperator),
    },
    communityRecruiter: {
      id: "community-recruiter",
      icon: BriefcaseIcon,
      title: intl.formatMessage(messages.communityRecruiter),
    },
    communityTalentCoordinator: {
      id: "community-talent-coordinator",
      icon: PuzzlePieceIcon,
      title: intl.formatMessage(messages.communityTalentCoordinator),
    },
    communityAdmin: {
      id: "community-admin",
      icon: FolderOpenIcon,
      title: intl.formatMessage(messages.communityAdmin),
    },
    permissionsTables: {
      id: "permissions-tables",
      icon: TableCellsIcon,
      title: intl.formatMessage({
        defaultMessage: "Permission tables",
        id: "9/x/2b",
        description: "Heading for tables describing permissions each role has",
      }),
    },
  };

  return (
    <>
      <SEO
        title={intl.formatMessage(adminMessages.rolesAndPermissions)}
        description={intl.formatMessage(messages.description)}
      />
      <Hero
        centered
        title={intl.formatMessage(adminMessages.rolesAndPermissions)}
        subtitle={intl.formatMessage(messages.description)}
        crumbs={crumbs}
      />
      <Container>
        <TableOfContents.Wrapper className="mt-18">
          <TableOfContents.Navigation>
            <TableOfContents.List>
              {Object.values(sections).map((section) => (
                <TableOfContents.ListItem key={section.id}>
                  <TableOfContents.AnchorLink id={section.id}>
                    {section.title}
                  </TableOfContents.AnchorLink>
                </TableOfContents.ListItem>
              ))}
            </TableOfContents.List>
          </TableOfContents.Navigation>
          <TableOfContents.Content>
            <TableOfContents.Section id={sections.managingFunctionalities.id}>
              <TableOfContents.Heading
                icon={sections.managingFunctionalities.icon}
                color="primary"
                className="mt-0"
              >
                {sections.managingFunctionalities.title}
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
                    "There are different roles and permissions to manage the functionalities of the platform, while handling access to personal data on a need-to-know basis.",
                  id: "yTu6Ih",
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
              <Ul space="md">
                <li>{intl.formatMessage(messages.processOperator)}</li>
                <li>{intl.formatMessage(messages.communityRecruiter)}</li>
                <li>
                  {intl.formatMessage(messages.communityTalentCoordinator)}
                </li>
                <li>{intl.formatMessage(messages.communityAdmin)}</li>
                <li>{intl.formatMessage(messages.platformAdmin)}</li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.processOperator.id}>
              <TableOfContents.Heading
                icon={sections.processOperator.icon}
                color="secondary"
              >
                {sections.processOperator.title}
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
              <Ul space="md">
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
              <Ul space="md">
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
                      "cannot create or publish recruitment processes",
                    id: "fzd6Eg",
                    description:
                      "Description of the limitation that process operators cannot create or publish a process",
                  })}
                </li>
                <li>
                  {intl.formatMessage({
                    defaultMessage: "cannot mark qualified candidates as hired",
                    id: "dJFo0+",
                    description:
                      "Description of the limitation that process operators cannot mark an applicant as hired",
                  })}
                </li>
              </Ul>
            </TableOfContents.Section>
            <TableOfContents.Section id={sections.communityRecruiter.id}>
              <TableOfContents.Heading
                icon={sections.communityRecruiter.icon}
                color="primary"
              >
                {sections.communityRecruiter.title}
              </TableOfContents.Heading>
              <p className="my-6">
                {intl.formatMessage({
                  defaultMessage:
                    "A Community Recruiter focuses on recruitment within their own community. They manage talent requests, have access to their community dashboard, and handle job applications.",
                  id: "kuiRAq",
                  description: "Description of the community recruiter role",
                })}
              </p>
              <p className="my-6">
                {intl.formatMessage(messages.keyPermissions) +
                  intl.formatMessage(commonMessages.dividingColon)}
              </p>
              <Ul space="md">
                <li>
                  {intl.formatMessage({
                    defaultMessage:
                      "has access to all recruitment processes and applicants within their community",
                    id: "Z65JVQ",
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
              <Ul space="md">
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
            <TableOfContents.Section
              id={sections.communityTalentCoordinator.id}
            >
              <TableOfContents.Heading
                icon={sections.communityTalentCoordinator.icon}
                color="secondary"
              >
                {sections.communityTalentCoordinator.title}
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
              <Ul space="md">
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
              <Ul space="md">
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
            <TableOfContents.Section id={sections.communityAdmin.id}>
              <TableOfContents.Heading
                icon={sections.communityAdmin.icon}
                color="primary"
              >
                {sections.communityAdmin.title}
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
              <Ul space="md">
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
            <TableOfContents.Section id={sections.permissionsTables.id}>
              <TableOfContents.Heading
                icon={sections.permissionsTables.icon}
                color="secondary"
              >
                {sections.permissionsTables.title}
              </TableOfContents.Heading>
              <RolesAndPermissionsTable
                title={intl.formatMessage({
                  defaultMessage: "Recruitment process management",
                  id: "mDs1Hm",
                  description:
                    "Title for section describing roles and permissions for processes",
                })}
                data={[
                  {
                    permission: intl.formatMessage({
                      defaultMessage: "Create and delete a draft process",
                      id: "VmlVb5",
                      description:
                        "Permissions related to creating/deleting draft processes",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage:
                        "Edit a draft process and assessment plan",
                      id: "YzUhwE",
                      description:
                        "Permissions related to creating/deleting draft processes assessment plan",
                    }),
                    [ROLE_NAME.ProcessOperator]: true,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage:
                        "Publish process and make editorial changes to published process",
                      id: "76SiMq",
                      description:
                        "Permissions related to edit published processes",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: false,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage: "Assign Process Operators",
                      id: "LwnpF0",
                      description:
                        "Permissions related to assign users to a process",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                ]}
              />
              <RolesAndPermissionsTable
                title={intl.formatMessage({
                  defaultMessage: "Applicant management",
                  id: "+D0qSp",
                  description:
                    "Title for section describing roles and permissions for applications",
                })}
                data={[
                  {
                    permission: intl.formatMessage({
                      defaultMessage: "View applicant profiles",
                      id: "e2PVIF",
                      description:
                        "Permissions related to viewing profiles of applicants",
                    }),
                    [ROLE_NAME.ProcessOperator]: true,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage:
                        "Screen applicants and record assessment results",
                      id: "ADk6dX",
                      description:
                        "Permissions related to assessing candidates",
                    }),
                    [ROLE_NAME.ProcessOperator]: true,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage: "Mark candidates as hired",
                      id: "Qpf83L",
                      description:
                        "Permissions related to mark a candidate as hired",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                ]}
              />
              <RolesAndPermissionsTable
                title={intl.formatMessage({
                  defaultMessage: "Community permissions",
                  id: "2age06",
                  description:
                    "Title for section describing roles and permissions for communities",
                })}
                data={[
                  {
                    permission: intl.formatMessage({
                      defaultMessage: "Manage talent requests",
                      id: "hhVBJP",
                      description:
                        "Permissions related to managing talent requests",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage: "View community talent",
                      id: "V0+Pk/",
                      description:
                        "Permissions related to viewing users interested in users community",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: true,
                    [ROLE_NAME.CommunityTalentCoordinator]: true,
                    [ROLE_NAME.CommunityAdmin]: false,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage:
                        "Manage talent management events and nominations",
                      id: "fVbf8w",
                      description:
                        "Permissions related to managing talent events and nominations",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: false,
                    [ROLE_NAME.CommunityTalentCoordinator]: true,
                    [ROLE_NAME.CommunityAdmin]: false,
                  },
                  {
                    permission: intl.formatMessage({
                      defaultMessage:
                        "Edit community information and manage roles",
                      id: "QSrnA8",
                      description:
                        "Permissions related to managing the community and its users",
                    }),
                    [ROLE_NAME.ProcessOperator]: false,
                    [ROLE_NAME.CommunityRecruiter]: false,
                    [ROLE_NAME.CommunityTalentCoordinator]: false,
                    [ROLE_NAME.CommunityAdmin]: true,
                  },
                ]}
              />
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

export default Component;
