import React from "react";
import { useIntl } from "react-intl";
import RocketLaunchIcon from "@heroicons/react/20/solid/RocketLaunchIcon";

import {
  Accordion,
  Button,
  Card,
  Heading,
  Link,
  Pending,
  ThrowNotFound,
  TreeView,
  Well,
} from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";

import { ExperienceForDate } from "~/types/experience";
import { useNavigate, useParams } from "react-router-dom";
import {
  SkillCategory,
  useGetApplicationQuery,
  useGetMyExperiencesQuery,
  useSubmitApplicationMutation,
} from "@gc-digital-talent/graphql";
import ExperienceAccordion from "~/components/ExperienceAccordion/ExperienceAccordion";
import { notEmpty } from "@gc-digital-talent/helpers";
import { categorizeSkill } from "~/utils/skillUtils";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";
import { useFeatureFlags } from "@gc-digital-talent/env";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import SkillTree from "../ApplicationSkillsPage/components/SkillTree";
import { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";
import ReviewSection from "./ReviewSection";
import ExperienceTreeItems from "../../../components/ExperienceTreeItems/ExperienceTreeItems";

type FormValues = {
  signature: string;
};

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
    icon: RocketLaunchIcon,
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

interface ApplicationReviewProps extends ApplicationPageProps {
  experiences: Array<ExperienceForDate>;
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
  const { applicantDashboard } = useFeatureFlags();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const nextStep = followingPageUrl ?? paths.applicationSuccess(application.id);

  const [, executeMutation] = useSubmitApplicationMutation();
  const methods = useForm<FormValues>();
  const handleSubmit = (formValues: FormValues) => {
    executeMutation({
      id: application.id,
      signature: formValues.signature,
    })
      .then((res) => {
        if (!res.error) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "We successfully received your application",
              id: "7vOa71",
              description:
                "Success message after submission for the application review page.",
            }),
          );
          navigate(nextStep);
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

  const cancelPath = applicantDashboard
    ? paths.dashboard({ fromIapDraft: isIAP })
    : paths.myProfile();
  const editPaths = {
    resume: paths.applicationResume(application.id),
    education: paths.applicationEducation(application.id),
    skills: paths.applicationSkills(application.id),
    screeningQuestions: paths.applicationQuestions(application.id),
  };

  const nonEmptyExperiences = experiences?.filter(notEmpty) ?? [];
  const hasSomeExperience = !!experiences.length;
  const educationRequirementExperiences =
    application.educationRequirementExperiences
      ? application.educationRequirementExperiences.filter(notEmpty)
      : [];

  const categorizedEssentialSkills = categorizeSkill(
    application.poolAdvertisement?.essentialSkills,
  );

  const screeningQuestions =
    application.poolAdvertisement?.screeningQuestions?.filter(notEmpty) || [];
  const screeningQuestionResponses =
    application.screeningQuestionResponses?.filter(notEmpty) || [];
  return (
    <section>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <div data-h2-margin-bottom="base(x2)">
        <p data-h2-margin-bottom="base(x1)">
          {intl.formatMessage({
            defaultMessage:
              "Before continuing, it’s important that you understand the following notes about your application:",
            id: "GXmpsW",
            description: "Starting message for the application review page.",
          })}
        </p>
        <ul>
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
          defaultMessage: "Your résumé",
          id: "2lOey6",
          description:
            "Heading for resume section of the application review page.",
        })}
        path={editPaths.resume}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit your resume",
          id: "v0QzOM",
          description:
            "Edit link text for resume section of the application review page.",
        })}
      >
        <TreeView.Root>
          <TreeView.Head>
            <Card title="" color="white" bold data-h2-margin-bottom="base(x1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "This section summarizes your résumé as it will be seen by hiring managers for these positions.",
                  id: "O83lYZ",
                  description:
                    "Blurb for resume section of the application review page.",
                })}
              </p>
            </Card>
          </TreeView.Head>
          {hasSomeExperience ? (
            nonEmptyExperiences.map((experience) => (
              <TreeView.Item key={experience.id}>
                <div data-h2-margin="base(-x.5, 0)">
                  <Accordion.Root type="single" collapsible>
                    <ExperienceAccordion
                      key={experience.id}
                      experience={experience}
                      headingLevel="h3"
                      showSkills={false}
                    />
                  </Accordion.Root>
                </div>
              </TreeView.Item>
            ))
          ) : (
            <Well>
              <p data-h2-text-align="base(center)">
                {intl.formatMessage({
                  defaultMessage:
                    "It looks like you haven't added any experiences to your résumé yet.",
                  id: "x0Eob3",
                  description:
                    "Null state message for resume section of the application review page.",
                })}
              </p>
            </Well>
          )}
        </TreeView.Root>
      </ReviewSection>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Minimum experience or equivalent education",
          id: "2je6Bi",
          description:
            "Heading for education requirements section of the application review page.",
        })}
        path={editPaths.education}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit education requirements",
          id: "jV/FG1",
          description:
            "Edit link text for education requirements section of the application review page.",
        })}
      >
        <TreeView.Root>
          <TreeView.Head>
            <Card title="" color="white" bold data-h2-margin-bottom="base(x1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You've indicated that you meet the <strong>minimum experience or education requirement (2 years of post-secondary)</strong> with the following experiences on your résumé:",
                  id: "SBNCsU",
                  description:
                    "Message on education requirements card on the application review page.",
                })}
              </p>
            </Card>
          </TreeView.Head>
          {educationRequirementExperiences?.length > 0 ? (
            <ExperienceTreeItems
              experiences={educationRequirementExperiences}
            />
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
                        "It looks like you haven't added any experiences to your résumé yet.",
                      id: "h3Cr80",
                      description:
                        "Null state message for experiences section of the application review page.",
                    })}
                  </p>
                </Well>
              )}
            </div>
          )}
        </TreeView.Root>
      </ReviewSection>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Skill requirements",
          id: "jX2LG0",
          description:
            "Heading for skill requirements section of the application review page.",
        })}
        path={editPaths.skills}
        editLinkAriaLabel={intl.formatMessage({
          defaultMessage: "Edit skill requirements",
          id: "6QGFk9",
          description:
            "Edit link text for skill requirements section of the application review page.",
        })}
      >
        <div data-h2-margin-top="base(-x2)">
          {categorizedEssentialSkills[SkillCategory.Technical]?.map(
            (requiredTechnicalSkill) => (
              <SkillTree
                key={requiredTechnicalSkill.id}
                skill={requiredTechnicalSkill}
                experiences={experiences}
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
          title={intl.formatMessage({
            defaultMessage: "Screening questions",
            id: "qGyD4w",
            description:
              "Heading for screening questions section of the application review page.",
          })}
          path={editPaths.screeningQuestions}
          editLinkAriaLabel={intl.formatMessage({
            defaultMessage: "Edit screening questions",
            id: "5A0a7w",
            description:
              "Edit link text for screening questions section of the application review page.",
          })}
        >
          {screeningQuestionResponses.length > 0 ? (
            <div>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "You’ve answered the following screening questions:",
                  id: "Sd8883",
                  description:
                    "Message in screening questions section of the application review page.",
                })}
              </p>
              <ul>
                {screeningQuestionResponses.map((response) => (
                  <li key={response.id} data-h2-margin-bottom="base(x1)">
                    <p
                      data-h2-font-weight="base(700)"
                      data-h2-margin-bottom="base(x.5)"
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

      <section data-h2-margin-bottom="base(x3)">
        <Heading level="h3" data-h2-margin="base(0, 0, x1, 0)">
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
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage: `You made it! By signing your name, you confirm that:`,
                  id: "pH8wF2",
                  description:
                    "Instructions for sign and submit section of application review page.",
                })}
              </p>
              <ul>
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
                    {intl.formatMessage({
                      defaultMessage: `"I understand that I am part of a community who trusts each other"`,
                      id: "jT5ANA",
                      description:
                        "Community list item for sign and submit section of application review page.",
                    })}
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
              <div>
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
                data-h2-gap="base(x.25, x.5)"
                data-h2-flex-wrap="base(wrap)"
                data-h2-flex-direction="base(column) l-tablet(row)"
                data-h2-align-items="base(flex-start) l-tablet(center)"
              >
                <Button type="submit" mode="solid" value="continue">
                  {intl.formatMessage({
                    defaultMessage: "Submit my application",
                    id: "bO9PB4",
                  })}
                </Button>
                <Link
                  type="button"
                  mode="inline"
                  color="secondary"
                  href={cancelPath}
                >
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

const ApplicationReviewPage = () => {
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
  const experiences = experienceData?.me?.experiences as ExperienceForDate[];

  return (
    <Pending
      fetching={applicationFetching || experienceFetching}
      error={applicationError || experienceError}
    >
      {application?.poolAdvertisement ? (
        <ApplicationReview
          application={application}
          experiences={experiences}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationReviewPage;
