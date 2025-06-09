import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useQuery } from "urql";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  NotFound,
  Heading,
  Link,
  Card,
  CardSeparator,
  Pending,
  Chip,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
  ViewTrainingOpportunityPageQuery,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { htmlToRichTextJSON, RichTextRenderer } from "@gc-digital-talent/forms";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";

import formLabels from "./formLabels";
import { TrainingOpportunityForm_Fragment } from "./apiUtils";

interface ViewTrainingOpportunityFormProps {
  query: FragmentType<typeof TrainingOpportunityForm_Fragment>;
}

export const ViewTrainingOpportunityForm = ({
  query,
}: ViewTrainingOpportunityFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { trainingOpportunityId } = useRequiredParams<RouteParams>(
    "trainingOpportunityId",
  );
  const trainingOpportunity = getFragment(
    TrainingOpportunityForm_Fragment,
    query,
  );

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Heading
          level="h2"
          color="secondary"
          icon={IdentificationIcon}
          data-h2-margin="base(0, 0, x1.5, 0)"
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage({
            defaultMessage: "Training opportunity information",
            id: "bwoJyk",
            description: "Heading for the opportunity form information section",
          })}
        </Heading>
      </div>
      <Card>
        <div
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) "
          data-h2-gap="base(x1)"
        >
          <FieldDisplay label={intl.formatMessage(formLabels.titleEn)}>
            {trainingOpportunity.title?.en}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.titleFr)}>
            {trainingOpportunity.title?.fr}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.courseLanguage)}>
            <Chip color="primary">
              {getLocalizedName(
                trainingOpportunity.courseLanguage?.label,
                intl,
              )}
            </Chip>
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.format)}>
            {getLocalizedName(trainingOpportunity.courseFormat?.label, intl)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(formLabels.applicationDeadline)}
          >
            {trainingOpportunity.registrationDeadline}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.pinned)}>
            {trainingOpportunity.pinned
              ? intl.formatMessage({
                  defaultMessage: "Pinned to top of training opportunities",
                  id: "Shp2Bo",
                  description:
                    "Message displayed indicating a training opportunity is pinned to the top of the list",
                })
              : intl.formatMessage({
                  defaultMessage: "Not pinned to top of training opportunities",
                  id: "nvPSBj",
                  description:
                    "Message displayed indicating a training opportunity is not pinned to the top of the list",
                })}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(formLabels.trainingStartDate)}
          >
            {trainingOpportunity.trainingStart}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.trainingEndDate)}>
            {trainingOpportunity.trainingEnd ??
              intl.formatMessage(adminMessages.noneProvided)}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.descriptionEn)}>
            {trainingOpportunity.description?.en ? (
              <RichTextRenderer
                node={htmlToRichTextJSON(trainingOpportunity.description.en)}
              />
            ) : (
              intl.formatMessage(adminMessages.noneProvided)
            )}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.descriptionFr)}>
            {trainingOpportunity.description?.fr ? (
              <RichTextRenderer
                node={htmlToRichTextJSON(trainingOpportunity.description.fr)}
              />
            ) : (
              intl.formatMessage(adminMessages.noneProvided)
            )}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.applicationUrlEn)}>
            {trainingOpportunity.applicationUrl?.en}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(formLabels.applicationUrlFr)}>
            {trainingOpportunity.applicationUrl?.fr}
          </FieldDisplay>
        </div>
        <CardSeparator />
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
        >
          <Link
            href={paths.trainingOpportunityUpdate(trainingOpportunityId)}
            data-h2-font-weight="base(bold)"
          >
            {intl.formatMessage({
              defaultMessage: "Edit training opportunity information",
              id: "EInfnR",
              description:
                "Link to edit the currently viewed training opportunity",
            })}
          </Link>
        </div>
      </Card>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  trainingOpportunityId: Scalars["ID"]["output"];
}

interface ViewTrainingOpportunityPageProps {
  trainingOpportunity: NonNullable<
    ViewTrainingOpportunityPageQuery["trainingOpportunity"]
  >;
}

const ViewTrainingOpportunityPage = ({
  trainingOpportunity,
}: ViewTrainingOpportunityPageProps) => {
  const intl = useIntl();
  const routes = useRoutes();
  const { trainingOpportunityId } = useRequiredParams<RouteParams>(
    "trainingOpportunityId",
  );
  const trainingOpportunityName = getLocalizedName(
    trainingOpportunity.title,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.trainingOpportunities),
        url: routes.trainingOpportunitiesIndex(),
      },
      {
        label: trainingOpportunityName,
        url: routes.trainingOpportunityView(trainingOpportunityId),
      },
    ],
  });

  const navTabs = [
    {
      url: routes.trainingOpportunityView(trainingOpportunityId),
      label: intl.formatMessage({
        defaultMessage: "Training opportunity information",
        id: "bwoJyk",
        description: "Heading for the opportunity form information section",
      }),
    },
  ];

  return (
    <>
      <SEO title={trainingOpportunityName} />
      <Hero
        title={trainingOpportunityName}
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
          <ViewTrainingOpportunityForm query={trainingOpportunity} />
        </div>
      </div>
    </>
  );
};

const ViewTrainingOpportunityPage_Query = graphql(/* GraphQL */ `
  query ViewTrainingOpportunityPage($id: UUID!) {
    trainingOpportunity(id: $id) {
      title {
        en
        fr
      }
      ...TrainingOpportunityView
    }
  }
`);

// Since the SEO and Hero need API-loaded data, we wrap the entire page in a Pending
const ViewTrainingOpportunityPageApiWrapper = () => {
  const intl = useIntl();
  const { trainingOpportunityId } = useRequiredParams<RouteParams>(
    "trainingOpportunityId",
  );
  const [{ data, fetching, error }] = useQuery({
    query: ViewTrainingOpportunityPage_Query,
    variables: { id: trainingOpportunityId },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.trainingOpportunity ? (
        <ViewTrainingOpportunityPage
          trainingOpportunity={data.trainingOpportunity}
        />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Opportunity {trainingOpportunityId} not found.",
                id: "QAo1Vy",
                description:
                  "Message displayed for training opportunity not found.",
              },
              { trainingOpportunityId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewTrainingOpportunityPageApiWrapper />
  </RequireAuth>
);

Component.displayName = "AdminViewTrainingOpportunityPage";

export default ViewTrainingOpportunityPage;
