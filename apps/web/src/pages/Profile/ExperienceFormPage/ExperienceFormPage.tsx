import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { OperationContext } from "urql";
import { TrashIcon } from "@heroicons/react/24/solid";

import { toast } from "@gc-digital-talent/toast";
import {
  Button,
  AlertDialog,
  ThrowNotFound,
  Pending,
} from "@gc-digital-talent/ui";
import { BasicForm, TextArea } from "@gc-digital-talent/forms";
import { removeFromSessionStorage } from "@gc-digital-talent/storage";
import { notEmpty } from "@gc-digital-talent/helpers";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import { categorizeSkill } from "~/utils/skillUtils";
import {
  Maybe,
  SkillCategory,
  PoolAdvertisement,
  Scalars,
  Skill,
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
  useGetSkillsQuery,
} from "~/api/generated";
import useRoutes from "~/hooks/useRoutes";
import useApplicationInfo from "~/hooks/useApplicationInfo";

import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";

import AwardFormFields from "./components/AwardFormFields/AwardFormFields";
import CommunityFormFields from "./components/CommunityFormFields/CommunityFormFields";
import EducationFormFields from "./components/EducationFormFields/EducationFormFields";
import PersonalFormFields from "./components/PersonalFormFields/PersonalFormFields";
import WorkFormFields from "./components/WorkFormFields/WorkFormFields";

import ExperienceSkills from "./components/ExperienceSkills";

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
import getExperienceFormLabels from "./labels";

export interface ExperienceFormProps {
  userId: string;
  experienceId?: string;
  applicationId?: string;
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
  experienceId,
  applicationId,
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
  const paths = useRoutes();

  const returnPath = `${paths.skillsAndExperiences(userId)}${
    applicationId ? `?applicationId=${applicationId}` : ``
  }`;

  let currentPath = "#";
  if (experience && experienceId) {
    currentPath = paths.editExperience(userId, experienceType, experienceId);
  } else {
    if (experienceType === "award") {
      currentPath = paths.createAward(userId);
    }
    if (experienceType === "community") {
      currentPath = paths.createCommunity(userId);
    }
    if (experienceType === "education") {
      currentPath = paths.createEducation(userId);
    }
    if (experienceType === "personal") {
      currentPath = paths.createPersonal(userId);
    }
    if (experienceType === "work") {
      currentPath = paths.createWork(userId);
    }
  }

  let crumbs: { label: string | React.ReactNode; url: string }[] = [
    {
      label: intl.formatMessage({
        defaultMessage: "Experience and Skills",
        id: "P/Mm5G",
        description: "Display text for My experience and skills Form Page Link",
      }),
      url: returnPath,
    },
    {
      label: experience
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
      url: `${currentPath}${
        applicationId ? `?applicationId=${applicationId}` : ``
      }`,
    },
  ];

  let irrelevantSkills: Maybe<Skill[]> = [];

  if (poolAdvertisement) {
    const advertisementTitle = getFullPoolAdvertisementTitleHtml(
      intl,
      poolAdvertisement,
    );

    crumbs = [
      {
        label: intl.formatMessage({
          defaultMessage: "My Applications",
          id: "q04FCp",
          description: "Link text for breadcrumb to user applications page.",
        }),
        url: paths.applications(userId),
      },
      {
        label: advertisementTitle,
        url: paths.pool(poolAdvertisement.id),
      },
      ...crumbs,
    ];

    irrelevantSkills = experience?.skills?.filter((skill) => {
      return (
        !poolAdvertisement.essentialSkills?.find(
          (essentialSkill) => essentialSkill.id === skill.id,
        ) &&
        !poolAdvertisement.nonessentialSkills?.find(
          (assetSkill) => assetSkill.id === skill.id,
        )
      );
    });
  }
  const newExperience = {
    ...experience,
    skills: experience?.skills?.filter(
      (skill) =>
        !irrelevantSkills?.find(
          (irrelevantSkill) => irrelevantSkill.id === skill.id,
        ),
    ),
  };

  const defaultValues = newExperience
    ? queryResultToDefaultValues(experienceType, newExperience)
    : undefined;

  const handleSubmit: SubmitHandler<FormValues<AllFormValues>> = async (
    formValues,
  ) => {
    const data = formValuesToSubmitData(
      experienceType,
      formValues,
      irrelevantSkills,
    );
    await onUpdateExperience(data);
  };

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
    >
      <BasicForm
        onSubmit={handleSubmit}
        cacheKey={cacheKey}
        labels={labels}
        options={{
          defaultValues,
        }}
      >
        {experienceType === "award" && <AwardFormFields labels={labels} />}
        {experienceType === "community" && (
          <CommunityFormFields labels={labels} />
        )}
        {experienceType === "education" && (
          <EducationFormFields labels={labels} />
        )}
        {experienceType === "personal" && (
          <PersonalFormFields labels={labels} />
        )}
        {experienceType === "work" && <WorkFormFields labels={labels} />}
        <ExperienceSkills
          skills={skills}
          poolAdvertisement={poolAdvertisement}
        />
        <h2 data-h2-font-size="base(h3, 1)" data-h2-margin="base(x3, 0, x1, 0)">
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
                color="error"
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

type RouteParams = {
  userId: Scalars["ID"];
  experienceType: ExperienceType;
  experienceId: Scalars["ID"];
};
export interface ExperienceFormContainerProps {
  edit?: boolean;
}

const ExperienceFormContainer = ({ edit }: ExperienceFormContainerProps) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const { id: applicationId } = useApplicationInfo();
  const { userId, experienceType, experienceId } = useParams<RouteParams>();
  const paths = useRoutes();
  const cacheKey = `ts-createExperience-${experienceId || experienceType}`;
  const returnPath = `${paths.skillsAndExperiences(userId || "")}${
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
        e?.id === experienceId &&
        type?.toLowerCase().includes(experienceType || "")
      );
    }) as ExperienceQueryData;
  }

  const { executeMutation, getMutationArgs } = useExperienceMutations(
    experience ? "update" : "create",
    experienceType,
  );

  const handleUpdateExperience = (values: ExperienceDetailsSubmissionData) => {
    const args = getMutationArgs(experienceId || userId || "", values);
    if (executeMutation) {
      const res = executeMutation(args) as Promise<ExperienceMutationResponse>;
      res.then(handleMutationResponse).catch(handleError);
    }
  };

  // delete functionality //
  // constrict to string only
  const experienceIdExact = experienceId || "";
  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);

  const handleDeleteExperience = () => {
    if (executeDeletionMutation) {
      executeDeletionMutation({
        id: experienceIdExact,
      })
        .then((result) => {
          navigate(returnPath);
          toast.success(
            intl.formatMessage({
              defaultMessage: "Experience Deleted",
              id: "/qN7tM",
              description:
                "Message displayed to user after experience deleted.",
            }),
          );
          return result.data;
        })
        .catch(handleError);
    }
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
          userId={userId || ""}
          poolAdvertisement={
            applicationData?.poolCandidate?.poolAdvertisement || undefined
          }
          experienceId={experienceId || ""}
          applicationId={applicationId || undefined}
          experience={experience as ExperienceQueryData}
          experienceType={experienceType || "personal"}
          skills={
            categorizeSkill(skillsData.skills as Skill[])[
              SkillCategory.Technical
            ] ?? []
          } // Only grab technical skills (hard skills).
          onUpdateExperience={handleUpdateExperience}
          deleteExperience={handleDeleteExperience}
          cacheKey={cacheKey}
          edit={edit}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "No experience found.",
            id: "Yhd/hk",
            description:
              "Message displayed when no experience is found for experience form.",
          })}
        />
      )}
    </Pending>
  );
};

export default ExperienceFormContainer;
