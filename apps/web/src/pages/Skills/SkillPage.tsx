import { defineMessage, useIntl } from "react-intl";
import { ReactNode } from "react";

import { Alert, Container, Heading, Link, Well } from "@gc-digital-talent/ui";
import { navigationMessages } from "@gc-digital-talent/i18n";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import skillBrowserMessages from "~/components/SkillBrowser/messages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import SkillTable from "./components/SkillTable";

const suggestionLink = (chunks: ReactNode, href: string) => (
  <Link href={href} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

const pageTitle = defineMessage(navigationMessages.skillsLibrary);
const pageSubtitle = defineMessage({
  defaultMessage: "Explore all the skills on our site.",
  id: "eTOg2E",
  description: "Subtitle for explore skills page",
});

export const Component = () => {
  const intl = useIntl();
  const routes = useRoutes();

  const formattedPageTitle = intl.formatMessage(pageTitle);
  const formattedPageSubtitle = intl.formatMessage(pageSubtitle);

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: formattedPageTitle,
        url: routes.skills(),
      },
    ],
  });

  return (
    <>
      <SEO title={formattedPageTitle} description={formattedPageSubtitle} />
      <Hero
        title={formattedPageTitle}
        subtitle={formattedPageSubtitle}
        crumbs={crumbs}
      />
      <Container className="my-18">
        <Alert.Root type="info" dismissible live={false} className="mt-0 mb-12">
          <p>
            {intl.formatMessage({
              defaultMessage:
                "This list of skills is under development. New skills are being added on an ongoing basis.",
              id: "Y1zzqe",
              description: "Message for skills page",
            })}
          </p>
        </Alert.Root>
        <SkillTable
          title={formattedPageTitle}
          paginationState={{ ...INITIAL_STATE.paginationState, pageSize: 20 }}
          csvDownload
          isPublic
        />
        <Well id="cant-find-a-skill" className="mt-18">
          <Heading
            level="h2"
            size="h6"
            id="cant-find-a-skill"
            className="mt-0 mb-6 font-bold"
          >
            {intl.formatMessage(skillBrowserMessages.showSkillInfo)}
          </Heading>
          <p className="mb-3">
            {intl.formatMessage({
              defaultMessage:
                "If you can't find a skill, try broadening your filters or searching for the skill's name using other industry terms.",
              id: "Q0AKK4",
              description:
                "Help text to tell users to change their filters to find a skill",
            })}
          </p>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "If you still can't find a skill, it's possible that it hasn't been added to our library yet! We're always growing our skills list and would love to hear from you. <a>Get in touch with your suggestion</a>.",
                id: "c0SFYY",
                description:
                  "Help text to tell users to change their filters to find a skill",
              },
              {
                a: (chunks: ReactNode) =>
                  suggestionLink(chunks, routes.support()),
              },
            )}
          </p>
        </Well>
      </Container>
    </>
  );
};

Component.displayName = "SkillPage";

export default Component;
