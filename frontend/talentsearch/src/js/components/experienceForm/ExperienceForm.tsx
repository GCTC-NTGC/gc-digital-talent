import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import type { SubmitHandler } from "react-hook-form";
import { BasicForm, TextArea } from "@common/components/form";
import { commonMessages } from "@common/messages";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";

import { OperationResult } from "urql";
import ProfileFormWrapper from "../applicantProfile/ProfileFormWrapper";
import ProfileFormFooter from "../applicantProfile/ProfileFormFooter";

import AwardDetailsForm from "../awardDetailsForm/AwardDetailsForm";
import CommunityExperienceForm from "../communityExperienceForm/CommunityExperienceForm";
import EducationExperienceForm from "../educationExperienceForm/EducationExperienceForm";
import PersonalExperienceForm from "../personalExperienceForm/PersonalExperienceForm";
import WorkExperienceForm from "../workExperienceForm/WorkExperienceForm";

import ExperienceSkills from "./ExperienceSkills";

import type { Skill } from "../../api/generated";
import { useGetMeQuery, useGetSkillsQuery } from "../../api/generated";
import applicantProfileRoutes from "../../applicantProfileRoutes";

import type {
  ExperienceType,
  AllFormValues,
  FormValues,
  ExperienceDetailsSubmissionData,
  ExperienceMutationResponse,
} from "./types";

import formValuesToSubmitData from "./submissionData";
import useExperienceMutations from "./mutations";

export interface ExperienceFormProps {
  experienceType: ExperienceType;
  skills: Skill[];
  onUpdateExperience: (values: ExperienceDetailsSubmissionData) => void;
}

export const ExperienceForm: React.FunctionComponent<ExperienceFormProps> = ({
  experienceType,
  onUpdateExperience,
  skills,
}) => {
  const intl = useIntl();

  const handleSubmit: SubmitHandler<FormValues<AllFormValues>> = async (
    formValues,
  ) => {
    const data = formValuesToSubmitData(experienceType, formValues);
    await onUpdateExperience(data);
  };

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
    >
      <BasicForm
        onSubmit={handleSubmit}
        options={{
          defaultValues: {
            skills: {},
          },
        }}
      >
        {experienceType === "award" && <AwardDetailsForm />}
        {experienceType === "community" && <CommunityExperienceForm />}
        {experienceType === "education" && <EducationExperienceForm />}
        {experienceType === "personal" && <PersonalExperienceForm />}
        {experienceType === "work" && <WorkExperienceForm />}
        <ExperienceSkills skills={skills} />
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
        <ProfileFormFooter mode="bothButtons" />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export interface ExperienceFormContainerProps {
  experienceType: ExperienceType; // TO DO: To be passed from router context
}

const ExperienceFormContainer: React.FunctionComponent<ExperienceFormContainerProps> =
  ({ experienceType }) => {
    const intl = useIntl();
    const locale = getLocale(intl);
    const paths = applicantProfileRoutes(locale);

    const [meResults] = useGetMeQuery();
    const { data: meData, fetching: fetchingMe, error: meError } = meResults;
    const { executeMutation, getMutationArgs } =
      useExperienceMutations(experienceType);

    const handleSuccess = () => {
      navigate(paths.home());
      toast.success(
        intl.formatMessage({
          defaultMessage: "Successfully added experience!",
          description:
            "Success message displayed after adding experience to profile",
        }),
      );
    };

    const handleError = () => {
      toast.error(
        intl.formatMessage({
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

    const handleUpdateExperience = (
      values: ExperienceDetailsSubmissionData,
    ) => {
      if (meData?.me) {
        const args = getMutationArgs(meData.me.id, values);
        const res = executeMutation(
          args,
        ) as Promise<ExperienceMutationResponse>;
        res.then(handleMutationResponse).catch(handleError);
      }
    };

    const [skillResults] = useGetSkillsQuery();
    const {
      data: skillsData,
      fetching: fetchingSkills,
      error: skillError,
    } = skillResults;

    if (fetchingSkills || fetchingMe) {
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
        experienceType={experienceType}
        skills={skillsData.skills as Skill[]}
        onUpdateExperience={handleUpdateExperience}
      />
    );
  };

export default ExperienceFormContainer;
