import React from "react";
import { useIntl } from "react-intl";
import { SubmitHandler } from "react-hook-form";

import { Heading, Separator } from "@gc-digital-talent/ui";
import { BasicForm, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages } from "@gc-digital-talent/i18n";

import SelfDeclarationDialog from "~/pages/Home/IAPHomePage/components/Dialog/SelfDeclarationDialog";
import VerificationDialog from "~/pages/Home/IAPHomePage/components/Dialog/VerificationDialog";
import DefinitionDialog from "~/pages/Home/IAPHomePage/components/Dialog/DefinitionDialog";

import CommunitySelection from "./CommunitySelection";
import SignAndContinue from "./SignAndContinue";
import HelpLink from "./HelpLink";

import { getSelfDeclarationLabels } from "./utils";

type FormValues = {
  selfDeclaration?: "yes" | "no";
};

export interface SelfDeclarationFormProps {
  onSubmit: (data: FormValues) => void;
}

const whyLink = (chunks: React.ReactNode) => (
  <SelfDeclarationDialog>{chunks}</SelfDeclarationDialog>
);

const verificationLink = (chunks: React.ReactNode) => (
  <VerificationDialog>{chunks}</VerificationDialog>
);

const definitionLink = (chunks: React.ReactNode) => (
  <DefinitionDialog>{chunks}</DefinitionDialog>
);

const SelfDeclarationForm = ({ onSubmit }: SelfDeclarationFormProps) => {
  const intl = useIntl();
  const labels = getSelfDeclarationLabels(intl);

  const handleSubmit: SubmitHandler<FormValues> = async (formValues) => {
    return onSubmit(formValues);
  };

  return (
    <BasicForm onSubmit={handleSubmit} labels={labels}>
      <div
        data-h2-background-color="base(white)"
        data-h2-radius="base(s)"
        data-h2-shadow="base(s)"
        data-h2-padding="base(x1) p-tablet(x2, x3)"
      >
        <div data-h2-container="base(center, m)">
          <Heading
            level="h2"
            data-h2-font-size="base(h5) p-tablet(h2)"
            data-h2-text-align="base(center)"
            data-h2-margin="base(0, 0, x1, 0)"
          >
            {intl.formatMessage({
              id: "pKACZK",
              defaultMessage: "Indigenous Peoples Self-Declaration Form",
              description: "Title for the indigenous self-declaration form",
            })}
          </Heading>
          <p
            data-h2-text-align="base(center)"
            data-h2-margin="base(x1, 0, x2, 0)"
          >
            {intl.formatMessage({
              defaultMessage:
                "We recognize the importance of Indigenous voices in the federal government. The program was designed in partnership with Indigenous peoples. By completing and signing the Indigenous Peoples Self-Declaration Form, you are helping to protect the space, agreeing that you are a part of the three distinct Indigenous groups in Canada, and are interested in joining the Program!",
              id: "0rL2ds",
              description:
                "Text describing the self-declaration form and its importance",
            })}
          </p>
        </div>
        <RadioGroup
          idPrefix="isIndigenous"
          id="isIndigenous"
          name="isIndigenous"
          legend={labels.isIndigenous}
          trackUnsaved={false}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          items={[
            {
              value: "yes",
              label: intl.formatMessage({
                defaultMessage:
                  '"I affirm that I am First Nations, Inuk (Inuit), or a Métis person"',
                id: "7STO48",
                description:
                  "Text for the option to self-declare as Indigenous",
              }),
            },
            {
              value: "no",
              label: intl.formatMessage({
                defaultMessage:
                  '"I am not a member of an Indigenous group and I would like to see other opportunities available to me"',
                id: "BwEf/S",
                description:
                  "Text for the option to self-declare as not an Indigenous person",
              }),
            },
          ]}
        />
        <CommunitySelection labels={labels} />
      </div>
      <SignAndContinue labels={labels} />
      <div data-h2-container="base(center, m)">
        <Separator
          orientation="horizontal"
          decorative
          data-h2-background-color="base(ia-secondary)"
          data-h2-margin="base(x2, 0)"
        />
        <div data-h2-text-align="base(center)">
          <HelpLink />
          <p data-h2-font-weight="base(700)" data-h2-margin="base(x1, 0)">
            {intl.formatMessage(
              {
                defaultMessage:
                  "See <whyLink>why we are asking you to self declare</whyLink>, <verificationLink>how this will be verified</verificationLink> and the term <definitionLink>Indigenous as defined for this program</definitionLink>.",
                id: "AMboRG",
                description:
                  "Links to more information on the self-declaration process and definition of Indigenous",
              },
              {
                whyLink,
                verificationLink,
                definitionLink,
              },
            )}
          </p>
        </div>
      </div>
    </BasicForm>
  );
};

export default SelfDeclarationForm;
