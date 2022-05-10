/* eslint-disable prettier/prettier */
import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";
import { BasicForm, TextArea } from "@common/components/form";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import Dialog from "@common/components/Dialog";
import { Button } from "@common/components";

import { TrashIcon } from "@heroicons/react/solid";

import { removeFromSessionStorage } from "@common/helpers/storageUtils";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

import AwardDetailsForm from "../awardDetailsForm/AwardDetailsForm";
import CommunityExperienceForm from "../communityExperienceForm/CommunityExperienceForm";
import EducationExperienceForm from "../educationExperienceForm/EducationExperienceForm";
import PersonalExperienceForm from "../personalExperienceForm/PersonalExperienceForm";
import WorkExperienceForm from "../workExperienceForm/WorkExperienceForm";

import ExperienceSkills from "./ExperienceSkills";
import type { Skill } from "../../api/generated";
import {
  useGetMyExperiencesQuery,
  useGetMeQuery,
  useGetSkillsQuery,
 Exact } from "../../api/generated";
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
import { useExperienceMutations, useDeleteExperienceMutation } from "./mutations";

export interface ExperienceFormProps {
  experienceType: ExperienceType;
  experience?: ExperienceQueryData;
  skills: Skill[];
  onUpdateExperience: (values: ExperienceDetailsSubmissionData) => void;
  deleteExperience: () => void;
  cacheKey?: string;
  edit?: boolean;
}

export const ExperienceForm: React.FunctionComponent<ExperienceFormProps> = ({
  experience,
  experienceType,
  onUpdateExperience,
  deleteExperience,
  skills,
  cacheKey,
  edit,
}) => {
  const [isDialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);
  const defaultValues = experience
    ? queryResultToDefaultValues(experienceType, experience)
    : { skills: undefined };

  const handleSubmit: SubmitHandler<FormValues<AllFormValues>> = async (
    formValues,
  ) => {
    const data = formValuesToSubmitData(experienceType, formValues);
    await onUpdateExperience(data);
  };
  const deleteButton = (
    <Button type="button" mode="solid" color="primary" onClick={deleteExperience}>
      {intl.formatMessage({
        defaultMessage: "Delete",
        description: "Delete confirmation",
      })}
    </Button>
  );

  return (
    <ProfileFormWrapper
      title={intl.formatMessage({
        defaultMessage: "My experience and skills",
        description: "Title for the experience profile form",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Here is where you can add experience and skills to your profile. This could be anything from helping community members troubleshoot their computers to full-time employment at an IT organization.",
        description: "Description for the experience profile form",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "My experience and skills",
            description:
              "Display text for My experience and skills F`orm Page Link",
          }),
        },
      ]}
      cancelLink={paths.skillsAndExperiences()}
    >
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues,
        }}
        cacheKey={cacheKey}
      >
        {experienceType === "award" && <AwardDetailsForm />}
        {experienceType === "community" && <CommunityExperienceForm />}
        {experienceType === "education" && <EducationExperienceForm />}
        {experienceType === "personal" && <PersonalExperienceForm />}
        {experienceType === "work" && <WorkExperienceForm />}
        <ExperienceSkills
          skills={skills}
          initialSkills={
            defaultValues?.skills ? defaultValues.skills : undefined
          }
        />
        <h2 data-h2-font-size="b(h3)">
          {intl.formatMessage({
            defaultMessage: "4. Additional information for this experience",
            description: "Title for addition information on Experience form",
          })}
        </h2>
        <p>
          {intl.formatMessage({
            defaultMessage:
              "Anything else about this experience you would like to share.",
            description:
              "Description blurb for additional information on Experience form",
          })}
        </p>
        <TextArea
          id="details"
          label={intl.formatMessage({
            defaultMessage: "Additional Information",
            description:
              "Label displayed on experience form for additional information input",
          })}
          name="details"
        />
        {edit && (
          <Button
            onClick={() => setDialogOpen(true)}
            type="button"
            mode="outline"
            color="secondary"
          >
            <span>
              <TrashIcon style={{ width: "1rem" }} />
              {intl.formatMessage({
                defaultMessage: "Delete experience from My Profile",
                description: "Label on button for delete this experience",
              })}
            </span>
          </Button>
        )}
        <ProfileFormFooter
          mode="bothButtons"
          link={paths.skillsAndExperiences()}
        />
      </BasicForm>
      <Dialog
        title={intl.formatMessage({
          defaultMessage: "Are you sure?",
          description: "Delete confirmation",
        })}
        isOpen={isDialogOpen}
        onDismiss={() => setDialogOpen(false)}
        footer={deleteButton}
      >
        {intl.formatMessage({
          defaultMessage:
            "You are about to delete an experience from your profile. You will lose all information attached to it. Are you sure you want to delete this experience?",
          description: "Warning prior to experience deletion",
        })}
      </Dialog>
    </ProfileFormWrapper>
  );
};

export interface ExperienceFormContainerProps {
  experienceType: ExperienceType;
  experienceId?: string;
  edit?: boolean;
}

const ExperienceFormContainer: React.FunctionComponent<
  ExperienceFormContainerProps
> = ({ experienceType, experienceId, edit }) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);
  const cacheKey = `ts-createExperience-${experienceId || experienceType}`;

  const [meResults] = useGetMeQuery();
  const { data: meData, fetching: fetchingMe, error: meError } = meResults;

  const handleSuccess = () => {
    removeFromSessionStorage(cacheKey); // clear the cache
    navigate(paths.skillsAndExperiences());
    toast.success(
      edit
        ? intl.formatMessage({
            defaultMessage: "Successfully updated experience!",
            description:
              "Success message displayed after updating experience on profile",
          })
        : intl.formatMessage({
            defaultMessage: "Successfully added experience!",
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
            description:
              "Message displayed to user after experience fails to be updated.",
          })
        : intl.formatMessage({
            defaultMessage: "Error: adding experience failed",
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

  const [skillResults] = useGetSkillsQuery();
  const {
    data: skillsData,
    fetching: fetchingSkills,
    error: skillError,
  } = skillResults;

  let experience: ExperienceQueryData | null = null;
  if (experienceId && experienceData?.me?.experiences) {
    experience = experienceData.me.experiences.find(
      (e) => e?.id === experienceId,
    ) as ExperienceQueryData;
  }

  const { executeMutation, getMutationArgs } = useExperienceMutations(
    experienceType,
    experience ? "update" : "create",
  );

  const handleUpdateExperience = (values: ExperienceDetailsSubmissionData) => {
    if (meData?.me) {
      const args = getMutationArgs(experienceId || meData.me.id, values);
      const res = executeMutation(args) as Promise<ExperienceMutationResponse>;
      res.then(handleMutationResponse).catch(handleError);
    }
  };

  // constrict to string only
  const experienceIdExact = experienceId || "";

  const handleBlah = (res: any) => {
    if (res.data) {
      navigate(paths.skillsAndExperiences());
    }
  };

  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);

  const handleDeleteExperience = () => {
    if (meData?.me) {
      const res = executeDeletionMutation.executeDeletionMutation({
        id: experienceIdExact,
      });
      handleBlah(res);
    }
  };

  if (fetchingSkills || fetchingMe || fetchingExperience) {
    return <p>{intl.formatMessage(commonMessages.loadingTitle)}</p>;
  }

  if (skillError || !skillsData || meError || !meData) {
    return (
      <p>
        {intl.formatMessage(commonMessages.loadingError)}
        {skillError?.message || ""}
      </p>
    );
  }

  return (
    <ExperienceForm
      experience={experience as ExperienceQueryData}
      experienceType={experienceType}
      skills={skillsData.skills as Skill[]}
      onUpdateExperience={handleUpdateExperience}
      deleteExperience={handleDeleteExperience}
      cacheKey={cacheKey}
      edit
    />
  );
};

export default ExperienceFormContainer;
