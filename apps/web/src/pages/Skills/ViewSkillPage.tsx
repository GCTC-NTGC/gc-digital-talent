import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  Chip,
  Chips,
  CardSeparator,
  Card,
  Container,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";
import { sortAlphaBy } from "@gc-digital-talent/helpers";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import FieldDisplay from "~/components/FieldDisplay/FieldDisplay";
import adminMessages from "~/messages/adminMessages";

export const SkillView_Fragment = graphql(/* GraphQL */ `
  fragment SkillForm on Skill {
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
    keywords {
      en
      fr
    }
    category {
      label {
        en
        fr
      }
    }
    families {
      id
      name {
        en
        fr
      }
    }
  }
`);

interface ViewSkillProps {
  query: FragmentType<typeof SkillView_Fragment>;
}

export const ViewSkillForm = ({ query }: ViewSkillProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const skill = getFragment(SkillView_Fragment, query);

  const skillFamilies = skill.families ?? [];
  const skillFamilyObjectsLocalized: { id: string; name: string }[] =
    skillFamilies.map((skillFamily) => {
      return {
        id: skillFamily.id,
        name: getLocalizedName(skillFamily.name, intl),
      };
    });
  const skillFamilyObjectsLocalizedSorted = skillFamilyObjectsLocalized.sort(
    sortAlphaBy((skillFamily) => skillFamily.name),
  );

  return (
    <>
      <Heading
        level="h2"
        color="secondary"
        icon={IdentificationIcon}
        center
        className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
      >
        {intl.formatMessage({
          defaultMessage: "Skill information",
          id: "08IbRz",
          description: "Heading for the 'view a skill' form",
        })}
      </Heading>
      <Card>
        <div className="grid gap-6 xs:grid-cols-2">
          <FieldDisplay
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"en"}
          >
            {skill.name.en}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.name)}
            appendLanguageToLabel={"fr"}
          >
            {skill.name.fr}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"en"}
          >
            {skill.description?.en}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"fr"}
          >
            {skill.description?.fr}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Keywords",
              id: "IgzSRR",
              description: "Label displayed on the skill form keywords field",
            })}
            appendLanguageToLabel={"en"}
          >
            {skill.keywords?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Keywords",
              id: "IgzSRR",
              description: "Label displayed on the skill form keywords field",
            })}
            appendLanguageToLabel={"fr"}
          >
            {skill.keywords?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <div className="xs:col-span-2">
            <FieldDisplay label={intl.formatMessage(adminMessages.category)}>
              <Chip color="secondary">
                {getLocalizedName(skill.category.label, intl)}
              </Chip>
            </FieldDisplay>
          </div>
          <div className="xs:col-span-2">
            <FieldDisplay
              label={intl.formatMessage(adminMessages.skillFamilies)}
            >
              {skillFamilies.length > 0 ? (
                <Chips>
                  {skillFamilyObjectsLocalizedSorted.map((skillFamily) => (
                    <Chip key={skillFamily.id} color="primary">
                      {skillFamily.name}
                    </Chip>
                  ))}
                </Chips>
              ) : (
                intl.formatMessage(commonMessages.notProvided)
              )}
            </FieldDisplay>
          </div>
          <div className="xs:col-span-2">
            <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
              {skill.key}
            </FieldDisplay>
          </div>
        </div>
        <CardSeparator />
        <div className="self-start">
          <Link href={paths.skillUpdate(skill.id)} className="font-bold">
            {intl.formatMessage({
              defaultMessage: "Edit skill information",
              id: "eJPU4G",
              description: "Link to edit the currently viewed skill",
            })}
          </Link>
        </div>
      </Card>
    </>
  );
};

interface RouteParams extends Record<string, string> {
  skillId: Scalars["ID"]["output"];
}

const Skill_Query = graphql(/* GraphQL */ `
  query ViewSkillPage($id: UUID!) {
    skill(id: $id) {
      name {
        en
        fr
      }
      ...SkillForm
    }
  }
`);

const ViewSkillPage = () => {
  const intl = useIntl();
  const routes = useRoutes();
  const { skillId: skillId } = useRequiredParams<RouteParams>("skillId");
  const [{ data: skillData, fetching, error }] = useQuery({
    query: Skill_Query,
    variables: { id: skillId },
  });

  const skillName = getLocalizedName(skillData?.skill?.name, intl);

  const navigationCrumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(pageTitles.skillsEditor),
        url: routes.skillTable(),
      },
      {
        label: skillName,
        url: routes.skillView(skillId),
      },
    ],
  });

  const navTabs = [
    {
      url: routes.skillView(skillId),
      label: intl.formatMessage({
        defaultMessage: "Skill information",
        id: "/qXiOK",
        description: "Nav tab label for skill information",
      }),
    },
  ];

  return (
    <>
      <SEO title={skillName} />
      <Hero
        title={
          fetching ? intl.formatMessage(commonMessages.loading) : skillName
        }
        crumbs={navigationCrumbs}
        navTabs={navTabs}
      />
      <Container className="my-18">
        <Pending fetching={fetching} error={error}>
          {skillData?.skill ? (
            <ViewSkillForm query={skillData?.skill} />
          ) : (
            <NotFound
              headingMessage={intl.formatMessage(commonMessages.notFound)}
            >
              <p>
                {intl.formatMessage(
                  {
                    defaultMessage: "Skill {skillId} not found.",
                    id: "953EAy",
                    description: "Message displayed for skill not found.",
                  },
                  { skillId: skillId },
                )}
              </p>
            </NotFound>
          )}
        </Pending>
      </Container>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminViewSkillPage";

export default Component;
