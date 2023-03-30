import React from "react";
import { useIntl } from "react-intl";
import {
  MapIcon,
  ChartPieIcon,
  NewspaperIcon,
  MagnifyingGlassCircleIcon,
} from "@heroicons/react/24/outline";

import {
  Heading,
  ExternalLink,
  Accordion,
  CardFlat,
} from "@gc-digital-talent/ui";
import { useLocale } from "@gc-digital-talent/i18n";

import Hero from "~/components/Hero";
import CallToActionLink from "~/components/CallToAction/CallToActionLink";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import useRoutes from "~/hooks/useRoutes";

const DirectivePage = () => {
  const intl = useIntl();
  const locale = useLocale();
  const paths = useRoutes();

  const pageTitle = intl.formatMessage({
    defaultMessage: "Directive on Digital Talent",
    id: "xXwUGs",
    description: "Title for the digital talent directive page",
  });

  const crumbs = useBreadcrumbs([
    {
      label: pageTitle,
      url: paths.directive(),
    },
  ]);

  const readDirectiveMessage = intl.formatMessage({
    defaultMessage: "Read the directive",
    id: "cKAuyx",
    description: "Link text to read the entire directive.",
  });

  return (
    <>
      <Hero
        title={pageTitle}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Learn more about how the Government of Canada is strengthening the talent base of the GC digital community.",
          id: "c/u1K+",
          description: "Subtitle for the digital talent directive page",
        })}
        crumbs={crumbs}
        linkSlot={
          <>
            <CallToActionLink href="#" color="quaternary" Icon={NewspaperIcon}>
              {readDirectiveMessage}
            </CallToActionLink>
            <CallToActionLink
              href="#"
              color="secondary"
              Icon={MagnifyingGlassCircleIcon}
            >
              {intl.formatMessage({
                defaultMessage: "Find talent",
                id: "NKr2Rg",
                description: "Link text for find talent (search) page",
              })}
            </CallToActionLink>
          </>
        }
      />
      <div data-h2-padding="base(x3, 0)">
        <div
          data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
          data-h2-margin="base:children[p:not(:first-child), ul](x1, 0, 0, 0)"
        >
          <Heading Icon={MapIcon} size="h3" color="red">
            {intl.formatMessage({
              defaultMessage: "What is the Directive on Digital Talent?",
              id: "GdOQeo",
              description: "Heading for section describing the directive",
            })}
          </Heading>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The Directive on Digital Talent was introduced on April 1, 2023, under the authorities in the Policy on Service and Digital. It focuses on data collection, planning, and interdepartmental coordination in an effort to improve talent sourcing and talent management outcomes across the GC digital community.",
              id: "zccwvF",
              description:
                "First paragraph describing the directive on digital talent",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Under the new directive, departments are required to submit additional information to the Office of the Chief Information Officer of Canada. This data is then used to create business intelligence and accelerated recruitment processes that serve departments and agencies across the GC. The goal is to ensure that the GC digital community has access to the talent it needs to deliver modern, effective digital services to Canadians.",
              id: "WieVH/",
              description:
                "Second paragraph describing the directive on digital talent",
            })}
          </p>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "Want to coordinate a presentation for your department? Contact us.",
              id: "hwEVqS",
              description:
                "Third paragraph describing the directive on digital talent",
            })}
          </p>
          <p>
            <ExternalLink type="button" color="primary" mode="solid" href="#">
              {readDirectiveMessage}
            </ExternalLink>
          </p>
          <Heading Icon={ChartPieIcon} size="h3" color="blue">
            {intl.formatMessage({
              defaultMessage: "Key components of the directive",
              id: "uxIN3Z",
              description:
                "Heading for section describing the different components of the directive",
            })}
          </Heading>
          <div data-h2-margin="base(x2, 0)">
            <Accordion.Root type="multiple">
              <Accordion.Item value="planning-reporting">
                <Accordion.Trigger headerAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Planning and reporting",
                    id: "cktAfD",
                    description:
                      "Heading for the directives planning and reporting component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage:
                        "The Directive on Digital Talent introduces new requirements for departments to inform the Office of the Chief Information Officer about current and planned digital talent needs. This data collection is aggregated and cross-referenced with other data sources. It is then used to provide government-wide and department-specific business intelligence, and to improve targeted recruitment and training.",
                      id: "1pbvy+",
                      description:
                        "The directives planning and reporting component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-talent-sourcing">
                <Accordion.Trigger headerAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital talent sourcing",
                    id: "C03OK7",
                    description:
                      "Heading for the directives digital talent and sourcing component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "...",
                      id: "Oz/LcD",
                      description:
                        "The directives digital talent and sourcing component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-talent-development">
                <Accordion.Trigger headerAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital talent development",
                    id: "mpa5Fd",
                    description:
                      "Heading for the directives digital talent and development component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "...",
                      id: "nPAtt1",
                      description:
                        "The directives digital talent and development component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="digital-executive-roles-structures">
                <Accordion.Trigger headerAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Digital executive roles and structures",
                    id: "e/nr9L",
                    description:
                      "Heading for the directives digital executive roles and structures component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "...",
                      id: "pgKS6I",
                      description:
                        "The directives digital executive roles and structures component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="enabling-conditions">
                <Accordion.Trigger headerAs="h3">
                  {intl.formatMessage({
                    defaultMessage: "Enabling conditions",
                    id: "8yB2Bm",
                    description:
                      "Heading for the directives digital enabling conditions component",
                  })}
                </Accordion.Trigger>
                <Accordion.Content>
                  <p>
                    {intl.formatMessage({
                      defaultMessage: "...",
                      id: "/QN/i6",
                      description:
                        "The directives digital enabling conditions component",
                    })}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            </Accordion.Root>
          </div>
          <Heading Icon={ChartPieIcon} size="h3" color="purple">
            {intl.formatMessage({
              defaultMessage: "Complete your mandatory forms",
              id: "XVWN/C",
              description:
                "Heading for section for the downloadable forms section",
            })}
          </Heading>
          <div
            data-h2-display="base(grid)"
            data-h2-grid-template-columns="base(1fr) p-tablet(repeat(2, minmax(0, 1fr))) l-tablet(repeat(3, minmax(0, 1fr)))"
            data-h2-gap="base(x2) p-tablet(x3)"
            data-h2-margin="base(x1, 0, 0, 0) p-tablet(x2, 0, 0, 0)"
          >
            <CardFlat
              color="yellow"
              title={intl.formatMessage({
                defaultMessage: "Department-specific Recruitment Form",
                id: "Get6gb",
                description:
                  "Heading for the department-specific recruitment form",
              })}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Mandatory reporting. This is now required when you want to run a recruitment for digital talent that will create a pool of candidates. No extra approvals – just let us know what you're planning!",
                  id: "WjyU29",
                  description:
                    "Description for the department-specific recruitment form",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="blue"
              title={intl.formatMessage({
                defaultMessage: "Digital Services Contracting Form",
                id: "QVWGaL",
                description:
                  "Heading for the digital Services contracting form",
              })}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Mandatory reporting. This is now required when you want to run a procurement process for digital talent, especially if you're planning to contract because you're having trouble finding the right talent to hire. No extra approvals – just let us know what you're planning!",
                  id: "oHCw55",
                  description:
                    "Description for the digital Services contracting form",
                })}
              </p>
            </CardFlat>
            <CardFlat
              color="red"
              title={intl.formatMessage({
                defaultMessage: "Forward Talent Plan Form",
                id: "sKAo0/",
                description: "Heading for the forward talent plan form",
              })}
            >
              <p>
                {intl.formatMessage({
                  defaultMessage:
                    "Mandatory reporting. This is now required when you plan a new or expanded digital initiative that will add 10 or more full-time equivalent positions to your department. We want to help make sure that fully qualified, ready-to-hire talent is there when you need it.",
                  id: "6UMVOJ",
                  description: "Description for the forward talent plan form",
                })}
              </p>
            </CardFlat>
          </div>
        </div>
      </div>
      <div
        data-h2-background-image="base(main-linear)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
    </>
  );
};

export default DirectivePage;
