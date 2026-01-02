import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import {
  Pending,
  NotFound,
  Card,
  Heading,
  Link,
  CardSeparator,
  Container,
} from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { emptyToNull } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import { getClassificationName } from "~/utils/poolUtils";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

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
    displayName {
      en
      fr
    }
    isAvailableInSearch
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
      <Container className="my-18">
        <Heading
          icon={IdentificationIcon}
          level="h2"
          color="secondary"
          className="mt-0 xs:justify-start xs:text-left"
          center
        >
          {subTitle}
        </Heading>
        <Card>
          <div className="grid gap-6 xs:grid-cols-2">
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"en"}
            >
              {classification.name?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"fr"}
            >
              {classification.name?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(commonMessages.group)}>
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
            <FieldDisplay
              label={intl.formatMessage(commonMessages.onFindTalent)}
              className="xs:col-span-2"
            >
              {classification.isAvailableInSearch
                ? intl.formatMessage(commonMessages.yes)
                : intl.formatMessage(commonMessages.no)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.displayName)}
              appendLanguageToLabel={"en"}
            >
              {emptyToNull(classification.displayName?.en) ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.displayName)}
              appendLanguageToLabel={"fr"}
            >
              {emptyToNull(classification.displayName?.fr) ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
          </div>
          <CardSeparator />
          <div className="flex justify-center text-center xs:justify-start xs:text-left">
            <Link
              color="primary"
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
        </Card>
      </Container>
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
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewClassificationPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateClassificationPage";

export default Component;
