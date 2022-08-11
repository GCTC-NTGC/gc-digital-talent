import React from "react";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { SubmitHandler } from "react-hook-form";
import { BasicForm, TextArea } from "@common/components/form";
import { getLocale } from "@common/helpers/localize";
import { navigate } from "@common/helpers/router";
import { Button } from "@common/components";
import AlertDialog from "@common/components/AlertDialog";

import { TrashIcon } from "@heroicons/react/solid";

import { removeFromSessionStorage } from "@common/helpers/storageUtils";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import { commonMessages } from "@common/messages";
import { notEmpty } from "@common/helpers/util";
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
  const cancelDeleteRef = React.useRef(null);
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = applicantProfileRoutes(locale);
  const defaultValues = experience
    ? queryResultToDefaultValues(experienceType, experience)
    : undefined;

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
            defaultMessage: "Experience and Skills",
            description:
              "Display text for My experience and skills Form Page Link",
          }),
          href: paths.skillsAndExperiences(),
        },
        {
          title: experience
            ? intl.formatMessage({
                defaultMessage: "Edit Experience",
                description:
                  "Display text for edit experience form in breadcrumbs",
              })
            : intl.formatMessage({
                defaultMessage: "Add Experience",
                description:
                  "Display text for add experience form in breadcrumbs",
              }),
        },
      ]}
      cancelLink={{
        href: paths.skillsAndExperiences(),
      }}
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
        {edit && (
          <Button
            onClick={() => setDialogOpen(true)}
            type="button"
            mode="outline"
            color="secondary"
            data-h2-margin="b(top, l)"
          >
            <span>
              <TrashIcon style={{ width: "0.9rem" }} />{" "}
              {intl.formatMessage({
                defaultMessage: "Delete experience from My Profile",
                description: "Label on button for delete this experience",
              })}
            </span>
          </Button>
        )}
        <ProfileFormFooter
          mode="bothButtons"
          link={{
            href: paths.skillsAndExperiences(),
          }}
        />
      </BasicForm>
      <AlertDialog
        isOpen={isDialogOpen}
        onDismiss={() => setDialogOpen(false)}
        leastDestructiveRef={cancelDeleteRef}
        title={intl.formatMessage({
          defaultMessage: "Are you sure?",
          description: "Delete confirmation",
        })}
      >
        <AlertDialog.Description>
          {intl.formatMessage({
            defaultMessage:
              "Are you sure you would like to delete this experience from your profile? This action cannot be undone.",
            description:
              "Question displayed when a user attempts to delete an experience from their profile",
          })}
        </AlertDialog.Description>
        <AlertDialog.Actions>
          <Button
            type="button"
            mode="outline"
            color="secondary"
            ref={cancelDeleteRef}
            onClick={() => setDialogOpen(false)}
          >
            {intl.formatMessage({
              defaultMessage: "Cancel",
              description: "Cancel confirmation",
            })}
          </Button>
          <span data-h2-margin="b(left, xxs)">
            <Button
              type="submit"
              mode="solid"
              color="primary"
              onClick={deleteExperience}
            >
              {intl.formatMessage({
                defaultMessage: "Delete",
                description: "Delete confirmation",
              })}
            </Button>
          </span>
        </AlertDialog.Actions>
      </AlertDialog>
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
    if (meData?.me) {
      const args = getMutationArgs(experienceId || meData.me.id, values);
      const res = executeMutation(args) as Promise<ExperienceMutationResponse>;
      res.then(handleMutationResponse).catch(handleError);
    }
  };

  // delete functionality //
  // constrict to string only
  const experienceIdExact = experienceId || "";
  const executeDeletionMutation = useDeleteExperienceMutation(experienceType);

  const handleDeleteExperience = () => {
    if (meData?.me) {
      executeDeletionMutation
        .executeDeletionMutation({
          id: experienceIdExact,
        })
        .then((result) => {
          navigate(paths.skillsAndExperiences());
          toast.success(
            intl.formatMessage({
              defaultMessage: "Experience Deleted",
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
      fetching={fetchingSkills || fetchingMe || fetchingExperience}
      error={skillError || meError}
    >
      {skillsData && meData && found ? (
        <ExperienceForm
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
