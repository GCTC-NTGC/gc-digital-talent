import { useIntl } from "react-intl";
import { useQuery } from "urql";

import { ROLE_NAME } from "@gc-digital-talent/auth";
import { graphql } from "@gc-digital-talent/graphql";
import { unpackMaybes } from "@gc-digital-talent/helpers";
import { Pending } from "@gc-digital-talent/ui";

import AdminContentWrapper from "~/components/AdminContentWrapper/AdminContentWrapper";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import SEO from "~/components/SEO/SEO";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";
import pageTitles from "~/messages/pageTitles";

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
