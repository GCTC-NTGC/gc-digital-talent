import { useIntl } from "react-intl";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";
import { useOutletContext } from "react-router";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Heading,
  Link,
  Card,
  CardSeparator,
  Ul,
  Container,
} from "@gc-digital-talent/ui";
import { FragmentType, getFragment, graphql } from "@gc-digital-talent/graphql";
import { NotFoundError } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import BoolCheckIcon from "~/components/BoolCheckIcon/BoolCheckIcon";
import { graphqlClientContext, intlContext } from "~/routing/context";

import labels from "./labels";
import { ContextType } from "./ManageAccessPage/components/types";
import messages from "./messages";
import { checkPlatformAdminOrDepartmentRolesWithTeams } from "./roleChecks";
import type { Route } from "./+types/ViewDepartmentPage";

export const DepartmentView_Fragment = graphql(/* GraphQL */ `
  fragment DepartmentView on Department {
    id
    departmentNumber
    name {
      en
      fr
    }
    orgIdentifier
    size {
      value
      label {
        localized
      }
    }
    isCorePublicAdministration
    isCentralAgency
    isScience
    isRegulatory
  }
`);

interface ViewDepartmentProps {
  query: FragmentType<typeof DepartmentView_Fragment>;
}

export const ViewDepartmentForm = ({ query }: ViewDepartmentProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const department = getFragment(DepartmentView_Fragment, query);
  const notProvided = intl.formatMessage(commonMessages.notProvided);

  return (
    <>
      <Heading
        level="h2"
        color="secondary"
        icon={IdentificationIcon}
        className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
      >
        {intl.formatMessage({
          defaultMessage: "Department information",
          id: "eNTKLK",
          description: "Heading for the 'create a department' form",
        })}
      </Heading>
      <Card>
        <div className="grid gap-6 xs:grid-cols-2">
          <FieldDisplay
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"en"}
          >
            {department.name.en}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"fr"}
          >
            {department.name.fr}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.departmentNumber)}>
            {department.departmentNumber}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.orgIdentifier)}>
            {department.orgIdentifier ?? notProvided}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.departmentType)}>
            <Ul unStyled space="md">
              <li>
                <BoolCheckIcon value={department.isCorePublicAdministration}>
                  {intl.formatMessage(labels.corePublicAdmin)}
                </BoolCheckIcon>
              </li>
              <li>
                <BoolCheckIcon value={department.isCentralAgency}>
                  {intl.formatMessage(labels.centralAgency)}
                </BoolCheckIcon>
              </li>
              <li>
                <BoolCheckIcon value={department.isScience}>
                  {intl.formatMessage(labels.science)}
                </BoolCheckIcon>
              </li>
              <li>
                <BoolCheckIcon value={department.isRegulatory}>
                  {intl.formatMessage(labels.regulatory)}
                </BoolCheckIcon>
              </li>
            </Ul>
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(labels.departmentSize)}>
            {department.size?.label.localized ?? notProvided}
          </FieldDisplay>
        </div>
        <CardSeparator />
        <div className="flex justify-center xs:justify-start">
          <Link
            href={paths.departmentUpdate(department.id)}
            className="font-bold"
          >
            {intl.formatMessage({
              defaultMessage: "Edit department information",
              id: "os2TYf",
              description: "Link to edit the currently viewed department",
            })}
          </Link>
        </div>
      </Card>
    </>
  );
};

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  checkPlatformAdminOrDepartmentRolesWithTeams,
];

const Department_Query = graphql(/* GraphQL */ `
  query ViewDepartmentPage($id: UUID!) {
    department(id: $id) {
      name {
        en
        fr
      }
      ...DepartmentView
    }
  }
`);

export async function clientLoader({
  context,
  params,
}: Route.ClientLoaderArgs) {
  const intl = context.get(intlContext);
  const client = context.get(graphqlClientContext);
  const res = await client
    .query(Department_Query, {
      id: params.departmentId,
    })
    .toPromise();

  if (!res.data?.department) {
    throw new NotFoundError(
      intl.formatMessage(messages.departmentNotFound, {
        departmentId: params.departmentId,
      }),
    );
  }

  return {
    department: res.data?.department,
  };
}

const Component = ({ loaderData: { department } }: Route.ComponentProps) => {
  const {
    departmentName,
    navigationCrumbs: baseCrumbs,
    navTabs,
  } = useOutletContext<ContextType>();

  const crumbs = [...(baseCrumbs ?? [])];

  return (
    <>
      <SEO title={departmentName} />
      <Hero title={departmentName} crumbs={crumbs} navTabs={navTabs} />
      <Container className="my-18">
        <ViewDepartmentForm query={department} />
      </Container>
    </>
  );
};

Component.displayName = "AdminViewDepartmentPage";

export default Component;
