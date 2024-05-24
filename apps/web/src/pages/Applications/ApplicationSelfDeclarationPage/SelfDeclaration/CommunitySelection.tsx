import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";
import { ReactNode, useState, useEffect, useId } from "react";

import {
  FieldLabels,
  Checklist,
  Field,
  Checkbox,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { Alert } from "@gc-digital-talent/ui";
import { errorMessages } from "@gc-digital-talent/i18n";

import { FirstNationsStatus } from "~/utils/indigenousDeclaration";

import HelpLink from "./HelpLink";
import { hasCommunityAndOther } from "./utils";
import CommunityIcon from "./CommunityIcon";
import CommunityChips from "./CommunityChips";

interface RowProps {
  children: ReactNode;
}

const Row = ({ children }: RowProps) => (
  <div
    data-h2-display="base(grid)"
    data-h2-grid-template-columns="base(repeat(4, 1fr))"
    data-h2-align-items="base(center)"
    data-h2-gap="base(0 x1)"
  >
    {children}
  </div>
);

interface CommunityListProps {
  labels: FieldLabels;
}

export const CommunityList = ({ labels }: CommunityListProps) => {
  const intl = useIntl();
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [hasDismissedAlert, setHasDismissedAlert] = useState<boolean>(false);
  const { watch, setValue, resetField, setError, clearErrors, formState } =
    useFormContext();

  const [communitiesValue, isStatus]: [
    string[],
    FirstNationsStatus | undefined,
  ] = watch(["communities", "isStatus"]);

  const isOtherAndHasCommunity = hasCommunityAndOther(communitiesValue);

  useEffect(() => {
    // Is not represented and has at least on other community selected
    setIsAlertOpen(!!(isOtherAndHasCommunity && !hasDismissedAlert));
  }, [isOtherAndHasCommunity, setIsAlertOpen, hasDismissedAlert]);

  useEffect(() => {
    if (
      communitiesValue.includes("status") &&
      communitiesValue.includes("nonStatus")
    ) {
      setError("firstNationsCustom", {
        type: "validation",
        message: intl.formatMessage({
          defaultMessage:
            "Please select either Status First Nations or Non-Status First Nations.",
          id: "skfKnv",
          description:
            "Error message that the user has selected both status and non-status first nations.",
        }),
      });
    } else {
      clearErrors("firstNationsCustom");
    }
  }, [clearErrors, communitiesValue, intl, setError]);
  const customAlertId = useId();

  const handleAlertDismiss = () => {
    setIsAlertOpen(false);
    setHasDismissedAlert(true);
  };

  const handleDismissCommunity = (community: string) => {
    const newCommunities = communitiesValue.filter(
      (value: string) => value !== community,
    );
    setValue("communities", newCommunities);
    if (community === "firstNations") {
      resetField("isStatus");
    }
  };

  return (
    <>
      <div
        data-h2-display="base(flex)"
        data-h2-gap="base(x1 0)"
        data-h2-flex-direction="base(column)"
      >
        <Row>
          <div data-h2-grid-column="base(span 3)">
            <Checkbox
              id="firstNations"
              name="communities"
              boundingBox
              boundingBoxLabel={labels.firstNations}
              trackUnsaved={false}
              value="firstNations"
              label={intl.formatMessage({
                defaultMessage: '"I am First Nations"',
                id: "Wpj2OY",
                description:
                  "Text for the option to self-declare as first nations",
              })}
              aria-describedby={customAlertId}
            />
            {formState.errors.firstNationsCustom && (
              <Field.Error id={customAlertId} data-h2-margin-top="base(x.25)">
                {formState.errors.firstNationsCustom.message?.toString()}
              </Field.Error>
            )}
          </div>
          <div>
            <CommunityIcon
              values={["firstNations"]}
              community="first-nations"
            />
          </div>
        </Row>
        {communitiesValue.includes("firstNations") && (
          <Row>
            <div data-h2-grid-column="base(span 3)">
              <RadioGroup
                idPrefix="firstNationsStatus"
                name="isStatus"
                legend={intl.formatMessage({
                  defaultMessage: "First Nations status",
                  id: "0KY1My",
                  description:
                    "Legend for selecting First Nations status or non-status",
                })}
                rules={{ required: intl.formatMessage(errorMessages.required) }}
                items={[
                  {
                    value: "status",
                    label: intl.formatMessage({
                      defaultMessage: '"I am Status First Nations"',
                      id: "ssJxrj",
                      description:
                        "Text for the option to self-declare as a status first nations",
                    }),
                  },
                  {
                    value: "nonStatus",
                    label: intl.formatMessage({
                      defaultMessage: '"I am Non-Status First Nations"',
                      id: "sSE4kt",
                      description:
                        "Text for the option to self-declare as a non-status first nations",
                    }),
                  },
                ]}
              />
            </div>
            <div />
          </Row>
        )}
        <Row>
          <div data-h2-grid-column="base(span 3)">
            <Checklist
              idPrefix="inuk"
              id="inuk"
              name="communities"
              legend={labels.inuk}
              trackUnsaved={false}
              items={[
                {
                  value: "inuk",
                  label: intl.formatMessage({
                    defaultMessage: `"I am Inuk"`,
                    id: "vDb+O+",
                    description: "Label text for Inuk community declaration",
                  }),
                },
              ]}
            />
          </div>
          <div>
            <CommunityIcon values={["inuk"]} community="inuit" />
          </div>
        </Row>
        <Row>
          <div data-h2-grid-column="base(span 3)">
            <Checklist
              idPrefix="metis"
              id="metis"
              name="communities"
              legend={labels.metis}
              trackUnsaved={false}
              items={[
                {
                  value: "metis",
                  label: intl.formatMessage({
                    defaultMessage: `"I am Métis"`,
                    id: "/81xCT",
                    description: "Label text for Métis community declaration",
                  }),
                },
              ]}
            />
          </div>
          <div>
            <CommunityIcon values={["metis"]} community="metis" />
          </div>
        </Row>
        <Row>
          <div data-h2-grid-column="base(span 3)">
            <Checklist
              idPrefix="other"
              id="other"
              name="communities"
              legend={labels.other}
              trackUnsaved={false}
              items={[
                {
                  value: "other",
                  label: intl.formatMessage({
                    defaultMessage: `"I am Indigenous and I don't see my community here"`,
                    id: "FRcbbi",
                    description:
                      "Label text for not represented community declaration",
                  }),
                },
              ]}
            />
          </div>
          <div>
            <CommunityIcon values={["other"]} community="other" />
          </div>
        </Row>
      </div>
      <CommunityChips
        communities={communitiesValue}
        status={isStatus}
        otherAlert={!!(isOtherAndHasCommunity && isAlertOpen)}
        onDismiss={handleDismissCommunity}
      />
      {isAlertOpen && (
        <Alert.Root type="warning" dismissible onDismiss={handleAlertDismiss}>
          <Alert.Title>
            {intl.formatMessage({
              defaultMessage:
                'Are you sure you meant to select "I am Indigenous and I don\'t see my community here?"',
              id: "at11n5",
              description:
                "Title for the alert warning users about selection not represented and a represented community",
            })}
          </Alert.Title>
          <p>
            {intl.formatMessage({
              defaultMessage:
                "The program is for First Nations, Inuit, and Métis peoples within the geographic boundaries of Canada. At a later step of the application process, you may be asked to provide proof that you are Indigenous. You can read more about how this will be verified below.",
              id: "Ap86I/",
              description:
                "Text explaining the program and the possibility of needing to provide proof.",
            })}
          </p>
          <Alert.Footer>
            <HelpLink />
          </Alert.Footer>
        </Alert.Root>
      )}
    </>
  );
};

interface CommunitySelectionProps {
  labels: FieldLabels;
}

const CommunitySelection = ({ labels }: CommunitySelectionProps) => {
  const { watch } = useFormContext();

  const [isIndigenousValue] = watch(["isIndigenous"]);
  const isIndigenous = isIndigenousValue === "yes";

  return isIndigenous ? <CommunityList labels={labels} /> : null;
};

export default CommunitySelection;
