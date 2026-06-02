import type { MessageDescriptor } from "react-intl";
import { useIntl } from "react-intl";
import type { UIMatch } from "react-router";
import { Outlet, useMatches } from "react-router";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { commonMessages } from "@gc-digital-talent/i18n";
import { Container } from "@gc-digital-talent/ui";
import { NotFoundError } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import { requireUser } from "~/routing/auth";
import SEO from "~/components/SEO/SEO";
import Hero from "~/components/Hero";
import adminMessages from "~/messages/adminMessages";
import { graphqlClientContext } from "~/routing/context";
import pageTitles from "~/messages/pageTitles";

import type { Route } from "./+types/DevelopmentProgramLayout";

interface DevelopmentProgramHandle {
  pageTitle?: MessageDescriptor;
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async ({ context, request }, next) => {
    requireUser(context, request, {
      roles: [{ name: ROLE_NAME.PlatformAdmin }],
    });
    return await next();
  },
];

const DevelopmentProgram_Query = graphql(/* GraphQL */ `
  query DevelopmentProgramLayout($id: UUID!) {
    developmentProgram(id: $id) {
      name {
        localized
      }
    }
  }
`);

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const client = context.get(graphqlClientContext);

  const res = await client
    .query(DevelopmentProgram_Query, {
      id: params.developmentProgramId,
    })
    .toPromise();

  if (!res.data?.developmentProgram) {
    throw new NotFoundError();
  }

  return {
    developmentProgram: res.data.developmentProgram,
  };
}

const DevelopmentProgramLayout = ({
  loaderData,
  params,
}: Route.ComponentProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { developmentProgram } = loaderData;
  const matches = useMatches() as UIMatch<unknown, DevelopmentProgramHandle>[];

  const currentPage = matches[matches.length - 1];

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.adminDashboard),
        url: paths.adminDashboard(),
      },
      {
        label: intl.formatMessage(pageTitles.developmentPrograms),
        url: paths.developmentProgramTable(),
      },
      ...(currentPage.handle?.pageTitle
        ? [
            {
              label: intl.formatMessage(currentPage.handle.pageTitle),
              url: currentPage.pathname,
            },
          ]
        : []),
    ],
  });

  const pageTitle = developmentProgram?.name?.localized;
  const description = intl.formatMessage({
    defaultMessage: "View and edit details about this program",
    id: "rdyy/m",
    description: "Description for the applicant profile section",
  });

  return (
    <>
      <SEO
        title={pageTitle ?? intl.formatMessage(commonMessages.notFound)}
        description={description}
      />
      <Hero
        title={pageTitle}
        subtitle={description}
        crumbs={crumbs}
        navTabs={[
          {
            label: intl.formatMessage(adminMessages.details),
            url: paths.developmentProgramView(params.developmentProgramId),
          },
        ]}
      />
      <Container className="my-18">
        <Outlet />
      </Container>
    </>
  );
};

export default DevelopmentProgramLayout;
