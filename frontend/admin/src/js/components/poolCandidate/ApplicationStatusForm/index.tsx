import React from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import { Input, Select, Submit } from "@common/components/form";
import Pending from "@common/components/Pending";
import NotFound from "@common/components/NotFound";
import Heading from "@common/components/Heading";
import { CalendarIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import {
  PoolCandidateStatus,
  type PoolCandidate,
} from "../../../api/generated";

export type FormValues = {
  status: PoolCandidateStatus;
};

export interface ApplicationStatusFormProps {
  application: Pick<PoolCandidate, "status" | "expiryDate" | "notes">;
  onSubmit: (id: string, values: FormValues) => Promise<void>;
}

export const ApplicationStatusForm = ({
  application,
  onSubmit,
}: ApplicationStatusFormProps) => {
  const intl = useIntl();
  const methods = useForm<FormValues>();
  const { handleSubmit } = methods;

  const handleFormSubmit: SubmitHandler<FormValues> = (values: FormValues) => {
    console.log(values);
  };

  return (
    <div
      data-h2-position="base(sticky)"
      data-h2-width="base(100%)"
      style={{ top: 0 }}
    >
      <Heading
        level="h2"
        data-h2-margin="base(0, 0, x0.5, 0)"
        data-h2-font-size="base(h3)"
      >
        {intl.formatMessage({
          defaultMessage: "Application status",
          id: "/s66sg",
          description: "Title for admins to edit an applications status.",
        })}
      </Heading>
      <div
        data-h2-background-color="base(light.dt-gray)"
        data-h2-radius="base(x1)"
        data-h2-padding="base(x0.5, x0.5, x0.5, x0.5)"
      >
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Heading
              level="h3"
              data-h2-font-size="base(h4)"
              data-h2-margin="base(0, 0, x0.25, 0)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
              data-h2-gap="base(0, x0.25)"
            >
              <CalendarIcon
                data-h2-width="base(0.75em)"
                data-h2-height="base(0.75em)"
                data-h2-margin="base(0, x0.25, 0, 0)"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "Candidate status",
                  id: "ETrCOq",
                  description:
                    "Title for admin editing a pool candidates status",
                })}
              </span>
            </Heading>
            <Select
              label={intl.formatMessage({
                defaultMessage: "Pool status",
                id: "4idVCF",
                description: "Label for the current applications pool status",
              })}
              required
              rules={{ required: true }}
              id="status"
              name="status"
              options={[
                {
                  value: "",
                  label: intl.formatMessage({
                    defaultMessage: "Select a status",
                    id: "VMhVyJ",
                    description: "Placeholder text for the pool status field",
                  }),
                },
              ]}
            />
            <Heading
              level="h3"
              data-h2-font-size="base(h4)"
              data-h2-display="base(flex)"
              data-h2-align-items="base(center)"
            >
              <PencilSquareIcon
                data-h2-width="base(0.75em)"
                data-h2-height="base(0.75em)"
                data-h2-margin="base(0, x0.25, 0, 0)"
              />
              <span>
                {intl.formatMessage({
                  defaultMessage: "Notes",
                  id: "npC3bT",
                  description:
                    "Title for admin editing a pool candidates notes",
                })}
              </span>
            </Heading>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
