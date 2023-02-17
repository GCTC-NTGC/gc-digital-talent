import * as React from "react";
import { useIntl } from "react-intl";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { SubmitHandler } from "react-hook-form";

import PageHeader from "@common/components/PageHeader";
import SEO from "@common/components/SEO/SEO";
import { BasicForm, Input } from "@common/components/form";
import { Button, Link } from "@common/components";
import MultiSelectField from "@common/components/form/MultiSelect/MultiSelectField";
import useRoutes from "~/hooks/useRoutes";

const CreateTeamPage = () => {
  const intl = useIntl();
  const paths = useRoutes();

  type FormValues = {
    classification: string[];
  };

  const pageTitle = intl.formatMessage({
    defaultMessage: "Create a new team",
    id: "vyyfX6",
    description: "Page title for the create team page",
  });

  const handleSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    // TODO: Handle submitting form
    console.log("Form submitted");
    console.log(data);
  };

  return (
    <>
      <SEO title={pageTitle} />
      <PageHeader icon={BuildingOffice2Icon}>{pageTitle}</PageHeader>
      <p>
        {intl.formatMessage({
          defaultMessage: "Create a new team from scratch",
          id: "XaYhX3",
          description:
            "Descriptive text for the create team page in the admin portal.",
        })}
      </p>
      <hr
        data-h2-margin="base(x1, 0, x1, 0)"
        data-h2-height="base(1px)"
        data-h2-background-color="base(dt-gray)"
        data-h2-border="base(none)"
      />
      <BasicForm onSubmit={handleSubmit}>
        <div data-h2-flex-grid="base(flex-start, x1, 0)">
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="displayNameEnglish"
              name="displayNameEnglish"
              type="text"
              rules={{ required: true }}
              label={intl.formatMessage({
                defaultMessage: "Organization's name (English)",
                id: "QC23B1",
                description: "Name of an organization/team in English field.",
              })}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="displayNameFrench"
              name="displayNameFrench"
              type="text"
              rules={{ required: true }}
              label={intl.formatMessage({
                defaultMessage: "Organization's name (French)",
                id: "W0BVd+",
                description: "Name of an organization/team in French field.",
              })}
            />
          </div>
          <div data-h2-flex-item="base(1of1) p-tablet(1of2)">
            <Input
              id="key"
              name="key"
              type="text"
              rules={{ required: true }}
              label={intl.formatMessage({
                defaultMessage: "Key",
                id: "i8zhiL",
                description: "Key",
              })}
            />
          </div>
          <div
            data-h2-flex-item="base(1of1) p-tablet(1of2)"
            data-h2-padding="base:(x1, 0, 0, 0)"
          >
            <MultiSelectField
              id="departments"
              name="departments"
              rules={{ required: true }}
              label={intl.formatMessage({
                defaultMessage: "Contact email",
                id: "nGNj5Q",
                description: "Contact email",
              })}
            />
          </div>
        </div>
        <div
          data-h2-align-items="base(center)"
          data-h2-display="base(flex)"
          style={{ gap: "0 1.5rem" }}
        >
          <Link href={paths.teamTable()}>
            {intl.formatMessage({
              defaultMessage: "Cancel and go back to teams",
              id: "/1s5pZ",
              description: "Cancel button for the create team page in admin",
            })}
          </Link>
          <Button
            type="submit"
            color="cta"
            data-h2-text-decoration="base(underline)"
          >
            {intl.formatMessage({
              defaultMessage: "Create new team",
              id: "DYzX/8",
              description: "Submit button for the create team page in admin",
            })}
          </Button>
        </div>
      </BasicForm>
    </>
  );
};

export default CreateTeamPage;
