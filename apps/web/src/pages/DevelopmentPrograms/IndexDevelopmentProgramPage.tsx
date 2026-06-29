import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { Pending } from "@gc-digital-talent/ui";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { graphql } from "@gc-digital-talent/graphql";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";

import DevelopmentProgramTable from "./components/DevelopmentProgramTable";

const DevelopmentPrograms_Query = graphql(/* GraphQL */ `
  query DevelopmentPrograms {
    developmentPrograms {
      ...DevelopmentProgramTableRow
    }
  }
`);

export const DevelopmentProgramPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const formattedPageTitle = intl.formatMessage(pageTitles.developmentPrograms);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.developmentProgramTable(),
      },
    ],
  });

  const [{ data, fetching, error }] = useQuery({
    query: DevelopmentPrograms_Query,
  });

  return (
    <>
      <SEO title={formattedPageTitle} />
      <Hero title={formattedPageTitle} crumbs={navigationCrumbs} />
      <AdminContentWrapper table>
        <Pending fetching={fetching} error={error} inline>
          <DevelopmentProgramTable
            developmentProgramQuery={unpackMaybes(data?.developmentPrograms)}
            title={formattedPageTitle}
          />
        </Pending>
      </AdminContentWrapper>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <DevelopmentProgramPage />
  </RequireAuth>
);

Component.displayName = "AdminIndexDevelopmentProgramPage";

export default Component;
