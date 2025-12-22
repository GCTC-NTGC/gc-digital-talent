import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Card,
  Chips,
  Chip,
  Link,
  CardSeparator,
  Container,
} from "@gc-digital-talent/ui";
import {
  Scalars,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import adminMessages from "~/messages/adminMessages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";

import messages from "./messages";

export const ViewSkillFamily_Fragment = graphql(/* GraphQL */ `
  fragment ViewSkillFamily on SkillFamily {
    id
    key
    name {
      en
      fr
    }
    description {
      en
      fr
    }
    skills {
      id
      key
      name {
        en
        fr
      }
    }
  }
`);

interface ViewSkillFamilyProps {
  query: FragmentType<typeof ViewSkillFamily_Fragment>;
}

export const ViewSkillFamily = ({ query }: ViewSkillFamilyProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const skillFamily = getFragment(ViewSkillFamily_Fragment, query);

  const pageTitle = getLocalizedName(skillFamily.name, intl);
  const subTitle = intl.formatMessage(messages.skillFamilyInfo);

  const skillObjectsLocalized: { id: string; name: string }[] | undefined =
    skillFamily.skills?.map((skill) => {
      return { id: skill.id, name: getLocalizedName(skill.name, intl) };
    });
  const skillObjectsLocalizedSorted = skillObjectsLocalized
    ? skillObjectsLocalized.sort(sortAlphaBy((skill) => skill.name))
    : undefined;

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.skillFamilies),
        url: paths.skillFamilyTable(),
      },
      {
        label: pageTitle,
        url: paths.skillFamilyView(skillFamily.id),
      },
    ],
  });

  return (
    <>
      <SEO title={pageTitle} />
      <Hero
        title={pageTitle}
        crumbs={navigationCrumbs}
        navTabs={[
          {
            url: paths.skillFamilyView(skillFamily.id),
            label: subTitle,
          },
        ]}
      />
      <Container className="my-18">
        <div className="flex justify-center xs:justify-start">
          <Heading
            icon={IdentificationIcon}
            level="h2"
            color="secondary"
            className="mt-0"
          >
            {subTitle}
          </Heading>
        </div>
        <Card>
          <div className="grid gap-6 xs:grid-cols-2">
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"en"}
            >
              {skillFamily.name?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.name)}
              appendLanguageToLabel={"fr"}
            >
              {skillFamily.name?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.description)}
              appendLanguageToLabel={"en"}
            >
              {skillFamily.description?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(commonMessages.description)}
              appendLanguageToLabel={"fr"}
            >
              {skillFamily.description?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <div className="xs:col-span-2">
              <FieldDisplay label={intl.formatMessage(messages.skillsInFamily)}>
                {skillObjectsLocalizedSorted &&
                skillObjectsLocalizedSorted.length > 0 ? (
                  <Chips>
                    {skillObjectsLocalizedSorted.map((skillObject) => (
                      <Chip key={skillObject.id}>{skillObject.name}</Chip>
                    ))}
                  </Chips>
                ) : (
                  intl.formatMessage(commonMessages.notProvided)
                )}
              </FieldDisplay>
            </div>
            <div className="xs:col-span-2">
              <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
                {skillFamily.key ??
                  intl.formatMessage(commonMessages.notProvided)}
              </FieldDisplay>
            </div>
          </div>
          <CardSeparator />
          <div className="flex justify-center text-center xs:justify-start xs:text-left">
            <Link
              color="primary"
              mode="inline"
              href={paths.skillFamilyUpdate(skillFamily.id)}
            >
              {intl.formatMessage({
                defaultMessage: "Edit skill family information",
                id: "ifVyI/",
                description: "Link text to edit a skill family",
              })}
            </Link>
          </div>
        </Card>
      </Container>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  skillFamilyId: Scalars["ID"]["output"];
}

const ViewSkillFamily_Query = graphql(/* GraphQL */ `
  query SkillFamily($id: UUID!) {
    skillFamily(id: $id) {
      ...ViewSkillFamily
    }
  }
`);

const ViewSkillFamilyPage = () => {
  const intl = useIntl();
  const { skillFamilyId } = useRequiredParams<RouteParams>("skillFamilyId");
  const [{ data, fetching, error }] = useQuery({
    query: ViewSkillFamily_Query,
    variables: { id: skillFamilyId || "" },
  });

  return (
    <Pending fetching={fetching} error={error}>
      {data?.skillFamily ? (
        <ViewSkillFamily query={data.skillFamily} />
      ) : (
        <NotFound headingMessage={intl.formatMessage(commonMessages.notFound)}>
          <p>
            {intl.formatMessage(
              {
                defaultMessage: "Skill family {skillFamilyId} not found.",
                id: "asjJwj",
                description: "Message displayed for skillFamily not found.",
              },
              { skillFamilyId },
            )}
          </p>
        </NotFound>
      )}
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewSkillFamilyPage />
  </RequireAuth>
);

Component.displayName = "ViewSkillFamilyPage";

export default Component;
