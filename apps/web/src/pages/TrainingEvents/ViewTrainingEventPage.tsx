import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useQuery } from "urql";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  NotFound,
  Heading,
  Link,
  CardBasic,
  CardSeparator,
  Pending,
  Chip,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  getFragment,
  graphql,
  Scalars,
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
import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
import adminMessages from "~/messages/adminMessages";

import formLabels from "./formLabels";
import { TrainingEventForm_Fragment } from "./apiUtils";

interface ViewTrainingEventFormProps {
  query: FragmentType<typeof TrainingEventForm_Fragment>;
}

export const ViewTrainingEventForm = ({
  query,
}: ViewTrainingEventFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  const trainingOpportunity = getFragment(TrainingEventForm_Fragment, query);

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Heading
          level="h2"
          color="primary"
          Icon={IdentificationIcon}
          data-h2-margin="base(0, 0, x1.5, 0)"
          data-h2-font-weight="base(400)"
        >
          {intl.formatMessage({
            defaultMessage: "Event information",
            id: "8ZTHFe",
            description: "Heading for the event form information section",
          })}
        </Heading>
      </div>
      <CardBasic>
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
            label={intl.formatMessage(formLabels.registrationDeadline)}
          >
            {trainingOpportunity.registrationDeadline}
          </FieldDisplay>
          <div data-h2-display="base(none) p-tablet(inherit)">
            {/* intentionally left blank */}
          </div>
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
            href={paths.trainingEventUpdate(trainingEventId)}
            data-h2-font-weight="base(bold)"
          >
            {intl.formatMessage({
              defaultMessage: "Edit event information",
              id: "i83KtN",
              description: "Link to edit the currently viewed training event",
            })}
          </Link>
        </div>
      </CardBasic>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  trainingEventId: Scalars["ID"]["output"];
}

const ViewTrainingEventPage_Query = graphql(/* GraphQL */ `
  query ViewTrainingEventPage($id: UUID!) {
    trainingOpportunity(id: $id) {
      title {
        en
        fr
      }
      ...TrainingEventView
    }
  }
`);

const ViewTrainingEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewTrainingEventPage_Query,
    variables: { id: trainingEventId },
  });

  const trainingEventName = getLocalizedName(
    data?.trainingOpportunity?.title,
    intl,
  );

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.trainingEvents),
        url: routes.trainingEventsIndex(),
      },
      {
        label: trainingEventName,
        url: routes.trainingEventView(trainingEventId),
      },
    ],
  });

  const navTabs = [
    {
      url: routes.trainingEventView(trainingEventId),
      label: intl.formatMessage({
        defaultMessage: "Event information",
        id: "8ZTHFe",
        description: "Heading for the event form information section",
      }),
    },
  ];

  return (
    <>
      <SEO title={trainingEventName} />
      <Hero
        title={
          fetching
            ? intl.formatMessage(commonMessages.loading)
            : trainingEventName
        }
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
          <Pending fetching={fetching} error={error}>
            {data?.trainingOpportunity ? (
              <ViewTrainingEventForm query={data.trainingOpportunity} />
            ) : (
              <NotFound
                headingMessage={intl.formatMessage(commonMessages.notFound)}
              >
                <p>
                  {intl.formatMessage(
                    {
                      defaultMessage: "Event {trainingEventId} not found.",
                      id: "z1otyE",
                      description:
                        "Message displayed for training event not found.",
                    },
                    { trainingEventId },
                  )}
                </p>
              </NotFound>
            )}
          </Pending>
        </div>
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewTrainingEventPage />
  </RequireAuth>
);

Component.displayName = "AdminViewTrainingEventPage";

export default ViewTrainingEventPage;
