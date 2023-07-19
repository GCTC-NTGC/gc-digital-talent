import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import {
  Button,
  Heading,
  Link,
  Pending,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { Input } from "@gc-digital-talent/forms";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import applicationMessages from "~/messages/applicationMessages";
import { GetPageNavInfo } from "~/types/applicationStep";
import { categorizeSkill } from "~/utils/skillUtils";
import {
  SkillCategory,
  useUpdateApplicationMutation,
  ApplicationStep,
  useGetMyExperiencesQuery,
  useGetApplicationQuery,
} from "~/api/generated";
import { AnyExperience } from "~/types/experience";

import SkillTree from "./components/SkillTree";
import { ApplicationPageProps } from "../ApplicationApi";
import SkillDescriptionAccordion from "./components/SkillDescriptionAccordion";
import { useApplicationContext } from "../ApplicationContext";

const resumeLink = (children: React.ReactNode, href: string) => (
  <Link href={href}>{children}</Link>
);

type FormValues = {
  skillsMissingExperiences: number;
};

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationSkills(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Skill requirements",
      id: "AtGnJW",
      description: "Page title for the application skills page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage:
        "Tell us about how you meet the skill requirements for this opportunity.",
      id: "+vHVZ2",
      description: "Subtitle for the application skills page",
    }),
    icon: SparklesIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

export interface ApplicationSkillsProps extends ApplicationPageProps {
  experiences: Array<AnyExperience>;
}

export const ApplicationSkills = ({
  application,
  experiences,
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
  const categorizedEssentialSkills = categorizeSkill(
    application.pool.essentialSkills,
  );
  const categorizedOptionalSkills = categorizeSkill(
    application.pool.nonessentialSkills,
  );
  const { applicantDashboard } = useFeatureFlags();
  const [, executeMutation] = useUpdateApplicationMutation();
  const { followingPageUrl, isIAP } = useApplicationContext();
  const cancelPath = applicantDashboard
    ? paths.profileAndApplications({ fromIapDraft: isIAP })
    : paths.myProfile();
  const nextStep =
    followingPageUrl ?? paths.applicationQuestionsIntro(application.id);

  const skillsMissingExperiences = categorizedEssentialSkills[
    SkillCategory.Technical
  ]
    ?.filter((essentialSkill) => {
      return !application.user.experiences?.some((experience) => {
        return experience?.skills?.some(
          (skill) => skill.id === essentialSkill.id,
        );
      });
    })
    .filter(notEmpty);

  const methods = useForm<FormValues>();
  const {
    setValue,
    formState: { isSubmitting },
  } = methods;

  const optionalDisclaimer = intl.formatMessage({
    defaultMessage:
      "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
    id: "LazN9T",
    description: "Instructions on  optional skills for a pool advertisement",
  });

  const handleSubmit = async () => {
    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.SkillRequirements,
      },
    })
      .then((res) => {
        if (!res.error) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Successfully updated your skills!",
              id: "j7nWu/",
              description:
                "Message displayed to users when saving skills is successful.",
            }),
          );
          navigate(nextStep);
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

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
      >
        <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
        <Link href={instructionsPath} mode="inline">
          {intl.formatMessage({
            defaultMessage: "Review instructions",
            id: "VRxiNC",
            description: "A link back to the instructions for this section",
          })}
        </Link>
      </div>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Now let's link your experiences to the skills that are critical for this role. This is the most important step in the application process. Similarly to the minimum experience and education step, if you need to add or change a résumé experience, you can do so by returning to the <resumeLink>résumé step</resumeLink> in the application.",
            id: "pHTwBd",
            description:
              "Lead in paragraph for adding experiences to a users skills",
          },
          {
            resumeLink: (chunks: React.ReactNode) =>
              resumeLink(chunks, paths.applicationResume(application.id)),
          },
        )}
      </p>
      {categorizedEssentialSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Required technical skills",
              id: "OCrKtT",
              description: "Heading for required technical skills section",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Please ensure that you provide <strong>at least 1 résumé experience</strong> for each required skill, along with a concise description of why that experience highlights your abilities in that skill.",
              id: "TbqFOI",
              description: "Instructions on requiring information for skills",
            })}
          </p>
          {categorizedEssentialSkills[SkillCategory.Technical]?.map(
            (requiredTechnicalSkill) => (
              <SkillTree
                key={requiredTechnicalSkill.id}
                skill={requiredTechnicalSkill}
                experiences={experiences}
                showDisclaimer
              />
            ),
          )}
        </>
      ) : null}
      {categorizedOptionalSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Optional technical skills",
              id: "OZe0NZ",
              description: "Heading for optional technical skills section",
            })}
          </Heading>
          <p>{optionalDisclaimer}</p>
          {categorizedOptionalSkills[SkillCategory.Technical]?.map(
            (optionalTechnicalSkill) => (
              <SkillTree
                key={optionalTechnicalSkill.id}
                skill={optionalTechnicalSkill}
                experiences={experiences}
              />
            ),
          )}
        </>
      ) : null}
      {categorizedEssentialSkills[SkillCategory.Behavioural]?.length ? (
        <>
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Required behavioural skills",
              id: "zv4Vyd",
              description: "Heading for required behavioural skills section",
            })}
          </Heading>
          <p data-h2-margin-bottom="base(x1)">
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
          <Heading level="h3" size="h5">
            {intl.formatMessage({
              defaultMessage: "Optional behavioural skills",
              id: "BqeIyx",
              description: "Heading for optional behavioural skills section",
            })}
          </Heading>
          <p data-h2-margin-bottom="base(x1)">{optionalDisclaimer}</p>
          <SkillDescriptionAccordion
            skills={categorizedOptionalSkills[SkillCategory.Behavioural] ?? []}
          />
        </>
      ) : null}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Input
            id="skillsMissingExperiences"
            name="skillsMissingExperiences"
            label=""
            type="number"
            hidden
            rules={{
              max: {
                value: 0,
                message: intl.formatMessage({
                  defaultMessage:
                    "Please connect at least one résumé experience to each required technical skill.",
                  id: "4YUt61",
                  description: "Error message if there are no experiences",
                }),
              },
            }}
          />
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background="base(black.light)"
            data-h2-margin="base(0, 0, x2, 0)"
          />
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x.25, x.5)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(flex-start) l-tablet(center)"
          >
            <Button
              type="submit"
              mode="solid"
              value="continue"
              disabled={isSubmitting}
              onClick={() => {
                setValue(
                  "skillsMissingExperiences",
                  skillsMissingExperiences?.length || 0,
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

const ApplicationSkillsPage = () => {
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
    },
  ] = useGetApplicationQuery({
    variables: {
      id: applicationId || "",
    },
    requestPolicy: "cache-first",
  });
  const [
    {
      data: experienceData,
      fetching: experienceFetching,
      error: experienceError,
    },
  ] = useGetMyExperiencesQuery();

  const application = applicationData?.poolCandidate;
  const experiences = experienceData?.me?.experiences as AnyExperience[];

  return (
    <Pending
      fetching={applicationFetching || experienceFetching}
      error={applicationError || experienceError}
    >
      {application ? (
        <ApplicationSkills
          application={application}
          experiences={experiences}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};
export default ApplicationSkillsPage;
