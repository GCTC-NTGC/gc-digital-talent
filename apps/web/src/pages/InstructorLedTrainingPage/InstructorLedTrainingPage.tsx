import { defineMessage, useIntl } from "react-intl";

import { Container } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import TrainingFundNotice from "~/components/TrainingFundNotice/TrainingFundNotice";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

const pageSubtitle = defineMessage({
  defaultMessage:
    "Find available instructor-led training courses and apply to grow your IT expertise.",
  id: "JlQIBx",
  description: "Page subtitle for the instructor led training page",
});

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.itTrainingFund),
        url: paths.itTrainingFund(),
      },
      {
        label: intl.formatMessage(pageTitles.instructorLedTraining),
        url: paths.instructorLedTraining(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitles.instructorLedTraining)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitles.instructorLedTraining)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
        centered
      />
      <Container className="my-18">
        <TrainingFundNotice />
      </Container>
    </>
  );
};

Component.displayName = "InstructorLedTrainingPage";

export default Component;
