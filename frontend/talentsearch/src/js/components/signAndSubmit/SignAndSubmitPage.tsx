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
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import ApplicationPageWrapper from "../ApplicationPageWrapper/ApplicationPageWrapper";

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
      {steps.map((item) => (
        <li key={uniqueId()} data-h2-margin="base(0, 0, x1, 0)">
          {item}
        </li>
      ))}
    </ol>
  );
};

const Signature = ({ isNotComplete }: { isNotComplete: boolean }) => {
  const intl = useIntl();
  const methods = useForm<{ signature: string }>();
  const confirmations = [
    intl.formatMessage({
      defaultMessage: `"I've reviewed everything written in my
        application`,
      id: "aeI64y",
      description: "Signature list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage: `"I understand that I am part of a community who trusts each
        other"`,
      id: "dIZPra",
      description: "Signature list item on sign and submit page.",
    }),
    intl.formatMessage({
      defaultMessage: `"I promise that the information Ive provided is
        true"`,
      id: "Lgo2iQ",
      description: "Signature list item on sign and submit page.",
    }),
  ];
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(() => {
          // TODO: ADD SUBMIT APPLICATION MUTATION HERE
        })}
      >
        <p>
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
            disabled={isNotComplete}
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
            disabled={isNotComplete}
          />
          <Link
            href="#REPLACE HREF WITH ROUTE WHEN AVAILABLE"
            color="black"
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
  closingDate: Date;
  jobTitle: string;
  isNotComplete: boolean;
}

export const SignAndSubmitForm = ({
  closingDate,
  jobTitle,
  isNotComplete,
}: SignAndSubmitFormProps) => {
  const intl = useIntl();
  const paths = useDirectIntakeRoutes();

  const tocNavItems = [
    {
      id: "importantInformation",
      title: intl.formatMessage({
        defaultMessage: "Important information",
        id: "/Mb8b6",
        description: "Toc navigation item on sign and submit page.",
      }),
      component: <ImportantInfo />,
      icon: UserIcon,
    },
    {
      id: "signature",
      title: intl.formatMessage({
        defaultMessage: "Signature",
        id: "Ledr63",
        description: "Toc navigation item on sign and submit page.",
      }),
      component: <Signature isNotComplete={isNotComplete} />,
      icon: ClipboardDocumentCheckIcon,
    },
  ];

  const applicationRoute = "#REPLACE-WITH-APPLICATION-ROUTE";
  return (
    <ApplicationPageWrapper
      closingDate={closingDate}
      title={intl.formatMessage({
        defaultMessage: "My application profile",
        id: "6p6syC",
        description: "Title for sign and submit page.",
      })}
      crumbs={[
        {
          title: intl.formatMessage({
            defaultMessage: "My applications",
            id: "kjtiha",
            description: "Breadcrumb for sign and submit page.",
          }),
          href: paths.allPools(),
        },
        {
          title: jobTitle,
          href: applicationRoute,
        },
        {
          title: intl.formatMessage({
            defaultMessage: "Step 2",
            id: "oOR4Rd",
            description: "Breadcrumb for sign and submit page.",
          }),
        },
      ]}
      navigation={{
        currentStep: 2,
        steps: [
          {
            path: applicationRoute,
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
              <TableOfContents.Heading as="h3" icon={item.icon}>
                {item.title}
              </TableOfContents.Heading>
              {item.component}
            </TableOfContents.Section>
          ))}
        </TableOfContents.Content>
      </TableOfContents.Wrapper>
    </ApplicationPageWrapper>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SignAndSubmitPage: React.FC<{ id: string }> = ({ id }) => {
  const intl = useIntl();

  // TODO: Fetch application data query
  // const [{ data, fetching, error }] = REPLACEWITHPROFILEDATAQUERY({
  //   variables: { id },
  // });
  const application = true;
  const fetching = true;
  const error = undefined;

  return (
    <Pending fetching={fetching} error={error}>
      {application ? (
        <SignAndSubmitForm
          closingDate={new Date(Date.now())} // TODO: Replace with api data
          jobTitle="REPLACE WITH JOB TITLE" // TODO: Replace with api data
          isNotComplete // TODO: Replace with api data
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage({
              defaultMessage: "Error, application unable to be loaded",
              id: "0+hcuo",
              description: "Error message, placeholder",
            })}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export default SignAndSubmitPage;
