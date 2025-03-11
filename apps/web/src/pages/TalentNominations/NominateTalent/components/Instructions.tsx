import RectangleGroupIcon from "@heroicons/react/24/outline/RectangleGroupIcon";
import { useIntl } from "react-intl";
import { FormProvider, useForm } from "react-hook-form";

import { TalentNominationStep } from "@gc-digital-talent/graphql";
import { Heading } from "@gc-digital-talent/ui";

import useMutations from "../useMutations";
import { BaseFormValues } from "../types";
import Actions from "./Actions";
import useCurrentStep from "../useCurrentStep";

const Instructions = () => {
  const intl = useIntl();
  const { current } = useCurrentStep();
  const [fetching, { update }] = useMutations();

  const methods = useForm<BaseFormValues>({
    disabled: fetching,
  });

  if (current !== TalentNominationStep.Instructions) {
    return null;
  }

  const handleSubmit = async (values: BaseFormValues) => {
    await update(
      {
        insertSubmittedStep: TalentNominationStep.Instructions,
      },
      values.intent,
    );
  };

  return (
    <>
      <Heading level="h2" Icon={RectangleGroupIcon}>
        {intl.formatMessage({
          defaultMessage: "Nomination details",
          id: "gD98oQ",
          description: "Heading for details step of a talent nomination",
        })}
      </Heading>
      <p data-h2-margin="base(x1 0)">
        {intl.formatMessage({
          defaultMessage:
            "Now, we'll look at the details of the nomination you'd like to submit.",
          id: "ZWIfBh",
          description: "Subtitle for nomiation details step",
        })}
      </p>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Actions />
        </form>
      </FormProvider>
    </>
  );
};

export default Instructions;
