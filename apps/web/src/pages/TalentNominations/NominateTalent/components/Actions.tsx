import { useIntl } from "react-intl";
import ChevronDoubleLeftIcon from "@heroicons/react/16/solid/ChevronDoubleLeftIcon";
import ChevronDoubleRightIcon from "@heroicons/react/16/solid/ChevronDoubleRightIcon";
import { useFormContext } from "react-hook-form";

import { Button, Link, Separator } from "@gc-digital-talent/ui";

import useRequiredParams from "~/hooks/useRequiredParams";
import useRoutes from "~/hooks/useRoutes";

import { RouteParams } from "../types";
import useCurrentStep from "../useCurrentStep";

const Actions = () => {
  const intl = useIntl();
  const paths = useRoutes();
  const { id } = useRequiredParams<RouteParams>("id");
  const { register, setValue } = useFormContext();
  const { prev, isLastStep } = useCurrentStep();
  const intentProps = register("intent");

  return (
    <>
      <Separator decorative orientation="horizontal" />
      <div className="flex flex-col items-center gap-6 xs:flex-row">
        {prev && (
          <Link
            href={`${paths.talentNomination(id)}?step=${prev}`}
            mode="inline"
            color="secondary"
            icon={ChevronDoubleLeftIcon}
          >
            {intl.formatMessage({
              defaultMessage: "Previous step",
              id: "r65UIr",
              description:
                "Link text to navigate to the previous step of a process",
            })}
          </Link>
        )}
        <Button
          type="submit"
          mode="inline"
          color="secondary"
          className="ml-0 xs:ml-auto"
          {...intentProps}
          onClick={() => setValue("intent", "save-draft")}
        >
          {intl.formatMessage({
            defaultMessage: "Save draft",
            id: "Ey0mXe",
            description: "Button text to save a draft",
          })}
        </Button>
        <Button
          type="submit"
          color="primary"
          {...intentProps}
          onClick={() => setValue("intent", "next-step")}
          utilityIcon={isLastStep ? undefined : ChevronDoubleRightIcon}
        >
          {isLastStep
            ? intl.formatMessage({
                defaultMessage: "Submit nomination",
                id: "ZNgKK4",
                description: "Button text to submit a talent nomination",
              })
            : intl.formatMessage({
                defaultMessage: "Next step",
                id: "xU771u",
                description:
                  "Button text to submit the current step of a process",
              })}
        </Button>
      </div>
    </>
  );
};

export default Actions;
