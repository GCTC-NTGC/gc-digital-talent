import { FieldValues, FormState, useFormContext } from "react-hook-form";
import { IntlShape, useIntl } from "react-intl";
import { ReactNode, useEffect, useId } from "react";

import {
  FieldLabels,
  Checklist,
  Field,
  Checkbox,
  RadioGroup,
} from "@gc-digital-talent/forms";
import { errorMessages, getLocale } from "@gc-digital-talent/i18n";

import { FirstNationsStatus } from "~/utils/indigenousDeclaration";

import { hasCommunityAndOther } from "./utils";
import CommunityIcon from "./CommunityIcon";
import CommunityChips from "./CommunityChips";

interface RowProps {
  children: ReactNode;
}

interface FirstNationSectionProps {
  labels: FieldLabels;
  intl: IntlShape;
  customAlertId: string;
  formState: FormState<FieldValues>;
  communitiesValue: string[];
}

interface InukSectionProps {
  labels: FieldLabels;
  intl: IntlShape;
}

interface MetisSectionProps {
  labels: FieldLabels;
  intl: IntlShape;
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

const FirstNationSection = ({
  labels,
  intl,
  customAlertId,
  formState,
  communitiesValue,
}: FirstNationSectionProps) => (
  <>
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
            description: "Text for the option to self-declare as first nations",
          })}
          aria-describedby={customAlertId}
        />
        {formState.errors.firstNationsCustom && (
          <Field.Error id={customAlertId} data-h2-margin-top="base(x.25)">
            {/* eslint-disable-next-line @typescript-eslint/no-base-to-string */}
            {formState.errors.firstNationsCustom.message?.toString()}
          </Field.Error>
        )}
      </div>
      <div>
        <CommunityIcon values={["firstNations"]} community="first-nations" />
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
  </>
);

const InukSection = ({ labels, intl }: InukSectionProps) => (
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
);

const MetisSection = ({ labels, intl }: MetisSectionProps) => (
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
);

interface CommunityListProps {
  labels: FieldLabels;
}

export const CommunityList = ({ labels }: CommunityListProps) => {
  const intl = useIntl();
  const locale = getLocale(intl);
  const { watch, setValue, resetField, setError, clearErrors, formState } =
    useFormContext<{
      communities: string[];
      isStatus: FirstNationsStatus | undefined;
      firstNationsCustom: string;
    }>();

  const [communitiesValue, isStatus] = watch(["communities", "isStatus"]);

  const isOtherAndHasCommunity = hasCommunityAndOther(communitiesValue);

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
        {locale === "fr" ? (
          <>
            <InukSection labels={labels} intl={intl} />
            <MetisSection labels={labels} intl={intl} />
            <FirstNationSection
              labels={labels}
              intl={intl}
              customAlertId={customAlertId}
              formState={formState}
              communitiesValue={communitiesValue}
            />
          </>
        ) : (
          <>
            <FirstNationSection
              labels={labels}
              intl={intl}
              customAlertId={customAlertId}
              formState={formState}
              communitiesValue={communitiesValue}
            />
            <InukSection labels={labels} intl={intl} />
            <MetisSection labels={labels} intl={intl} />
          </>
        )}
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
        otherAlert={!!isOtherAndHasCommunity}
        onDismiss={handleDismissCommunity}
      />
    </>
  );
};

interface CommunitySelectionProps {
  labels: FieldLabels;
}

const CommunitySelection = ({ labels }: CommunitySelectionProps) => {
  const { watch } = useFormContext<{ isIndigenous?: "yes" | "no" }>();

  const [isIndigenousValue] = watch(["isIndigenous"]);
  const isIndigenous = isIndigenousValue === "yes";

  return isIndigenous ? <CommunityList labels={labels} /> : null;
};

export default CommunitySelection;
