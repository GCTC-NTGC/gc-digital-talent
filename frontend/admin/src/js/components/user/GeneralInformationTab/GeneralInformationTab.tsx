import React from "react";
import { useIntl } from "react-intl";
import TableOfContents from "@common/components/TableOfContents";
import {
  CalculatorIcon,
  InformationCircleIcon,
  PencilAltIcon,
  UserIcon,
  CheckIcon,
} from "@heroicons/react/outline";
import {
  getLanguage,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import { getLocale } from "@common/helpers/localize";
import { isEmpty } from "lodash";
import { Button } from "@common/components";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import { commonMessages } from "@common/messages";
import { BasicForm, TextArea } from "@common/components/form";
import { unpackMaybes } from "@common/helpers/formUtils";
import { toast } from "react-toastify";
import {
  AddToPoolDialog,
  ChangeDateDialog,
  ChangeStatusDialog,
} from "./GeneralInfoTabDialogs";
import {
  User,
  JobLookingStatus,
  PoolCandidate,
  useGetGeneralInfoQuery,
  Pool,
  useUpdatePoolCandidateMutation,
  UpdatePoolCandidateAsAdminInput,
} from "../../../api/generated";

interface BasicSectionProps {
  user: User;
}

interface SectionWithPoolsProps {
  user: User;
  pools: Pool[];
}

// accessible button for modals - generate clickable inline elements resembling <a>
interface ModalTableButtonProps {
  click: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  children?: React.ReactNode;
}
const ModalTableButton: React.FC<ModalTableButtonProps> = ({
  click,
  children,
}) => {
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

const PoolStatusTable: React.FC<BasicSectionProps> = ({ user }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [changeStatusDialogTarget, setChangeStatusDialogTarget] =
    React.useState<PoolCandidate | null>(null);
  const [changeDateDialogTarget, setChangeDateDialogTarget] =
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
                    <ModalTableButton
                      click={() => {
                        setChangeStatusDialogTarget(candidate);
                      }}
                    >
                      {intl.formatMessage({
                        defaultMessage: "Change status",
                        description:
                          "Button to change a users status in a pool - located in the table on view-user page",
                      })}
                    </ModalTableButton>
                  </td>
                  <td
                    data-h2-font-style="b(underline)"
                    data-h2-bg-color="b(lightgray)"
                    data-h2-padding="b(top-bottom, xs)"
                  >
                    <ModalTableButton
                      click={() => {
                        setChangeDateDialogTarget(candidate);
                      }}
                    >
                      {candidate.expiryDate}
                    </ModalTableButton>
                  </td>
                  <td
                    data-h2-font-style="b(underline)"
                    data-h2-bg-color="b(lightgray)"
                    data-h2-font-color="b(darkgray)"
                    data-h2-padding="b(top-bottom, xs)"
                  >
                    {intl.formatMessage({
                      defaultMessage: "Remove from pool",
                      description:
                        "Button to remove a user from a pool - located in the table on view-user page",
                    })}
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
    </>
  );
};

const AboutSection: React.FC<BasicSectionProps> = ({ user }) => {
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

const CandidateStatusSection: React.FC<SectionWithPoolsProps> = ({
  user,
  pools,
}) => {
  const intl = useIntl();

  const [showAddToPoolDialog, setShowAddToPoolDialog] = React.useState(false);

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
      <Button
        color="primary"
        mode="outline"
        onClick={() => {
          setShowAddToPoolDialog(true);
        }}
      >
        <span data-h2-font-style="b(underline)">
          {intl.formatMessage({
            defaultMessage: "Add user to pool",
            description: "Button to add user to pool on the view-user page",
          })}
        </span>
      </Button>
      <AddToPoolDialog
        isVisible={showAddToPoolDialog}
        user={user}
        pools={pools}
        onDismiss={() => setShowAddToPoolDialog(false)}
      />
    </>
  );
};

const NotesSection: React.FC<BasicSectionProps> = ({ user }) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  const [, executeMutation] = useUpdatePoolCandidateMutation();

  const handleUpdateCandidate = async (
    id: string,
    values: UpdatePoolCandidateAsAdminInput,
  ) => {
    const res = await executeMutation({ id, poolCandidate: values });
    if (res.data?.updatePoolCandidateAsAdmin) {
      return res.data.updatePoolCandidateAsAdmin;
    }
    return Promise.reject(res.error);
  };

  const handleSubmit = async (formValues: { [x: string]: string }) => {
    user?.poolCandidates?.forEach(async (candidate) => {
      if (candidate && (candidate.notes || "") !== formValues[candidate.id]) {
        await handleUpdateCandidate(candidate.id, {
          notes: formValues[candidate.id],
        })
          .then(() => {
            toast.success(
              intl
                .formatMessage({
                  defaultMessage: "Successfully updated notes for candidate in",
                  description:
                    "Toast notification for successful update of candidates notes",
                })
                .concat(` ${candidate.pool?.name?.[locale]}` || ""),
            );
          })
          .catch(() => {
            toast.error(
              intl
                .formatMessage({
                  defaultMessage: "Failed updating notes for candidate in",
                  description:
                    "Toast notification for failed update of candidates notes",
                })
                .concat(` ${candidate.pool?.name?.[locale]}` || ""),
            );
          });
      }
    });
  };

  return (
    <>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "These notes are shared between all managers of this pool, but not to candidates.",
          description:
            "Message about the behavior of notes on the view-user page",
        })}
      </p>
      {isEmpty(user.poolCandidates) ? (
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
      ) : (
        <BasicForm onSubmit={handleSubmit}>
          {user?.poolCandidates?.map((candidate) => {
            if (candidate) {
              return (
                <div data-h2-padding="b(bottom, s)" key={candidate.id}>
                  <TextArea
                    id={candidate.id}
                    name={candidate.id}
                    label={`${intl.formatMessage({
                      defaultMessage: "Notes",
                      description: "Title for a pool candidates notes field",
                    })} - ${candidate.pool?.name?.[locale]}`}
                    defaultValue={candidate.notes ? candidate.notes : ""}
                    placeholder={intl.formatMessage({
                      defaultMessage: "Start writing your notes here...",
                      description:
                        "Placeholder text for a pool candidates notes field",
                    })}
                    rows={4}
                  />
                </div>
              );
            }
            return null;
          })}
          <Button type="submit" mode="solid" color="secondary">
            <span data-h2-font-style="b(underline)">
              {intl.formatMessage({
                defaultMessage: "Save notes",
                description:
                  "Button to save notes for a pool candidate on the view-user page",
              })}
            </span>
          </Button>
        </BasicForm>
      )}
    </>
  );
};

const EmploymentEquitySection: React.FC<BasicSectionProps> = ({ user }) => {
  const intl = useIntl();

  return (
    <div
      data-h2-bg-color="b(lightgray)"
      data-h2-padding="b(right-left, s) b(top-bottom, xxs)"
      data-h2-radius="b(s)"
    >
      {!user.isIndigenous &&
        !user.hasDisability &&
        !user.isVisibleMinority &&
        !user.isWoman &&
        intl.formatMessage({
          defaultMessage:
            "Has not identified as a member of any employment equity groups.",
          description:
            "Text on view-user page that the user isn't part of any employment equity groups",
        })}
      {user.isIndigenous && (
        <div data-h2-padding="b(top-bottom, xxs)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Indigenous",
            description: "Text on view-user page that the user is indigenous",
          })}
        </div>
      )}
      {user.hasDisability && (
        <div data-h2-padding="b(top-bottom, xxs)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Person with disability",
            description:
              "Text on view-user page that the user has a disability",
          })}
        </div>
      )}
      {user.isVisibleMinority && (
        <div data-h2-padding="b(top-bottom, xxs)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Visible minority",
            description:
              "Text on view-user page that the user is part of a visible minority",
          })}
        </div>
      )}
      {user.isWoman && (
        <div data-h2-padding="b(top-bottom, xxs)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Woman",
            description: "Text on view-user page that the user is a woman",
          })}
        </div>
      )}
    </div>
  );
};

export const GeneralInformationTab: React.FC<SectionWithPoolsProps> = ({
  user,
  pools,
}) => {
  const intl = useIntl();

  const items = [
    {
      id: "about",
      title: intl.formatMessage({
        defaultMessage: "About",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: UserIcon,
      content: <AboutSection user={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        description:
          "Title of the 'Candidate status' section of the view-user page",
      }),
      titleIcon: CalculatorIcon,
      content: <CandidateStatusSection user={user} pools={pools} />,
    },
    {
      id: "notes",
      title: intl.formatMessage({
        defaultMessage: "Notes",
        description: "Title of the 'Notes' section of the view-user page",
      }),
      titleIcon: PencilAltIcon,
      content: <NotesSection user={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage({
        defaultMessage: "Employment equity",
        description:
          "Title of the 'Employment equity' section of the view-user page",
      }),
      titleIcon: InformationCircleIcon,
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
            <TableOfContents.Heading icon={item.titleIcon}>
              {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

const GeneralInfoTabApi: React.FC<{
  userId: string;
}> = ({ userId }) => {
  const intl = useIntl();

  const [{ data, fetching, error }] = useGetGeneralInfoQuery({
    variables: { id: userId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.user && data?.pools ? (
        <GeneralInformationTab
          user={data.user}
          pools={unpackMaybes(data.pools)}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Failed fetching data for tab.",
              description: "Message displayed for failed fetching data.",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default GeneralInfoTabApi;
