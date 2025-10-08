import { useNavigate, useSearchParams } from "react-router";
import { defineMessage, useIntl } from "react-intl";
import BriefcaseIcon from "@heroicons/react/24/outline/BriefcaseIcon";

import { Card, Heading } from "@gc-digital-talent/ui";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { UpdateUserAsUserInput } from "@gc-digital-talent/graphql";

import Hero from "~/components/Hero";
import SEO from "~/components/SEO/SEO";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import messages from "../messages";

const addWorkExperienceSectionTitle = defineMessage({
  defaultMessage: "Add your most recent work experience",
  id: "v1dIUn",
  description: "Section title for the Add work experience section.",
});

export interface EmployeeInformationFormProps {
  onSubmit: (
    data: UpdateUserAsUserInput,
    skipVerification?: boolean,
  ) => Promise<void>;
}

export const EmployeeInformationForm = ({
  onSubmit,
}: EmployeeInformationFormProps) => {
  const intl = useIntl();
  return (
    <>
      <Heading
        level="h2"
        size="h3"
        icon={BriefcaseIcon}
        color="secondary"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage(addWorkExperienceSectionTitle)}
      </Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "Start building your profile by telling us about your most recent job. Not ready to add experience yet? You can skip this step at the end of the form.",
          id: "g3vPKp",
          description: "Description for Add your work experience section",
        })}
      </p>

      <div className="my-6 flex flex-col gap-y-6"></div>
    </>
  );
};

const EmployeeInformationPage = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(messages.breadcrumb),
        url: paths.employeeInformation(),
      },
    ],
  });

  const onSubmit = async (input: UpdateUserAsUserInput) => {
    console.debug("onSubmit");
  };

  return (
    <>
      <SEO
        title={intl.formatMessage(addWorkExperienceSectionTitle)}
        description={intl.formatMessage(messages.subtitle)}
      />
      <Hero
        title={intl.formatMessage(messages.title)}
        subtitle={intl.formatMessage(messages.subtitle)}
        crumbs={crumbs}
        overlap
        centered
      >
        <section className="mb-18">
          <Card className="xs:p-12">
            {/* <Pending fetching={fetching} error={error}> */}
            <EmployeeInformationForm onSubmit={onSubmit} />

            {/* </Pending> */}
          </Card>
        </section>
      </Hero>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <EmployeeInformationPage />
  </RequireAuth>
);

export default EmployeeInformationPage;
