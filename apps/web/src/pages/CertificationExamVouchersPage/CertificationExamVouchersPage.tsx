import { defineMessage, useIntl } from "react-intl";

import { Container } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import pageTitles from "~/messages/pageTitles";
import TrainingFundNotice from "~/components/TrainingFundNotice/TrainingFundNotice";

const pageSubtitle = defineMessage({
  defaultMessage: "Validate your skills in key IT areas by becoming certified.",
  id: "YZtE49",
  description: "Page subtitle for certification exam vouchers page",
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
        label: intl.formatMessage(pageTitles.certificationExamVouchers),
        url: paths.certificationExamVouchers(),
      },
    ],
  });

  return (
    <>
      <SEO
        title={intl.formatMessage(pageTitles.certificationExamVouchers)}
        description={intl.formatMessage(pageSubtitle)}
      />
      <Hero
        title={intl.formatMessage(pageTitles.certificationExamVouchers)}
        subtitle={intl.formatMessage(pageSubtitle)}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <TrainingFundNotice />
      </Container>
    </>
  );
};

Component.displayName = "CertificationExamVouchersPage";

export default Component;
