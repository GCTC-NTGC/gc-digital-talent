import React from "react";
import { defineMessage, useIntl } from "react-intl";

import { SubmitHandler } from "react-hook-form";

import { Link, Pending, TableOfContents } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { BasicForm } from "@gc-digital-talent/forms";
import { useLocale } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import Hero from "~/components/Hero";
import contractingEn from "~/assets/documents/Digital_Contracting_Questionnaire_EN.docx";
import contractingFr from "~/assets/documents/Questionnaire_d'octroi_de_contrats_numeriques_FR.docx";

import { useDigitalServicesContractingQuestionnairePageDataQuery } from "~/api/generated";
import { pageTitle as directiveHomePageTitle } from "../../DirectivePage/DirectivePage";
import { getSectionTitle, PAGE_SECTION_ID } from "./navigation";
import { IdNamePair, FormValues } from "./types";
import ExamplesOfContractsSection from "./sections/ExamplesOfContractsSection";
import InstructionsSection from "./sections/InstructionsSection";
import PreambleSection from "./sections/PreambleSection";
import QuestionnaireSection from "./sections/QuestionnaireSection";

export const pageTitle = defineMessage({
  defaultMessage: "Digital Services Contracting Questionnaire",
  id: "kUgTNq",
  description:
    "Title for the Digital services contracting questionnaire form page",
});

type DigitalServicesContractingQuestionnaireProps = {
  departments: Array<IdNamePair>;
  onSubmit: SubmitHandler<FormValues>;
};

const DigitalServicesContractingQuestionnaire = ({
  departments,
  onSubmit,
}: DigitalServicesContractingQuestionnaireProps) => {
  const intl = useIntl();
  const localeState = useLocale();
  const paths = useRoutes();

  const crumbs = useBreadcrumbs([
    {
      label: intl.formatMessage(directiveHomePageTitle),
      url: paths.directive(),
    },
    {
      label: intl.formatMessage(pageTitle),
      url: paths.digitalServicesContractingQuestionnaire(),
    },
  ]);

  return (
    <>
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage({
          defaultMessage:
            "Complete this form as a part of your role in the Directive on Digital Talent.",
          id: "RNGz7i",
          description:
            "Subtitle for the _digital services contracting questionnaire_ page",
        })}
        crumbs={crumbs}
      />
      <div data-h2-container="base(center, large, x1) p-tablet(center, large, x2)">
        <TableOfContents.Wrapper>
          <TableOfContents.Navigation data-h2-padding-top="base(x3)">
            <TableOfContents.List>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.INSTRUCTIONS}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.INSTRUCTIONS),
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.PREAMBLE}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.PREAMBLE),
                  )}
                </TableOfContents.AnchorLink>
                <TableOfContents.List space="sm">
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.ROLE_OF_THE_CIO}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.ROLE_OF_THE_CIO),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.WHY_COLLECT}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.WHY_COLLECT),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.REQUIREMENTS}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.REQUIREMENTS),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                </TableOfContents.List>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.QUESTIONNAIRE}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE),
                  )}
                </TableOfContents.AnchorLink>
                <TableOfContents.List space="sm">
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.GENERAL_INFORMATION}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.GENERAL_INFORMATION),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.SCOPE_OF_CONTRACT}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.SCOPE_OF_CONTRACT),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.CONTRACT_REQUIREMENTS}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.CONTRACT_REQUIREMENTS),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE}
                    >
                      {intl.formatMessage(
                        getSectionTitle(PAGE_SECTION_ID.TECHNOLOGICAL_CHANGE),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS}
                    >
                      {intl.formatMessage(
                        getSectionTitle(
                          PAGE_SECTION_ID.OPERATIONS_CONSIDERATIONS,
                        ),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                  <TableOfContents.ListItem>
                    <TableOfContents.AnchorLink
                      id={PAGE_SECTION_ID.TALENT_SOURCING_DECISION}
                    >
                      {intl.formatMessage(
                        getSectionTitle(
                          PAGE_SECTION_ID.TALENT_SOURCING_DECISION,
                        ),
                      )}
                    </TableOfContents.AnchorLink>
                  </TableOfContents.ListItem>
                </TableOfContents.List>
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink
                  id={PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS}
                >
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.EXAMPLES_OF_CONTRACTS),
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
            <Link
              mode="solid"
              color="secondary"
              block
              external
              href={localeState.locale === "fr" ? contractingFr : contractingEn}
            >
              {intl.formatMessage({
                defaultMessage: "Download a copy of this form",
                id: "R9YL7P",
                description: "Button text to download this form",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content data-h2-padding-top="base(x3)">
            <BasicForm onSubmit={onSubmit}>
              <InstructionsSection />
              <PreambleSection />
              <QuestionnaireSection departments={departments} />
              <ExamplesOfContractsSection />
            </BasicForm>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const DigitalServicesContractingQuestionnairePage = () => {
  const [{ data, fetching, error }] =
    useDigitalServicesContractingQuestionnairePageDataQuery();
  return (
    <Pending fetching={fetching} error={error}>
      <DigitalServicesContractingQuestionnaire
        departments={data?.departments?.filter(notEmpty) ?? []}
        onSubmit={(values) => {
          console.log(values);
        }}
      />
    </Pending>
  );
};

export default DigitalServicesContractingQuestionnairePage;
