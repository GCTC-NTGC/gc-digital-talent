import { useIntl } from "react-intl";
import StarIcon from "@heroicons/react/20/solid/StarIcon";

import { Heading, Link, Separator } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";

import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationCareerTimelineIntro(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Great work! On to your career timeline.",
      id: "oX23Z+",
      description:
        "Page title for the application career timeline introduction page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Update and review your career timeline information.",
      id: "qGSEMx",
      description:
        "Subtitle for the application career timeline introduction page",
    }),
    icon: StarIcon,
    crumbs: [
      {
        url: path,
        label: intl.formatMessage(applicationMessages.numberedStepIntro, {
          stepOrdinal,
        }),
      },
    ],
    link: {
      url: path,
    },
  };
};

const ApplicationCareerTimelineIntroduction = ({
  application,
}: ApplicationPageProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal, isIAP } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const nextStep = paths.applicationCareerTimeline(application.id);

  return (
    <>
      <Heading
        data-h2-margin-top="base(0)"
        size="h3"
        data-h2-font-weight="base(400)"
      >
        {pageInfo.title}
      </Heading>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "The next step is to make sure that your career timeline is as up-to-date as possible.",
          id: "C780XI",
          description:
            "Application step to begin working on career timeline, paragraph one",
        })}
      </p>
      <p data-h2-margin="base(x1, 0)">
        {intl.formatMessage({
          defaultMessage:
            "Tell us about your <strong>work experience</strong>, <strong>community participation</strong>, <strong>awards</strong>, <strong>personal initiatives</strong>, and <strong>education</strong>. You'll use this information later in your application to help us understand how you meet this opportunity's education and skill requirements.",
          id: "4XVcc2",
          description:
            "Application step to begin working on career timeline, paragraph two",
        })}
      </p>
      <Separator />
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1)"
        data-h2-flex-wrap="base(wrap)"
        data-h2-flex-direction="base(column) l-tablet(row)"
        data-h2-align-items="base(flex-start) l-tablet(center)"
      >
        <Link color="primary" mode="solid" href={nextStep}>
          {intl.formatMessage({
            defaultMessage: "Got it, let's go!",
            id: "AOrJqm",
            description: "Link text to continue the application process",
          })}
        </Link>
        <Link
          mode="inline"
          href={paths.profileAndApplications({ fromIapDraft: isIAP })}
        >
          {intl.formatMessage(applicationMessages.saveQuit)}
        </Link>
      </div>
    </>
  );
};

export const Component = () => (
  <ApplicationApi PageComponent={ApplicationCareerTimelineIntroduction} />
);

Component.displayName = "ApplicationCareerTimelineIntroductionPage";
