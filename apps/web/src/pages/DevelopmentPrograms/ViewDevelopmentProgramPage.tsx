import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  Card,
  CardSeparator,
} from "@gc-digital-talent/ui";
import type { FragmentType } from "@gc-digital-talent/graphql";
import { getFragment, graphql } from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";

export const DevelopmentProgramView_Fragment = graphql(/* GraphQL */ `
  fragment DevelopmentProgramView on DevelopmentProgram {
    id
    name {
      en
      fr
    }
    descriptionForProfile {
      en
      fr
    }
    informationUrl {
      en
      fr
    }
    abbreviation {
      en
      fr
    }
  }
`);

interface ViewDevelopmentProgramProps {
  query: FragmentType<typeof DevelopmentProgramView_Fragment>;
}

export const handle = {
  pageTitle: adminMessages.details,
};

export const ViewDevelopmentProgramForm = ({
  query,
}: ViewDevelopmentProgramProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const developmentProgram = getFragment(
    DevelopmentProgramView_Fragment,
    query,
  );

  return (
    <>
      <Heading
        level="h2"
        color="secondary"
        icon={IdentificationIcon}
        className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
      >
        {intl.formatMessage({
          defaultMessage: "Development program information",
          id: "AxLO/M",
          description: "Heading for the 'create a development program' form",
        })}
      </Heading>
      <Card>
        <div className="grid gap-6 xs:grid-cols-2">
          <FieldDisplay
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"en"}
          >
            {developmentProgram.name?.en}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"fr"}
          >
            {developmentProgram.name?.fr}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Abbreviation",
              id: "QEwqmf",
              description: "Label displayed for abbreviation field",
            })}
            appendLanguageToLabel={"en"}
          >
            {developmentProgram.abbreviation?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Abbreviation",
              id: "QEwqmf",
              description: "Label displayed for abbreviation field",
            })}
            appendLanguageToLabel={"fr"}
          >
            {developmentProgram.abbreviation?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Official website or documentation",
              id: "eK+8dS",
              description: "Label displayed for information URL field",
            })}
            appendLanguageToLabel={"en"}
          >
            {developmentProgram.informationUrl?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Official website or documentation",
              id: "eK+8dS",
              description: "Label displayed for information URL field",
            })}
            appendLanguageToLabel={"fr"}
          >
            {developmentProgram.informationUrl?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"en"}
          >
            {developmentProgram.descriptionForProfile?.en}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"fr"}
          >
            {developmentProgram.descriptionForProfile?.fr}
          </FieldDisplay>
        </div>
        <CardSeparator />
        <div className="flex justify-center xs:justify-start">
          <Link
            href={paths.developmentProgramUpdate(developmentProgram.id)}
            className="font-bold"
          >
            {intl.formatMessage({
              defaultMessage: "Edit development program information",
              id: "j69CvA",
              description:
                "Link to edit the currently viewed development program",
            })}
          </Link>
        </div>
      </Card>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  developmentProgramId: string;
}

const DevelopmentProgram_Query = graphql(/* GraphQL */ `
  query ViewDevelopmentProgramPage($id: UUID!) {
    developmentProgram(id: $id) {
      name {
        en
        fr
      }
      descriptionForProfile {
        en
        fr
      }
      informationUrl {
        en
        fr
      }
      abbreviation {
        en
        fr
      }
      ...DevelopmentProgramView
    }
  }
`);

const ViewDevelopmentProgramPage = () => {
  const intl = useIntl();
  const { developmentProgramId } = useRequiredParams<RouteParams>(
    "developmentProgramId",
  );
  const [{ data: developmentProgramData, fetching, error }] = useQuery({
    query: DevelopmentProgram_Query,
    variables: { id: developmentProgramId },
  });

  return (
    <>
      <Pending fetching={fetching} error={error}>
        {developmentProgramData?.developmentProgram ? (
          <ViewDevelopmentProgramForm
            query={developmentProgramData?.developmentProgram}
          />
        ) : (
          <NotFound
            headingMessage={intl.formatMessage(commonMessages.notFound)}
          >
            <p>
              {intl.formatMessage(
                {
                  defaultMessage:
                    "Development program {developmentProgramId} not found.",
                  id: "gmymLN",
                  description:
                    "Message displayed for development program not found.",
                },
                { developmentProgramId },
              )}
            </p>
          </NotFound>
        )}
      </Pending>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewDevelopmentProgramPage />
  </RequireAuth>
);

Component.displayName = "AdminViewDevelopmentProgramPage";

export default Component;
