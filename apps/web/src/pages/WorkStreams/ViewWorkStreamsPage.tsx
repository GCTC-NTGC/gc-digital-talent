import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  Card,
  CardSeparator,
  Container,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

export const WorkStreamView_Fragment = graphql(/* GraphQL */ `
  fragment WorkStreamView on WorkStream {
    id
    key
    name {
      en
      fr
      localized
    }
    plainLanguageName {
      en
      fr
    }
    talentSearchable
    community {
      id
      key
      name {
        en
        fr
        localized
      }
    }
  }
`);

interface ViewWorkStreamProps {
  query: FragmentType<typeof WorkStreamView_Fragment>;
}

export const ViewWorkStream = ({ query }: ViewWorkStreamProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const workStream = getFragment(WorkStreamView_Fragment, query);

  const pageTitle =
    workStream.name?.localized ?? intl.formatMessage(commonMessages.notFound);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.workStreams),
        url: paths.workStreamTable(),
      },
      {
        label: pageTitle,
        url: paths.workStreamView(workStream.id),
      },
    ],
  });

  const navTabs = [
    {
      url: paths.workStreamView(workStream.id),
      label: intl.formatMessage({
        defaultMessage: "Work stream information",
        id: "mBaKVv",
        description: "Nav tab label for work stream information",
      }),
    },
  ];
  return (
    <>
      <SEO title={pageTitle} />
      <Hero title={pageTitle} crumbs={navigationCrumbs} navTabs={navTabs} />

      <Container className="my-18">
        <Heading
          level="h2"
          color="primary"
          icon={IdentificationIcon}
          center
          className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
        >
          {intl.formatMessage({
            defaultMessage: "Work stream information",
            id: "nGy9DA",
            description: "Heading for the 'view a work stream' form",
          })}
        </Heading>
        <Card>
          <div className="grid gap-6 xs:grid-cols-2">
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"en"}
            >
              {workStream.name?.en}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"fr"}
            >
              {workStream.name?.fr}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Plain language alternative",
                id: "vUZf8Y",
                description: "Label for plain language alternative",
              })}
              appendLanguageToLabel={"en"}
            >
              {workStream.plainLanguageName?.en}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage({
                defaultMessage: "Plain language alternative",
                id: "vUZf8Y",
                description: "Label for plain language alternative",
              })}
              appendLanguageToLabel={"fr"}
            >
              {workStream.plainLanguageName?.fr}
            </FieldDisplay>
            <div className="xs:col-span-2">
              <FieldDisplay label={intl.formatMessage(adminMessages.community)}>
                {workStream.community?.name?.localized}
              </FieldDisplay>
            </div>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.onFindTalent)}
            >
              {workStream.talentSearchable
                ? intl.formatMessage(commonMessages.yes)
                : intl.formatMessage(commonMessages.no)}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
              {workStream.key ?? intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
          </div>
          <CardSeparator />
          <Link
            href={paths.workStreamUpdate(workStream.id)}
            className="font-bold"
          >
            {intl.formatMessage({
              defaultMessage: "Edit work stream information",
              id: "fqEh4+",
              description: "Link to edit the currently viewed work stream",
            })}
          </Link>
        </Card>
      </Container>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  workStreamId: Scalars["ID"]["output"];
}

const WorkStream_Query = graphql(/* GraphQL */ `
  query ViewWorkStreamPage($id: UUID!) {
    workStream(id: $id) {
      ...WorkStreamView
    }
  }
`);

const ViewWorkStreamPage = () => {
  const intl = useIntl();
  const { workStreamId } = useRequiredParams<RouteParams>("workStreamId");
  const [{ data: workStreamData, fetching, error }] = useQuery({
    query: WorkStream_Query,
    variables: { id: workStreamId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {workStreamData?.workStream ? (
        <ViewWorkStream query={workStreamData?.workStream} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Work stream {workStreamId} not found.",
                id: "PzQ0E1",
                description: "Message displayed for work stream not found.",
              },
              { workStreamId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewWorkStreamPage />
  </RequireAuth>
);

Component.displayName = "AdminUpdateWorkStreamPage";

export default Component;
