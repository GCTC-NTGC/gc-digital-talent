import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  NotFound,
  Heading,
  Link,
  CardBasic,
  CardSeparator,
} from "@gc-digital-talent/ui";
import { Scalars } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import FieldDisplay from "~/components/ToggleForm/FieldDisplay";

import formLabels from "./formLabels";

// export const DepartmentView_Fragment = graphql(/* GraphQL */ `
//   fragment DepartmentForm on Department {
//     id
//     departmentNumber
//     name {
//       en
//       fr
//     }
//   }
// `);

interface ViewTrainingEventFormProps {
  // query: FragmentType<typeof DepartmentView_Fragment>;
}

export const ViewTrainingEventForm =
  (/*{ query }: ViewTrainingEventFormProps*/) => {
    const intl = useIntl();
    const paths = useRoutes();
    const { trainingEventId } =
      useRequiredParams<RouteParams>("trainingEventId");
    // const department = getFragment(DepartmentView_Fragment, query);

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
              {/* {department.name.en} */}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(formLabels.titleFr)}>
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(formLabels.courseLanguage)}>
              {/* {department.name.en} */}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(formLabels.format)}>
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(formLabels.registrationDeadline)}
            >
              {/* {department.name.fr} */}
            </FieldDisplay>
            <div data-h2-display="base(none) p-tablet(inherit)">
              {/* intentionally left blank */}
            </div>
            <FieldDisplay
              label={intl.formatMessage(formLabels.trainingStartDate)}
            >
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(formLabels.trainingEndDate)}
            >
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(formLabels.descriptionEn)}>
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(formLabels.descriptionFr)}>
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(formLabels.applicationUrlEn)}
            >
              {/* {department.name.fr} */}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(formLabels.applicationUrlFr)}
            >
              {/* {department.name.fr} */}
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

// const Department_Query = graphql(/* GraphQL */ `
//   query ViewDepartmentPage($id: UUID!) {
//     department(id: $id) {
//       name {
//         en
//         fr
//       }
//       ...DepartmentForm
//     }
//   }
// `);

const ViewTrainingEventPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { trainingEventId } = useRequiredParams<RouteParams>("trainingEventId");
  // const [{ data: departmentData, fetching, error }] = useQuery({
  //   query: Department_Query,
  //   variables: { id: departmentId },
  // });

  const trainingEventName = "TODO";
  // const trainingEventName = getLocalizedName(
  //   departmentData?.department?.name,
  //   intl,
  // );

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
          /* fetching ? intl.formatMessage(commonMessages.loading) :*/ trainingEventName
        }
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
          {/* <Pending fetching={fetching} error={error}> */}
          {true /*departmentData?.department*/ ? (
            <ViewTrainingEventForm
            // query={departmentData?.department}
            />
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
          {/* </Pending> */}
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
