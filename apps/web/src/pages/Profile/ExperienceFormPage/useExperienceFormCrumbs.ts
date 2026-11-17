import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { graphql } from "@gc-digital-talent/graphql";
import { navigationMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import { poolTitle } from "~/utils/poolUtils";
import { CAREER_TIMELINE_STEP_ORDINAL } from "~/utils/applicationUtils";
import poolCandidateMessages from "~/messages/poolCandidateMessages";

const ExperienceFormApplication_Query = graphql(/* GraphQL */ `
  query ExperienceFormApplication($id: UUID!) {
    poolCandidate(id: $id) {
      id
      pool {
        id
        name {
          en
          fr
        }
        workStream {
          name {
            en
            fr
          }
        }
        classification {
          groupAndLevel
        }
      }
    }
  }
`);

interface UseExperienceFormCrumbsArgs {
  applicationId?: string;
  edit?: boolean;
  title: string;
  currentUrl: string;
}

/**
 * Breadcrumbs for the experience form pages.
 *
 * When opened from an application, they match the application's own
 * career timeline add/edit pages (job, step number, add/edit experience).
 */
const useExperienceFormCrumbs = ({
  applicationId,
  edit,
  title,
  currentUrl,
}: UseExperienceFormCrumbsArgs) => {
  const intl = useIntl();
  const paths = useRoutes();

  const [{ data }] = useQuery({
    query: ExperienceFormApplication_Query,
    variables: { id: applicationId ?? "" },
    pause: !applicationId,
  });
  const pool = data?.poolCandidate?.pool;

  let crumbs = [
    {
      label: intl.formatMessage(navigationMessages.applicantDashboard),
      url: paths.applicantDashboard(),
    },
    {
      label: intl.formatMessage(navigationMessages.careerTimeline),
      url: paths.careerTimeline(),
    },
    { label: title, url: currentUrl },
  ];

  if (applicationId && pool) {
    crumbs = [
      {
        label: intl.formatMessage(navigationMessages.browseJobs),
        url: paths.jobs(),
      },
      {
        label: poolTitle(intl, pool).label,
        url: paths.jobPoster(pool.id),
      },
      {
        label: intl.formatMessage(poolCandidateMessages.assessmentStepNumber, {
          stepNumber: CAREER_TIMELINE_STEP_ORDINAL,
        }),
        url: paths.applicationCareerTimeline(applicationId),
      },
      {
        label: edit
          ? intl.formatMessage({
              defaultMessage: "Edit experience",
              id: "zsUuN9",
              description: "Title for edit experience page",
            })
          : intl.formatMessage({
              defaultMessage: "Add experience",
              id: "g1WB3B",
              description: "Title for add experience page",
            }),
        url: currentUrl,
      },
    ];
  }

  return useBreadcrumbs({ crumbs });
};

export default useExperienceFormCrumbs;
