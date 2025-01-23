import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import {
  Pending,
  NotFound,
  CardBasic,
  Heading,
  Link,
  CardSeparator,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import { getClassificationName } from "~/utils/poolUtils";
import adminMessages from "~/messages/adminMessages";
import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import permissionConstants from "~/constants/permissionConstants";

import messages from "./messages";

const ViewClassification_Fragment = graphql(/* GraphQL */ `
  fragment ViewClassification on Classification {
    id
    name {
      en
      fr
    }
    group
    level
    minSalary
    maxSalary
  }
`);

interface ViewClassificationProps {
  query: FragmentType<typeof ViewClassification_Fragment>;
}

const ViewClassification = ({ query }: ViewClassificationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const classification = getFragment(ViewClassification_Fragment, query);

  const pageTitle = getClassificationName(classification, intl);
  const subTitle = intl.formatMessage(messages.classificationInfo);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.classifications),
        url: paths.classificationTable(),
      },
      {
        label: pageTitle,
        url: paths.classificationView(classification.id),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        crumbs={navigationCrumbs}
        navTabs={[
          {
            url: paths.classificationView(classification.id),
            label: subTitle,
          },
        ]}
      />
      <div
        data-h2-margin="base(x3 0)"
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
        >
          <Heading
            Icon={IdentificationIcon}
            level="h2"
            color="primary"
            data-h2-margin-top="base(0)"
          >
            {subTitle}
          </Heading>
        </div>
        <CardBasic>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(1fr 1fr)"
            data-h2-gap="base(x1)"
          >
            <FieldDisplay label={intl.formatMessage(adminMessages.nameEn)}>
              {classification.name?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(adminMessages.nameFr)}>
              {classification.name?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Group",
                id: "hGEhAB",
                description: "Label for classification group display",
              })}
            >
              {classification.group}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(messages.levelNumber)}>
              {classification.level}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Minimum salary",
                id: "VWEwki",
                description: "Label for classification minimum salary display",
              })}
            >
              {classification.minSalary ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Maximum salary",
                id: "zKCAjY",
                description: "Label for classification maximum salary display",
              })}
            >
              {classification.maxSalary ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
          </div>
          <CardSeparator />
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(center) p-tablet(flex-start)"
            data-h2-text-align="base(center) p-tablet(left)"
          >
            <Link
              color="secondary"
              mode="inline"
              href={paths.classificationUpdate(classification.id)}
            >
              {intl.formatMessage({
                defaultMessage: "Edit classification information",
                id: "VvOx9a",
                description: "Link text to edit a classification",
              })}
            </Link>
          </div>
        </CardBasic>
      </div>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  classificationId: Scalars["ID"]["output"];
}

const Classification_Query = graphql(/* GraphQL */ `
  query ViewClassificationPage($id: UUID!) {
    classification(id: $id) {
      ...ViewClassification
    }
  }
`);

const ViewClassificationPage = () => {
  const intl = useIntl();
  const { classificationId } =
    useRequiredParams<RouteParams>("classificationId");
  const [{ data, fetching, error }] = useQuery({
    query: Classification_Query,
    variables: { id: classificationId },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {data?.classification ? (
          <ViewClassification query={data.classification} />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Classification {classificationId} not found.",
                  id: "b3VnhM",
                  description:
                    "Message displayed for classification not found.",
                },
                { classificationId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants.managePlatformData}>
    <ViewClassificationPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateClassificationPage";

export default ViewClassification;
