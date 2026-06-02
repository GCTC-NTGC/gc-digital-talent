import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import kebabCase from "lodash/kebabCase";
import QueueListIcon from "@heroicons/react/24/outline/QueueListIcon";

import {
  Card,
  CardSeparator,
  Heading,
  Link,
  Notice,
} from "@gc-digital-talent/ui";
import { BasicForm, Input, Submit, TextArea } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import type {
  CreateCommunityInput,
  LocalizedStringInput,
} from "@gc-digital-talent/graphql";
import { commonMessages, errorMessages } from "@gc-digital-talent/i18n";

import useRoutes from "~/hooks/useRoutes";
import adminMessages from "~/messages/adminMessages";
import { FRENCH_WORDS_PER_ENGLISH_WORD } from "~/constants/talentSearchConstants";

const TEXT_AREA_MAX_WORDS_EN = 200;
const TEXT_AREA_MAX_WORDS_FR = Math.round(
  TEXT_AREA_MAX_WORDS_EN * FRENCH_WORDS_PER_ENGLISH_WORD,
);

interface FormValues {
  key: string;
  name?: LocalizedStringInput | null;
  informationUrl?: LocalizedStringInput | null;
  description?: LocalizedStringInput | null;
  mandateAuthority?: LocalizedStringInput | null;
  contactEmail: string;
}

const formValuesToSubmitData = (data: FormValues): CreateCommunityInput => {
  return {
    key: kebabCase(data.key || ""),
    name: {
      en: data.name?.en,
      fr: data.name?.fr,
    },
    informationUrl: {
      en: data.informationUrl?.en,
      fr: data.informationUrl?.fr,
    },
    description: {
      en: data.description?.en,
      fr: data.description?.fr,
    },
    mandateAuthority: {
      en: data.mandateAuthority?.en,
      fr: data.mandateAuthority?.fr,
    },
    contactEmail: data.contactEmail,
  };
};

interface CreateCommunityFormProps {
  onSubmit: (data: CreateCommunityInput) => Promise<string>;
}

const CreateCommunityForm = ({ onSubmit }: CreateCommunityFormProps) => {
  const intl = useIntl();
  const paths = useRoutes();
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<FormValues> = async (data) => {
    return onSubmit(formValuesToSubmitData(data))
      .then(async (id) => {
        await navigate(paths.communityView(id));
        toast.success(
          intl.formatMessage({
            defaultMessage: "Community created successfully!",
            id: "LxRoWB",
            description: "Message displayed after a community is created",
          }),
        );
      })
      .catch(() => {
        toast.error(
          intl.formatMessage({
            defaultMessage: "Error: creating community failed",
            id: "ri2PBL",
            description: "Messaged displayed after creating community fails",
          }),
        );
      });
  };

  return (
    <BasicForm onSubmit={handleSubmit}>
      <Card space="lg">
        <Heading
          level="h2"
          color="primary"
          icon={QueueListIcon}
          center
          className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
        >
          {intl.formatMessage({
            defaultMessage: "Community information",
            id: "+OOFwz",
            description: "Title for community form",
          })}
        </Heading>
        <p className="mb-8">
          {intl.formatMessage({
            defaultMessage:
              "The following information will be used to identify the community and offer insight into the domains it supports.",
            id: "f1vqns",
            description: "Description for community form",
          })}
        </p>
        <div className="grid gap-6 xs:grid-cols-2">
          <Input
            id="name.en"
            label={intl.formatMessage({
              defaultMessage: "Community name",
              id: "3K2EZB",
              description:
                "Label displayed on the community form information name field",
            })}
            appendLanguageToLabel={"en"}
            name="name.en"
            autoComplete="off"
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="name.fr"
            label={intl.formatMessage({
              defaultMessage: "Community name",
              id: "3K2EZB",
              description:
                "Label displayed on the community form information name field",
            })}
            appendLanguageToLabel={"fr"}
            name="name.fr"
            autoComplete="off"
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <TextArea
            id="description.en"
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"en"}
            name="description.en"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            wordLimit={TEXT_AREA_MAX_WORDS_EN}
          />
          <TextArea
            id="description.fr"
            label={intl.formatMessage(commonMessages.description)}
            appendLanguageToLabel={"fr"}
            name="description.fr"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
            wordLimit={TEXT_AREA_MAX_WORDS_FR}
          />
          <Input
            id="informationUrl.en"
            name="informationUrl.en"
            label={intl.formatMessage({
              defaultMessage: "External link to information",
              id: "fWNqcM",
              description:
                "Label displayed on the community form information URL field",
            })}
            appendLanguageToLabel={"en"}
            type="url"
          />
          <Input
            id="informationUrl.fr"
            name="informationUrl.fr"
            label={intl.formatMessage({
              defaultMessage: "External link to information",
              id: "fWNqcM",
              description:
                "Label displayed on the community form information URL field",
            })}
            appendLanguageToLabel={"fr"}
            type="url"
          />
          <div className="xs:col-span-2">
            <Input
              id="contactEmail"
              label={intl.formatMessage({
                defaultMessage: "Generic contact email",
                id: "iVe7JX",
                description:
                  "Label displayed on the community form contact email field",
              })}
              name="contactEmail"
              type="email"
            />
          </div>
          <div className="xs:col-span-2">
            <Input
              id="key"
              label={intl.formatMessage(adminMessages.key)}
              name="key"
              type="text"
              rules={{
                required: intl.formatMessage(errorMessages.required),
              }}
            />
            <Notice.Root className="mt-2">
              <Notice.Content>
                <p>
                  {intl.formatMessage({
                    defaultMessage:
                      "Please provide a short word or phrase that will represent this community’s data model. This value should be lowercase and use underscores between words when necessary (e.g. data_management). This value is not user facing and can’t be changed after it is set.",
                    id: "LgKlN9",
                    description: "Description for notice for key field",
                  })}
                </p>
              </Notice.Content>
            </Notice.Root>
          </div>
        </div>
        <CardSeparator />
        <Heading level="h3" className="xs:justify-start xs:text-left">
          {intl.formatMessage({
            defaultMessage: "Mandate authority",
            id: "83aYHF",
            description:
              "Label displayed on the community form mandate authority field",
          })}
        </Heading>
        <p className="mb-8">
          {intl.formatMessage({
            defaultMessage:
              "Please identify the name or position of the delegated officer with the mandate authority to permit this community to collect data on participating users. By completing this field, you acknowledge that the community has the correct approvals for data collection.",
            id: "saf66z",
            description: "Description for mandate authority fields",
          })}
        </p>
        <div className="grid gap-6 xs:grid-cols-2">
          <Input
            id="mandateAuthority.en"
            name="mandateAuthority.en"
            label={intl.formatMessage({
              defaultMessage: "Delegated officer or entity",
              id: "KRXSAf",
              description:
                "Label displayed on the community form mandate authority field",
            })}
            appendLanguageToLabel={"en"}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
          <Input
            id="mandateAuthority.fr"
            name="mandateAuthority.fr"
            label={intl.formatMessage({
              defaultMessage: "Delegated officer or entity",
              id: "KRXSAf",
              description:
                "Label displayed on the community form mandate authority field",
            })}
            appendLanguageToLabel={"fr"}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
          />
        </div>
        <CardSeparator />
        <div className="flex flex-col items-center gap-6 xs:flex-row">
          <Submit
            text={intl.formatMessage({
              defaultMessage: "Create community",
              id: "lhLfd7",
              description: "Text to create a community",
            })}
          />
          <Link mode="inline" color="warning" href={paths.communityTable()}>
            {intl.formatMessage(commonMessages.cancel)}
          </Link>
        </div>
      </Card>
    </BasicForm>
  );
};

export default CreateCommunityForm;
