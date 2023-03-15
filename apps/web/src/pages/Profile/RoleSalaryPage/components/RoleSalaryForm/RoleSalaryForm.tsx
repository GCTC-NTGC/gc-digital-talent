import React from "react";
import { useIntl } from "react-intl";
import { useNavigate } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { BasicForm, Checklist, unpackMaybes } from "@gc-digital-talent/forms";
import { errorMessages, navigationMessages } from "@gc-digital-talent/i18n";
import { notEmpty } from "@gc-digital-talent/helpers";
import { toast } from "@gc-digital-talent/toast";
import { Well, ExternalLink } from "@gc-digital-talent/ui";

import { getFullPoolAdvertisementTitleHtml } from "~/utils/poolUtils";
import {
  GenericJobTitle,
  GenericJobTitleKey,
  GetRoleSalaryInfoQuery,
  PoolCandidate,
  UpdateUserAsUserInput,
  UpdateUserAsUserMutation,
} from "~/api/generated";
import ProfileFormWrapper, {
  ProfileFormFooter,
} from "~/components/ProfileFormWrapper/ProfileFormWrapper";
import profileMessages from "~/messages/profileMessages";
import useRoutes from "~/hooks/useRoutes";
import { wrapAbbr } from "~/utils/nameUtils";
import useApplicationInfo from "~/hooks/useApplicationInfo";

import {
  DialogLevelOne,
  DialogLevelTwo,
  DialogLevelThreeLead,
  DialogLevelThreeAdvisor,
  DialogLevelFourLead,
  DialogLevelFourAdvisor,
} from "../dialogs";

export type FormValues = {
  expectedGenericJobTitles: GenericJobTitleKey[];
};

const dataToFormValues = (data: GetRoleSalaryInfoQuery): FormValues => {
  return {
    expectedGenericJobTitles:
      data?.me?.expectedGenericJobTitles
        ?.map((genericJobTitle) => genericJobTitle?.key)
        .filter(notEmpty) ?? [],
  };
};

const formValuesToSubmitData = (
  values: FormValues,
  GenericJobTitles: GenericJobTitle[],
): UpdateUserAsUserInput => {
  const ids = values.expectedGenericJobTitles
    .map((key: GenericJobTitleKey) =>
      GenericJobTitles.find((generic) => generic.key === key),
    )
    .filter(notEmpty)
    .map((c: GenericJobTitle) => c.id);
  return {
    expectedGenericJobTitles: {
      sync: ids,
    },
  };
};

export type RoleSalaryUpdateHandler = (
  id: string,
  data: UpdateUserAsUserInput,
) => Promise<UpdateUserAsUserMutation["updateUserAsUser"]>;

export interface RoleSalaryFormProps {
  initialData: GetRoleSalaryInfoQuery;
  application?: PoolCandidate;
  updateRoleSalary: RoleSalaryUpdateHandler;
}

const RoleSalaryForm: React.FunctionComponent<RoleSalaryFormProps> = ({
  initialData,
  application,
  updateRoleSalary,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const paths = useRoutes();
  const { id: applicationId, returnRoute } = useApplicationInfo(
    initialData.me?.id,
  );

  const labels = {
    expectedGenericJobTitles: intl.formatMessage({
      defaultMessage:
        "I would like to be referred for jobs at the following levels:",
      id: "DrR60L",
      description: "Legend for role and salary checklist form",
    }),
  };

  const GenericJobTitles = unpackMaybes(initialData?.genericJobTitles);

  const handleSubmit = async (formValues: FormValues) => {
    const userId = initialData.me?.id;
    if (userId === undefined) {
      return;
    }

    await updateRoleSalary(
      userId,
      formValuesToSubmitData(formValues, GenericJobTitles),
    )
      .then(() => {
        navigate(returnRoute);
        toast.success(intl.formatMessage(profileMessages.userUpdated));
      })
      .catch(() => {
        toast.error(intl.formatMessage(profileMessages.updatingFailed));
      });
  };

  // intl styling functions section
  function link(chunks: React.ReactNode, url: string) {
    return (
      <ExternalLink newTab href={url}>
        {chunks}
      </ExternalLink>
    );
  }

  const applicationBreadcrumbs = application
    ? [
        {
          label: intl.formatMessage({
            defaultMessage: "My Applications",
            id: "mq4G8h",
            description:
              "'My Applications' breadcrumb from applicant profile wrapper.",
          }),
          url: paths.applications(application.user.id),
        },
        {
          label: getFullPoolAdvertisementTitleHtml(
            intl,
            application.poolAdvertisement,
          ),
          url: paths.pool(application.poolAdvertisement?.id || ""),
        },
        {
          label: intl.formatMessage(navigationMessages.stepOne),
          url: paths.reviewApplication(applicationId ?? ""),
        },
        {
          label: intl.formatMessage({
            defaultMessage: "Role and Salary Expectations",
            id: "dgOYID",
            description: "Label for role and salary link",
          }),
          url: initialData.me?.id
            ? `${paths.roleSalary(initialData.me.id)}${
                applicationId ? `?${applicationId}` : ``
              }`
            : "#",
        },
      ]
    : [];

  return (
    <ProfileFormWrapper
      title={intl.formatMessage({
        defaultMessage: "Role and Salary Expectations",
        id: "kCBLsJ",
        description: "Title role and salary expectations form",
      })}
      description={intl.formatMessage({
        defaultMessage:
          "Government classifications are labels that the Government of Canada uses to group similar types of work. In the Government of Canada salary is tied to how positions are classified.",
        id: "uIpPFZ",
        description: "Description for the role and salary expectation form",
      })}
      crumbs={
        applicationBreadcrumbs?.length
          ? applicationBreadcrumbs
          : [
              {
                label: intl.formatMessage({
                  defaultMessage: "Role and Salary Expectations",
                  id: "dgOYID",
                  description: "Label for role and salary link",
                }),
                url: initialData.me?.id
                  ? paths.roleSalary(initialData.me.id)
                  : "#",
              },
            ]
      }
      prefixBreadcrumbs={!application}
    >
      <BasicForm
        cacheKey="role-salary-form"
        onSubmit={handleSubmit}
        labels={labels}
        options={{
          defaultValues: dataToFormValues(initialData),
        }}
      >
        <p data-h2-margin="base(0, 0, x2, 0)">
          {intl.formatMessage(
            {
              defaultMessage:
                "This platform is focused on hiring digital talent to work in positions classified as <abbreviation>IT</abbreviation> (Information Technology). Look at the following levels within the <abbreviation>IT</abbreviation> classification and <strong>select only</strong> the ones that represent the work you want to do.",
              id: "oZ03/b",
              description: "Blurb describing the purpose of the form",
            },
            {
              abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
            },
          )}
        </p>
        <Checklist
          idPrefix="expectedGenericJobTitles"
          legend={labels.expectedGenericJobTitles}
          rules={{
            required: intl.formatMessage(errorMessages.required),
          }}
          name="expectedGenericJobTitles"
          id="expectedGenericJobTitles"
          items={[
            {
              value: GenericJobTitleKey.TechnicianIt01,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 1: Technician ($60,000 to $78,000). <openModal>Learn about <abbreviation>IT-01</abbreviation></openModal>",
                  id: "X+Y+qq",
                  description: "Checkbox label for Level IT-01 selection",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelOne({ children: msg }),
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              ),
            },
            {
              value: GenericJobTitleKey.AnalystIt02,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 2: Analyst ($75,000 to $91,000). <openModal>Learn about <abbreviation>IT-02</abbreviation></openModal>",
                  id: "SngY7e",
                  description: "Checkbox label for Level IT-02 selection",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelTwo({ children: msg }),
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              ),
            },
            {
              value: GenericJobTitleKey.TeamLeaderIt03,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Team Leader ($88,000 to $110,000). <openModal>Learn about <abbreviation>IT-03</abbreviation></openModal>",
                  id: "FEEa2S",
                  description:
                    "Checkbox label for Level IT-03 leader selection",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelThreeLead({ children: msg }),
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              ),
            },
            {
              value: GenericJobTitleKey.TechnicalAdvisorIt03,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 3: Technical Advisor ($88,000 to $110,000). <openModal>Learn about <abbreviation>IT-03</abbreviation></openModal>",
                  id: "WTdmxR",
                  description:
                    "Checkbox label for Level IT-03 advisor selection",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelThreeAdvisor({ children: msg }),
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              ),
            },
            {
              value: GenericJobTitleKey.SeniorAdvisorIt04,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Senior Advisor ($101,000 to $126,000). <openModal>Learn about <abbreviation>IT-04</abbreviation></openModal>",
                  id: "dofE/5",
                  description:
                    "Checkbox label for Level IT-04 senior advisor selection",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelFourAdvisor({ children: msg }),
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              ),
            },
            {
              value: GenericJobTitleKey.ManagerIt04,
              label: intl.formatMessage(
                {
                  defaultMessage:
                    "Level 4: Manager ($101,000 to $126,000). <openModal>Learn about <abbreviation>IT-04</abbreviation></openModal>",
                  id: "O8m3JS",
                  description:
                    "Checkbox label for Level IT-04 manager selection",
                },
                {
                  openModal: (msg: React.ReactNode) =>
                    DialogLevelFourLead({ children: msg }),
                  abbreviation: (text: React.ReactNode) => wrapAbbr(text, intl),
                },
              ),
            },
          ]}
        />
        <Well data-h2-margin="base(x.5, 0, x1, 0)">
          <p data-h2-display="base(flex)" data-h2-align-items="base(center)">
            <InformationCircleIcon
              data-h2-margin="base(0, x.25, 0, 0)"
              style={{ width: "0.9rem" }}
            />
            {intl.formatMessage(
              {
                defaultMessage:
                  "<link>Click here to learn more about classifications in the Government of Canada's Digital Community.</link>",
                id: "KT3jUW",
                description: "Link to learn more about classifications",
              },
              {
                link: (chunks: React.ReactNode) =>
                  link(
                    chunks,
                    intl.locale === "en"
                      ? "https://www.canada.ca/en/government/system/digital-government/gcdigital-community/careers-digital.html"
                      : "https://www.canada.ca/fr/gouvernement/systeme/gouvernement-numerique/collectivite-gcnumerique/carriere-domaine-numerique.html",
                  ),
              },
            )}
          </p>
        </Well>
        <ProfileFormFooter
          mode="saveButton"
          cancelLink={{ href: returnRoute }}
        />
      </BasicForm>
    </ProfileFormWrapper>
  );
};

export default RoleSalaryForm;
