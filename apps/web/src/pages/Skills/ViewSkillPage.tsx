import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  Link,
  CardSectioned,
  Chip,
  Chips,
} from "@gc-digital-talent/ui";
import {
  FragmentType,
  Scalars,
  getFragment,
  graphql,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import pageTitles from "~/messages/pageTitles";
import Hero from "~/components/Hero";
import FieldDisplay from "~/components/ToggleForm/FieldDisplay";
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
  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-justify-content="base(center) p-tablet(flex-start)"
      >
        <Heading
          level="h2"
          color="primary"
          Icon={IdentificationIcon}
          data-h2-margin="base(0, 0, x1.5, 0)"
        >
          {intl.formatMessage({
            defaultMessage: "Skill information",
            id: "08IbRz",
            description: "Heading for the 'view a skill' form",
          })}
        </Heading>
      </div>
      <CardSectioned.Root>
        <CardSectioned.Item
          data-h2-display="base(grid)"
          data-h2-grid-template-columns="p-tablet(repeat(2, 1fr)) "
          data-h2-gap="base(x1)"
        >
          <FieldDisplay label={intl.formatMessage(adminMessages.nameEn)}>
            {skill.name.en}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(adminMessages.nameFr)}>
            {skill.name.fr}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(adminMessages.descriptionEn)}>
            {skill.description?.en}
          </FieldDisplay>
          <FieldDisplay label={intl.formatMessage(adminMessages.descriptionFr)}>
            {skill.description?.fr}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Keywords (English)",
              id: "FiylOa",
              description:
                "Label displayed on the skill form keywords field in English.",
            })}
          >
            {skill.keywords?.en ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <FieldDisplay
            label={intl.formatMessage({
              defaultMessage: "Keywords (French)",
              id: "fOl4Ez",
              description:
                "Label displayed on the skill form keywords field in French.",
            })}
          >
            {skill.keywords?.fr ??
              intl.formatMessage(commonMessages.notProvided)}
          </FieldDisplay>
          <div data-h2-grid-column="p-tablet(span 2)">
            <FieldDisplay label={intl.formatMessage(adminMessages.category)}>
              <Chip color="secondary">
                {getLocalizedName(skill.category.label, intl)}
              </Chip>
            </FieldDisplay>
          </div>
          <div data-h2-grid-column="p-tablet(span 2)">
            <FieldDisplay
              label={intl.formatMessage(adminMessages.skillFamilies)}
            >
              <Chips>
                {skillFamilies.map((family) => (
                  <Chip key={family.id} color="primary">
                    {getLocalizedName(family.name, intl)}
                  </Chip>
                ))}
              </Chips>
            </FieldDisplay>
          </div>
          <div data-h2-grid-column="p-tablet(span 2)">
            <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
              {skill.key}
            </FieldDisplay>
          </div>
        </CardSectioned.Item>

        <CardSectioned.Item
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
        >
          <Link
            href={paths.skillUpdate(skill.id)}
            data-h2-font-weight="base(bold)"
          >
            {intl.formatMessage({
              defaultMessage: "Edit skill information",
              id: "eJPU4G",
              description: "Link to edit the currently viewed skill",
            })}
          </Link>
        </CardSectioned.Item>
      </CardSectioned.Root>
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
    isAdmin: true,
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
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
        <div data-h2-padding="base(x3, 0)">
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
        </div>
      </div>
    </>
  );
};

export const Component = () => (
  <RequireAuth roles={[ROLE_NAME.PlatformAdmin]}>
    <ViewSkillPage />
  </RequireAuth>
);

Component.displayName = "AdminViewSkillPage";

export default ViewSkillPage;
