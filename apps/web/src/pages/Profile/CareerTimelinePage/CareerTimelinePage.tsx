import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import { defineMessage, useIntl } from "react-intl";
import { useQuery } from "urql";

import { Heading, Pending, ThrowNotFound } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql, type FragmentType } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import type { CareerTimelineSectionExperience_Fragment } from "~/components/CareerTimelineSection/CareerTimelineSection";
import CareerTimelineSection from "~/components/CareerTimelineSection/CareerTimelineSection";
import RequireAuth from "~/components/RequireAuth/RequireAuth";

const pageTitle = defineMessage({
  defaultMessage: "Career timeline",
  id: "TUfJUD",
  description: "Name of Career timeline page",
});

export const handle = {
  pageTitle,
};

export const CareerTimelineExperiences_Query = graphql(/* GraphQL */ `
  query CareerTimelineExperiences {
    me {
      id
      experiences {
        ...CareerTimelineSectionExperience
      }
    }
  }
`);

interface CareerTimelineProps {
  userId: string;
  experiencesQuery: FragmentType<
    typeof CareerTimelineSectionExperience_Fragment
  >[];
}

export const CareerTimeline = ({
  userId,
  experiencesQuery,
}: CareerTimelineProps) => {
  const intl = useIntl();

  return (
    <>
      <Heading
        icon={BookmarkSquareIcon}
        color="error"
        size="h3"
        className="mt-0 mb-6 font-normal"
      >
        {intl.formatMessage({
          defaultMessage: "Manage your career timeline",
          id: "eZYP/W",
          description:
            "Titles for a page section to manage your career timeline",
        })}
      </Heading>
      <p className="mb-6">
        {intl.formatMessage({
          defaultMessage:
            "This section is similar to your traditional resume. This is where you can describe your experiences across work, school, and life. You'll be able to reuse this information on each application you submit on the platform, speeding up the process and ensuring that your information is always up-to-date.",
          id: "0m3FMH",
          description: "Descriptive paragraph for the career timeline page.",
        })}
      </p>
      <div className="mb-18">
        <CareerTimelineSection
          experiencesQuery={experiencesQuery}
          userId={userId}
        />
      </div>
    </>
  );
};

const CareerTimelinePage = () => {
  const intl = useIntl();
  const [{ data, fetching, error }] = useQuery({
    query: CareerTimelineExperiences_Query,
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.me ? (
        <CareerTimeline
          userId={data?.me.id}
          experiencesQuery={unpackMaybes(data?.me.experiences)}
        />
      ) : (
        <ThrowNotFound
          message={intl.formatMessage(profileMessages.userNotFound)}
        />
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.Applicant]}>
    <CareerTimelinePage />
  </RequireAuth>
);

Component.displayName = "CareerTimelinePage";

export default Component;
