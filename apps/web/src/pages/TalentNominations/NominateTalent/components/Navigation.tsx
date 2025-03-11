import { defineMessage, MessageDescriptor, useIntl } from "react-intl";

import { Stepper, StepType } from "@gc-digital-talent/ui";
import { commonMessages } from "@gc-digital-talent/i18n";
import {
  FragmentType,
  getFragment,
  graphql,
  TalentNominationStep,
} from "@gc-digital-talent/graphql";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";
import { unpackMaybes } from "@gc-digital-talent/helpers";

import useRoutes from "~/hooks/useRoutes";
import useRequiredParams from "~/hooks/useRequiredParams";

import useCurrentStep, { stepOrder } from "../useCurrentStep";
import { RouteParams } from "../types";

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

const NominateTalentNavigation_Fragment = graphql(/* GraphQL */ `
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

  let prevSteps: TalentNominationStep[] = [];
  const steps: StepType[] = unpackMaybes(
    stepOrder.map((key) => {
      const label = stepLabels.get(key);
      if (!label) return null;
      const step = {
        label: intl.formatMessage(label),
        href: `${paths.talentNomiation(id)}?step=${key}`,
        completed: talentNomination.submittedSteps?.includes(key),
        disabled:
          prevSteps.length > 0
            ? !includesAll(talentNomination.submittedSteps ?? [], prevSteps)
            : false,
      };
      prevSteps = [...prevSteps, key];
      return step;
    }),
  );

  return (
    <Stepper
      label={intl.formatMessage({
        defaultMessage: "Nomination steps",
        id: "stz9hq",
        description: "Label for the talen nomination stepper navigation",
      })}
      subTitle={
        talentNomination.talentNominationEvent.closeDate ? (
          <p
            data-h2-margin="base(x.5 0)"
            data-h2-color="base(black.light)"
            data-h2-font-size="base(caption)"
          >
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
                formatString: "MMMM d, yyyy",
                intl,
              })}
          </p>
        ) : undefined
      }
      currentIndex={index ?? 0}
      steps={steps}
    />
  );
};

export default Navigation;
