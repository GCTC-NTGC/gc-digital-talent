import React from "react";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import SparklesIcon from "@heroicons/react/20/solid/SparklesIcon";

import {
  Button,
  Heading,
  Link,
  Separator,
  ThrowNotFound,
} from "@gc-digital-talent/ui";
import { toast } from "@gc-digital-talent/toast";
import { Input } from "@gc-digital-talent/forms";
import { apiMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import {
  ApplicationStep,
  Experience,
  SkillCategory,
} from "@gc-digital-talent/graphql";
import { useFeatureFlags } from "@gc-digital-talent/env";

import useRoutes from "~/hooks/useRoutes";
import applicationMessages from "~/messages/applicationMessages";
import { GetPageNavInfo } from "~/types/applicationStep";
import { categorizeSkill } from "~/utils/skillUtils";
import { AnyExperience } from "~/types/experience";
import { isIncomplete } from "~/validators/profile/skillRequirements";
import SkillTree from "~/components/SkillTree/SkillTree";

import useUpdateApplicationMutation from "../useUpdateApplicationMutation";
import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import SkillDescriptionAccordion from "./components/SkillDescriptionAccordion";
import useApplication from "../useApplication";

const careerTimelineLink = (children: React.ReactNode, href: string) => (
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
      id: "tON7JL",
      description: "Title for skill requirements",
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
  const features = useFeatureFlags();
  const navigate = useNavigate();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
    RoDFlag: features.recordOfDecision,
  });
  const instructionsPath = paths.applicationSkillsIntro(application.id);
  const categorizedEssentialSkills = categorizeSkill(
    application.pool.essentialSkills,
  );
  const categorizedOptionalSkills = categorizeSkill(
    application.pool.nonessentialSkills,
  );
  const [{ fetching: mutating }, executeMutation] =
    useUpdateApplicationMutation();
  const { followingPageUrl, isIAP } = useApplicationContext();
  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });
  const nextStep =
    followingPageUrl ?? paths.applicationQuestionsIntro(application.id);

  const isSkillsExperiencesIncomplete = isIncomplete(
    application.user,
    application.pool,
  );

  const methods = useForm<FormValues>();
  const {
    setValue,
    formState: { isSubmitting },
  } = methods;

  const optionalDisclaimer = intl.formatMessage({
    defaultMessage:
      "All the following skills are optionally beneficial to the role, and demonstrating them might benefit you when being considered.",
    id: "mqRhhe",
    description:
      "Descriptive text about how optional skills are used in the application process",
  });

  const handleSubmit = async () => {
    executeMutation({
      id: application.id,
      application: {
        insertSubmittedStep: ApplicationStep.SkillRequirements,
        applicationId: application.id,
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

  React.useEffect(() => {
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
      <div
        data-h2-display="base(flex)"
        data-h2-flex-direction="base(column) p-tablet(row)"
        data-h2-justify-content="base(space-between)"
        data-h2-align-items="base(flex-start) p-tablet(center)"
        data-h2-margin="base(0, 0, x1, 0)"
      >
        <Heading
          data-h2-margin="base(0)"
          data-h2-font-weight="base(400)"
          size="h3"
        >
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
              "Now let's link your experiences to the skills that are critical for this role. This is the most important step in the application process. Similarly to the minimum experience and education step, if you need to add or change a career timeline experience, you can do so by returning to the <careerTimelineLink>career timeline step</careerTimelineLink> in the application.",
            id: "MUwxzr",
            description:
              "Lead in paragraph for adding experiences to a users skills",
          },
          {
            careerTimelineLink: (chunks: React.ReactNode) =>
              careerTimelineLink(
                chunks,
                paths.applicationCareerTimeline(application.id),
              ),
          },
        )}
      </p>
      {categorizedEssentialSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading
            level="h3"
            size="h4"
            data-h2-margin="base(x3, 0, x1, 0)"
            data-h2-font-weight="base(700)"
          >
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
                experiences={experiences}
                showDisclaimer
              />
            ),
          )}
        </>
      ) : null}
      {categorizedOptionalSkills[SkillCategory.Technical]?.length ? (
        <>
          <Heading
            level="h3"
            size="h4"
            data-h2-margin="base(x3, 0, x1, 0)"
            data-h2-font-weight="base(700)"
          >
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
                experiences={experiences}
              />
            ),
          )}
        </>
      ) : null}
      {categorizedEssentialSkills[SkillCategory.Behavioural]?.length ? (
        <>
          <Heading
            level="h3"
            size="h4"
            data-h2-margin="base(x3, 0, x1, 0)"
            data-h2-font-weight="base(700)"
          >
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
          <Heading
            level="h3"
            size="h4"
            data-h2-margin="base(x3, 0, x1, 0)"
            data-h2-font-weight="base(700)"
          >
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
          <Separator
            orientation="horizontal"
            decorative
            data-h2-background="base(gray)"
            data-h2-margin="base(x2, 0)"
          />
          {/* -x.25 removes stray gap from flex layout */}
          <div data-h2-margin="base(-x.25 0 x1 0)">
            <Input
              id="skillsMissingExperiences"
              name="skillsMissingExperiences"
              label=""
              type="number"
              hidden
              rules={{
                max: {
                  value: 0,
                  message: intl.formatMessage(
                    apiMessages.MISSING_ESSENTIAL_SKILLS,
                  ),
                },
              }}
            />
          </div>
          <div
            data-h2-display="base(flex)"
            data-h2-gap="base(x1)"
            data-h2-flex-wrap="base(wrap)"
            data-h2-flex-direction="base(column) l-tablet(row)"
            data-h2-align-items="base(flex-start) l-tablet(center)"
          >
            <Button
              type="submit"
              mode="solid"
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

const ApplicationSkillsPage = () => {
  const { application } = useApplication();

  const experiences: Experience[] = unpackMaybes(application.user.experiences);

  return application ? (
    <ApplicationSkills application={application} experiences={experiences} />
  ) : (
    <ThrowNotFound />
  );
};
export default ApplicationSkillsPage;
