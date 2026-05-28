import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import { defineMessage, useIntl } from "react-intl";

import { Heading } from "@gc-digital-talent/ui";
import { NotFoundError, unpackMaybes } from "@gc-digital-talent/helpers";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";

import profileMessages from "~/messages/profileMessages";
import { requireUser } from "~/routing/auth";
import { graphqlClientContext, intlContext } from "~/routing/context";
import CareerTimelineSection from "~/components/CareerTimelineSection/CareerTimelineSection";

import type { Route } from "./+types/CareerTimelinePage";

const pageTitle = defineMessage({
  defaultMessage: "Career timeline",
  id: "TUfJUD",
  description: "Name of Career timeline page",
});

export const handle = {
  pageTitle,
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, { roles: [{ name: ROLE_NAME.Applicant }] });
    return await next();
  },
];

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

export async function clientLoader({ context }: Route.ClientLoaderArgs) {
  const intl = context.get(intlContext);
  const client = context.get(graphqlClientContext);

  const res = await client
    .query(CareerTimelineExperiences_Query, {})
    .toPromise();

  if (!res.data?.me) {
    throw new NotFoundError(intl.formatMessage(profileMessages.userNotFound));
  }

  return {
    user: res.data.me,
  };
}

const CareerTimelinePage = ({ loaderData }: Route.ComponentProps) => {
  const intl = useIntl();
  const { user } = loaderData;

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
          experiencesQuery={unpackMaybes(user.experiences)}
          userId={user.id}
        />
      </div>
    </>
  );
};

export default CareerTimelinePage;
