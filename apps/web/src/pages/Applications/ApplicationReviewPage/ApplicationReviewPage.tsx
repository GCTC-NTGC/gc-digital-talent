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
      id: "rR+M64",
      description: "Page title for the application review page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Review your application and submit it!",
      id: "O6L+3N",
      description: "Subtitle for the application review page",
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
        id: "QDcEYJ",
        description: "Link text for the application review page",
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
  const { currentStepOrdinal, followingPageUrl } = useApplicationContext();
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
              id: "k0//XC",
            }),
          );
          navigate(nextStep);
        }
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: submitting application failed",
            id: "1lFWN/",
          }),
        );
      });
  };

  const cancelPath = applicantDashboard ? paths.dashboard() : paths.myProfile();
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
            id: "hX7Z1l",
          })}
        </p>
        <ul>
          <li>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "When you submit your application, a copy of your profile will be created as a part of your application.",
                id: "WWoPd/",
              })}
            </p>
          </li>
          <li>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "Changes made to your profile after submitting will not be updated on your application.",
                id: "RvafWw",
              })}
            </p>
          </li>
          <li>
            <p data-h2-margin-bottom="base(x.5)">
              {intl.formatMessage({
                defaultMessage:
                  "You are still encouraged to keep your profile up to date, as updated versions will be used at later steps of the hiring process.",
                id: "TIU07I",
              })}
            </p>
          </li>
        </ul>
      </div>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Your résumé",
          id: "IYAKcM",
        })}
        path={editPaths.resume}
      >
        <TreeView.Root>
          <TreeView.Head>
            <Card title="" color="white" bold data-h2-margin-bottom="base(x1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Below is your résumé as it will be presented to hiring managers for these positions.",
                  id: "cbx+9J",
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
                  id: "bOLaWz",
                })}
              </p>
            </Well>
          )}
        </TreeView.Root>
      </ReviewSection>
      <ReviewSection
        title={intl.formatMessage({
          defaultMessage: "Minimum experience or equivalent education",
          id: "Ye8Uif",
        })}
        path={editPaths.education}
      >
        <TreeView.Root>
          <TreeView.Head>
            <Card title="" color="white" bold data-h2-margin-bottom="base(x1)">
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "You’ve indicated that you meet the <strong>minimum experience or education requirement (2 years of post-secondary)</strong> with the following experiences on your résumé:",
                  id: "U16BJ5",
                })}
              </p>
            </Card>
          </TreeView.Head>
          {educationRequirementExperiences?.length > 0 ? (
            educationRequirementExperiences.map((experience) => (
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
            <div>
              {application.educationRequirementOption === null ||
              application.educationRequirementOption === undefined ? (
                <Well>
                  <p data-h2-text-align="base(center)">
                    {intl.formatMessage({
                      defaultMessage:
                        "It looks like you haven't selected an education requirement yet.",
                      id: "lZXCYx",
                    })}
                  </p>
                </Well>
              ) : (
                <Well>
                  <p data-h2-text-align="base(center)">
                    {intl.formatMessage({
                      defaultMessage:
                        "It looks like you haven't added any experiences to your résumé yet.",
                      id: "bOLaWz",
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
          id: "MP+5bd",
        })}
        path={editPaths.skills}
        data-h2-margin-bottom="base(x1)"
      >
        {categorizedEssentialSkills[SkillCategory.Technical]?.map(
          (requiredTechnicalSkill) => (
            <SkillTree
              key={requiredTechnicalSkill.id}
              skill={requiredTechnicalSkill}
              experiences={experiences}
              showDisclaimer
              hideConnectButton
            />
          ),
        )}
      </ReviewSection>
      {screeningQuestions.length > 0 && (
        <ReviewSection
          title={intl.formatMessage({
            defaultMessage: "Screening questions",
            id: "/7P3+F",
          })}
          path={editPaths.screeningQuestions}
          data-h2-margin-bottom="base(x1)"
        >
          {screeningQuestionResponses.length > 0 ? (
            <div>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage:
                    "You’ve answered the following screening questions:",
                  id: "GJc/j5",
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
                  id: "+ojoEd",
                })}
              </p>
            </Well>
          )}
        </ReviewSection>
      )}

      <section data-h2-margin-bottom="base(x3)">
        <Heading level="h4" data-h2-margin="base(0, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage: "Sign and submit",
            id: "+sWqVY",
          })}
        </Heading>
        <div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
              <p data-h2-margin-bottom="base(x1)">
                {intl.formatMessage({
                  defaultMessage: `"You made it! By signing your name, you confirm that:"`,
                  id: "d0KeTK",
                })}
              </p>
              <ul>
                <li>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage({
                      defaultMessage: `"I’ve reviewed everything written in my application"`,
                      id: "IFVdRD",
                    })}
                  </p>
                </li>
                <li>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage({
                      defaultMessage: `"I understand that I am part of a community who trusts each other"`,
                      id: "MKU7g2",
                    })}
                  </p>
                </li>
                <li>
                  <p data-h2-margin-bottom="base(x.5)">
                    {intl.formatMessage({
                      defaultMessage:
                        "I promise that the information I’ve provided is true",
                      id: "kAMYLw",
                    })}
                  </p>
                </li>
              </ul>
              <div>
                <Input
                  id="signature"
                  label={intl.formatMessage({
                    defaultMessage: "Please type your name",
                    id: "DmeN52",
                    description:
                      "Label displayed for signature input in sign and submit page.",
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
