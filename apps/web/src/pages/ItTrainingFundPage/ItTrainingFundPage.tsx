import { defineMessage, useIntl } from "react-intl";

import { Container } from "@gc-digital-talent/ui";

import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import pageTitles from "~/messages/pageTitles";
import TrainingFundNotice from "~/components/TrainingFundNotice/TrainingFundNotice";

const pageTitle = defineMessage(pageTitles.itTrainingFund);

const pageSubtitle = defineMessage({
  defaultMessage:
    "Explore learning opportunities for IT employees to build and strengthen skills.",
  id: "A94Zgi",
  description: "Page subtitle for the IT training fund page",
});

export const Component = () => {
  const intl = useIntl();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitle),
        url: paths.itTrainingFund(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitle)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitle)}
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

Component.displayName = "ItTrainingFundPage";

export default Component;
