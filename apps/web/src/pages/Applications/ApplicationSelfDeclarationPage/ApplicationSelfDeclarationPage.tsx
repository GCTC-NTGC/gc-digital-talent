import React from "react";
import { useIntl } from "react-intl";
import HeartIcon from "@heroicons/react/20/solid/HeartIcon";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";

import useRoutes from "~/hooks/useRoutes";
import { GetPageNavInfo } from "~/types/applicationStep";
import applicationMessages from "~/messages/applicationMessages";

import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  apiValuesToFormValues,
  FormValues,
  formValuesToApiValues,
} from "~/utils/indigenousDeclaration";
import {
  IndigenousCommunity,
  useGetApplicationQuery,
  useGetMeQuery,
} from "@gc-digital-talent/graphql";
import AddToProfile from "~/components/EmploymentEquity/dialogs/AddToProfile";
import { Checkbox, Fieldset, unpackMaybes } from "@gc-digital-talent/forms";
import { getEmploymentEquityStatement } from "@gc-digital-talent/i18n";
import CommunitySelection from "~/components/SelfDeclaration/CommunitySelection";
import { getSelfDeclarationLabels } from "~/components/SelfDeclaration/utils";
import { useParams } from "react-router";
import ApplicationApi, { ApplicationPageProps } from "../ApplicationApi";
import { useApplicationContext } from "../ApplicationContext";

export const getPageInfo: GetPageNavInfo = ({
  application,
  paths,
  intl,
  stepOrdinal,
}) => {
  const path = paths.applicationSelfDeclaration(application.id);
  return {
    title: intl.formatMessage({
      defaultMessage: "Indigenous Peoples Self-Declaration Form",
      id: "CU5XqI",
      description: "Page title for the self-declaration page",
    }),
    subtitle: intl.formatMessage({
      defaultMessage: "Help us understand your community.",
      id: "gQl1LT",
      description: "Subtitle for the self-declaration page",
    }),
    icon: HeartIcon,
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
        defaultMessage: "Self-declaration",
        id: "fLohdl",
        description: "Link text for the self-declaration page",
      }),
    },
  };
};

const makeLink = (text: React.ReactNode, url: string) => (
  <a href={url}>{text}</a>
);

interface ApplicationSelfDeclarationProps extends ApplicationPageProps {
  indigenousCommunities: Array<IndigenousCommunity>;
}

const ApplicationSelfDeclaration = ({
  application,
  indigenousCommunities,
}: ApplicationSelfDeclarationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { currentStepOrdinal } = useApplicationContext();
  const pageInfo = getPageInfo({
    intl,
    paths,
    application,
    stepOrdinal: currentStepOrdinal,
  });
  const methods = useForm<FormValues>({
    defaultValues: apiValuesToFormValues(indigenousCommunities),
  });
  const { handleSubmit } = methods;

  const onSave = (_: IndigenousCommunity[]) => {};

  const submitHandler: SubmitHandler<FormValues> = async (data: FormValues) => {
    onSave(formValuesToApiValues(data));
  };

  const labels = getSelfDeclarationLabels(intl);

  return (
    <>
      <Heading data-h2-margin-top="base(0)">{pageInfo.title}</Heading>
      <p>
        {intl.formatMessage({
          defaultMessage:
            "We recognize the importance of Indigenous voices in the federal government. The Program was designed in partnership with Indigenous peoples. By completing and signing the Indigenous Peoples Self-Declaration Form, you are helping to protect the space, agreeing that you are a part of the three distinct Indigenous groups in Canada and are interested in joining the Program!",
          id: "XZkxuK",
          description: "Application self-declaration intro paragraph 1",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <AddToProfile />
          <div data-h2-margin="base(x1, 0, x1.5, 0)">
            <Fieldset
              legend={intl.formatMessage({
                defaultMessage: "Self-Declaration",
                id: "dYS0MA",
                description: "Form label for a self-declaration input",
              })}
              name="isIndigenous"
              hideOptional
              trackUnsaved={false}
            >
              <Checkbox
                id="isIndigenous"
                name="isIndigenous"
                label={intl.formatMessage(
                  getEmploymentEquityStatement("indigenous"),
                )}
                trackUnsaved={false}
              />
            </Fieldset>
            <CommunitySelection labels={labels} />
          </div>
        </form>
      </FormProvider>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "If you are unsure about providing your information, or if you have any questions regarding the IT Apprenticeship Program for Indigenous Peoples, please <contactUsLink>contact us</contactUsLink> and we would be happy to meet with you.",
            id: "0HsSBa",
            description: "Application self-declaration intro paragraph 2",
          },
          {
            contactUsLink: (text: React.ReactNode) =>
              makeLink(text, "mailto:edsc.pda-iap.esdc@hrsdc-rhdcc.gc.ca"),
          },
        )}
      </p>
      <p>
        {intl.formatMessage(
          {
            defaultMessage:
              "Click here to see <whyAskLink>why we are asking you to self declare</whyAskLink>, <howVerifyLink>how this will be verified</howVerifyLink>, and the term <defineIndigenousLink>Indigenous as defined for this program</defineIndigenousLink>.",
            id: "o3xrfO",
            description: "Application self-declaration intro paragraph 3",
          },
          {
            whyAskLink: null,
            howVerifyLink: null,
            defineIndigenousLink: null,
          },
        )}
      </p>
    </>
  );
};

const ApplicationSelfDeclarationPage = () => {
  const { applicationId } = useParams();
  const [
    {
      data: applicationData,
      fetching: applicationFetching,
      error: applicationError,
      stale: applicationStale,
    },
  ] = useGetApplicationQuery({
    requestPolicy: "cache-first",
    variables: {
      id: applicationId || "",
    },
  });
  const [{ data: userData, fetching: userFetching, error: userError }] =
    useGetMeQuery();

  const application = applicationData?.poolCandidate;
  const resolvedIndigenousCommunities = unpackMaybes(
    userData?.me?.indigenousCommunities,
  );
  return (
    <Pending
      fetching={applicationFetching || applicationStale || userFetching}
      error={applicationError || userError}
    >
      {application?.poolAdvertisement && userData?.me ? (
        <ApplicationSelfDeclaration
          application={application}
          indigenousCommunities={resolvedIndigenousCommunities}
        />
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export default ApplicationSelfDeclarationPage;
