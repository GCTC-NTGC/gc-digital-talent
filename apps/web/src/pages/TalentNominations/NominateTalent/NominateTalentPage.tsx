import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";
import { useEffect } from "react";
import { useLocation, useSearchParams, type Location } from "react-router";

import { Pending, TableOfContents, ThrowNotFound } from "@gc-digital-talent/ui";
import { graphql, TalentNominationStep } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { navigationMessages } from "@gc-digital-talent/i18n";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRequiredParams from "~/hooks/useRequiredParams";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

import { RouteParams } from "./types";
import Nominator from "./components/Nominator";
import Nominee from "./components/Nominee";
import Details from "./components/Details";
import Rationale from "./components/Rationale";
import ReviewAndSubmit from "./components/ReviewAndSubmit";
import Instructions from "./components/Instructions";
import Navigation from "./components/Navigation";
import useCurrentStep, { stepOrder } from "./useCurrentStep";
import Success from "./components/Success";

const tryGetCurrentStep = (
  isSubmitted: boolean,
  current?: TalentNominationStep | null,
  submittedSteps?: TalentNominationStep[] | null,
): TalentNominationStep | null => {
  if (isSubmitted || current) return null;

  let lastSubmittedStep: number | undefined;
  for (const step of stepOrder) {
    if (!submittedSteps?.includes(step)) {
      break;
    }

    // Add one to go to last non-submitted step
    lastSubmittedStep = stepOrder.indexOf(step) + 1;
  }

  if (!lastSubmittedStep) return TalentNominationStep.Instructions;

  if (lastSubmittedStep >= stepOrder.length) {
    lastSubmittedStep = stepOrder.length - 1;
  }

  return stepOrder[lastSubmittedStep];
};

const NominateTalent_Query = graphql(/* GraphQL */ `
  query NominateTalent($id: UUID!) {
    talentNomination(id: $id) {
      id
      submittedAt
      submittedSteps
      talentNominationEvent {
        name {
          localized
        }
      }

      ...NominateTalentNavigation
      ...NominateTalentNominator
      ...NominateTalentNominee
      ...NominateTalentDetails
      ...NominateTalentRationale
      ...NominateTalentReviewAndSubmit
      ...NominateTalentSuccess
    }

    ...NomineeFieldOptions
    ...NominatorFieldOptions
    # klc = Leadership - Executive behaviours
    skills(families: ["klc"]) {
      ...NominateTalentSkill
    }
  }
`);

const subTitle = defineMessage({
  defaultMessage:
    "Nominate talent for advancement, lateral movement, or development programs.",
  id: "4adKE5",
  description: "Subtitle for the form to nominate talent",
});

type TLocation = Location<{ submitting?: boolean }>;

const NominateTalentPage = () => {
  const intl = useIntl();
  const { id } = useRequiredParams<RouteParams>("id");
  const { current } = useCurrentStep();
  const location: TLocation = useLocation() as TLocation;
  const [, setSearchParams] = useSearchParams();
  const paths = useRoutes();
  const [{ data, fetching, error }] = useQuery({
    query: NominateTalent_Query,
    variables: { id },
  });

  const isSubmitted = !!data?.talentNomination?.submittedAt;

  // NOTE: If step is not set and nomination is not submitted, send them to the instructions page
  useEffect(() => {
    if (!fetching) {
      const targetStep = tryGetCurrentStep(
        isSubmitted,
        current,
        data?.talentNomination?.submittedSteps,
      );
      if (targetStep && !location.state?.submitting) {
        setSearchParams(
          (params) => {
            params.set("step", targetStep);
            return params;
          },
          { replace: true },
        );
      } else if (isSubmitted) {
        // Prevent navigating to steps after submission
        setSearchParams(
          (params) => {
            params.delete("step");
            return params;
          },
          { replace: true },
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitted, fetching, current, location.state]);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(navigationMessages.applicantDashboard),
        url: paths.applicantDashboard(),
      },
      {
        label: intl.formatMessage(navigationMessages.talentManagementEvents),
        url: paths.talentManagementEvents(),
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Nominate talent",
          id: "3IwZ47",
          description: "Link text for the form to nominate talent",
        }),
        url: paths.talentNomination(id),
      },
    ],
  });

  const pageTitle = intl.formatMessage(
    {
      defaultMessage: "Nominate talent for {eventName}",
      id: "yKRyJw",
      description: "Page title for the form to nominate talent",
    },
    {
      eventName:
        data?.talentNomination?.talentNominationEvent.name.localized ?? "",
    },
  );

  return (
    <Pending fetching={fetching} error={error}>
      {data?.talentNomination ? (
        <>
          <SEO title={pageTitle} description={intl.formatMessage(subTitle)} />
          <Hero
            title={pageTitle}
            subtitle={intl.formatMessage(subTitle)}
            crumbs={crumbs}
          />
          <div
            data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
            data-h2-margin-top="base(x3)"
          >
            <TableOfContents.Wrapper>
              <TableOfContents.Sidebar>
                <Navigation navigationQuery={data.talentNomination} />
              </TableOfContents.Sidebar>
              <TableOfContents.Content>
                <Instructions />
                <Nominator
                  nominatorQuery={data.talentNomination}
                  optionsQuery={data}
                />
                <Nominee
                  nomineeQuery={data.talentNomination}
                  optionsQuery={data}
                />
                <Details detailsQuery={data.talentNomination} />
                <Rationale
                  rationaleQuery={data.talentNomination}
                  skillsQuery={unpackMaybes(data?.skills)}
                />
                <ReviewAndSubmit reviewAndSubmitQuery={data.talentNomination} />
                <Success successQuery={data.talentNomination} />
              </TableOfContents.Content>
            </TableOfContents.Wrapper>
          </div>
        </>
      ) : (
        <ThrowNotFound />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <NominateTalentPage />
  </RequireAuth>
);

Component.displayName = "NominateTalentLayout";

export default Component;
