import type { SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import { useIntl } from "react-intl";
import kebabCase from "lodash/kebabCase";
import IdentificationIcon from "@heroicons/react/24/outline/IdentificationIcon";

import { Card, CardSeparator, Heading, Link } from "@gc-digital-talent/ui";
import { BasicForm, Input, Submit, TextArea } from "@gc-digital-talent/forms";
import { toast } from "@gc-digital-talent/toast";
import type {
  CreateCommunityInput,
  LocalizedStringInput,
  Maybe,
  Scalars,
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
  name?: Maybe<LocalizedStringInput>;
  informationUrl?: Maybe<LocalizedStringInput>;
  description?: Maybe<LocalizedStringInput>;
  mandateAuthority?: Maybe<LocalizedStringInput>;
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
  onSubmit: (data: CreateCommunityInput) => Promise<Scalars["UUID"]["output"]>;
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
      <Card>
        <Heading
          level="h2"
          color="secondary"
          icon={IdentificationIcon}
          center
          className="mt-0 mb-9 font-normal xs:justify-start xs:text-left"
        >
          {intl.formatMessage({
            defaultMessage: "Community information",
            id: "ocTGYr",
            description: "Heading for the 'create a community' form",
          })}
        </Heading>
        <div className="grid gap-6 xs:grid-cols-2">
          <Input
            id="name.en"
            label={intl.formatMessage(commonMessages.name)}
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
            label={intl.formatMessage(commonMessages.name)}
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
          <Input
            id="mandateAuthority.en"
            name="mandateAuthority.en"
            label={intl.formatMessage({
              defaultMessage: "Mandate authority",
              id: "83aYHF",
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
              defaultMessage: "Mandate authority",
              id: "83aYHF",
              description:
                "Label displayed on the community form mandate authority field",
            })}
            appendLanguageToLabel={"fr"}
            type="text"
            rules={{
              required: intl.formatMessage(errorMessages.required),
            }}
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
          </div>
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
            {intl.formatMessage({
              defaultMessage: "Cancel and go back to communities",
              id: "OFGtZr",
              description: "Link text to cancel updating a community",
            })}
          </Link>
        </div>
      </Card>
    </BasicForm>
  );
};

export default CreateCommunityForm;
