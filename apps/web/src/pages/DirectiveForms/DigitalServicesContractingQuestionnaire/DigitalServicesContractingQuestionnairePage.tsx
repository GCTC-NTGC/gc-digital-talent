import { defineMessage, useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "urql";

import { Link, Pending, TableOfContents } from "@gc-digital-talent/ui";
import { notEmpty } from "@gc-digital-talent/helpers";
import { BasicForm } from "@gc-digital-talent/forms";
import { getLocale } from "@gc-digital-talent/i18n";
import { toast } from "@gc-digital-talent/toast";
import {
  Department,
  DigitalContractingQuestionnaireInput,
  Skill,
} from "@gc-digital-talent/graphql";

import useRoutes from "~/hooks/useRoutes";
import useBreadcrumbs from "~/hooks/useBreadcrumbs";
import Hero from "~/components/Hero";
import RequireAuth from "~/components/RequireAuth/RequireAuth";
import permissionConstants from "~/constants/permissionConstants";

import { pageTitle as directiveHomePageTitle } from "../../DirectivePage/DirectivePage";
import { getSectionTitle, PAGE_SECTION_ID } from "./navigation";
import InstructionsSection from "./sections/InstructionsSection";
import PreambleSection from "./sections/PreambleSection";
import QuestionnaireSection from "./sections/QuestionnaireSection";
import { convertFormValuesToApiInput, FormValues } from "./formValues";
import useLabels from "./useLabels";
import {
  CreateDigitalContractingQuestionnaire_Mutation,
  DigitalServicesContractingQuestionnairePageData_Query,
} from "./operations";

export const pageTitle = defineMessage({
  defaultMessage: "Digital Services Contracting Questionnaire",
  id: "kUgTNq",
  description:
    "Title for the Digital services contracting questionnaire form page",
});

export interface DigitalServicesContractingQuestionnaireProps {
  departments: Omit<Department, "departmentNumber">[];
  skills: Skill[];
  isSubmitting: boolean;
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: Partial<FormValues>;
}

export const DigitalServicesContractingQuestionnaire = ({
  departments,
  skills,
  isSubmitting,
  onSubmit,
  defaultValues,
}: DigitalServicesContractingQuestionnaireProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const paths = useRoutes();

  const crumbs = useBreadcrumbs({
    crumbs: [
      {
        label: intl.formatMessage(directiveHomePageTitle),
        url: paths.directive(),
      },
      {
        label: intl.formatMessage(pageTitle),
        url: paths.digitalServicesContractingQuestionnaire(),
      },
    ],
  });

  const labels = useLabels();

  return (
    <>
      <Hero
        title={intl.formatMessage(pageTitle)}
        subtitle={intl.formatMessage({
          defaultMessage:
            "A requirement under the Directive on Digital Talent.",
          id: "PB2VIT",
          description:
            "Subtitle for the _digital services contracting questionnaire_ page",
        })}
        crumbs={crumbs}
      />
      <div data-h2-wrapper="base(center, large, x1) p-tablet(center, large, x2)">
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
              </TableOfContents.ListItem>
              <TableOfContents.ListItem>
                <TableOfContents.AnchorLink id={PAGE_SECTION_ID.QUESTIONNAIRE}>
                  {intl.formatMessage(
                    getSectionTitle(PAGE_SECTION_ID.QUESTIONNAIRE),
                  )}
                </TableOfContents.AnchorLink>
              </TableOfContents.ListItem>
            </TableOfContents.List>
            <Link
              mode="solid"
              color="secondary"
              block
              external
              href={
                locale === "fr"
                  ? "/static/documents/Questionnaire_d'octroi_de_contrats_numeriques_FR.docx"
                  : "/static/documents/Digital_Contracting_Questionnaire_EN.docx"
              }
            >
              {intl.formatMessage({
                defaultMessage: "Download a copy of this form",
                id: "R9YL7P",
                description: "Button text to download this form",
              })}
            </Link>
          </TableOfContents.Navigation>
          <TableOfContents.Content data-h2-padding-top="base(x3)">
            <BasicForm
              onSubmit={onSubmit}
              options={{
                defaultValues,
              }}
              labels={labels}
            >
              <InstructionsSection />
              <PreambleSection />
              <QuestionnaireSection
                departments={departments}
                skills={skills}
                isSubmitting={isSubmitting}
              />
            </BasicForm>
          </TableOfContents.Content>
        </TableOfContents.Wrapper>
      </div>
    </>
  );
};

const DigitalServicesContractingQuestionnairePage = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();
  const [
    { data: initialData, fetching: initialFetching, error: initialError },
  ] = useQuery({
    query: DigitalServicesContractingQuestionnairePageData_Query,
  });
  const [{ fetching: isSubmitting }, executeMutation] = useMutation(
    CreateDigitalContractingQuestionnaire_Mutation,
  );

  const toastError = () =>
    toast.error(
      intl.formatMessage({
        defaultMessage: "Failed to save the questionnaire.",
        id: "zCKX6h",
        description:
          "Message displayed to user if account fails to get updated.",
      }),
    );

  const handleCreateQuestionnaire = async (
    questionnaire: DigitalContractingQuestionnaireInput,
  ) => {
    await executeMutation({ questionnaire })
      .then(async (result) => {
        if (result.data?.createDigitalContractingQuestionnaire?.id) {
          toast.success(
            intl.formatMessage({
              defaultMessage: "Questionnaire successfully saved.",
              id: "S2if5C",
              description:
                "Message displayed to user if the questionnaire was saved successfully.",
            }),
          );
          await navigate(paths.directive());
        } else {
          toastError();
        }
      })
      .catch(() => {
        toastError();
      });
  };

  return (
    <Pending fetching={initialFetching} error={initialError}>
      <DigitalServicesContractingQuestionnaire
        departments={initialData?.departments?.filter(notEmpty) ?? []}
        skills={initialData?.skills?.filter(notEmpty) ?? []}
        isSubmitting={isSubmitting}
        onSubmit={(formValues) =>
          handleCreateQuestionnaire(convertFormValuesToApiInput(formValues))
        }
      />
    </Pending>
  );
};

export const Component = () => (
  <RequireAuth roles={permissionConstants().managePlatformData}>
    <DigitalServicesContractingQuestionnairePage />
  </RequireAuth>
);

Component.displayName = "DigitalServicesContractingQuestionnairePage";

export default DigitalServicesContractingQuestionnairePage;
