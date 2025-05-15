import { useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation } from "urql";

import {
  Button,
  Heading,
  Link,
  ThrowNotFound,
  Well,
} from "@gc-digital-talent/ui";
import { notEmpty, unpackMaybes } from "@gc-digital-talent/helpers";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import { Input } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import {
  PoolSkillType,
  SkillCategory,
  graphql,
} from "@gc-digital-talent/graphql";

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
import { SimpleAnyExperience } from "~/utils/experienceUtils";

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
        label: intl.formatMessage(applicationMessages.numberedStep, {
          stepOrdinal,
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

interface ApplicationReviewExperience extends SimpleAnyExperience {
  id: string;
}

interface ApplicationReviewProps extends ApplicationPageProps {
  experiences: ApplicationReviewExperience[];
}

const ApplicationReview = ({
  application,
  experiences,
}: ApplicationReviewProps) => {
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
  const methods = useForm<FormValues>();
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

  const nonEmptyExperiences = unpackMaybes(experiences);
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
      <Heading
        data-h2-margin="base(0, 0, x1, 0)"
        data-h2-font-weight="base(400)"
        size="h3"
      >
        {pageInfo.title}
      </Heading>
      <div data-h2-margin-bottom="base(x2)">
        <p data-h2-margin="base(x1, 0, x.5, 0)">
          {intl.formatMessage({
            defaultMessage:
              "Before continuing, it’s important that you understand the following notes about your application:",
            id: "GXmpsW",
            description: "Starting message for the application review page.",
          })}
        </p>
        <ul data-h2-padding="base(0, 0, 0, x1)">
          <li>
            <p data-h2-margin-bottom="base(x.5)">
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
            <p data-h2-margin-bottom="base(x.5)">
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
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "You are still encouraged to keep your profile up to date, as updated versions will be used at later steps of the hiring process.",
                id: "8BR20I",
                description:
                  "List item note 3 for the application review page.",
              })}
            </p>
          </li>
        </ul>
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
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This section summarizes your career timeline as it will be seen by hiring managers for these positions.",
            id: "eCkRlc",
            description:
              "Blurb for career timeline section of the application review page.",
          })}
        </p>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(100%)"
          data-h2-gap="base(x.5)"
        >
          {hasSomeExperience ? (
            nonEmptyExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experienceQuery={experience}
                headingLevel="h4"
                showSkills={allSkills}
                showEdit={false}
              />
            ))
          ) : (
            <Well>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage:
                    "It looks like you haven't added any experiences to your career timeline yet.",
                  id: "yfzR+U",
                  description:
                    "Null state message for career timeline section of the application review page.",
                })}
              </p>
            </Well>
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
        <p data-h2-margin="base(x1, 0)">
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
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="base(100%)"
          data-h2-gap="base(x.5)"
        >
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
                <Well>
                  <p data-h2-text-align="base(center)">
                    {intl.formatMessage({
                      defaultMessage:
                        "It looks like you haven't selected an education requirement yet.",
                      id: "mf8++l",
                      description:
                        "Null state message for education requirement section of the application review page.",
                    })}
                  </p>
                </Well>
              ) : (
                <Well>
                  <p data-h2-text-align="base(center)">
                    {intl.formatMessage({
                      defaultMessage:
                        "It looks like you haven't added any experiences to your career timeline yet.",
                      id: "4liNMy",
                      description:
                        "Null state message for experiences section of the application review page.",
                    })}
                  </p>
                </Well>
              )}
            </div>
          )}
        </div>
      </ReviewSection>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Skill requirements",
          id: "tON7JL",
          description: "Title for skill requirements",
        })}
        path={editPaths.skills}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit skill requirements",
          id: "6QGFk9",
          description:
            "Edit link text for skill requirements section of the application review page.",
        })}
      >
        <p data-h2-margin="base(x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "This section outlines your responses on how your experience meets the skill requirements for these positions.",
            id: "ymHPWF",
            description:
              "Instructional text under the Skill Requirements section",
          })}
        </p>
        <div>
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
        </div>
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
              <p data-h2-margin="base(x1, 0, x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "You’ve answered the following screening questions:",
                  id: "Sd8883",
                  description:
                    "Message in screening questions section of the application review page.",
                })}
              </p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                {screeningQuestionResponses.map((response) => (
                  <li key={response.id} data-h2-margin-bottom="base(x.5)">
                    <p
                      data-h2-font-weight="base(700)"
                      data-h2-margin-bottom="base(x.25)"
                    >
                      {response.screeningQuestion?.question
                        ? response.screeningQuestion.question[locale]
                        : ""}
                    </p>
                    <p>{response.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Well>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage:
                    "It looks like you haven't answered any screening questions yet.",
                  id: "V9lxDE",
                  description:
                    "Null state message in screening questions section of the application review page.",
                })}
              </p>
            </Well>
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
              <p data-h2-margin="base(x1, 0, x.5, 0)">
                {intl.formatMessage({
                  defaultMessage:
                    "You've answered the following general questions:",
                  id: "96AvU9",
                  description:
                    "Message in general questions section of the application review page.",
                })}
              </p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                {generalQuestionResponses.map((response) => (
                  <li key={response.id} data-h2-margin-bottom="base(x.5)">
                    <p
                      data-h2-font-weight="base(700)"
                      data-h2-margin-bottom="base(x.25)"
                    >
                      {response.generalQuestion?.question
                        ? response.generalQuestion.question[locale]
                        : ""}
                    </p>
                    <p>{response.answer}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Well>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage:
                    "It looks like you haven't answered any general questions yet.",
                  id: "OPbfwn",
                  description:
                    "Null state message in general questions section of the application review page.",
                })}
              </p>
            </Well>
          )}
        </ReviewSection>
      )}

      <section data-h2-margin="base(x3, 0, 0, 0)">
        <Heading
          level="h3"
          size="h4"
          data-h2-font-weight="base(700)"
          data-h2-margin="base(0, 0, x1, 0)"
        >
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
              <p data-h2-margin="base(x1, 0, x.5, 0)">
                {intl.formatMessage({
                  defaultMessage: `You made it! By signing your name, you confirm that:`,
                  id: "pH8wF2",
                  description:
                    "Instructions for sign and submit section of application review page.",
                })}
              </p>
              <ul data-h2-padding="base(0, 0, 0, x1)">
                <li>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage({
                      defaultMessage: `"I’ve reviewed everything written in my application"`,
                      id: "PDbqFR",
                      description:
                        "Review list item for sign and submit section of application review page.",
                    })}
                  </p>
                </li>
                <li>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage(
                      applicationMessages.confirmationCommunity,
                    )}
                  </p>
                </li>
                <li>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage({
                      defaultMessage: `"I promise that the information I’ve provided is true"`,
                      id: "1ZQP80",
                      description:
                        "Truth list item for sign and submit section of application review page.",
                    })}
                  </p>
                </li>
              </ul>
              <div data-h2-margin="base(x1 0)">
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
              <div
                data-h2-display="base(flex)"
                data-h2-gap="base(x1)"
                data-h2-flex-wrap="base(wrap)"
                data-h2-flex-direction="base(column) l-tablet(row)"
                data-h2-align-items="base(flex-start) l-tablet(center)"
              >
                <Button
                  type="submit"
                  color="secondary"
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
    <ApplicationReview
      application={application}
      experiences={unpackMaybes(application.user.experiences)}
    />
  ) : (
    <ThrowNotFound />
  );
};

Component.displayName = "ApplicationReviewPage";
