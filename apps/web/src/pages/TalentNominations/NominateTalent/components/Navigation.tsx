import type { MessageDescriptor } from "react-intl";
import { defineMessage, useIntl } from "react-intl";

import type { StepType } from "@gc-digital-talent/ui";
import { Stepper } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import type { FragmentType } from "@gc-digital-talent/graphql";
import {
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import {
  DATE_FORMAT_LOCALIZED,
  formatDate,
  parseDateTimeUtc,
} from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";

import useCurrentStep, { stepOrder } from "../useCurrentStep";
import type { RouteParams } from "../types";

const stepLabels = new Map<TalentNominationStep, MessageDescriptor>([
  [
    TalentNominationStep.Instructions,
    defineMessage({
      defaultMessage: "Instructions",
      id: "bF/Cas",
      description: "Link text for instructions step of a talent nomination",
    }),
  ],
  [
    TalentNominationStep.NominatorInformation,
    defineMessage({
      defaultMessage: "Nominator",
      id: "N5swJ7",
      description: "Link text for nominator step of a talent nomination",
    }),
  ],
  [
    TalentNominationStep.NomineeInformation,
    defineMessage({
      defaultMessage: "Nominee",
      id: "xQXV5W",
      description: "Link text for nominee step of a talent nomination",
    }),
  ],
  [
    TalentNominationStep.NominationDetails,
    defineMessage({
      defaultMessage: "Details",
      id: "rdUAvx",
      description: "Link text for details step of a talent nomination",
    }),
  ],
  [
    TalentNominationStep.Rationale,
    defineMessage({
      defaultMessage: "Rationale",
      id: "IgniT6",
      description: "Link text for rationale step of a talent nomination",
    }),
  ],
  [
    TalentNominationStep.ReviewAndSubmit,
    defineMessage({
      defaultMessage: "Submit",
      id: "ASz5R4",
      description: "Link text for submit step of a talent nomination",
    }),
  ],
]);

const includesAll = (
  arr: TalentNominationStep[],
  values: TalentNominationStep[],
) => values.every((v) => arr.includes(v));

export const NominateTalentNavigation_Fragment = graphql(/* GraphQL */ `
  fragment NominateTalentNavigation on TalentNomination {
    submittedSteps
    talentNominationEvent {
      closeDate
    }
  }
`);

interface NavigationProps {
  navigationQuery: FragmentType<typeof NominateTalentNavigation_Fragment>;
}

const Navigation = ({ navigationQuery }: NavigationProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const { id } = useRequiredParams<RouteParams>("id");
  const { index } = useCurrentStep();
  const talentNomination = getFragment(
    NominateTalentNavigation_Fragment,
    navigationQuery,
  );

  const steps: StepType[] = unpackMaybes(
    stepOrder.map((key, i) => {
      const label = stepLabels.get(key);
      if (!label) return null;

      // Purely derive previous steps based on current index
      const prevSteps = stepOrder.slice(0, i);
      const submittedSteps = talentNomination.submittedSteps ?? [];

      return {
        label: intl.formatMessage(label),
        href: `${paths.talentNomination(id)}?step=${key}`,
        completed: submittedSteps.includes(key),
        disabled:
          prevSteps.length > 0
            ? !includesAll(submittedSteps, prevSteps)
            : false,
      };
    }),
  );

  return (
    <Stepper
      label={intl.formatMessage({
        defaultMessage: "Nomination steps",
        id: "QTm+/n",
        description: "Label for the talent nomination stepper navigation",
      })}
      subTitle={
        talentNomination.talentNominationEvent.closeDate ? (
          <p className="my-3 text-sm text-gray-600 dark:text-gray-200">
            {intl.formatMessage({
              defaultMessage: "Nomination deadline",
              id: "Mt3GfT",
              description: "Label for the deadline of a nomination",
            }) +
              intl.formatMessage(commonMessages.dividingColon) +
              formatDate({
                date: parseDateTimeUtc(
                  talentNomination.talentNominationEvent.closeDate,
                ),
                formatString: DATE_FORMAT_LOCALIZED,
                intl,
              })}
          </p>
        ) : undefined
      }
      currentIndex={index ?? undefined}
      steps={steps}
    />
  );
};

export default Navigation;
