import * as React from "react";
import { Link } from "@common/components";
import { Input, Submit } from "@common/components/form";
import NotFound from "@common/components/NotFound";
import Pending from "@common/components/Pending";
import TableOfContents from "@common/components/TableOfContents";
import { commonMessages, errorMessages } from "@common/messages";
import { ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import {
  ClipboardDocumentCheckIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import uniqueId from "lodash/uniqueId";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { navigate, useQueryParams } from "@common/helpers/router";
import { toast } from "react-toastify";
import { getMissingSkills } from "@common/components/skills/MissingSkills/MissingSkills";
import { notEmpty } from "@common/helpers/util";
import directIntakeRoutes, {
  useDirectIntakeRoutes,
} from "../../directIntakeRoutes";
import ApplicationPageWrapper from "../ApplicationPageWrapper/ApplicationPageWrapper";
import {
  SubmitApplicationMutation,
  useGetApplicationDataQuery,
  useSubmitApplicationMutation,
} from "../../api/generated";
import getFullPoolAdvertisementTitle from "../pool/getFullPoolAdvertisementTitle";
import { flattenExperienceSkills } from "../experienceAndSkills/ExperienceAndSkills";

const ImportantInfo = () => {
  const intl = useIntl();
  const steps = [
    intl.formatMessage({
      defaultMessage:
        "When you submit your application, a copy of your profile will be created.",
      description: "Important info list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage:
        "This copy will be used for the initial application review.",
      description: "Important info list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage:
        "Changes made to your profile after submitting will not be updated on this copy.",
      description: "Important info list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage:
        "You are still encouraged to keep your profile up to date, updated versions will be used at later steps of the hiring process.",
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
  isApplicationComplete: boolean;
  handleSubmitApplication: (
    id: string,
    signature: string,
  ) => Promise<SubmitApplicationMutation["submitApplication"]>;
};

const SignatureForm = ({
  applicationId,
  userId,
  isApplicationComplete,
  handleSubmitApplication,
}: SignatureFormProps) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();
  const methods = useForm<FormValues>();
  const confirmations = [
    intl.formatMessage({
      defaultMessage: `"I've reviewed everything written in my
        application`,
      description: "Signature list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage: `"I understand that I am part of a community who trusts each
        other"`,
      description: "Signature list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage: `"I promise that the information Ive provided is
        true"`,
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
            description:
              "Message displayed to user after application is submitted successfully.",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: submitting application failed",
            description:
              "Message displayed to user after application fails to submit.",
          }),
        );
      });
  };

  console.log(isApplicationComplete);
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <p data-h2-margin="base(0, 0, x1, 0)">
          {intl.formatMessage({
            defaultMessage:
              "You made it! By signing your name below you confirm that:",
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
              description:
                "Label displayed for signature input in sign and submit page.",
            })}
            type="text"
            name="signature"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            disabled={!isApplicationComplete}
          />
        </div>
        <div data-h2-text-align="base(center) p-tablet(left)">
          <Submit
            color="cta"
            text={
              <span
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
              >
                {intl.formatMessage({
                  defaultMessage: "Submit my application",
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
            disabled={!isApplicationComplete}
          />
          <Link
            href="#REPLACEWITHREVIEWAPPLICATIONROUTE" // TODO: Replace with review my application route.
            color="black"
            mode="inline"
            type="button"
          >
            {intl.formatMessage({
              defaultMessage: "Back to previous step",
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
  poolAdvertisementId: string;
  userId: string;
  closingDate: Date;
  jobTitle: string;
  isApplicationComplete: boolean;
  handleSubmitApplication: (
    id: string,
    signature: string,
  ) => Promise<SubmitApplicationMutation["submitApplication"]>;
}

export const SignAndSubmitForm = ({
  applicationId,
  poolAdvertisementId,
  userId,
  closingDate,
  jobTitle,
  isApplicationComplete,
  handleSubmitApplication,
}: SignAndSubmitFormProps) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();

  const tocNavItems = [
    {
      id: "importantInformation",
      title: intl.formatMessage({
        defaultMessage: "Important information",
        description: "Toc navigation item on sign and submit page.",
      }),
      component: <ImportantInfo />,
      icon: UserIcon,
    },
    {
      id: "signature",
      title: intl.formatMessage({
        defaultMessage: "Signature",
        description: "Toc navigation item on sign and submit page.",
      }),
      component: (
        <SignatureForm
          applicationId={applicationId}
          userId={userId}
          isApplicationComplete={isApplicationComplete}
          handleSubmitApplication={handleSubmitApplication}
        />
      ),
      icon: ClipboardDocumentCheckIcon,
    },
  ];

  return (
    <ApplicationPageWrapper
      closingDate={closingDate}
      title={intl.formatMessage({
        defaultMessage: "My application profile",
        description: "Title for sign and submit page.",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "My applications",
            description: "Breadcrumb for sign and submit page.",
          }),
          href: paths.allPools(),
        },
        {
          title: jobTitle,
          href: paths.poolAdvertisement(poolAdvertisementId),
        },
        {
          title: intl.formatMessage({
            defaultMessage: "Step 2",
            description: "Breadcrumb for sign and submit page.",
          }),
        },
      ]}
      navigation={{
        currentStep: 2,
        steps: [
          {
            path: "#REPLACEWITHREVIEWAPPLICATIONROUTE", // TODO: Replace with review my application route.
            label: intl.formatMessage({
              defaultMessage: "Step 1: Review my profile",
              description: "Navigation step in sign and submit page.",
            }),
          },
          {
            path: "#sign-and-submit",
            label: intl.formatMessage({
              defaultMessage: "Step 2: Sign and submit",
              description: "Navigation step in sign and submit page.",
            }),
          },
        ],
      }}
      subtitle={jobTitle}
    >
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
              <div data-h2-padding="base(x3, 0, x1, 0)">
                <div data-h2-flex-grid="base(center, 0, x2, x1)">
                  <div
                    data-h2-flex-item="base(1of1) p-tablet(content)"
                    data-h2-text-align="base(center) p-tablet(right)"
                  >
                    <TableOfContents.Heading as="h3" icon={item.icon}>
                      {item.title}
                    </TableOfContents.Heading>
                  </div>
                </div>
              </div>

              {item.component}
            </TableOfContents.Section>
          ))}
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </ApplicationPageWrapper>
  );
};

const SignAndSubmitPage: React.FC<{ id: string }> = ({ id }) => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useGetApplicationDataQuery({
    variables: { id },
  });

  const jobTitle = data?.poolCandidate?.poolAdvertisement
    ? getFullPoolAdvertisementTitle(intl, data.poolCandidate.poolAdvertisement)
    : intl.formatMessage({
        defaultMessage: "Error, job title not found.",
        description: "Error message when job title isn't found.",
      });

  const isProfileComplete = data?.poolCandidate?.user.isProfileComplete;
  const experiences = data?.poolCandidate?.user.experiences?.filter(notEmpty);
  const hasExperiences = notEmpty(experiences);

  console.log(isProfileComplete);

  const isApplicationComplete =
    isProfileComplete === true &&
    getMissingSkills(
      data?.poolCandidate?.poolAdvertisement?.essentialSkills || [],
      hasExperiences
        ? flattenExperienceSkills(experiences).filter(notEmpty)
        : [],
    ).length === 0;

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
      {data?.poolCandidate && data.poolCandidate.poolAdvertisement ? (
        <SignAndSubmitForm
          applicationId={id}
          poolAdvertisementId={data.poolCandidate.poolAdvertisement?.id}
          userId={data.poolCandidate.user.id}
          closingDate={data.poolCandidate.poolAdvertisement?.expiryDate}
          jobTitle={jobTitle}
          isApplicationComplete={isApplicationComplete}
          handleSubmitApplication={handleSubmitApplication}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Error, application unable to be loaded",
              description: "Error message, placeholder",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default SignAndSubmitPage;
