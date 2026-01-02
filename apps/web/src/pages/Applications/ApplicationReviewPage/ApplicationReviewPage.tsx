import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import {
  Button,
  Heading,
  Link,
  ThrowNotFound,
  Ul,
  Notice,
} from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import {
  commonMessages,
  errorMessages,
  getLocale,
} from "@gc-digital-talent/i18n";
import { Input } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  PoolSkillType,
  SkillCategory,
  graphql,
} from "@gc-digital-talent/graphql";
import { appInsights } from "@gc-digital-talent/app-insights";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";
import {
  categorizeSkill,
  filterPoolSkillsByType,
  poolSkillsToSkills,
} from "~/utils/skillUtils";
import ExperienceCard from "~/components/ExperienceCard/ExperienceCard";
import SkillTree from "~/components/SkillTree/SkillTree";
import processMessages from "~/messages/processMessages";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import ReviewSection from "./ReviewSection";
import useApplication from "../useApplication";

const Application_SubmitMutation = graphql(/* GraphQL */ `
  mutation Application_Submit($id: ID!, $signature: String!) {
    submitApplication(id: $id, signature: $signature) {
      id
      signature
    }
  }
`);

interface FormValues {
  signature: string;
}

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationReview(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Review your submission",
      id: "JxDtt+",
      description: "Page title for the application review page.",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Review your application and submit it!",
      id: "4ii2WZ",
      description: "Subtitle for the application review page.",
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
      label: intl.formatMessage({
        defaultMessage: "Review and submit",
        id: "DXtgrn",
        description: "Link text for the application review page.",
      }),
    },
  };
};

const ApplicationReview = ({ application }: ApplicationPageProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();
  const navigate = useNavigate();
  const { currentStepOrdinal, followingPageUrl, isIAP } =
    useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const nextStep = followingPageUrl ?? paths.applicationSuccess(application.id);

  const [{ fetching: mutating }, executeMutation] = useMutation(
    Application_SubmitMutation,
  );
  const methods = useForm<FormValues>({
    defaultValues: { signature: application.signature ?? "" },
  });
  const {
    formState: { isSubmitting },
  } = methods;
  const handleSubmit = (formValues: FormValues) => {
    executeMutation({
      id: application.id,
      signature: formValues.signature,
    })
      .then(async (res) => {
        if (!res.error) {
          // Log the submission of the application with app insights
          if (appInsights) {
            const aiUserId = appInsights?.context?.user?.id || "unknown";
            appInsights.trackEvent?.(
              { name: "Job application submitted" },
              {
                aiUserId,
                pageUrl: window.location.href,
                timestamp: new Date().toISOString(),
                referrer: document.referrer || "none",
                source: "ApplicationReviewPage",
              },
            );
          }
          toast.success(
            intl.formatMessage({
              defaultMessage: "We've successfully received your application",
              id: "2SSm+L",
              description:
                "Success message after submission for the application review page.",
            }),
          );
          await navigate(nextStep);
        }
      })
      .catch(() => {
        if (appInsights) {
          const aiUserId = appInsights?.context?.user?.id || "unknown";
          appInsights.trackEvent?.(
            { name: "Job application submission error" },
            {
              aiUserId,
              pageUrl: window.location.href,
              timestamp: new Date().toISOString(),
              referrer: document.referrer || "none",
              source: "ApplicationReviewPage",
            },
          );
        }
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: submitting application failed",
            id: "yC4xI6",
            description:
              "Error message after failed submission for the application review page.",
          }),
        );
      });
  };

  const cancelPath = paths.profileAndApplications({ fromIapDraft: isIAP });
  const editPaths = {
    careerTimeline: paths.applicationCareerTimeline(application.id),
    education: paths.applicationEducation(application.id),
    skills: paths.applicationSkills(application.id),
    applicationQuestions: paths.applicationQuestions(application.id),
  };

  const experiences = unpackMaybes(application.user.experiences);
  const hasSomeExperience = !!experiences.length;
  const educationRequirementExperiences = unpackMaybes(
    application.educationRequirementExperiences,
  );

  const categorizedEssentialSkills = categorizeSkill(
    filterPoolSkillsByType(
      application.pool.poolSkills,
      PoolSkillType.Essential,
    ),
  );

  const categorizedOptionalSkills = categorizeSkill(
    filterPoolSkillsByType(
      application.pool.poolSkills,
      PoolSkillType.Nonessential,
    ),
  );

  const allSkills = poolSkillsToSkills(application.pool.poolSkills);

  const screeningQuestions =
    application.pool.screeningQuestions?.filter(notEmpty) ?? [];
  const screeningQuestionResponses =
    application.screeningQuestionResponses?.filter(notEmpty) ?? [];
  const generalQuestions =
    application.pool.generalQuestions?.filter(notEmpty) ?? [];
  const generalQuestionResponses =
    application.generalQuestionResponses?.filter(notEmpty) ?? [];

  const classificationGroup = application.pool.classification?.group;
  return (
    <section>
      <Heading className="mt-0 mb-6 font-normal" size="h3">
        {pageInfo.title}
      </Heading>
      <div className="mb-12">
        <p className="mt-6 mb-3">
          {intl.formatMessage({
            defaultMessage:
              "Before continuing, it’s important that you understand the following notes about your application:",
            id: "GXmpsW",
            description: "Starting message for the application review page.",
          })}
        </p>
        <Ul space="md">
          <li>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "When you submit your application, a copy of your profile will be created as a part of your application.",
                id: "A9Urm+",
                description:
                  "List item note 1 for the application review page.",
              })}
            </p>
          </li>
          <li>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "Changes made to your profile after submitting will not be updated on your application.",
                id: "Pasf+O",
                description:
                  "List item note 2 for the application review page.",
              })}
            </p>
          </li>
          <li>
            <p>
              {intl.formatMessage({
                defaultMessage:
                  "You are still encouraged to keep your profile up to date, as updated versions will be used at later steps of the hiring process.",
                id: "8BR20I",
                description:
                  "List item note 3 for the application review page.",
              })}
            </p>
          </li>
        </Ul>
      </div>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Your career timeline",
          id: "0w59dG",
          description:
            "Heading for career timeline section of the application review page.",
        })}
        path={editPaths.careerTimeline}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit your career timeline",
          id: "MdVah3",
          description:
            "Edit link text for career timeline section of the application review page.",
        })}
      >
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "This section summarizes your career timeline as it will be seen by hiring managers for these positions.",
            id: "eCkRlc",
            description:
              "Blurb for career timeline section of the application review page.",
          })}
        </p>
        <div className="flex flex-col gap-y-3">
          {hasSomeExperience ? (
            experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experienceQuery={experience}
                headingLevel="h4"
                showSkills={allSkills}
                showEdit={false}
              />
            ))
          ) : (
            <Notice.Root className="text-center">
              <Notice.Content>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "It looks like you haven't added any experiences to your career timeline yet.",
                    id: "yfzR+U",
                    description:
                      "Null state message for career timeline section of the application review page.",
                  })}
                </p>
              </Notice.Content>
            </Notice.Root>
          )}
        </div>
      </ReviewSection>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Minimum experience or equivalent education",
          id: "LvYEdh",
          description: "Title for Minimum experience or equivalent education",
        })}
        path={editPaths.education}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit education requirements",
          id: "jV/FG1",
          description:
            "Edit link text for education requirements section of the application review page.",
        })}
      >
        <p className="my-6">
          {classificationGroup === "EX"
            ? intl.formatMessage({
                defaultMessage:
                  "You've indicated that you meet the <strong>minimum experience or education requirement (graduation with degree)</strong> with the following experiences on your career timeline:",
                id: "p5qn9H",
                description:
                  "Message on education requirements card on the application review page.",
              })
            : intl.formatMessage({
                defaultMessage:
                  "You've indicated that you meet the <strong>minimum experience or education requirement (2 years of post-secondary)</strong> with the following experiences on your career timeline:",
                id: "rCpVpZ",
                description:
                  "Message on education requirements card on the application review page.",
              })}
        </p>
        <div className="flex flex-col gap-y-3">
          {educationRequirementExperiences?.length > 0 ? (
            educationRequirementExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experienceQuery={experience}
                headingLevel="h4"
                showSkills={allSkills}
                showEdit={false}
              />
            ))
          ) : (
            <div>
              {application.educationRequirementOption === null ||
              application.educationRequirementOption === undefined ? (
                <Notice.Root className="text-center">
                  <Notice.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "It looks like you haven't selected an education requirement yet.",
                        id: "mf8++l",
                        description:
                          "Null state message for education requirement section of the application review page.",
                      })}
                    </p>
                  </Notice.Content>
                </Notice.Root>
              ) : (
                <Notice.Root className="text-center">
                  <Notice.Content>
                    <p>
                      {intl.formatMessage({
                        defaultMessage:
                          "It looks like you haven't added any experiences to your career timeline yet.",
                        id: "4liNMy",
                        description:
                          "Null state message for experiences section of the application review page.",
                      })}
                    </p>
                  </Notice.Content>
                </Notice.Root>
              )}
            </div>
          )}
        </div>
      </ReviewSection>
      <ReviewSection
        title={intl.formatMessage(commonMessages.skillRequirements)}
        path={editPaths.skills}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit skill requirements",
          id: "6QGFk9",
          description:
            "Edit link text for skill requirements section of the application review page.",
        })}
      >
        <p className="my-6">
          {intl.formatMessage({
            defaultMessage:
              "This section outlines your responses on how your experience meets the skill requirements for these positions.",
            id: "ymHPWF",
            description:
              "Instructional text under the Skill Requirements section",
          })}
        </p>
        <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
          {intl.formatMessage({
            defaultMessage: "Required technical skills",
            id: "OCrKtT",
            description: "Heading for required technical skills section",
          })}
        </Heading>
        {categorizedEssentialSkills[SkillCategory.Technical]?.map(
          (requiredTechnicalSkill) => (
            <SkillTree
              key={requiredTechnicalSkill.id}
              skill={requiredTechnicalSkill}
              experiencesQuery={experiences}
              showDisclaimer
              hideConnectButton
              hideEdit
            />
          ),
        )}
        <Heading level="h3" size="h4" className="mt-18 mb-6 font-bold">
          {intl.formatMessage({
            defaultMessage: "Optional technical skills",
            id: "mm1X02",
            description: "Title for optional technical skills section",
          })}
        </Heading>
        {categorizedOptionalSkills[SkillCategory.Technical]?.map(
          (optionalTechnicalSkill) => (
            <SkillTree
              key={optionalTechnicalSkill.id}
              skill={optionalTechnicalSkill}
              experiencesQuery={experiences}
              showDisclaimer
              hideConnectButton
              hideEdit
            />
          ),
        )}
      </ReviewSection>
      {screeningQuestions.length > 0 && (
        <ReviewSection
          title={intl.formatMessage(processMessages.screeningQuestions)}
          path={editPaths.applicationQuestions}
          editLinkAriaLabel={intl.formatMessage({
            defaultMessage: "Edit screening questions",
            id: "5A0a7w",
            description:
              "Edit link text for screening questions section of the application review page.",
          })}
        >
          {screeningQuestionResponses.length > 0 ? (
            <div>
              <p className="mt-6 mb-3">
                {intl.formatMessage({
                  defaultMessage:
                    "You’ve answered the following screening questions:",
                  id: "Sd8883",
                  description:
                    "Message in screening questions section of the application review page.",
                })}
              </p>
              <Ul space="lg">
                {screeningQuestionResponses.map((response) => (
                  <li key={response.id}>
                    <p className="mb-1.5 font-bold">
                      {response.screeningQuestion?.question
                        ? response.screeningQuestion.question[locale]
                        : ""}
                    </p>
                    <p>{response.answer}</p>
                  </li>
                ))}
              </Ul>
            </div>
          ) : (
            <Notice.Root className="text-center">
              <Notice.Content>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "It looks like you haven't answered any screening questions yet.",
                    id: "V9lxDE",
                    description:
                      "Null state message in screening questions section of the application review page.",
                  })}
                </p>
              </Notice.Content>
            </Notice.Root>
          )}
        </ReviewSection>
      )}
      {generalQuestions.length > 0 && (
        <ReviewSection
          title={intl.formatMessage(processMessages.generalQuestions)}
          path={editPaths.applicationQuestions}
          editLinkAriaLabel={intl.formatMessage({
            defaultMessage: "Edit general questions",
            id: "gIzUDr",
            description:
              "Edit link text for general questions section of the application review page.",
          })}
        >
          {generalQuestionResponses.length > 0 ? (
            <div>
              <p className="mt-6 mb-3">
                {intl.formatMessage({
                  defaultMessage:
                    "You've answered the following general questions:",
                  id: "96AvU9",
                  description:
                    "Message in general questions section of the application review page.",
                })}
              </p>
              <Ul space="lg">
                {generalQuestionResponses.map((response) => (
                  <li key={response.id}>
                    <p className="mb-1.5 font-bold">
                      {response.generalQuestion?.question
                        ? response.generalQuestion.question[locale]
                        : ""}
                    </p>
                    <p>{response.answer}</p>
                  </li>
                ))}
              </Ul>
            </div>
          ) : (
            <Notice.Root className="text-center">
              <Notice.Content>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "It looks like you haven't answered any general questions yet.",
                    id: "OPbfwn",
                    description:
                      "Null state message in general questions section of the application review page.",
                  })}
                </p>
              </Notice.Content>
            </Notice.Root>
          )}
        </ReviewSection>
      )}

      <section className="mt-18">
        <Heading level="h3" size="h4" className="mt-0 mb-6 font-bold">
          {intl.formatMessage({
            defaultMessage: "Sign and submit",
            id: "fhgZRX",
            description:
              "Heading for sign and submit section of application review page.",
          })}
        </Heading>
        <div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <p className="mt-6 mb-3">
                {intl.formatMessage({
                  defaultMessage: `You made it! By signing your name, you confirm that:`,
                  id: "pH8wF2",
                  description:
                    "Instructions for sign and submit section of application review page.",
                })}
              </p>
              <Ul space="lg">
                <li>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: `"I’ve reviewed everything written in my application"`,
                      id: "PDbqFR",
                      description:
                        "Review list item for sign and submit section of application review page.",
                    })}
                  </p>
                </li>
                <li>
                  <p>
                    {intl.formatMessage(
                      applicationMessages.confirmationCommunity,
                    )}
                  </p>
                </li>
                <li>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: `"I promise that the information I’ve provided is true"`,
                      id: "1ZQP80",
                      description:
                        "Truth list item for sign and submit section of application review page.",
                    })}
                  </p>
                </li>
              </Ul>
              <div className="my-6">
                <Input
                  id="signature"
                  label={intl.formatMessage({
                    defaultMessage: "Your full name",
                    id: "T8eOrg",
                    description:
                      "Label displayed for signature input in sign and submit section of application review page.",
                  })}
                  type="text"
                  name="signature"
                  rules={{
                    required: intl.formatMessage(errorMessages.required),
                  }}
                />
              </div>
              <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  color="primary"
                  value="continue"
                  disabled={mutating || isSubmitting}
                >
                  {intl.formatMessage({
                    defaultMessage: "Submit my application",
                    id: "yKr1Ji",
                    description: "Label for submitting an application",
                  })}
                </Button>
                <Link mode="inline" href={cancelPath}>
                  {intl.formatMessage(applicationMessages.saveQuit)}
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </section>
  );
};

export const Component = () => {
  const { application } = useApplication();

  return application?.pool ? (
    <ApplicationReview application={application} />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationReviewPage";

export default Component;
