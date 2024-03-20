import React from "react";
import { defineMessage, useIntl } from "react-intl";

import { Heading, Link, Well } from "@gc-digital-talent/ui";

import SEO from "~/components/SEO/SEO";
import useRoutes from "~/hooks/useRoutes";
import Hero from "~/components/Hero";
import { INITIAL_STATE } from "~/components/Table/ResponsiveTable/constants";
import adminMessages from "~/messages/adminMessages";
import skillBrowserMessages from "~/components/SkillBrowser/messages";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";

import SkillTableApi from "./components/SkillTable";

const suggestionLink = (chunks: React.ReactNode, href: string) => (
  <Link href={href} state={{ referrer: window.location.href }}>
    {chunks}
  </Link>
);

export const pageTitle = defineMessage(adminMessages.skills);
export const pageSubtitle = defineMessage({
  defaultMessage: "Explore all the skills on our site.",
  id: "eTOg2E",
  description: "Subtitle for explore skills page",
});

export const SkillPage = () => {
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
      <section
        data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
        data-h2-margin="base(x3)"
      >
        <SkillTableApi
          title={formattedPageTitle}
          paginationState={{ ...INITIAL_STATE.paginationState, pageSize: 20 }}
        />
        <Well id="cant-find-a-skill" data-h2-margin-top="base(x3)">
          <Heading
            level="h2"
            size="h6"
            data-h2-font-weight="base(bold)"
            data-h2-margin-top="base(0)"
            data-h2-margin-bottom="base(x1)"
          >
            {intl.formatMessage(skillBrowserMessages.showSkillInfo)}
          </Heading>
          <p data-h2-margin-bottom="base(x.5)">
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
                a: (chunks: React.ReactNode) =>
                  suggestionLink(chunks, routes.support()),
              },
            )}
          </p>
        </Well>
      </section>
    </>
  );
};

export default SkillPage;
