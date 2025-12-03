import { useIntl } from "react-intl";
import { useFormContext } from "react-hook-form";
import { ReactNode, useEffect } from "react";

import { Link, Notice } from "@gc-digital-talent/ui";
import { FieldLabels, Input, RadioGroup } from "@gc-digital-talent/forms";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";

import useDirtyFields from "../../hooks/useDirtyFields";
import { FormValues } from "./types";

const priorityEntitlementLink = (locale: string, chunks: ReactNode) => {
  const href =
    locale === "en"
      ? "https://www.canada.ca/en/public-service-commission/services/information-priority-administration.html"
      : "https://www.canada.ca/fr/commission-fonction-publique/services/administration-priorites.html";
  return (
    <Link href={href} newTab external>
      {chunks}
    </Link>
  );
};

interface FormFieldsProps {
  labels: FieldLabels;
}

const FormFields = ({ labels }: FormFieldsProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);

  useDirtyFields("government");
  const { watch, resetField } = useFormContext<FormValues>();
  // hooks to watch, needed for conditional rendering
  const priorityEntitlement = watch("priorityEntitlementYesNo");

  const hasPriorityEntitlement = priorityEntitlement === "yes";

  /**
   * Reset fields when they disappear
   * to avoid confusing users about unsaved changes
   */
  useEffect(() => {
    const resetDirtyField = (name: keyof FormValues) => {
      resetField(name, {
        keepDirty: false,
      });
    };

    if (!hasPriorityEntitlement) {
      resetDirtyField("priorityEntitlementNumber");
    }
  }, [resetField, hasPriorityEntitlement]);

  return (
    <div className="flex flex-col gap-y-6">
      <RadioGroup
        idPrefix="priorityEntitlementYesNo"
        legend={labels.priorityEntitlementYesNo}
        name="priorityEntitlementYesNo"
        id="priorityEntitlementYesNo"
        describedBy="priority-description"
        rules={{
          required: intl.formatMessage(errorMessages.required),
        }}
        items={[
          {
            value: "no",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>No</strong>, I do not have a priority entitlement.",
              id: "09ijOa",
              description:
                "Label displayed for does not have priority entitlement option",
            }),
          },
          {
            value: "yes",
            label: intl.formatMessage({
              defaultMessage:
                "<strong>Yes</strong>, I do have a priority entitlement.",
              id: "Xmtw0V",
              description:
                "Label displayed does have priority entitlement option",
            }),
          },
        ]}
      />
      <Notice.Root id="priority-description" small>
        <Notice.Content>
          <p>
            {intl.formatMessage(
              {
                defaultMessage:
                  "Priority entitlement is a status provided by the Public Service Commission of Canada. To learn more, <priorityEntitlementLink>visit the Information on Priority Entitlement website</priorityEntitlementLink>.",
                id: "WpVd0l",
                description: "Sentence describing what priority entitlement is",
              },
              {
                priorityEntitlementLink: (chunks: ReactNode) =>
                  priorityEntitlementLink(locale, chunks),
              },
            )}
          </p>
        </Notice.Content>
      </Notice.Root>
      {hasPriorityEntitlement && (
        <Input
          id="priorityEntitlementNumber"
          type="text"
          label={labels.priorityEntitlementNumber}
          name="priorityEntitlementNumber"
          rules={{ required: intl.formatMessage(errorMessages.required) }}
        />
      )}
    </div>
  );
};

export default FormFields;
