import React from "react";
import { useIntl } from "react-intl";
import isEmpty from "lodash/isEmpty";
import {
  CalculatorIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  UserIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

import { toast } from "@common/components/Toast";
import TableOfContents from "@common/components/TableOfContents";
import Well from "@common/components/Well";
import {
  getArmedForcesStatusesAdmin,
  getCitizenshipStatusesAdmin,
  getLanguage,
  getPoolCandidateStatus,
  getProvinceOrTerritory,
} from "@common/constants/localizedConstants";
import { Button, Link } from "@common/components";
import { BasicForm, TextArea } from "@common/components/form";
import Heading from "@common/components/Heading";
import { getFullNameHtml } from "@common/helpers/nameUtils";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import { useAdminRoutes } from "../../../adminRoutes";
import { ChangeDateDialog } from "./ChangeDateDialog";
import { AddToPoolDialog } from "./AddToPoolDialog";
import { ChangeStatusDialog } from "./ChangeStatusDialog";
import {
  JobLookingStatus,
  Pool,
  useUpdatePoolCandidateMutation,
  UpdatePoolCandidateAsAdminInput,
  Applicant,
} from "../../../api/generated";

interface BasicSectionProps {
  user: Applicant;
}

interface SectionWithPoolsProps {
  user: Applicant;
  pools: Pool[];
}

const PoolStatusTable: React.FC<SectionWithPoolsProps> = ({ user, pools }) => {
  const intl = useIntl();
  const routes = useAdminRoutes();

  if (isEmpty(user.poolCandidates)) {
    return (
      <Well>
        {intl.formatMessage({
          defaultMessage: "This user is not in any pools yet",
          id: "W58QTT",
          description:
            "Message on view-user page that the user is not in any pools",
        })}
      </Well>
    );
  }
  return (
    <table data-h2-text-align="base(center)">
      <thead>
        <tr
          data-h2-background-color="base(dt-gray.dark)"
          data-h2-color="base(dt-white)"
        >
          <th data-h2-padding="base(x.25, 0)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Pool",
              id: "icYqDt",
              description:
                "Title of the 'Pool' column for the table on view-user page",
            })}
          </th>
          <th data-h2-padding="base(x.25, 0)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Status",
              id: "sUx3ZS",
              description:
                "Title of the 'Status' column for the table on view-user page",
            })}
          </th>
          <th data-h2-padding="base(x.25, 0)" data-h2-width="base(25%)">
            {intl.formatMessage({
              defaultMessage: "Expiry date",
              id: "STDYoR",
              description:
                "Title of the 'Expiry date' column for the table on view-user page",
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
                  data-h2-background-color="base(dt-gray.light)"
                  data-h2-padding="base(x.25, 0)"
                >
                  {candidate.pool ? (
                    <Link href={routes.poolView(candidate.pool.id)}>
                      {getFullPoolAdvertisementTitle(intl, candidate.pool)}
                    </Link>
                  ) : (
                    ""
                  )}
                </td>
                <td
                  data-h2-background-color="base(dt-gray.light)"
                  data-h2-padding="base(x.25, 0)"
                >
                  {intl.formatMessage(
                    getPoolCandidateStatus(candidate.status as string),
                  )}
                  {" - "}
                  <ChangeStatusDialog
                    selectedCandidate={candidate}
                    user={user}
                    pools={pools}
                  />
                </td>
                <td
                  data-h2-text-decoration="base(underline)"
                  data-h2-background-color="base(dt-gray.light)"
                  data-h2-padding="base(x.25, 0)"
                >
                  <ChangeDateDialog selectedCandidate={candidate} user={user} />
                </td>
              </tr>
            );
          }
          return null;
        })}
      </tbody>
    </table>
  );
};

const AboutSection: React.FC<BasicSectionProps> = ({ user }) => {
  const intl = useIntl();

  return (
    <Well>
      <div data-h2-flex-grid="base(normal, x1, x.5)">
        {/* Name */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Name:",
              id: "nok2sR",
              description: "Display text for the name field on users",
            })}
          </p>
          <p>{getFullNameHtml(user.firstName, user.lastName, intl)}</p>
        </div>
        {/* Email */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Email:",
              id: "3UkIDo",
              description: "Display text for the email field on users",
            })}
          </p>
          <p>{user.email}</p>
        </div>
        {/* Preferred communication language */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Preferred Communication Language:",
              id: "LvHCvn",
              description:
                "Display text for the preferred communication language field on users",
            })}
          </p>
          <p>
            {user.preferredLang
              ? intl.formatMessage(getLanguage(user.preferredLang as string))
              : ""}
          </p>
        </div>
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Preferred Spoken Interview Language:",
              id: "Wmuizf",
              description:
                "Display text for the preferred spoken interview language field on users",
            })}
          </p>
          <p>
            {user.preferredLanguageForInterview
              ? intl.formatMessage(
                  getLanguage(user.preferredLanguageForInterview as string),
                )
              : ""}
          </p>
        </div>
        {/* Preferred exam language */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Preferred Written Exam Language:",
              id: "zzwPOR",
              description:
                "Display text for the preferred written exam language field on users",
            })}
          </p>
          <p>
            {user.preferredLanguageForExam
              ? intl.formatMessage(
                  getLanguage(user.preferredLanguageForExam as string),
                )
              : ""}
          </p>
        </div>
        {/* Phone */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Phone:",
              id: "EnvwAC",
              description: "Display text for the phone number field on users",
            })}
          </p>
          <p>
            {user.telephone ? (
              <a
                href={`tel:${user.telephone}`}
                aria-label={user.telephone.replace(/.{1}/g, "$& ")}
              >
                {user.telephone}
              </a>
            ) : (
              ""
            )}
          </p>
        </div>
        {/* Current location */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Current Location:",
              id: "DMdCkf",
              description:
                "Display text for the current location field on users",
            })}
          </p>
          <p>
            {user.currentCity},{" "}
            {user.currentProvince
              ? intl.formatMessage(
                  getProvinceOrTerritory(user.currentProvince as string),
                )
              : ""}
          </p>
        </div>
        {/* CAF status */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Member of CAF:",
              id: "EkBES+",
              description: "label for CAF status",
            })}
          </p>
          {user.armedForcesStatus !== null &&
            user.armedForcesStatus !== undefined && (
              <p>
                {intl.formatMessage(
                  getArmedForcesStatusesAdmin(user.armedForcesStatus),
                )}
              </p>
            )}
        </div>
        {/* Citizenship */}
        <div data-h2-flex-item="base(1of1) p-tablet(1of2) desktop(1of3)">
          <p data-h2-font-weight="base(700)">
            {intl.formatMessage({
              defaultMessage: "Citizenship:",
              id: "LOhcO4",
              description: "label for citizenship status",
            })}
          </p>
          <p>
            {user.citizenship
              ? intl.formatMessage(
                  getCitizenshipStatusesAdmin(user.citizenship),
                )
              : ""}
          </p>
        </div>
      </div>
    </Well>
  );
};

const CandidateStatusSection: React.FC<SectionWithPoolsProps> = ({
  user,
  pools,
}) => {
  const intl = useIntl();

  return (
    <>
      <Heading level="h4" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Personal status",
          id: "4N6O+3",
          description:
            "Title of the 'Personal status' section of the view-user page",
        })}
      </Heading>
      <Well>
        {user.jobLookingStatus === JobLookingStatus.ActivelyLooking &&
          intl.formatMessage({
            defaultMessage:
              "<heavyPrimary>Active</heavyPrimary> - Wants to be contacted for job opportunities",
            id: "SOZVtc",
            description:
              "Text in view user page saying they currently have the 'Active' status, ignore things in <> tags please",
          })}
        {user.jobLookingStatus === JobLookingStatus.OpenToOpportunities &&
          intl.formatMessage({
            defaultMessage:
              "<heavyPrimary>Open to opportunities</heavyPrimary> - Not actively looking but still wants to be contacted for job opportunities",
            id: "ye47Rz",
            description:
              "Text in view user page saying they currently have the 'Open to opportunities' status, ignore things in <> tags please",
          })}
        {user.jobLookingStatus === JobLookingStatus.Inactive &&
          intl.formatMessage({
            defaultMessage:
              "<heavyPrimary>Inactive</heavyPrimary> - Does not want to be contacted for job opportunities",
            id: "S0ghpc",
            description:
              "Text in view user page saying they currently have the 'Inactive' status, ignore things in <> tags please",
          })}
      </Well>
      <Heading level="h4" data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Pool status",
          id: "hIaETV",
          description:
            "Title of the 'Pool status' section of the view-user page",
        })}
      </Heading>
      <PoolStatusTable user={user} pools={pools} />
      <h5 data-h2-margin="base(x2, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage: "Add user to pool",
          id: "jtEouE",
          description:
            "Title of the 'Add user to pools' section of the view-user page",
        })}
      </h5>
      <AddToPoolDialog user={user} pools={pools} />
    </>
  );
};

const NotesSection: React.FC<BasicSectionProps> = ({ user }) => {
  const intl = useIntl();

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
              intl.formatMessage(
                {
                  defaultMessage:
                    "Successfully updated notes for candidate in {poolName}",
                  id: "CoUFQ5",
                  description:
                    "Toast notification for successful update of candidates notes in specified pool",
                },
                {
                  poolName: getFullPoolAdvertisementTitle(intl, candidate.pool),
                },
              ),
            );
          })
          .catch(() => {
            toast.error(
              intl.formatMessage(
                {
                  defaultMessage:
                    "Failed updating notes for candidate in {poolName}",
                  id: "kXAnJt",
                  description:
                    "Toast notification for failed update of candidates notes in specified pool",
                },
                {
                  poolName: getFullPoolAdvertisementTitle(intl, candidate.pool),
                },
              ),
            );
          });
      }
    });
  };

  return (
    <>
      <p data-h2-margin="base(x1, 0, x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "These notes are shared between all managers of this pool, but not to candidates.",
          id: "9mJuzm",
          description:
            "Message about the behavior of notes on the view-user page",
        })}
      </p>
      {isEmpty(user.poolCandidates) ? (
        <Well>
          {intl.formatMessage({
            defaultMessage: "This user is not in any pools yet",
            id: "W58QTT",
            description:
              "Message on view-user page that the user is not in any pools",
          })}
        </Well>
      ) : (
        <BasicForm onSubmit={handleSubmit}>
          {user?.poolCandidates?.map((candidate) => {
            if (candidate) {
              return (
                <div data-h2-padding="base(0, 0, x.5, 0)" key={candidate.id}>
                  <TextArea
                    id={candidate.id}
                    name={candidate.id}
                    label={`${intl.formatMessage({
                      defaultMessage: "Notes",
                      id: "CSDdh/",
                      description: "Title for a pool candidates notes field",
                    })} - ${getFullPoolAdvertisementTitle(
                      intl,
                      candidate.pool,
                    )}`}
                    defaultValue={candidate.notes ? candidate.notes : ""}
                    placeholder={intl.formatMessage({
                      defaultMessage: "Start writing your notes here...",
                      id: "/MBeNc",
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
            <span data-h2-text-decoration="base(underline)">
              {intl.formatMessage({
                defaultMessage: "Save notes",
                id: "ZNne50",
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
    <Well>
      {!user.isIndigenous &&
        !user.hasDisability &&
        !user.isVisibleMinority &&
        !user.isWoman &&
        intl.formatMessage({
          defaultMessage:
            "Has not identified as a member of any employment equity groups.",
          id: "PjK/4B",
          description:
            "Text on view-user page that the user isn't part of any employment equity groups",
        })}
      {user.isIndigenous && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Indigenous",
            id: "HrXZ6X",
            description: "Text on view-user page that the user is indigenous",
          })}
        </div>
      )}
      {user.hasDisability && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Person with disability",
            id: "4Zl/mp",
            description:
              "Text on view-user page that the user has a disability",
          })}
        </div>
      )}
      {user.isVisibleMinority && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Visible minority",
            id: "eickbr",
            description:
              "Text on view-user page that the user is part of a visible minority",
          })}
        </div>
      )}
      {user.isWoman && (
        <div data-h2-padding="base(x.125, 0)">
          <CheckIcon style={{ width: "1rem" }} />
          {"  "}
          {intl.formatMessage({
            defaultMessage: "Woman",
            id: "3HJ51b",
            description: "Text on view-user page that the user is a woman",
          })}
        </div>
      )}
    </Well>
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
        id: "uutH18",
        description: "Title of the 'About' section of the view-user page",
      }),
      titleIcon: UserIcon,
      content: <AboutSection user={user} />,
    },
    {
      id: "candidate-status",
      title: intl.formatMessage({
        defaultMessage: "Candidate status",
        id: "F00OD4",
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
        id: "4AubyK",
        description: "Title of the 'Notes' section of the view-user page",
      }),
      titleIcon: PencilSquareIcon,
      content: <NotesSection user={user} />,
    },
    {
      id: "employment-equity",
      title: intl.formatMessage({
        defaultMessage: "Employment equity",
        id: "BYGKiT",
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
            <TableOfContents.Heading
              icon={item.titleIcon}
              as="h3"
              data-h2-margin="base(x3, 0, x1, 0)"
            >
              {item.title}
            </TableOfContents.Heading>
            {item.content}
          </TableOfContents.Section>
        ))}
      </TableOfContents.Content>
    </TableOfContents.Wrapper>
  );
};

export default GeneralInformationTab;
