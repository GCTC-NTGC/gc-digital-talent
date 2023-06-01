import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import uniqueId from "lodash/uniqueId";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import ArrowSmallRightIcon from "@heroicons/react/24/outline/ArrowSmallRightIcon";
import ClipboardDocumentCheckIcon from "@heroicons/react/24/solid/ClipboardDocumentCheckIcon";
import UserIcon from "@heroicons/react/24/solid/UserIcon";

import { toast } from "@gc-digital-talent/toast";
import {
  Link,
  ThrowNotFound,
  Pending,
  TableOfContents,
} from "@gc-digital-talent/ui";
import { Input, Submit } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import { getFullPoolTitleHtml } from "~/utils/poolUtils";
import useRoutes from "~/hooks/useRoutes";
import {
  Pool,
  Scalars,
  SubmitApplicationMutation,
  useGetApplicationDataQuery,
  useSubmitApplicationMutation,
} from "~/api/generated";
import ApplicationPageWrapper from "~/components/ApplicationPageWrapper/ApplicationPageWrapper";

const ImportantInfo = () => {
  const intl = useIntl();
  const steps = [
    intl.formatMessage({
      defaultMessage:
        "When you submit your application, a copy of your profile will be created.",
      id: "ww86SN",
      description: "Important info list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage:
        "This copy will be used for the initial application review.",
      id: "wyxpjm",
      description: "Important info list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage:
        "Changes made to your profile after submitting will not be updated on this copy.",
      id: "4NzbMZ",
      description: "Important info list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage:
        "You are still encouraged to keep your profile up to date, updated versions will be used at later steps of the hiring process.",
      id: "qDYcDP",
      description: "Important info list item on sign and submit page.",
    }),
  ];

  return (
    <ol>
      {steps.map((item, index) => (
        <li
          key={uniqueId()}
          {...(index !== steps.length - 1 && {
            "data-h2-margin": "base(0, 0, x1, 0)",
          })}
        >
          {item}
        </li>
      ))}
    </ol>
  );
};

type FormValues = {
  signature: string;
};

type SignatureFormProps = {
  applicationId: string;
  userId: string;
  handleSubmitApplication: (
    id: string,
    signature: string,
  ) => Promise<SubmitApplicationMutation["submitApplication"]>;
};

const SignatureForm = ({
  applicationId,
  userId,
  handleSubmitApplication,
}: SignatureFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const methods = useForm<FormValues>();
  const navigate = useNavigate();
  const confirmations = [
    intl.formatMessage({
      defaultMessage: `"I've reviewed everything written in my
        application"`,
      id: "voTvve",
      description: "Signature list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage: `"I understand that I am part of a community who trusts each
        other"`,
      id: "dIZPra",
      description: "Signature list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage: `"I promise that the information I've provided is
        true"`,
      id: "9Eke1a",
      description: "Signature list item on sign and submit page.",
    }),
  ];

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    await handleSubmitApplication(applicationId, data.signature)
      .then(() => {
        navigate(paths.applications(userId));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Application submitted successfully!",
            id: "Zx0ylN",
            description:
              "Message displayed to user after application is submitted successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: submitting application failed",
            id: "iilT16",
            description:
              "Message displayed to user after application fails to submit.",
          }),
        );
      });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <p data-h2-margin="base(0, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "You made it! By signing your name below you confirm that:",
            id: "i4CKlO",
            description:
              "Confirmation message before signature form on sign and submit page.",
          })}
        </p>
        <ul>
          {confirmations.map((item) => (
            <li key={uniqueId()} data-h2-margin="base(0, 0, x1, 0)">
              {item}
            </li>
          ))}
        </ul>
        <div
          data-h2-width="base(100%) p-tablet(75%) l-tablet(50%)"
          data-h2-margin="base(0, 0, x1, 0)"
        >
          <Input
            id="signature"
            label={intl.formatMessage({
              defaultMessage: "Signature",
              id: "YZyNUJ",
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
        <div data-h2-text-align="base(center) p-tablet(left)">
          <Submit
            color="primary"
            text={
              <span
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
              >
                {intl.formatMessage({
                  defaultMessage: "Submit my application",
                  id: "Knr0yc",
                  description: "Submit button label on sign and submit page.",
                })}
                <ArrowSmallRightIcon
                  style={{
                    width: "1em",
                    height: "1em",
                    marginLeft: "0.5rem",
                  }}
                />
              </span>
            }
          />
          <Link
            href={paths.reviewApplication(applicationId)}
            color="secondary"
            mode="inline"
            type="button"
          >
            {intl.formatMessage({
              defaultMessage: "Back to previous step",
              id: "SDQWZf",
              description: "Label for return link on sign and submit page.",
            })}
          </Link>
        </div>
      </form>
    </FormProvider>
  );
};

export interface SignAndSubmitFormProps {
  applicationId: string;
  poolId: string;
  userId: string;
  closingDate: Pool["closingDate"];
  jobTitle: React.ReactNode;
  handleSubmitApplication: (
    id: string,
    signature: string,
  ) => Promise<SubmitApplicationMutation["submitApplication"]>;
}

export const SignAndSubmitForm = ({
  applicationId,
  poolId,
  userId,
  closingDate,
  jobTitle,
  handleSubmitApplication,
}: SignAndSubmitFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();

  const tocNavItems = [
    {
      id: "importantInformation-section",
      title: intl.formatMessage({
        defaultMessage: "Important information",
        id: "/Mb8b6",
        description: "Toc navigation item on sign and submit page.",
      }),
      component: <ImportantInfo />,
      icon: UserIcon,
    },
    {
      id: "signature-section",
      title: intl.formatMessage({
        defaultMessage: "Signature",
        id: "Ledr63",
        description: "Toc navigation item on sign and submit page.",
      }),
      component: (
        <SignatureForm
          applicationId={applicationId}
          userId={userId}
          handleSubmitApplication={handleSubmitApplication}
        />
      ),
      icon: ClipboardDocumentCheckIcon,
    },
  ];

  return (
    <>
      <SEO
        title={intl.formatMessage({
          defaultMessage: "Submit application profile",
          id: "pf1Ffp",
          description: "Page title for pool application sign and submit page",
        })}
      />
      <ApplicationPageWrapper
        closingDate={closingDate}
        title={intl.formatMessage({
          defaultMessage: "My application profile",
          id: "6p6syC",
          description: "Title for sign and submit page.",
        })}
        crumbs={[
          {
            label: intl.formatMessage({
              defaultMessage: "My applications",
              id: "kjtiha",
              description: "Breadcrumb for sign and submit page.",
            }),
            url: paths.applications(userId),
          },
          {
            label: jobTitle,
            url: paths.pool(poolId),
          },
          {
            label: intl.formatMessage({
              defaultMessage: "Step 2",
              id: "oOR4Rd",
              description: "Breadcrumb for sign and submit page.",
            }),
            url: paths.signAndSubmit(applicationId),
          },
        ]}
        navigation={{
          currentStep: 2,
          steps: [
            {
              path: paths.reviewApplication(applicationId),
              label: intl.formatMessage({
                defaultMessage: "Step 1: Review my profile",
                id: "LUEVdb",
                description: "Navigation step in sign and submit page.",
              }),
            },
            {
              path: "#sign-and-submit",
              label: intl.formatMessage({
                defaultMessage: "Step 2: Sign and submit",
                id: "LOh+c5",
                description: "Navigation step in sign and submit page.",
              }),
            },
          ],
        }}
        subtitle={jobTitle}
      >
        <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
          <TableOfContents.Wrapper>
            <TableOfContents.Navigation>
              {tocNavItems.map((item) => (
                <TableOfContents.AnchorLink key={item.id} id={item.id}>
                  {item.title}
                </TableOfContents.AnchorLink>
              ))}
            </TableOfContents.Navigation>
            <TableOfContents.Content>
              {tocNavItems.map((item) => (
                <TableOfContents.Section key={item.id} id={item.id}>
                  <div data-h2-padding="base(x2, 0, x1, 0)">
                    <TableOfContents.Heading as="h3" icon={item.icon}>
                      {item.title}
                    </TableOfContents.Heading>
                    {item.component}
                  </div>
                </TableOfContents.Section>
              ))}
            </TableOfContents.Content>
          </TableOfContents.Wrapper>
        </div>
      </ApplicationPageWrapper>
    </>
  );
};

type RouteParams = {
  poolCandidateId: Scalars["ID"];
};

const SignAndSubmitPage = () => {
  const { poolCandidateId } = useParams<RouteParams>();
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetApplicationDataQuery({
    variables: { id: poolCandidateId || "" },
  });

  const jobTitle = data?.poolCandidate
    ? getFullPoolTitleHtml(intl, data.poolCandidate.pool)
    : intl.formatMessage({
        defaultMessage: "Error, job title not found.",
        id: "oDyHaL",
        description: "Error message when job title isn't found.",
      });

  const [, executeMutation] = useSubmitApplicationMutation();
  const handleSubmitApplication = (applicationId: string, signature: string) =>
    executeMutation({ id: applicationId, signature }).then((result) => {
      if (result.data?.submitApplication) {
        return result.data.submitApplication;
      }
      return Promise.reject(result.error);
    });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.poolCandidate ? (
        <SignAndSubmitForm
          applicationId={data.poolCandidate.id}
          poolId={data.poolCandidate.pool.id}
          userId={data.poolCandidate.user.id}
          closingDate={data.poolCandidate.pool.closingDate}
          jobTitle={jobTitle}
          handleSubmitApplication={handleSubmitApplication}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage({
            defaultMessage: "Error, application unable to be loaded",
            id: "0+hcuo",
            description: "Error message, placeholder",
          })}
        />
      )}
    </Pending>
  );
};

export default SignAndSubmitPage;
