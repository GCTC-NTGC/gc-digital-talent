import React from "react";
import { useIntl } from "react-intl";
import TableOfContents from "@common/components/TableOfContents";
import {
  CalculatorIcon,
  InformationCircleIcon,
  PencilAltIcon,
  UserIcon,
} from "@heroicons/react/outline";
import {
  getLanguage,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import { isEmpty } from "lodash";
import { Button } from "@common/components";
import {
  ChangeDateDialog,
  ChangeStatusDialog,
  RemoveFromPoolDialog,
} from "./GeneralInfoTabDialogs";
import { User, JobLookingStatus, PoolCandidate } from "../../api/generated";

interface ViewUserPageProps {
  user: User;
}

// accessible button for modals - generate clickable inline elements resembling <a>
interface ModalButtonProps {
  click: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
}
const ModalButton: React.FC<ModalButtonProps> = ({ click, children }) => {
  return (
    <Button
      color="black"
      mode="inline"
      data-h2-padding="b(all, none)"
      data-h2-font-size="b(caption)"
      onClick={click}
    >
      <span data-h2-font-style="b(underline)">{children}</span>
    </Button>
  );
};

const PoolStatusTable: React.FC<ViewUserPageProps> = ({ user }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [changeStatusDialogTarget, setChangeStatusDialogTarget] =
    React.useState<PoolCandidate | null>(null);
  const [changeDateDialogTarget, setChangeDateDialogTarget] =
    React.useState<PoolCandidate | null>(null);
  const [removeFromPoolDialogTarget, setRemoveFromPoolDialogTarget] =
    React.useState<PoolCandidate | null>(null);

  if (isEmpty(user.poolCandidates)) {
    return (
      <div
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, s)"
        data-h2-radius="b(s)"
        data-h2-font-size="b(caption)"
      >
        {intl.formatMessage({
          defaultMessage: "This user is not in any pools yet",
          description:
            "Message on view-user page that the user is not in any pools",
        })}
      </div>
    );
  }
  return (
    <>
      <table data-h2-font-size="b(caption)" data-h2-text-align="b(center)">
        <thead>
          <tr data-h2-bg-color="b(darkgray)" data-h2-font-color="b(white)">
            <th data-h2-padding="b(top-bottom, xs)" data-h2-width="b(25)">
              {intl.formatMessage({
                defaultMessage: "Pool",
                description:
                  "Title of the 'Pool' column for the table on view-user page",
              })}
            </th>
            <th data-h2-padding="b(top-bottom, xs)" data-h2-width="b(25)">
              {intl.formatMessage({
                defaultMessage: "Status",
                description:
                  "Title of the 'Status' column for the table on view-user page",
              })}
            </th>
            <th data-h2-padding="b(top-bottom, xs)" data-h2-width="b(25)">
              {intl.formatMessage({
                defaultMessage: "Expiry date",
                description:
                  "Title of the 'Expiry date' column for the table on view-user page",
              })}
            </th>
            <th data-h2-padding="b(top-bottom, xs)" data-h2-width="b(25)">
              {intl.formatMessage({
                defaultMessage: "Actions",
                description:
                  "Title of the 'Actions' column for the table on view-user page",
              })}
            </th>
          </tr>
        </thead>
        <tbody>
          {user.poolCandidates?.map((candidate) => {
            if (candidate) {
              return (
                <tr key={candidate.id}>
                  <td
                    data-h2-bg-color="b(lightgray)"
                    data-h2-padding="b(top-bottom, xs)"
                  >
                    {candidate.pool?.name?.[locale]}
                  </td>
                  <td
                    data-h2-bg-color="b(lightgray)"
                    data-h2-padding="b(top-bottom, xs)"
                  >
                    {intl.formatMessage(
                      getPoolCandidateStatus(candidate.status as string),
                    )}
                    {" - "}
                    <ModalButton
                      click={() => {
                        setChangeStatusDialogTarget(candidate);
                      }}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Change status",
                        description:
                          "Button to change a users status in a pool - located in the table on view-user page",
                      })}
                    </ModalButton>
                  </td>
                  <td
                    data-h2-font-style="b(underline)"
                    data-h2-bg-color="b(lightgray)"
                    data-h2-padding="b(top-bottom, xs)"
                  >
                    <ModalButton
                      click={() => {
                        setChangeDateDialogTarget(candidate);
                      }}
                    >
                      {candidate.expiryDate}
                    </ModalButton>
                  </td>
                  <td
                    data-h2-font-style="b(underline)"
                    data-h2-bg-color="b(lightgray)"
                    data-h2-padding="b(top-bottom, xs)"
                  >
                    <ModalButton
                      click={() => {
                        setRemoveFromPoolDialogTarget(candidate);
                      }}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Remove from pool",
                        description:
                          "Button to remove a user from a pool - located in the table on view-user page",
                      })}
                    </ModalButton>
                  </td>
                </tr>
              );
            }
            return null;
          })}
        </tbody>
      </table>
      <ChangeStatusDialog
        selectedCandidate={changeStatusDialogTarget}
        user={user}
        onDismiss={() => setChangeStatusDialogTarget(null)}
      />
      <ChangeDateDialog
        selectedCandidate={changeDateDialogTarget}
        user={user}
        onDismiss={() => setChangeDateDialogTarget(null)}
      />
      <RemoveFromPoolDialog
        selectedCandidate={removeFromPoolDialogTarget}
        user={user}
        onDismiss={() => setRemoveFromPoolDialogTarget(null)}
      />
    </>
  );
};

const AboutSection: React.FC<ViewUserPageProps> = ({ user }) => {
  const intl = useIntl();

  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(right-left, m) b(top-bottom, s)"
      data-h2-flex-grid="b(normal, expanded, flush, xs)"
      data-h2-radius="b(s)"
    >
      <span data-h2-flex-item="b(1of3) l(1of6)">
        {intl.formatMessage({
          defaultMessage: "Name:",
          description: "Display text for the name field on users",
        })}
      </span>
      <div data-h2-flex-item="b(2of3) l(1of3)">
        {user.firstName} {user.lastName}
      </div>

      <span data-h2-flex-item="b(1of3) l(1of6)">
        {intl.formatMessage({
          defaultMessage: "Preferred Language:",
          description: "Display text for the preferred language field on users",
        })}
      </span>
      <div data-h2-flex-item="b(2of3) l(1of3)">
        {user.preferredLang
          ? intl.formatMessage(getLanguage(user.preferredLang as string))
          : ""}
      </div>

      <span data-h2-flex-item="b(1of3) l(1of6)">
        {intl.formatMessage({
          defaultMessage: "Email:",
          description: "Display text for the email field on users",
        })}
      </span>
      <div
        data-h2-flex-item="b(2of3) l(1of3)"
        data-h2-font-style="b(underline)"
      >
        {user.email}
      </div>

      <span data-h2-flex-item="b(1of3) l(1of6)">
        {intl.formatMessage({
          defaultMessage: "Current Location:",
          description: "Display text for the current location field on users",
        })}
      </span>
      <div data-h2-flex-item="b(2of3) l(1of3)">
        {user.currentCity},{" "}
        {user.currentProvince
          ? intl.formatMessage(
              getProvinceOrTerritory(user.currentProvince as string),
            )
          : ""}
      </div>

      <span data-h2-flex-item="b(1of3) l(1of6)">
        {intl.formatMessage({
          defaultMessage: "Phone:",
          description: "Display text for the phone number field on users",
        })}
      </span>
      <div data-h2-flex-item="b(2of3) l(1of3)">{user.telephone}</div>
    </div>
  );
};

const CandidateStatusSection: React.FC<ViewUserPageProps> = ({ user }) => {
  const intl = useIntl();

  const purpleText = (msg: string) => {
    return (
      <span data-h2-font-color="b(lightpurple)" data-h2-font-weight="b(800)">
        {msg}
      </span>
    );
  };

  return (
    <>
      <h3>
        {intl.formatMessage({
          defaultMessage: "Personal status",
          description:
            "Title of the 'Personal status' section of the view-user page",
        })}
      </h3>
      <div
        data-h2-bg-color="b(lightgray)"
        data-h2-padding="b(all, s)"
        data-h2-radius="b(s)"
        data-h2-font-size="b(caption)"
      >
        {user.jobLookingStatus === JobLookingStatus.ActivelyLooking &&
          intl.formatMessage(
            {
              defaultMessage:
                "<purpleText>Active</purpleText> - Wants to be contacted for job opportunities",
              description:
                "Text in view user page saying they currently have the 'Active' status, ignore things in <> tags please",
            },
            {
              purpleText,
            },
          )}
        {user.jobLookingStatus === JobLookingStatus.OpenToOpportunities &&
          intl.formatMessage(
            {
              defaultMessage:
                "<purpleText>Open to opportunities</purpleText> - Not actively looking but still wants to be contacted for job opportunities",
              description:
                "Text in view user page saying they currently have the 'Open to opportunities' status, ignore things in <> tags please",
            },
            {
              purpleText,
            },
          )}
        {user.jobLookingStatus === JobLookingStatus.Inactive &&
          intl.formatMessage(
            {
              defaultMessage:
                "<purpleText>Inactive</purpleText> - Does not want to be contacted for job opportunities",
              description:
                "Text in view user page saying they currently have the 'Inactive' status, ignore things in <> tags please",
            },
            {
              purpleText,
            },
          )}
      </div>
      <h3>
        {intl.formatMessage({
          defaultMessage: "Pool status",
          description:
            "Title of the 'Pool status' section of the view-user page",
        })}
      </h3>
      <PoolStatusTable user={user} />
      <h3>
        {intl.formatMessage({
          defaultMessage: "Add user to other pools",
          description:
            "Title of the 'Add user to pools' section of the view-user page",
        })}
      </h3>
    </>
  );
};

const NotesSection: React.FC<ViewUserPageProps> = ({ user }) => {
  return <p>details</p>;
};

const EmploymentEquitySection: React.FC<ViewUserPageProps> = ({ user }) => {
  return <p>details</p>;
};

const GeneralInformationTab: React.FC<ViewUserPageProps> = ({ user }) => {
  const intl = useIntl();

  const items = [
    {
      id: "about",
      title: intl.formatMessage({
        defaultMessage: "About",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: <UserIcon style={{ width: "2rem" }} />,
      content: <AboutSection user={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        description:
          "Title of the 'Candidate status' section of the view-user page",
      }),
      titleIcon: <CalculatorIcon style={{ width: "2rem" }} />,
      content: <CandidateStatusSection user={user} />,
    },
    {
      id: "notes",
      title: intl.formatMessage({
        defaultMessage: "Notes",
        description: "Title of the 'Notes' section of the view-user page",
      }),
      titleIcon: <PencilAltIcon style={{ width: "2rem" }} />,
      content: <NotesSection user={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage({
        defaultMessage: "Employment equity",
        description:
          "Title of the 'Employment equity' section of the view-user page",
      }),
      titleIcon: <InformationCircleIcon style={{ width: "2rem" }} />,
      content: <EmploymentEquitySection user={user} />,
    },
  ];

  return (
    <TableOfContents.Wrapper>
      <TableOfContents.Navigation>
        {items.map((item) => (
          <TableOfContents.AnchorLink key={item.id} id={item.id}>
            {item.title}
          </TableOfContents.AnchorLink>
        ))}
      </TableOfContents.Navigation>
      <TableOfContents.Content>
        {items.map((item) => (
          <TableOfContents.Section key={item.id} id={item.id}>
            <TableOfContents.Heading>
              {item.titleIcon} {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default GeneralInformationTab;
