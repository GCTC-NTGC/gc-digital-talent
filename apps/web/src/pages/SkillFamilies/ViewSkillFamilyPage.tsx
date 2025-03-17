import { useIntl } from "react-intl";
import { useQuery } from "urql";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { commonMessages, getLocalizedName } from "@gc-digital-talent/i18n";
import {
  Pending,
  NotFound,
  Heading,
  CardBasic,
  Chips,
  Chip,
  Link,
  CardSeparator,
} from "@gc-digital-talent/ui";
import {
  Scalars,
  graphql,
  FragmentType,
  getFragment,
} from "@gc-digital-talent/graphql";
import { ROLE_NAME } from "@gc-digital-talent/auth";

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
    ? skillObjectsLocalized.sort((a, b) => {
        const aName = a.name;
        const bName = b.name;
        return aName.localeCompare(bName);
      })
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
      <div
        data-h2-margin="base(x3 0)"
        data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)"
      >
        <div
          data-h2-display="base(flex)"
          data-h2-justify-content="base(center) p-tablet(flex-start)"
        >
          <Heading
            Icon={IdentificationIcon}
            level="h2"
            color="primary"
            data-h2-margin-top="base(0)"
          >
            {subTitle}
          </Heading>
        </div>
        <CardBasic>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="p-tablet(1fr 1fr)"
            data-h2-gap="base(x1)"
          >
            <FieldDisplay label={intl.formatMessage(adminMessages.nameEn)}>
              {skillFamily.name?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay label={intl.formatMessage(adminMessages.nameFr)}>
              {skillFamily.name?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(adminMessages.descriptionEn)}
            >
              {skillFamily.description?.en ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <FieldDisplay
              label={intl.formatMessage(adminMessages.descriptionFr)}
            >
              {skillFamily.description?.fr ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
            <div data-h2-grid-column="p-tablet(1 / 3)">
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
            <FieldDisplay label={intl.formatMessage(adminMessages.key)}>
              {skillFamily.key ??
                intl.formatMessage(commonMessages.notProvided)}
            </FieldDisplay>
          </div>
          <CardSeparator />
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(center) p-tablet(flex-start)"
            data-h2-text-align="base(center) p-tablet(left)"
          >
            <Link
              color="secondary"
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
        </CardBasic>
      </div>
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

export default ViewSkillFamilyPage;
