import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { ReactNode, useEffect } from "react";

import {
  Button,
  Heading,
  Link,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { ErrorMessage, Field, HiddenInput } from "@gc-digital-talent/forms";
import { apiMessages, commonMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  ApplicationStep,
  ErrorCode,
  FragmentType,
  getFragment,
  graphql,
  PoolSkillType,
  SkillCategory,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import applicationMessages from "~/messages/applicationMessages";
import { GetPageNavInfo } from "~/types/applicationStep";
import { categorizeSkill, groupPoolSkillByType } from "~/utils/skillUtils";
import { isIncomplete } from "~/validators/profile/skillRequirements";
import SkillTree from "~/components/SkillTree/SkillTree";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import SkillDescriptionAccordion from "./components/SkillDescriptionAccordion";
import useApplication from "../useApplication";

const careerTimelineLink = (children: ReactNode, href: string) => (
  <Link href={href}>{children}</Link>
);

interface FormValues {
  skillsMissingExperiences: number;
}

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationSkills(application.id);
  return {
    title: intl.formatMessage(commonMessages.skillRequirements),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Tell us about how you meet the skill requirements for this opportunity.",
      id: "+vHVZ2",
      description: "Subtitle for the application skills page",
    }),
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

export const ApplicationSkillsExperience_Fragment = graphql(/** GraphQL */ `
  fragment ApplicationSkillsExperience on Experience {
    ...SkillTreeExperience
    id
    skills {
      id
      experienceSkillRecord {
        details
      }
    }
  }
`);

export interface ApplicationSkillsProps extends ApplicationPageProps {
  experiencesQuery: FragmentType<typeof ApplicationSkillsExperience_Fragment>[];
}

export const ApplicationSkills = ({
  application,
  experiencesQuery,
}: ApplicationSkillsProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const instructionsPath = paths.applicationSkillsIntro(application.id);
  const poolSkillsByType = groupPoolSkillByType(application.pool.poolSkills);
  const categorizedEssentialSkills = categorizeSkill(
    poolSkillsByType.get(PoolSkillType.Essential),
  );
  const categorizedOptionalSkills = categorizeSkill(
    poolSkillsByType.get(PoolSkillType.Nonessential),
  );
  const [{ fetching: mutating }, executeMutation] =
    useUpdateApplicationMutation();
  const { followingPageUrl, isIAP } = useApplicationContext();
  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });
  const nextStep =
    followingPageUrl ?? paths.applicationQuestionsIntro(application.id);
  const experiences = getFragment(
    ApplicationSkillsExperience_Fragment,
    experiencesQuery,
  );

  const isSkillsExperiencesIncomplete = isIncomplete(
    experiences,
    application.pool,
  );

  const applicationWasSubmitted = !!application.submittedAt;

  const methods = useForm<FormValues>();
  const {
    setValue,
    formState: { isSubmitting, errors },
  } = methods;

  const optionalDisclaimer = intl.formatMessage({
    defaultMessage:
      "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
    id: "mqRhhe",
    description:
      "Descriptive text about how optional skills are used in the application process",
  });

  const handleSubmit = () => {
    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.SkillRequirements,
        applicationId: application.id,
      },
    })
      .then(async (res) => {
        if (!res.error) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated your skills!",
              id: "j7nWu/",
              description:
                "Message displayed to users when saving skills is successful.",
            }),
          );
          await navigate(nextStep);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: adding skill details failed",
            id: "1Qw7ZV",
            description:
              "Message displayed to user after skill details fails to be created.",
          }),
        );
      });
  };

  useEffect(() => {
    setValue(
      "skillsMissingExperiences",
      isSkillsExperiencesIncomplete ? 1 : 0,
      {
        shouldValidate: true,
      },
    );
  }, [isSkillsExperiencesIncomplete, setValue]);

  return (
    <>
      <div className="mb-6 flex flex-col items-start justify-between xs:flex-row xs:items-center">
        <Heading size="h3" className="m-0 font-normal">
          {pageInfo.title}
        </Heading>
        <Link href={instructionsPath} mode="inline">
          {intl.formatMessage({
            defaultMessage: "Review instructions",
            id: "cCSlti",
            description: "Title for review instructions action",
          })}
        </Link>
      </div>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Now let's link your experiences to the skills that are critical for this role. This is the most important step in the application process. To add or change an experience in your career timeline, go back to <careerTimelineLink>Review your career timeline</careerTimelineLink>.",
            id: "6EzUZV",
            description:
              "Lead in paragraph for adding experiences to a users skills",
          },
          {
            careerTimelineLink: (chunks: ReactNode) =>
              careerTimelineLink(
                chunks,
                paths.applicationCareerTimeline(application.id),
              ),
          },
        )}
      </p>
      {categorizedEssentialSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
            {intl.formatMessage({
              defaultMessage: "Required technical skills",
              id: "OCrKtT",
              description: "Heading for required technical skills section",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please ensure that you provide <strong>at least 1 career timeline experience</strong> for each required skill, along with a concise description of why that experience highlights your abilities in that skill.",
              id: "N5qMql",
              description: "Instructions on requiring information for skills",
            })}
          </p>
          {categorizedEssentialSkills[SkillCategory.Technical]?.map(
            (requiredTechnicalSkill) => (
              <SkillTree
                key={requiredTechnicalSkill.id}
                skill={requiredTechnicalSkill}
                experiencesQuery={experiences}
                showDisclaimer
                hideEdit={applicationWasSubmitted}
                hideConnectButton={applicationWasSubmitted}
              />
            ),
          )}
        </>
      ) : null}
      {categorizedOptionalSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
            {intl.formatMessage({
              defaultMessage: "Optional technical skills",
              id: "mm1X02",
              description: "Title for optional technical skills section",
            })}
          </Heading>
          <p>{optionalDisclaimer}</p>
          {categorizedOptionalSkills[SkillCategory.Technical]?.map(
            (optionalTechnicalSkill) => (
              <SkillTree
                key={optionalTechnicalSkill.id}
                skill={optionalTechnicalSkill}
                experiencesQuery={unpackMaybes(experiences)}
                hideEdit={applicationWasSubmitted}
                hideConnectButton={applicationWasSubmitted}
              />
            ),
          )}
        </>
      ) : null}
      {categorizedEssentialSkills[SkillCategory.Behavioural]?.length ? (
        <>
          <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
            {intl.formatMessage({
              defaultMessage: "Required behavioural skills",
              id: "zv4Vyd",
              description: "Heading for required behavioural skills section",
            })}
          </Heading>
          <p className="mb-6">
            {intl.formatMessage({
              defaultMessage:
                "The following skills are required for this role, but aren't required as a part of this application. <strong>They will be reviewed during the assessment process should your application be accepted</strong>.",
              id: "fA79sM",
              description: "Information regarding required behavioural skills",
            })}
          </p>
          <SkillDescriptionAccordion
            skills={categorizedEssentialSkills[SkillCategory.Behavioural] ?? []}
          />
        </>
      ) : null}
      {categorizedOptionalSkills[SkillCategory.Behavioural]?.length ? (
        <>
          <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
            {intl.formatMessage({
              defaultMessage: "Optional behavioural skills",
              id: "BqeIyx",
              description: "Heading for optional behavioural skills section",
            })}
          </Heading>
          <p className="mb-6">{optionalDisclaimer}</p>
          <SkillDescriptionAccordion
            skills={categorizedOptionalSkills[SkillCategory.Behavioural] ?? []}
          />
        </>
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Separator />
          <HiddenInput
            name="skillsMissingExperiences"
            rules={{
              max: {
                value: 0,
                message: intl.formatMessage(
                  apiMessages[ErrorCode.ApplicationMissingEssentialSkills],
                ),
              },
            }}
          />
          <ErrorMessage
            errors={errors}
            name="skillsMissingExperiences"
            render={({ message }) => (
              <Field.Error className="mb-6">{message}</Field.Error>
            )}
          />

          <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
            <Button
              type="submit"
              color="primary"
              value="continue"
              disabled={mutating || isSubmitting}
              onClick={() => {
                setValue(
                  "skillsMissingExperiences",
                  isSkillsExperiencesIncomplete ? 1 : 0,
                );
              }}
            >
              {intl.formatMessage(applicationMessages.saveContinue)}
            </Button>
            <Link mode="inline" href={cancelPath}>
              {intl.formatMessage(applicationMessages.saveQuit)}
            </Link>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export const Component = () => {
  const { application } = useApplication();

  const experiences = unpackMaybes(application.user.experiences);

  return application ? (
    <ApplicationSkills
      application={application}
      experiencesQuery={experiences}
    />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationSkillsPage";

export default Component;
