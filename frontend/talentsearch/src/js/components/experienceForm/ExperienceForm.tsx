import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { toast } from "@common/components/Toast";
import { BasicForm, TextArea } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { navigate, useQueryParams } from "@common/helpers/router";
import { Button } from "@common/components";
import AlertDialog from "@common/components/AlertDialog";
import { TrashIcon } from "@heroicons/react/24/solid";

import { removeFromSessionStorage } from "@common/helpers/storageUtils";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
import { BreadcrumbsProps } from "@common/components/Breadcrumbs";
import { OperationContext } from "urql";
import { getFullPoolAdvertisementTitle } from "@common/helpers/poolUtils";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

import AwardDetailsForm from "../awardDetailsForm/AwardDetailsForm";
import CommunityExperienceForm from "../communityExperienceForm/CommunityExperienceForm";
import EducationExperienceForm from "../educationExperienceForm/EducationExperienceForm";
import PersonalExperienceForm from "../personalExperienceForm/PersonalExperienceForm";
import WorkExperienceForm from "../workExperienceForm/WorkExperienceForm";

import ExperienceSkills from "./ExperienceSkills";
import {
  PoolAdvertisement,
  Skill,
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
  useGetSkillsQuery,
} from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";

import type {
  ExperienceType,
  AllFormValues,
  FormValues,
  ExperienceDetailsSubmissionData,
  ExperienceMutationResponse,
  ExperienceQueryData,
} from "./types";

import queryResultToDefaultValues from "./defaultValues";
import formValuesToSubmitData from "./submissionData";
import {
  useExperienceMutations,
  useDeleteExperienceMutation,
} from "./mutations";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import getExperienceFormLabels from "./labels";

export interface ExperienceFormProps {
  userId: string;
  experienceType: ExperienceType;
  experience?: ExperienceQueryData;
  poolAdvertisement?: PoolAdvertisement;
  skills: Skill[];
  onUpdateExperience: (values: ExperienceDetailsSubmissionData) => void;
  deleteExperience: () => void;
  cacheKey?: string;
  edit?: boolean;
}

export const ExperienceForm: React.FunctionComponent<ExperienceFormProps> = ({
  userId,
  experience,
  experienceType,
  onUpdateExperience,
  deleteExperience,
  skills,
  cacheKey,
  edit,
  poolAdvertisement,
}) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);
  const directIntakePaths = useDirectIntakeRoutes();
  const defaultValues = experience
    ? queryResultToDefaultValues(experienceType, experience)
    : undefined;
  const { applicationId } = useQueryParams();
  const returnPath = `${paths.skillsAndExperiences(userId)}${
    applicationId ? `?applicationId=${applicationId}` : ``
  }`;

  const handleSubmit: SubmitHandler<FormValues<AllFormValues>> = async (
    formValues,
  ) => {
    const data = formValuesToSubmitData(experienceType, formValues);
    await onUpdateExperience(data);
  };

  let crumbs = [
    {
      title: intl.formatMessage({
        defaultMessage: "Experience and Skills",
        id: "P/Mm5G",
        description: "Display text for My experience and skills Form Page Link",
      }),
      href: returnPath,
    },
    {
      title: experience
        ? intl.formatMessage({
            defaultMessage: "Edit Experience",
            id: "NrivlZ",
            description: "Display text for edit experience form in breadcrumbs",
          })
        : intl.formatMessage({
            defaultMessage: "Add Experience",
            id: "mJ1HE4",
            description: "Display text for add experience form in breadcrumbs",
          }),
    },
  ] as BreadcrumbsProps["links"];

  if (poolAdvertisement) {
    const advertisementTitle = getFullPoolAdvertisementTitle(
      intl,
      poolAdvertisement,
    );

    crumbs = [
      {
        title: intl.formatMessage({
          defaultMessage: "My Applications",
          id: "q04FCp",
          description: "Link text for breadcrumb to user applications page.",
        }),
        href: directIntakePaths.applications(userId),
      },
      {
        title: advertisementTitle,
        href: "#",
      },
      ...crumbs,
    ];
  }

  const labels = getExperienceFormLabels(intl, experienceType);

  const pageTitle = () => {
    switch (experienceType) {
      case "award":
        return intl.formatMessage({
          defaultMessage: "Edit award",
          id: "7X5cnb",
          description: "Page title for the award profile form",
        });
      case "community":
        return intl.formatMessage({
          defaultMessage: "Edit community experience",
          id: "LN0Wag",
          description: "Page title for the community experience profile form",
        });
      case "education":
        return intl.formatMessage({
          defaultMessage: "Edit education experience",
          id: "7DtNMY",
          description: "Page title for the education experience profile form",
        });
      case "personal":
        return intl.formatMessage({
          defaultMessage: "Edit personal experience",
          id: "96GHnx",
          description: "Page title for the personal experience profile form",
        });
      case "work":
        return intl.formatMessage({
          defaultMessage: "Edit work experience",
          id: "Ytlyzb",
          description: "Page title for the work experience profile form",
        });
      default:
        return "";
    }
  };

  return (
    <ProfileFormWrapper
      title={pageTitle()}
      prefixBreadcrumbs={!poolAdvertisement}
      crumbs={crumbs}
      cancelLink={{
        href: returnPath,
      }}
    >
      <BasicForm
        onSubmit={handleSubmit}
        cacheKey={cacheKey}
        labels={labels}
        options={{
          defaultValues,
        }}
      >
        {experienceType === "award" && <AwardDetailsForm labels={labels} />}
        {experienceType === "community" && (
          <CommunityExperienceForm labels={labels} />
        )}
        {experienceType === "education" && (
          <EducationExperienceForm labels={labels} />
        )}
        {experienceType === "personal" && (
          <PersonalExperienceForm labels={labels} />
        )}
        {experienceType === "work" && <WorkExperienceForm labels={labels} />}
        <ExperienceSkills
          skills={skills}
          poolAdvertisement={poolAdvertisement}
        />
        <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x2, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage: "4. Additional information for this experience",
            id: "Rgh/Qb",
            description: "Title for addition information on Experience form",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Anything else about this experience you would like to share.",
            id: "h1wsiL",
            description:
              "Description blurb for additional information on Experience form",
          })}
        </p>
        <TextArea id="details" label={labels.details} name="details" />
        {edit && (
          <AlertDialog.Root>
            <AlertDialog.Trigger>
              <Button
                type="button"
                mode="outline"
                color="secondary"
                data-h2-margin="base(x2, 0, 0, 0)"
              >
                <span>
                  <TrashIcon style={{ width: "0.9rem" }} />{" "}
                  {intl.formatMessage({
                    defaultMessage: "Delete experience from My Profile",
                    id: "uqoN4k",
                    description: "Label on button for delete this experience",
                  })}
                </span>
              </Button>
            </AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Title>
                {intl.formatMessage({
                  defaultMessage: "Are you sure?",
                  id: "AcsOrg",
                  description: "Delete confirmation",
                })}
              </AlertDialog.Title>
              <AlertDialog.Description>
                {intl.formatMessage({
                  defaultMessage:
                    "Are you sure you would like to delete this experience from your profile? This action cannot be undone.",
                  id: "IhXvCe",
                  description:
                    "Question displayed when a user attempts to delete an experience from their profile",
                })}
              </AlertDialog.Description>
              <AlertDialog.Footer>
                <AlertDialog.Cancel>
                  <Button type="button" mode="outline" color="secondary">
                    {intl.formatMessage({
                      defaultMessage: "Cancel",
                      id: "KnE2Rk",
                      description: "Cancel confirmation",
                    })}
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button
                    type="submit"
                    mode="solid"
                    color="primary"
                    onClick={deleteExperience}
                  >
                    {intl.formatMessage({
                      defaultMessage: "Delete",
                      id: "sBksyQ",
                      description: "Delete confirmation",
                    })}
                  </Button>
                </AlertDialog.Action>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog.Root>
        )}
        <ProfileFormFooter
          mode="bothButtons"
          cancelLink={{
            href: returnPath,
          }}
        />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

const context: Partial<OperationContext> = {
  additionalTypenames: ["Skill", "SkillFamily"], // This lets urql know when to invalidate cache if request returns empty list. https://formidable.com/open-source/urql/docs/basics/document-caching/#document-cache-gotchas
  requestPolicy: "cache-first", // The list of skills will rarely change, so we override default request policy to avoid unnecessary cache updates.
};

export interface ExperienceFormContainerProps {
  userId: string;
  experienceType: ExperienceType;
  experienceId?: string;
  edit?: boolean;
}

const ExperienceFormContainer: React.FunctionComponent<
  ExperienceFormContainerProps
> = ({ userId, experienceType, experienceId, edit }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);
  const cacheKey = `ts-createExperience-${experienceId || experienceType}`;
  const { applicationId } = useQueryParams();
  const returnPath = `${paths.skillsAndExperiences(userId)}${
    applicationId ? `?applicationId=${applicationId}` : ``
  }`;
  const [
    {
      data: applicationData,
      fetching: fetchingApplication,
      error: applicationError,
    },
  ] = useGetApplicationQuery({
    variables: { id: applicationId || "" },
    pause: !applicationId,
  });

  const handleSuccess = () => {
    removeFromSessionStorage(cacheKey); // clear the cache
    navigate(returnPath);
    toast.success(
      edit
        ? intl.formatMessage({
            defaultMessage: "Successfully updated experience!",
            id: "jrjPWp",
            description:
              "Success message displayed after updating experience on profile",
          })
        : intl.formatMessage({
            defaultMessage: "Successfully added experience!",
            id: "DZ775N",
            description:
              "Success message displayed after adding experience to profile",
          }),
    );
  };

  const handleError = () => {
    toast.error(
      edit
        ? intl.formatMessage({
            defaultMessage: "Error: updating experience failed",
            id: "WyKJsK",
            description:
              "Message displayed to user after experience fails to be updated.",
          })
        : intl.formatMessage({
            defaultMessage: "Error: adding experience failed",
            id: "moKAQP",
            description:
              "Message displayed to user after experience fails to be created.",
          }),
    );
  };

  const handleMutationResponse = (res: ExperienceMutationResponse) => {
    if (res.data) {
      handleSuccess();
    }
  };

  const [experiencesResult] = useGetMyExperiencesQuery();
  const { data: experienceData, fetching: fetchingExperience } =
    experiencesResult;

  const [skillResults] = useGetSkillsQuery({
    context,
  });
  const {
    data: skillsData,
    fetching: fetchingSkills,
    error: skillError,
  } = skillResults;

  let experience: ExperienceQueryData | null = null;
  if (experienceId && experienceData?.me?.experiences) {
    experience = experienceData.me.experiences.find((e) => {
      // eslint-disable-next-line no-underscore-dangle
      const type = e?.__typename;
      return (
        e?.id === experienceId && type?.toLowerCase().includes(experienceType)
      );
    }) as ExperienceQueryData;
  }

  const { executeMutation, getMutationArgs } = useExperienceMutations(
    experienceType,
    experience ? "update" : "create",
  );

  const handleUpdateExperience = (values: ExperienceDetailsSubmissionData) => {
    const args = getMutationArgs(experienceId || userId, values);
    const res = executeMutation(args) as Promise<ExperienceMutationResponse>;
    res.then(handleMutationResponse).catch(handleError);
  };

  // delete functionality //
  // constrict to string only
  const experienceIdExact = experienceId || "";
  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);

  const handleDeleteExperience = () => {
    executeDeletionMutation
      .executeDeletionMutation({
        id: experienceIdExact,
      })
      .then((result) => {
        navigate(returnPath);
        toast.success(
          intl.formatMessage({
            defaultMessage: "Experience Deleted",
            id: "/qN7tM",
            description: "Message displayed to user after experience deleted.",
          }),
        );
        return result.data;
      })
      .catch(handleError);
  };

  let found = true;
  if (experienceId) {
    found = found && notEmpty(experience);
  }

  return (
    <Pending
      fetching={fetchingSkills || fetchingExperience || fetchingApplication}
      error={skillError || applicationError}
    >
      {skillsData && found ? (
        <ExperienceForm
          userId={userId}
          poolAdvertisement={
            applicationData?.poolCandidate?.poolAdvertisement || undefined
          }
          experience={experience as ExperienceQueryData}
          experienceType={experienceType}
          skills={skillsData.skills as Skill[]}
          onUpdateExperience={handleUpdateExperience}
          deleteExperience={handleDeleteExperience}
          cacheKey={cacheKey}
          edit={edit}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "No experience found.",
              id: "Yhd/hk",
              description:
                "Message displayed when no experience is found for experience form.",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default ExperienceFormContainer;
